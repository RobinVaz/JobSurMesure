#!/usr/bin/env node

/**
 * JobStudent Comprehensive Job Scrapper
 * Scrapes ALL internship and apprenticeship offers from multiple sources
 * Sources: HelloWork (France Travail), Indeed, Welcome to the Jungle, LinkedIn, JobTeaser
 * Uses Playwright for browser automation
 */

const { chromium } = require('playwright');
const DatabaseManager = require('./database');

// Configuration with proper delays to avoid being blocked
const CONFIG = {
    helloWork: { delay: 3000, maxPages: 5 },
    indeed: { delay: 4000, maxPages: 3 },
    wttj: { delay: 2500, maxPages: 3 },
    linkedin: { delay: 5000, maxPages: 2 },
    jobteaser: { delay: 3000, maxPages: 3 },
};

// All major French cities and regions
const LOCATIONS = [
    'Paris', 'Saint-Denis', 'Montreuil', 'Boulogne-Billancourt', 'Maisons-Alfort',
    'Créteil', 'Nanterre', 'Versailles', 'Evry-Courcouronnes', 'Argenteuil',
    'Lyon', 'Saint-Étienne', 'Grenoble', 'Annecy', 'Chambéry', 'Clermont-Ferrand',
    'Bordeaux', 'Limoges', 'Poitiers', 'Toulouse', 'Montpellier', 'Perpignan',
    'Nantes', 'Angers', 'Le Mans', 'Rennes', 'Brest', 'Quimper',
    'Lille', 'Amiens', 'Arras', 'Calais', 'Douai', 'Valenciennes',
    'Strasbourg', 'Metz', 'Nancy', 'Reims', 'Mulhouse', 'Colmar',
    'Dijon', 'Besançon', 'Auxerre', 'Belfort', 'Chalon-sur-Saône',
    'Orléans', 'Tours', 'Blois', 'Chartres', 'Bourges', 'Châteauroux',
    'Ajaccio', 'Bastia', 'Calvi'
];

// More job domains
const DOMAINS = [
    'Tech & IT', 'Marketing', 'Finance', 'Data Science', 'Consulting',
    'Ressources Humaines', 'Design', 'Commerce', 'Communication',
    'Juridique', 'Health', 'Education', 'Engineering', 'Science',
    'Art', 'Media', 'Hospitality', 'Transport', 'Public Service',
    'International', 'Agriculture', 'Environment', 'Energy', 'Manufacturing'
];

/**
 * Scrape HelloWork (France Travail) - Main source
 */
async function scrapeHelloWork(page, type = 'all', location = '', maxPages = 5) {
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'fr-FR,fr;q=0.9' });

    console.log(`  HelloWork: ${type} in ${location}, ${maxPages} pages`);

    const results = [];
    let currentPage = 1;

    try {
        let url = 'https://www.francetravail.fr/emplois';
        const params = new URLSearchParams();

        if (location) params.set('lieux', location);
        if (type === 'stage') params.set('typeContrat', 'stage');
        if (type === 'alternance') params.set('typeContrat', 'alternance');

        if (params.toString()) {
            url += '?' + params.toString();
        }

        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(2000);

        while (currentPage <= maxPages) {
            // Wait for job cards
            await page.waitForSelector('.card-title, .job-card, .search-card', { timeout: 10000 }).catch(() => {});

            const jobs = await page.evaluate(() => {
                const jobs = [];
                const selectors = ['.card-title', '.job-card', '.search-card', '.result-card'];
                let cards = [];

                for (const selector of selectors) {
                    cards = [...document.querySelectorAll(selector)];
                    if (cards.length > 0) break;
                }

                cards.forEach(card => {
                    const titleEl = card.querySelector('h3, h2, .title, .job-title');
                    const title = titleEl?.textContent?.trim() || '';

                    if (!title) return;

                    const companyEl = card.querySelector('.company-name, .company, .company-title');
                    const company = companyEl?.textContent?.trim() || 'Entreprise';

                    const locEl = card.querySelector('.location, .place, .company-location');
                    const loc = locEl?.textContent?.trim() || 'France';

                    const salaryEl = card.querySelector('.salary, .salary-snippet');
                    const salary = salaryEl?.textContent?.trim() || '';

                    const typeMatch = title.toLowerCase().match(/(alternance|stage)/);
                    const detectedType = typeMatch ? (typeMatch[1] === 'alternance' ? 'alternance' : 'stage') : (type === 'all' ? 'stage' : type);

                    jobs.push({
                        title: title.replace(/\s+/g, ' '),
                        company: company.replace(/\s+/g, ' '),
                        location: loc.replace(/\s+/g, ' '),
                        salary: salary,
                        type: detectedType,
                        domain: 'General',
                        description: '',
                        requirements: [],
                        skills: [],
                        studyLevel: ['bac+3', 'bac+4', 'bac+5'],
                        duration: '6 mois',
                        postedAt: new Date().toISOString(),
                        source: 'hellowork'
                    });
                });

                return jobs;
            });

            if (jobs.length > 0) {
                results.push(...jobs);
                console.log(`    Page ${currentPage}: ${jobs.length} jobs`);
            }

            // Try to go to next page
            if (currentPage < maxPages) {
                try {
                    const nextBtn = await page.$('a[rel="next"], .pagination-next, .next-page');
                    if (nextBtn) {
                        await nextBtn.click();
                        await page.waitForTimeout(CONFIG.helloWork.delay);
                        currentPage++;
                    } else {
                        break;
                    }
                } catch (e) {
                    break;
                }
            } else {
                break;
            }
        }
    } catch (err) {
        console.error(`    Error: ${err.message}`);
    }

    return results;
}

/**
 * Scrape Indeed France
 */
async function scrapeIndeed(page, type = 'all', location = '', maxPages = 3) {
    console.log(`  Indeed: ${type} in ${location}, ${maxPages} pages`);

    const results = [];
    let currentPage = 1;

    try {
        const jobType = type === 'stage' ? 'stage' : type === 'alternance' ? 'alternance' : '';
        const url = `https://fr.indeed.com/emplois?q=${encodeURIComponent(jobType || 'alternance%20ou%20stage')}&l=${encodeURIComponent(location)}`;

        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(2000);

        while (currentPage <= maxPages) {
            const jobs = await page.evaluate(() => {
                const jobs = [];
                const cards = document.querySelectorAll('.jobsearch-SerpJobCard, .jobCard, .job');

                cards.forEach(card => {
                    const titleEl = card.querySelector('.jobTitle span, h2 a, .title');
                    const title = titleEl?.textContent?.trim() || '';

                    if (!title) return;

                    const companyEl = card.querySelector('.company, .companyName');
                    const company = companyEl?.textContent?.trim() || 'Entreprise';

                    const locEl = card.querySelector('.location, .companyLocation');
                    const loc = locEl?.textContent?.trim() || 'France';

                    const salaryEl = card.querySelector('.salary-snippet, .salary');
                    const salary = salaryEl?.textContent?.trim() || '';

                    const typeMatch = title.toLowerCase().match(/(alternance|stage)/);
                    const detectedType = typeMatch ? (typeMatch[1] === 'alternance' ? 'alternance' : 'stage') : 'stage';

                    jobs.push({
                        title: title.replace(/\s+/g, ' '),
                        company: company.replace(/\s+/g, ' '),
                        location: loc.replace(/\s+/g, ' '),
                        salary: salary,
                        type: detectedType,
                        domain: 'General',
                        description: '',
                        requirements: [],
                        skills: [],
                        studyLevel: ['bac+3', 'bac+4', 'bac+5'],
                        duration: '6 mois',
                        postedAt: new Date().toISOString(),
                        source: 'indeed'
                    });
                });

                return jobs;
            });

            if (jobs.length > 0) {
                results.push(...jobs);
                console.log(`    Page ${currentPage}: ${jobs.length} jobs`);
            }

            if (currentPage < maxPages) {
                try {
                    await page.evaluate(() => {
                        const nextBtn = document.querySelector('a[aria-label="Suivant"]');
                        if (nextBtn) nextBtn.click();
                    });
                    await page.waitForTimeout(CONFIG.indeed.delay);
                    currentPage++;
                } catch (e) {
                    break;
                }
            } else {
                break;
            }
        }
    } catch (err) {
        console.error(`    Error: ${err.message}`);
    }

    return results;
}

/**
 * Scrape Welcome to the Jungle
 */
async function scrapeWTTJ(page, domain = '', maxPages = 3) {
    console.log(`  WTTJ: ${domain || 'stage'}, ${maxPages} pages`);

    const results = [];

    try {
        const query = domain ? `${domain} stage alternance` : 'stage alternance';
        const url = `https://www.welcometothejungle.com/fr/jobs?query=${encodeURIComponent(query)}`;

        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(2000);

        // Scroll to load more jobs
        for (let i = 0; i < 3; i++) {
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await page.waitForTimeout(1000);
        }

        const jobs = await page.evaluate(() => {
            const jobs = [];
            const cards = document.querySelectorAll('.sc-1twkx6o-0, .job-card, .sc-job-card');

            cards.forEach(card => {
                const titleEl = card.querySelector('.sc-title, .sc-bdVaJa, .job-title, h3');
                const title = titleEl?.textContent?.trim() || '';

                if (!title) return;

                const companyEl = card.querySelector('.company-name, .sc-12345, .company');
                const company = companyEl?.textContent?.trim() || 'Entreprise';

                const locEl = card.querySelector('.sc-location, .location, .place');
                const loc = locEl?.textContent?.trim() || 'France';

                const domEl = card.querySelector('.sc-domain, .domain, .job-domain');
                const dom = domEl?.textContent?.trim() || 'General';

                const typeMatch = title.toLowerCase().match(/(alternance|stage)/);
                const detectedType = typeMatch ? (typeMatch[1] === 'alternance' ? 'alternance' : 'stage') : 'stage';

                jobs.push({
                    title: title.replace(/\s+/g, ' '),
                    company: company.replace(/\s+/g, ' '),
                    location: loc.replace(/\s+/g, ' '),
                    domain: dom,
                    type: detectedType,
                    description: '',
                    requirements: [],
                    skills: [],
                    studyLevel: ['bac+3', 'bac+4', 'bac+5'],
                    duration: '6 mois',
                    postedAt: new Date().toISOString(),
                    source: 'welcome_to_the_jungle'
                });
            });

            return jobs;
        });

        if (jobs.length > 0) {
            results.push(...jobs);
            console.log(`    Found ${jobs.length} jobs`);
        }
    } catch (err) {
        console.error(`    Error: ${err.message}`);
    }

    return results;
}

/**
 * Scrape LinkedIn
 */
async function scrapeLinkedin(page, maxPages = 2) {
    console.log(`  LinkedIn: ${maxPages} pages`);

    const results = [];
    let currentPage = 1;

    try {
        const url = 'https://www.linkedin.com/jobs/search?keywords=Stage%20ou%20Alternance&location=France';

        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(3000);

        // Scroll to load jobs
        for (let i = 0; i < 10; i++) {
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await page.waitForTimeout(500);
        }

        const jobs = await page.evaluate(() => {
            const jobs = [];
            const cards = document.querySelectorAll('.base-search-card, .job-card-container');

            cards.forEach(card => {
                const titleEl = card.querySelector('.base-search-card__title, .job-card-list__title');
                const title = titleEl?.textContent?.trim() || '';

                if (!title) return;

                const companyEl = card.querySelector('.base-search-card__subtitle, .job-card-container__company-name');
                const company = companyEl?.textContent?.trim() || 'Entreprise';

                const locEl = card.querySelector('.job-search-card__location, .job-card-container__location');
                const loc = locEl?.textContent?.trim() || 'France';

                const typeMatch = title.toLowerCase().match(/(alternance|stage)/);
                const detectedType = typeMatch ? (typeMatch[1] === 'alternance' ? 'alternance' : 'stage') : 'stage';

                jobs.push({
                    title: title.replace(/\s+/g, ' '),
                    company: company.replace(/\s+/g, ' '),
                    location: loc.replace(/\s+/g, ' '),
                    domain: 'General',
                    type: detectedType,
                    description: '',
                    requirements: [],
                    skills: [],
                    studyLevel: ['bac+3', 'bac+4', 'bac+5'],
                    duration: '6 mois',
                    postedAt: new Date().toISOString(),
                    source: 'linkedin'
                });
            });

            return jobs;
        });

        if (jobs.length > 0) {
            results.push(...jobs);
            console.log(`    Found ${jobs.length} jobs`);
        }
    } catch (err) {
        console.error(`    Error: ${err.message}`);
    }

    return results;
}

/**
 * Main function - scrape all sources
 */
async function scrapeAllJobs() {
    console.log('=== JobStudent Comprehensive Scrape ===\n');
    console.log('Starting to scrape jobs from multiple sources...\n');

    const db = new DatabaseManager();
    let browser = null;

    try {
        // Connect to database
        await db.connect();
        await db.initializeSchema();

        // Launch browser with Playwright
        console.log('Launching browser...');
        browser = await chromium.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ]
        });

        const page = await browser.newPage({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        const totalScraped = [];
        const totalSaved = [];

        // Scrape HelloWork (France Travail) - Main source
        console.log('\n=== Scraping HelloWork (France Travail) ===');
        let hwCount = 0;
        for (const location of LOCATIONS) {
            for (const type of ['stage', 'alternance']) {
                const jobs = await scrapeHelloWork(page, type, location, CONFIG.helloWork.maxPages);
                totalScraped.push(...jobs);
                hwCount += jobs.length;

                for (const job of jobs) {
                    const id = `hw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    await db.insertJob({ ...job, id });
                    totalSaved.push(id);
                }

                await new Promise(r => setTimeout(r, CONFIG.helloWork.delay));
            }
            console.log(`  Total so far: ${totalScraped.length} jobs\n`);
        }

        // Scrape Indeed
        console.log('\n=== Scraping Indeed ===');
        let indeedCount = 0;
        for (const location of LOCATIONS.slice(0, 5)) {
            for (const type of ['stage', 'alternance']) {
                const jobs = await scrapeIndeed(page, type, location, CONFIG.indeed.maxPages);
                totalScraped.push(...jobs);
                indeedCount += jobs.length;

                for (const job of jobs) {
                    const id = `indeed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    await db.insertJob({ ...job, id });
                    totalSaved.push(id);
                }

                await new Promise(r => setTimeout(r, CONFIG.indeed.delay));
            }
            console.log(`  Total so far: ${totalScraped.length} jobs\n`);
        }

        // Scrape Welcome to the Jungle
        console.log('\n=== Scraping Welcome to the Jungle ===');
        let wttjCount = 0;
        for (const domain of DOMAINS.slice(0, 10)) {
            const jobs = await scrapeWTTJ(page, domain, CONFIG.wttj.maxPages);
            totalScraped.push(...jobs);
            wttjCount += jobs.length;

            for (const job of jobs) {
                const id = `wttj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                await db.insertJob({ ...job, id });
                totalSaved.push(id);
            }

            await new Promise(r => setTimeout(r, CONFIG.wttj.delay));
        }
        console.log(`  Total so far: ${totalScraped.length} jobs\n`);

        // Scrape LinkedIn
        console.log('\n=== Scraping LinkedIn ===');
        const linkedinJobs = await scrapeLinkedin(page, CONFIG.linkedin.maxPages);
        totalScraped.push(...linkedinJobs);

        for (const job of linkedinJobs) {
            const id = `linkedin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            await db.insertJob({ ...job, id });
            totalSaved.push(id);
        }

        // Update stats
        const stats = await db.updateStats();

        console.log('\n=== Final Scrape Results ===');
        console.log(`Total jobs scraped: ${totalScraped.length}`);
        console.log(`Total jobs saved: ${totalSaved.length}`);
        console.log(`Stats: ${stats.totalJobs} jobs, ${stats.totalCompanies} companies`);

        console.log('\nBreakdown:');
        console.log(`  HelloWork: ~${hwCount} jobs`);
        console.log(`  Indeed: ~${indeedCount} jobs`);
        console.log(`  WTTJ: ~${wttjCount} jobs`);
        console.log(`  LinkedIn: ${linkedinJobs.length} jobs`);

    } catch (err) {
        console.error('Fatal error:', err);
    } finally {
        if (browser) {
            await browser.close();
        }
        await db.close();
        console.log('\n=== Scraping Complete ===');
    }
}

// Run
scrapeAllJobs();
