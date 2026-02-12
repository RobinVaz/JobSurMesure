// Candidatures Page JavaScript

// Mock applications data
const mockApplications = [
    {
        id: 'app-1',
        jobId: 'job-1',
        jobTitle: 'Développeur Full Stack Junior',
        company: 'TechStartup Paris',
        companyLogo: 'https://ui-avatars.com/api/?name=TS&background=3b82f6&color=fff',
        status: 'pending',
        appliedAt: new Date('2026-01-25'),
        notes: 'Première candidature, CV envoyé'
    },
    {
        id: 'app-2',
        jobId: 'job-2',
        jobTitle: 'Stage Marketing Digital',
        company: 'L\'Oréal',
        companyLogo: 'https://ui-avatars.com/api/?name=LO&background=e11d48&color=fff',
        status: 'viewed',
        appliedAt: new Date('2026-01-20'),
        notes: 'CV vu par le recruteur'
    },
    {
        id: 'app-3',
        jobId: 'job-3',
        jobTitle: 'Data Analyst Junior',
        company: 'BNP Paribas',
        companyLogo: 'https://ui-avatars.com/api/?name=BNP&background=00965e&color=fff',
        status: 'interview',
        appliedAt: new Date('2026-01-15'),
        notes: 'Rappel pour entretien téléphonique',
        interviewDate: new Date('2026-02-10'),
        interviewType: 'Téléphone'
    },
    {
        id: 'app-4',
        jobId: 'job-4',
        jobTitle: 'Stage Assistant Chef de Projet',
        company: 'Capgemini',
        companyLogo: 'https://ui-avatars.com/api/?name=CG&background=0070ad&color=fff',
        status: 'accepted',
        appliedAt: new Date('2026-01-10'),
        notes: 'Offre d\'alternance acceptée !',
        offerDetails: '1 100€/mois, 6 mois'
    },
    {
        id: 'app-5',
        jobId: 'job-5',
        jobTitle: 'Développeur Mobile iOS/Android',
        company: 'Doctolib',
        companyLogo: 'https://ui-avatars.com/api/?name=DO&background=6366f1&color=fff',
        status: 'rejected',
        appliedAt: new Date('2026-01-05'),
        notes: 'Merci mais nous avons retenu un autre candidat'
    },
    {
        id: 'app-6',
        jobId: 'job-6',
        jobTitle: 'Stage Ressources Humaines',
        company: 'Decathlon',
        companyLogo: 'https://ui-avatars.com/api/?name=DE&background=0082c3&color=fff',
        status: 'pending',
        appliedAt: new Date('2026-02-01'),
        notes: 'En attente de réponse'
    },
    {
        id: 'app-7',
        jobId: 'job-7',
        jobTitle: 'Ingénieur DevOps Junior',
        company: 'OVHcloud',
        companyLogo: 'https://ui-avatars.com/api/?name=OVH&background=000e9c&color=fff',
        status: 'interview',
        appliedAt: new Date('2026-01-28'),
        notes: 'Entretien technique prévu'
    },
    {
        id: 'app-8',
        jobId: 'job-8',
        jobTitle: 'Stage Design UX/UI',
        company: 'BlaBlaCar',
        companyLogo: 'https://ui-avatars.com/api/?name=BB&background=00aff5&color=fff',
        status: 'pending',
        appliedAt: new Date('2026-02-05'),
        notes: 'Portfolio envoyé'
    }
];

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
        list.innerHTML = '';
        emptyState.classList.remove('hidden');
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

function filterApplications(event, filter) {
    const buttons = document.querySelectorAll('.flex.gap-2 button');
    buttons.forEach(btn => btn.classList.remove('bg-blue-600', 'text-white', 'border'));

    // Find the button that was clicked and set active state
    event.target.classList.add('bg-blue-600', 'text-white');
    event.target.classList.remove('bg-white', 'border-gray-200', 'text-gray-700');

    let filtered = mockApplications;
    if (filter !== 'all') {
        filtered = mockApplications.filter(app => app.status === filter);
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

    // Load applications
    updateStats(mockApplications);
    displayApplications(mockApplications);
});
