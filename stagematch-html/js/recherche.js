// Recherche Page JavaScript - Fetches jobs from API

const API_URL = 'http://localhost:3000/api';

function getScoreClass(score) {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
}

function getScoreText(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Bon';
    if (score >= 40) return 'Moyen';
    return 'Faible';
}

function formatDate(date) {
    if (!date) return 'Date inconnue';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

async function displayJobs(jobs) {
    const grid = document.getElementById('jobsGrid');
    const count = document.getElementById('resultsCount');

    if (jobs.length === 0) {
        grid.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">🔍</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucune offre trouvée</h3>
                <p class="text-gray-600">Essayez avec d'autres mots-clés ou filtres</p>
                <button onclick="searchJobs()" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">Réinitialiser</button>
            </div>`;
        count.textContent = '0 offres trouvées';
        return;
    }

    count.textContent = `${jobs.length} offre${jobs.length > 1 ? 's' : ''} trouvée${jobs.length > 1 ? 's' : ''}`;

    let html = '';
    jobs.forEach(job => {
        const scoreClass = getScoreClass(job.matchScore || 0);
        const scoreText = getScoreText(job.matchScore || 0);
        const logoUrl = job.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company || '')}&background=3b82f6&color=fff`;
        html += `
        <div class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group">
            <div class="flex flex-col md:flex-row gap-4">
                <img src="${logoUrl}" alt="${job.company}" class="w-16 h-16 rounded-xl object-cover flex-shrink-0">
                <div class="flex-1">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h3 class="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">${job.title}</h3>
                            <p class="text-gray-600">${job.company || ''}</p>
                        </div>
                        ${job.matchScore ? `<div class="px-3 py-1 rounded-full text-xs font-semibold border ${scoreClass}">${job.matchScore}% ${scoreText}</div>` : ''}
                    </div>
                    <div class="flex flex-wrap gap-2 mb-3">
                        <span class="px-3 py-1 rounded-full text-xs font-medium ${job.type === 'stage' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}">
                            ${job.type === 'stage' ? 'Stage' : 'Alternance'}
                        </span>
                        <span class="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">${job.domain || 'General'}</span>
                        ${job.remote === 'true' || job.remote === true ? '<span class="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1"><i data-lucide="laptop" class="w-3 h-3"></i> Télétravail</span>' : ''}
                    </div>
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">${job.description || ''}</p>
                    <div class="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                        <span class="flex items-center gap-1"><i data-lucide="map-pin" class="w-4 h-4"></i>${job.location || ''}</span>
                        <span class="flex items-center gap-1"><i data-lucide="clock" class="w-4 h-4"></i>${job.duration || '6 mois'}</span>
                        ${job.salary ? `<span class="flex items-center gap-1"><i data-lucide="dollar-sign" class="w-4 h-4"></i>${job.salary}</span>` : ''}
                    </div>
                    <div class="flex flex-wrap gap-1 mb-3">
                        ${(job.skills || []).slice(0, 4).map(skill => `<span class="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">${skill}</span>`).join('')}
                        ${job.skills && job.skills.length > 4 ? `<span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">+${job.skills.length - 4}</span>` : ''}
                    </div>
                    <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span class="text-xs text-gray-500">Publié le ${formatDate(job.postedAt)}</span>
                        <a href="offre.html?id=${job.id}" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Voir l'offre</a>
                    </div>
                </div>
            </div>
        </div>`;
    });

    grid.innerHTML = html;
    setTimeout(() => lucide.createIcons(), 10);
}

async function fetchJobs(filters = {}) {
    const params = new URLSearchParams();
    if (filters.query) params.append('query', filters.query);
    if (filters.location) params.append('location', filters.location);
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.studyLevel) params.append('studyLevel', filters.studyLevel);
    if (filters.domain) params.append('domain', filters.domain);
    if (filters.remote !== undefined) params.append('remote', filters.remote);

    try {
        const response = await fetch(`${API_URL}/jobs?${params.toString()}`);
        const data = await response.json();
        return data.success ? data.jobs : [];
    } catch (err) {
        console.error('Error fetching jobs:', err);
        return [];
    }
}

async function searchJobs() {
    const query = document.getElementById('searchQuery').value.toLowerCase();
    const location = document.getElementById('location').value.toLowerCase();
    const typeBtns = document.getElementById('btnTypeAll').classList.contains('bg-blue-100') ? 'all' :
                     document.getElementById('btnTypeStage').classList.contains('bg-purple-100') ? 'stage' : 'alternance';
    const studyLevel = document.getElementById('studyLevel').value;
    const domain = document.getElementById('domain').value;
    const remoteOnly = document.getElementById('remoteOnly').checked;

    const jobs = await fetchJobs({
        query,
        location,
        type: typeBtns,
        studyLevel,
        domain,
        remote: remoteOnly ? 'true' : undefined
    });

    jobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    displayJobs(jobs);
}

function filterByType(type) {
    const btns = ['btnTypeAll', 'btnTypeStage', 'btnTypeAlternance'];
    btns.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.className = id === 'btnTypeAll' ? 'px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium' :
                            id === 'btnTypeStage' ? 'px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium' :
                            'px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium';
        }
    });

    const activeBtn = type === 'all' ? 'btnTypeAll' : type === 'stage' ? 'btnTypeStage' : 'btnTypeAlternance';
    const activeBtnEl = document.getElementById(activeBtn);
    if (activeBtnEl) {
        activeBtnEl.classList.remove('bg-gray-100', 'text-gray-600');
        activeBtnEl.classList.add(type === 'all' ? 'bg-blue-100 text-blue-700' :
                               type === 'stage' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700');
    }

    btns.forEach(id => {
        if (id !== activeBtn) {
            const btn = document.getElementById(id);
            if (btn) {
                btn.className = id === 'btnTypeAll' ? 'px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium' :
                                id === 'btnTypeStage' ? 'px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium' :
                                'px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium';
            }
        }
    });

    searchJobs();
}

async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const data = await response.json();
        if (data.success) {
            document.getElementById('totalJobs').textContent = data.stats.totalJobs;
            document.getElementById('totalCompanies').textContent = data.stats.totalCompanies;
            document.getElementById('totalApplications').textContent = data.stats.totalApplications || '0';
        }
    } catch (err) {
        console.error('Error loading stats:', err);
    }
}

async function displayPopularJobs() {
    const jobs = await fetchJobs();
    displayJobs(jobs.slice(0, 6));
}

document.addEventListener('DOMContentLoaded', async function() {
    lucide.createIcons();
    await loadStats();
    await displayPopularJobs();
});
