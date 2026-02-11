#!/usr/bin/env node

/**
 * JobStudent Real Job Scraper
 * Uses headless browser to scrape real jobs from France Travail, Indeed, WTTJ
 * Saves to SQLite database
 */

const { chromium } = require('playwright');
const DatabaseManager = require('./database');

// All major French cities
const LOCATIONS = [
    'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Nantes',
    'Lille', 'Nice', 'Strasbourg', 'Montpellier', 'Rennes', 'Reims',
    'Saint-Étienne', 'Le Mans', 'Aix-en-Provence', 'Cannes', 'Grenoble',
    'Dijon', 'Angers', 'Nîmes', 'Toulon', 'Amiens', 'Perpignan', 'Metz'
];

// Domains to search
const DOMAINS = [
    'stage', 'alternance', 'développeur', 'marketing', 'finance',
    'data analyst', 'design', 'commerce', 'rh', 'consulting'
];

/**
 * Main scraping function
 */
async function scrapeRealJobs() {
    console.log('=== JobStudent Real Job Scraper ===\n');
    console.log('Starting browser and scraping real job data...\n');

    const db = new DatabaseManager();
    let browser = null;

    try {
        await db.connect();
        await db.initializeSchema();

        console.log('Launching browser...');
        browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        const page = await browser.newPage({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        const totalScraped = [];
        const totalSaved = [];

        // Scrape France Travail (HelloWork)
        console.log('\n=== Scraping France Travail (HelloWork) ===');

        for (const location of LOCATIONS) {
            const types = ['stage', 'alternance'];
            for (const type of types) {
                const url = `https://www.francetravail.fr/emplois?motsCles=${type}&lieux=${encodeURIComponent(location)}&typeContrat=${type}`;
                console.log(`  ${type} in ${location}:`);

                try {
                    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
                    await page.waitForTimeout(2000);

                    // Extract jobs from the page
                    const jobs = await page.evaluate(() => {
                        const results = [];

                        // Try multiple selectors for job cards
                        const selectors = [
                            '.search-card, .result-card',
                            '.job-card',
                            '[class*="card"]',
                            'article, .card'
                        ];

                        let cards = [];
                        for (const selector of selectors) {
                            cards = [...document.querySelectorAll(selector)];
                            if (cards.length > 0) break;
                        }

                        if (cards.length === 0) {
                            // Last resort: find any card-like elements
                            cards = [...document.querySelectorAll('article, .card, .search-card')];
                        }

                        cards.forEach(card => {
                            // Try to extract title
                            const titleEl = card.querySelector('h1, h2, h3, .title, .job-title, [class*="title"]');
                            const title = titleEl?.textContent?.trim() || '';

                            if (!title || title.length < 5) return;

                            // Extract company
                            const companyEl = card.querySelector('.company, .company-name, [class*="company"]');
                            const company = companyEl?.textContent?.trim() || 'Entreprise';

                            // Extract location
                            const locEl = card.querySelector('.location, .place, [class*="location"]');
                            const loc = locEl?.textContent?.trim() || location;

                            // Extract salary if available
                            const salaryEl = card.querySelector('.salary, [class*="salary"]');
                            const salary = salaryEl?.textContent?.trim() || '';

                            // Extract description
                            const descEl = card.querySelector('.description, .job-description, [class*="desc"]');
                            const description = descEl?.textContent?.trim() || '';

                            // Determine type
                            const typeMatch = title.toLowerCase().match(/(alternance|stage)/);
                            const detectedType = typeMatch ? (typeMatch[1] === 'alternance' ? 'alternance' : 'stage') : type;

                            results.push({
                                title: title.replace(/\s+/g, ' ').substring(0, 100),
                                company: company.replace(/\s+/g, ' '),
                                location: loc.replace(/\s+/g, ' '),
                                salary: salary,
                                type: detectedType,
                                domain: 'General',
                                description: description.substring(0, 500),
                                requirements: [],
                                skills: [],
                                studyLevel: ['bac+3', 'bac+4', 'bac+5'],
                                duration: '6 mois',
                                postedAt: new Date().toISOString(),
                                source: 'hellowork'
                            });
                        });

                        return results;
                    });

                    if (jobs.length > 0) {
                        console.log(`    Found ${jobs.length} jobs`);
                        totalScraped.push(...jobs);

                        for (const job of jobs) {
                            try {
                                const id = `hw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                                await db.insertJob({ ...job, id });
                                totalSaved.push(id);
                            } catch (err) {
                                // Skip duplicate or error jobs
                            }
                        }
                    }
                } catch (err) {
                    console.log(`    Error: ${err.message}`);
                }

                await new Promise(r => setTimeout(r, 2000));
            }
        }

        // Scrape Welcome to the Jungle
        console.log('\n=== Scraping Welcome to the Jungle ===');

        for (const domain of DOMAINS.slice(0, 5)) {
            const url = `https://www.welcometothejungle.com/fr/jobs?query=${encodeURIComponent(domain)}`;
            console.log(`  Domain: ${domain}:`);

            try {
                await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
                await page.waitForTimeout(2000);

                // Scroll to load more
                await page.evaluate(() => {
                    for (let i = 0; i < 3; i++) {
                        window.scrollTo(0, document.body.scrollHeight);
                        setTimeout(() => {}, 500);
                    }
                });
                await page.waitForTimeout(1000);

                const jobs = await page.evaluate(() => {
                    const results = [];

                    const cards = [...document.querySelectorAll('.sc-job-card, .job-card, article')];

                    cards.forEach(card => {
                        const titleEl = card.querySelector('.sc-title, h1, h2, h3, [class*="title"]');
                        const title = titleEl?.textContent?.trim() || '';

                        if (!title || title.length < 5) return;

                        const companyEl = card.querySelector('.company-name, [class*="company"]');
                        const company = companyEl?.textContent?.trim() || 'Entreprise';

                        const locEl = card.querySelector('.sc-location, .location, [class*="location"]');
                        const loc = locEl?.textContent?.trim() || 'France';

                        const typeMatch = title.toLowerCase().match(/(alternance|stage)/);
                        const detectedType = typeMatch ? (typeMatch[1] === 'alternance' ? 'alternance' : 'stage') : 'stage';

                        results.push({
                            title: title.replace(/\s+/g, ' ').substring(0, 100),
                            company: company.replace(/\s+/g, ' '),
                            location: loc.replace(/\s+/g, ' '),
                            type: detectedType,
                            domain: 'General',
                            description: '',
                            requirements: [],
                            skills: [],
                            studyLevel: ['bac+3', 'bac+4', 'bac+5'],
                            duration: '6 mois',
                            postedAt: new Date().toISOString(),
                            source: 'welcome_to_the_jungle'
                        });
                    });

                    return results;
                });

                if (jobs.length > 0) {
                    console.log(`    Found ${jobs.length} jobs`);
                    totalScraped.push(...jobs);

                    for (const job of jobs) {
                        try {
                            const id = `wttj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                            await db.insertJob({ ...job, id });
                            totalSaved.push(id);
                        } catch (err) {}
                    }
                }
            } catch (err) {
                console.log(`    Error: ${err.message}`);
            }

            await new Promise(r => setTimeout(r, 2000));
        }

        // Update stats
        const stats = await db.updateStats();

        console.log('\n=== Final Scrape Results ===');
        console.log(`Total jobs scraped: ${totalScraped.length}`);
        console.log(`Total jobs saved: ${totalSaved.length}`);
        console.log(`Stats: ${stats.totalJobs} jobs, ${stats.totalCompanies} companies`);

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
scrapeRealJobs();