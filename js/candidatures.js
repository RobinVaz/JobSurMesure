// Candidatures Page JavaScript

// Functions to manage applications in localStorage
function getApplications() {
    const stored = localStorage.getItem('jobsurmesure_applications');
    return stored ? JSON.parse(stored) : [];
}

function saveApplications(applications) {
    localStorage.setItem('jobsurmesure_applications', JSON.stringify(applications));
}

function addApplication(app) {
    const apps = getApplications();
    apps.push(app);
    saveApplications(apps);
}

function getStatusClass(status) {
    switch (status) {
        case 'pending': return 'status-pending';
        case 'viewed': return 'status-viewed';
        case 'interview': return 'status-interview';
        case 'accepted': return 'status-accepted';
        case 'rejected': return 'status-rejected';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function getStatusText(status) {
    switch (status) {
        case 'pending': return 'En attente';
        case 'viewed': return 'Vue';
        case 'interview': return 'Entretien';
        case 'accepted': return 'Acceptée';
        case 'rejected': return 'Refusée';
        default: return status;
    }
}

function formatDate(date) {
    if (!date) return 'Date inconnue';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function displayApplications(applications) {
    const list = document.getElementById('applicationsList');
    const emptyState = document.getElementById('emptyState');

    if (applications.length === 0) {
        list.innerHTML = `
            <div class="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div class="text-6xl mb-4">💼</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucune candidature pour l'instant</h3>
                <p class="text-gray-600 mb-6">Commencez à postuler à des offres pour les voir apparaître ici !</p>
                <a href="recherche.html" class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                    <i data-lucide="search" class="inline w-4 h-4 mr-2"></i>Rechercher des offres
                </a>
            </div>`;
        emptyState.classList.add('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    let html = '';
    applications.forEach(app => {
        html += `
        <div class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
            <div class="flex flex-col md:flex-row gap-4">
                <img src="${app.companyLogo}" alt="${app.company}" class="w-16 h-16 rounded-xl object-cover flex-shrink-0">
                <div class="flex-1">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h3 class="font-bold text-gray-900 text-lg">${app.jobTitle}</h3>
                            <p class="text-gray-600">${app.company}</p>
                        </div>
                        <span class="px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(app.status)}">
                            ${getStatusText(app.status)}
                        </span>
                    </div>
                    <div class="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                        <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-4 h-4"></i>${formatDate(app.appliedAt)}</span>
                        ${app.interviewDate ? `<span class="flex items-center gap-1"><i data-lucide="clock" class="w-4 h-4"></i>${formatDate(app.interviewDate)} (${app.interviewType})</span>` : ''}
                        ${app.offerDetails ? `<span class="flex items-center gap-1"><i data-lucide="check-circle" class="w-4 h-4"></i>${app.offerDetails}</span>` : ''}
                    </div>
                    ${app.notes ? `<p class="text-sm text-gray-600 italic">"${app.notes}"</p>` : ''}
                    <div class="mt-4 flex flex-wrap gap-2">
                        ${app.status === 'pending' ? `<button onclick="viewApplication('${app.id}')" class="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100">Voir l'offre</button>` : ''}
                        ${app.status === 'interview' ? `<a href="preparation-entretien.html?jobId=${app.jobId}" class="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm hover:bg-purple-100">Préparer l'entretien</a>` : ''}
                        ${app.status === 'accepted' ? `<button onclick="downloadOffer('${app.id}')" class="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100">Télécharger l'offre</button>` : ''}
                    </div>
                </div>
            </div>
        </div>`;
    });

    list.innerHTML = html;
    setTimeout(() => lucide.createIcons(), 10);
}

function filterApplications(filter) {
    const buttons = document.querySelectorAll('#filterTabs button');
    buttons.forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-white', 'border-gray-200', 'text-gray-700');
    });

    // Set active state on clicked button
    const clickedButton = document.querySelector(`#filterTabs button[data-filter="${filter}"]`);
    if (clickedButton) {
        clickedButton.classList.add('bg-blue-600', 'text-white');
        clickedButton.classList.remove('bg-white', 'border-gray-200', 'text-gray-700');
    }

    let filtered = getApplications();
    if (filter !== 'all') {
        filtered = filtered.filter(app => app.status === filter);
    }

    // Update stats
    updateStats(filtered);
    displayApplications(filtered);
}

function updateStats(applications) {
    document.getElementById('totalApplications').textContent = applications.length;
    document.getElementById('pendingApplications').textContent = applications.filter(a => a.status === 'pending').length;
    document.getElementById('viewedApplications').textContent = applications.filter(a => a.status === 'viewed').length;
    document.getElementById('interviewApplications').textContent = applications.filter(a => a.status === 'interview').length;
    document.getElementById('acceptedApplications').textContent = applications.filter(a => a.status === 'accepted').length;
}

function viewApplication(appId) {
    // In a real app, this would show details
    alert('Affichage des détails de la candidature...');
}

function downloadOffer(appId) {
    // In a real app, this would download an offer PDF
    alert('Téléchargement de l\'offre...');
}

function logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        localStorage.removeItem('jobsurmesure_user');
        localStorage.removeItem('jobsurmesure_files');
        localStorage.removeItem('jobsurmesure_applications');
        window.location.href = 'index.html';
    }
}

function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');
    const icon = document.getElementById('mobileMenuIcon');

    if (btn && menu && icon) {
        btn.addEventListener('click', function() {
            menu.classList.toggle('hidden');
            if (menu.classList.contains('hidden')) {
                icon.setAttribute('data-lucide', 'menu');
            } else {
                icon.setAttribute('data-lucide', 'x');
            }
            setTimeout(() => lucide.createIcons(), 10);
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    initMobileMenu();

    // Load applications from localStorage (empty by default)
    const applications = getApplications();
    updateStats(applications);
    displayApplications(applications);

    // Add event listeners for filter buttons
    const filterTabs = document.getElementById('filterTabs');
    if (filterTabs) {
        filterTabs.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON') {
                const filter = e.target.getAttribute('data-filter');
                if (filter) {
                    filterApplications(filter);
                }
            }
        });
    }
});