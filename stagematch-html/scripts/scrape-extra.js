#!/usr/bin/env node

/**
 * JobSurMesure Extra Scraper
 * Scrapes job offers from additional French job sites
 * Sources: RegionFrance, Etudiant, Stagiaires, Jeunes talents
 */

const puppeteer = require('puppeteer');
const DatabaseManager = require('./database');
const readline = require('readline');

// Configuration
const CONFIG = {
    regionfrance: {
        baseUrl: 'https://www.regionfrance.fr/stages',
        delay: 1500,
    },
    etudiant: {
        baseUrl: 'https://www.etudiant.gouv.fr/fr/offre-de-stage',
        delay: 2000,
    },
    jeunesTangents: {
        baseUrl: 'https://www.jeunes-tangents.gouv.fr/offres-stage',
        delay: 2000,
    },
    alternance: {
        baseUrl: 'https://www.alternance.emploi.gouv.fr/offres',
        delay: 2000,
    },
};

// French regions
const REGIONS = [
    'Île-de-France', 'Provence-Alpes-Côte dAzur', 'Occitanie',
    'Nouvelle-Aquitaine', 'Auvergne-Rhône-Alpes', 'Bretagne',
    'Normandie', 'Hauts-de-France', 'Grand Est', 'Pays de la Loire',
    'Centre-Val de Loire', 'Corse'
];

// Job domains
const DOMAINS = [
    'Tech & IT', 'Marketing', 'Finance', 'Data Science', 'Consulting',
    'Ressources Humaines', 'Design', 'Commerce', 'Communication',
    'Juridique', 'Health', 'Education', 'Engineering', 'Science',
    'Environment', 'Culture', 'Tourism', 'Agriculture'
];

class ExtraScraper {
    constructor() {
        this.db = new DatabaseManager();
        this.browser = null;
        this.jobsScraped = 0;
        this.jobsSaved = 0;
    }

    async init() {
        console.log('Initializing extra scraper...');
        await this.db.connect();
        await this.db.initializeSchema();

        this.browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--diable-features=IsolateOrigins,site-per-process',
                '--accept-lang=fr-FR,fr'
            ]
        });

        console.log('Extra scraper initialized');
    }

    async scrapeAll() {
        console.log('\n=== Starting Extra Scrape ===\n');

        const results = {
            regionfrance: { scraped: 0, saved: 0 },
            etudiant: { scraped: 0, saved: 0 },
            alternance: { scraped: 0, saved: 0 }
        };

        // Scrape each source
        results.regionfrance = await this.scrapeRegionFrance(2);
        await this.wait(CONFIG.regionfrance.delay);
        results.etudiant = await this.scrapeEtudiant(2);
        await this.wait(CONFIG.etudiant.delay);
        results.alternance = await this.scrapeAlternance(2);

        // Update database stats
        await this.db.updateStats();

        console.log('\n=== Scrape Summary ===');
        console.log(`Total jobs scraped: ${this.jobsScraped}`);
        console.log(`Total jobs saved: ${this.jobsSaved}`);

        for (const [source, stats] of Object.entries(results)) {
            console.log(`${source}: ${stats.scraped} scraped, ${stats.saved} saved`);
        }

        return results;
    }

    async scrapeRegionFrance(maxPages = 1) {
        console.log('\n--- Scraping Region France ---');
        const results = { scraped: 0, saved: 0 };

        for (const region of REGIONS.slice(0, 3)) {
            try {
                const page = await this.browser.newPage();
                await page.setViewport({ width: 1920, height: 1080 });

                const url = `https://www.regionfrance.fr/stages?region=${encodeURIComponent(region)}`;

                await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
                await page.waitForSelector('.job-card, .offre-stage', { timeout: 10000 });

                for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
                    const jobs = await page.evaluate(() => {
                        const jobCards = document.querySelectorAll('.job-card, .offre-stage');
                        const jobs = [];

                        jobCards.forEach(card => {
                            const title = card.querySelector('h3, .title, .job-title')?.textContent?.trim() || 'Stage inconnu';
                            const company = card.querySelector('.company, .entreprise')?.textContent?.trim() || 'Organisme inconnu';
                            const location = card.querySelector('.location, .ville')?.textContent?.trim() || region;
                            const description = card.querySelector('.description, .texte')?.textContent?.trim() || '';

                            jobs.push({
                                title,
                                company,
                                location,
                                type: 'stage',
                                domain: 'General',
                                description,
                                requirements: [],
                                skills: [],
                                studyLevel: ['bac+2', 'bac+3', 'bac+4', 'bac+5'],
                                duration: '3-6 mois',
                                salary: 'Indiqué sur l\'offre',
                                startDate: '',
                                postedAt: new Date().toISOString(),
                                remote: false,
                                source: 'regionfrance'
                            });
                        });

                        return jobs;
                    });

                    results.scraped += jobs.length;
                    console.log(`  ${region} Page ${pageNum}: Found ${jobs.length} jobs`);

                    for (const job of jobs) {
                        const id = `rf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                        await this.db.insertJob({ ...job, id });
                        results.saved++;
                        this.jobsScraped++;
                        this.jobsSaved++;
                    }

                    if (pageNum < maxPages) {
                        const nextBtn = await page.$('a[rel="next"], .pagination-next');
                        if (nextBtn) {
                            await nextBtn.click();
                            await page.waitForTimeout(CONFIG.regionfrance.delay);
                        } else {
                            break;
                        }
                    }
                }

                await page.close();
            } catch (err) {
                console.error(`  Error scraping Region France for ${region}:`, err.message);
            }
        }

        return results;
    }

    async scrapeEtudiant(maxPages = 1) {
        console.log('\n--- Scraping Étudiant.gouv.fr ---');
        const results = { scraped: 0, saved: 0 };

        for (const domain of DOMAINS.slice(0, 3)) {
            try {
                const page = await this.browser.newPage();
                await page.setViewport({ width: 1920, height: 1080 });

                const url = `https://www.etudiant.gouv.fr/fr/offre-de-stage?domaine=${encodeURIComponent(domain)}`;

                await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
                await page.waitForSelector('.card, .offre', { timeout: 10000 });

                const jobs = await page.evaluate(() => {
                    const cards = document.querySelectorAll('.card, .offre');
                    const jobs = [];

                    cards.forEach(card => {
                        const title = card.querySelector('h3, .title, h2')?.textContent?.trim() || 'Stage inconnu';
                        const company = card.querySelector('.organization, .entreprise')?.textContent?.trim() || 'Organisme';
                        const location = card.querySelector('.location, .lieu')?.textContent?.trim() || 'France';
                        const salary = card.querySelector('.salary, .indemnité')?.textContent?.trim() || '';

                        jobs.push({
                            title,
                            company,
                            location,
                            type: 'stage',
                            domain: card.querySelector('.domain')?.textContent?.trim() || domain,
                            description: '',
                            requirements: [],
                            skills: [],
                            studyLevel: ['bac+2', 'bac+3', 'bac+4', 'bac+5'],
                            duration: '3-6 mois',
                            salary,
                            startDate: '',
                            postedAt: new Date().toISOString(),
                            remote: false,
                            source: 'etudiant'
                        });
                    });

                    return jobs;
                });

                results.scraped += jobs.length;
                console.log(`  Domain ${domain}: Found ${jobs.length} jobs`);

                for (const job of jobs) {
                    const id = `etd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    await this.db.insertJob({ ...job, id });
                    results.saved++;
                    this.jobsScraped++;
                    this.jobsSaved++;
                }

                await page.close();
            } catch (err) {
                console.error(`  Error scraping Étudiant for ${domain}:`, err.message);
            }
        }

        return results;
    }

    async scrapeAlternance(maxPages = 1) {
        console.log('\n--- Scraping Alternance.gouv.fr ---');
        const results = { scraped: 0, saved: 0 };

        try {
            const page = await this.browser.newPage();
            await page.setViewport({ width: 1920, height: 1080 });

            // Scrape different types of alternance
            const types = ['alternance', 'apprentissage'];

            for (const type of types) {
                const url = `https://www.alternance.emploi.gouv.fr/offres?type=${type}`;

                await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
                await page.waitForSelector('.job-card, .offre', { timeout: 10000 });

                for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
                    const jobs = await page.evaluate(() => {
                        const jobCards = document.querySelectorAll('.job-card, .offre');
                        const jobs = [];

                        jobCards.forEach(card => {
                            const title = card.querySelector('h3, .title, .job-title')?.textContent?.trim() || 'Offre inconnue';
                            const company = card.querySelector('.company, .entreprise')?.textContent?.trim() || 'Entreprise inconnue';
                            const location = card.querySelector('.location, .ville')?.textContent?.trim() || 'France';

                            jobs.push({
                                title,
                                company,
                                location,
                                type: 'alternance',
                                domain: 'General',
                                description: '',
                                requirements: [],
                                skills: [],
                                studyLevel: ['bac+2', 'bac+3', 'bac+4', 'bac+5'],
                                duration: '1-3 ans',
                                salary: 'Indiqué sur l\'offre',
                                startDate: '',
                                postedAt: new Date().toISOString(),
                                remote: false,
                                source: 'alternance'
                            });
                        });

                        return jobs;
                    });

                    results.scraped += jobs.length;
                    console.log(`  ${type} Page ${pageNum}: Found ${jobs.length} jobs`);

                    for (const job of jobs) {
                        const id = `alt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                        await this.db.insertJob({ ...job, id });
                        results.saved++;
                        this.jobsScraped++;
                        this.jobsSaved++;
                    }

                    if (pageNum < maxPages) {
                        const nextBtn = await page.$('a[rel="next"], .pagination-next');
                        if (nextBtn) {
                            await nextBtn.click();
                            await page.waitForTimeout(CONFIG.alternance.delay);
                        } else {
                            break;
                        }
                    }
                }
            }

            await page.close();
        } catch (err) {
            console.error('  Error scraping Alternance:', err.message);
        }

        return results;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
        await this.db.close();
        console.log('\nExtra scraper closed');
    }
}

// Main execution
async function main() {
    const scraper = new ExtraScraper();

    try {
        await scraper.init();
        await scraper.scrapeAll();
        await scraper.close();
    } catch (err) {
        console.error('Fatal error:', err);
        await scraper.close();
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { ExtraScraper, CONFIG };
