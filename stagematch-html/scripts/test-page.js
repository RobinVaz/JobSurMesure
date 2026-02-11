#!/usr/bin/env node

const { chromium } = require('playwright');

async function testPage() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // New France Travail URL
    const url = 'https://candidat.francetravail.fr/emplois?motsCles=stage&lieux=Paris';
    console.log(`Fetching: ${url}`);

    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const content = await page.content();
    console.log('Page loaded. Size:', content.length, 'bytes');

    // Check for job cards
    const jobCount = await page.evaluate(() => {
        const cards = document.querySelectorAll('.search-card, .result-card, .job-card, article, [class*="card"]');
        return cards.length;
    });
    console.log('Job cards found:', jobCount);

    // Check for any job-like elements
    const anyJobs = await page.evaluate(() => {
        return {
            h3: document.querySelectorAll('h3').length,
            h2: document.querySelectorAll('h2').length,
            h1: document.querySelectorAll('h1').length,
            article: document.querySelectorAll('article').length,
            card: document.querySelectorAll('.card').length,
            searchCard: document.querySelectorAll('.search-card').length,
            resultCard: document.querySelectorAll('.result-card').length,
            jobCard: document.querySelectorAll('.job-card').length,
            title: document.querySelectorAll('.title').length
        };
    });
    console.log('Element counts:', JSON.stringify(anyJobs, null, 2));

    // Save HTML to file for inspection
    const fs = require('fs');
    fs.writeFileSync('page.html', content);
    console.log('Saved HTML to page.html');

    await browser.close();
}

testPage().catch(console.error);