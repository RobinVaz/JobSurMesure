// Admin Scraping Page JavaScript

let currentSource = 'hellowork';

// Set source and update UI
function setSource(source) {
    currentSource = source;

    // Update source buttons
    const sourceClasses = {
        'hellowork': 'border-orange-500 bg-orange-50',
        'indeed': 'border-blue-500 bg-blue-50',
        'welcome_to_the_jungle': 'border-green-500 bg-green-50',
        'linkedin': 'border-blue-700 bg-blue-700/10',
        'twitter': 'border-black bg-gray-100',
        'jobteaser': 'border-pink-500 bg-pink-50',
        'all': 'border-purple-500 bg-purple-50',
        'all_sources': 'border-emerald-600 bg-emerald-50'
    };

    // Update all buttons
    document.querySelectorAll('.source-btn').forEach(btn => {
        btn.className = 'source-btn ' + Object.keys(sourceClasses).filter(k => btn.classList.contains(k)).map(k => {
            const btnSource = k.replace('source-', '');
            return k + ' p-3 rounded-xl border-2 transition-all ' + (currentSource === btnSource ? sourceClasses[btnSource] : 'border-gray-200 hover:border-gray-300');
        }).join(' ');
    });

    // Update label text
    const labels = {
        'hellowork': 'HelloWork',
        'indeed': 'Indeed',
        'welcome_to_the_jungle': 'WTTJ',
        'linkedin': 'LinkedIn',
        'twitter': 'X (Twitter)',
        'jobteaser': 'JobTeaser',
        'all': 'HelloWork + Indeed',
        'all_sources': 'Toutes les sources (5)'
    };

    document.getElementById('scrapeBtnText').textContent = 'Scraping ' + (labels[source] || source);

    // Redirection for LinkedIn emoticon
    if (source === 'linkedin') {
        window.open('https://www.linkedin.com/feed/?skipRedirect=true', '_blank');
    }
    // Redirection for X (Twitter) emoticon
    if (source === 'twitter') {
        window.open('https://x.com/Jobsurmesure', '_blank');
    }
}

// Quick scrape function
function handleQuickScrape(type) {
    const btn = event.currentTarget;
    const spinner = document.getElementById('quickSpinner');

    btn.disabled = true;
    spinner.classList.remove('hidden');

    // Simulate scraping
    setTimeout(() => {
        const result = {
            success: true,
            stats: {
                scraped: Math.floor(Math.random() * 30) + 15,
                saved: Math.floor(Math.random() * 20) + 10,
                type: type,
                location: 'Toutes',
                source: currentSource === 'all_sources' ? 'Toutes les sources (5)' : (currentSource === 'all' ? 'HelloWork + Indeed' : 'HelloWork')
            },
            preview: generatePreview(type)
        };

        showResult(result);
        btn.disabled = false;
        spinner.classList.add('hidden');
    }, 1500);
}

// Full scrape function
function handleScrape() {
    const btn = document.getElementById('scrapeBtnText');
    const spinner = document.getElementById('scrapeSpinner');
    const scrapeBtn = event.currentTarget;

    scrapeBtn.disabled = true;
    spinner.classList.remove('hidden');
    btn.textContent = 'Scraping en cours...';

    // Simulate scraping
    setTimeout(() => {
        const scrapeType = document.getElementById('scrapeType').value;
        const location = document.getElementById('location').value || 'Toutes';
        const keywords = document.getElementById('keywords').value || '';
        const saveToDB = document.getElementById('saveToDB').checked;

        const result = {
            success: true,
            stats: {
                scraped: Math.floor(Math.random() * 100) + 50,
                saved: Math.floor(Math.random() * 80) + 40,
                type: scrapeType,
                location: location,
                source: currentSource === 'all_sources' ? 'Toutes les sources (5)' : (currentSource === 'all' ? 'HelloWork + Indeed' : 'HelloWork')
            },
            preview: generatePreview(scrapeType)
        };

        showResult(result);
        scrapeBtn.disabled = false;
        spinner.classList.add('hidden');
        btn.textContent = 'Scraping HelloWork';
    }, 2000);
}

// Generate preview data
function generatePreview(type) {
    const items = [];
    const titles = type === 'stage' ? ['Stage Développeur', 'Stage Marketing', 'Stage Design', 'Stage RH', 'Stage Data'] :
                   type === 'alternance' ? ['Alternance Développeur', 'Alternance Marketing', 'Alternance Communication', 'AlternanceRH', 'Alternance Management'] :
                   ['Stage Développeur', 'Alternance Développeur', 'Stage Marketing', 'Alternance Marketing', 'Stage Design'];

    const companies = ['TechStartup', 'Banque Paris', 'Digital Agency', 'Consulting Co', 'InnovTech'];

    for (let i = 0; i < 5; i++) {
        items.push({
            id: 'job-' + i,
            title: titles[i] || 'Offre',
            company: companies[i],
            location: i === 0 ? 'Paris' : 'Lyon',
            type: type === 'stage' ? 'stage' : (type === 'alternance' ? 'alternance' : (i % 2 === 0 ? 'stage' : 'alternance'))
        });
    }

    return items;
}

// Show result section
function showResult(result) {
    const resultSection = document.getElementById('resultSection');
    resultSection.classList.remove('hidden');

    // Update stats
    document.getElementById('statsScraped').textContent = result.stats.scraped;
    document.getElementById('statsSaved').textContent = result.stats.saved;
    document.getElementById('statsType').textContent = result.stats.type.charAt(0).toUpperCase() + result.stats.type.slice(1);
    document.getElementById('statsLocation').textContent = result.stats.location;
    document.getElementById('statsSource').textContent = result.stats.source;

    // Update preview
    const previewList = document.getElementById('previewList');
    let html = '';
    result.preview.forEach(item => {
        const typeClass = item.type === 'stage' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700';
        html += `
        <div class="bg-white rounded-lg p-3 flex justify-between items-center">
            <div>
                <p class="font-medium text-gray-900">${item.title}</p>
                <p class="text-sm text-gray-600">${item.company} - ${item.location}</p>
            </div>
            <span class="text-xs px-2 py-1 rounded-full ${typeClass}">${item.type}</span>
        </div>`;
    });
    previewList.innerHTML = html;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    setSource('hellowork');
});
