// Offre Page JavaScript

const API_URL = 'http://localhost:3000/api';

// Get job ID from URL
function getJobId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Get current user from session
function getCurrentUser() {
    const user = sessionStorage.getItem('jobsurmesure_user');
    if (user) {
        return JSON.parse(user);
    }
    return null;
}

// Fetch job from API
async function fetchJob() {
    const jobId = getJobId();
    if (!jobId) return null;

    try {
        const response = await fetch(`${API_URL}/jobs/${jobId}`);
        const data = await response.json();
        return data.success ? data.job : null;
    } catch (err) {
        console.error('Error fetching job:', err);
        return null;
    }
}

// Format date
function formatDate(date) {
    if (!date) return 'Date inconnue';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Calculate salary range
function calculateAnnualSalary(monthlySalary) {
    if (!monthlySalary) return 'Non communiqué';
    const matches = monthlySalary.match(/(\d+[\s.]?\d*)/g);
    if (!matches) return 'Non communiqué';

    const min = parseInt(matches[0].replace(/\s/g, ''));
    const max = matches.length > 1 ? parseInt(matches[1].replace(/\s/g, '')) : min;
    const annualMin = min * 12;
    const annualMax = max * 12;

    if (annualMin >= 1000) {
        return `${(annualMin / 1000).toFixed(1)}k - ${(annualMax / 1000).toFixed(1)}k €/an`;
    }
    return `${annualMin} - ${annualMax} €/an`;
}

// Show AI generation modal
function showAIGenerationModal() {
    const modal = document.getElementById('aiGenerationModal');
    modal.classList.remove('hidden');

    // Initialize AI generation options
    const cvBtn = document.getElementById('aiGenerateCv');
    const lmBtn = document.getElementById('aiGenerateLm');

    cvBtn.onclick = () => generateCV();
    lmBtn.onclick = () => generateLM();
}

// Generate CV with AI
async function generateCV() {
    const job = currentJob;
    const user = getCurrentUser();

    if (!user) {
        alert('Veuillez vous connecter pour générer votre CV');
        closeAIGenerationModal();
        return;
    }

    const btn = document.getElementById('aiGenerateCv');
    const originalText = btn.textContent;
    btn.textContent = 'Génération en cours...';
    btn.disabled = true;

    try {
        // Create a template-based CV optimized for the job
        const skillsText = job.skills ? job.skills.slice(0, 5).map(s => `  - Expertise en ${s}`).join('\n') : '  - Compétences pertinentes pour le poste';

        const cvText = `CV ORIENTÉ OFFRE: ${job.title}

CANDIDAT:
${user.firstName} ${user.lastName}
Email: ${user.email}

PROFIL PROFESSIONNEL:
Passionné par le domaine ${job.domain} avec une solide base de compétences.
Motivé par l'opportunité de rejoindre ${job.company} pour le poste de ${job.title}.

COMPÉTENCES CLÉS:
${skillsText}

EXPERIENCE PROFESSIONNELLE:
[Expérience précédente]

FORMATION:
${user.profile?.studyLevel || 'Bac+3'} - [Nom de votre établissement]

LANGUES:
Français (natif)
Anglais (intermédiaire)

CERTIFICATIONS:
[Certifications pertinentes]

CETTE VERSION DU CV EST ORIENTÉE POUR L'OFFRE DE: ${job.title} CHEZ ${job.company}
Suit les recommandations de l'IA pour maximiser vos chances de succès.`;

        // Create downloadable CV
        const blob = new Blob([cvText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CV_${job.company}_${job.title}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        alert('CV généré et téléchargé avec succès!');
        closeAIGenerationModal();
    } catch (err) {
        console.error('Error generating CV:', err);
        alert('Erreur lors de la génération du CV');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// Generate Cover Letter with AI
async function generateLM() {
    const job = currentJob;
    const user = getCurrentUser();

    if (!user) {
        alert('Veuillez vous connecter pour générer votre lettre de motivation');
        closeAIGenerationModal();
        return;
    }

    const btn = document.getElementById('aiGenerateLm');
    const originalText = btn.textContent;
    btn.textContent = 'Génération en cours...';
    btn.disabled = true;

    try {
        const domainsText = user.profile?.preferredDomains?.join(', ') || 'divers domaines';
        const skillsText = job.skills ? job.skills.slice(0, 3).join(', ') : 'diverses compétences';

        const lmText = `Objet: Candidature au poste de ${job.title} chez ${job.company}

Bonjour,

Actuellement étudiant en ${user.profile?.studyLevel || 'Bac+3'}, je suis fortement intéressé par le poste de ${job.title} au sein de ${job.company} que je découvre sur JobSurMesure.

Ayant suivi une formation en ${domainsText}, je me sens particulièrement concerné par les missions que vous recherchez pour ce poste. Mes compétences en ${skillsText} correspondent parfaitement aux attentes de votre offre.

Ce qui me motive particulièrement chez ${job.company}, c'est [motiver avec des éléments spécifiques de l'entreprise]. Je suis convaincu que mon profil et ma motivation feront de moi un atout pour votre équipe.

Je reste bien entendu disponible pour une entretien à votre convenance afin de vous présenter plus en détail mon parcours et mes motivations.

Dans l'attente de votre réponse, je vous adresse mes salutations respectueuses.

Cordialement,

${user.firstName} ${user.lastName}
${user.email}
[Téléphone]`;

        // Create downloadable LM
        const blob = new Blob([lmText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `LM_${job.company}_${job.title}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        alert('Lettre de motivation générée et téléchargée avec succès!');
        closeAIGenerationModal();
    } catch (err) {
        console.error('Error generating LM:', err);
        alert('Erreur lors de la génération de la lettre de motivation');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// Close AI generation modal
function closeAIGenerationModal() {
    document.getElementById('aiGenerationModal').classList.add('hidden');
}

// Display job with all sections including roadmap and AI
function displayJob(job) {
    currentJob = job;

    // Update basic info
    document.getElementById('jobTitleDisplay').textContent = job.title;
    document.getElementById('jobCompany').textContent = job.company;
    document.getElementById('jobLocation').textContent = job.location;
    document.getElementById('jobDescription').textContent = job.description;
    document.getElementById('jobDuration').textContent = job.duration;
    document.getElementById('jobSalary').textContent = job.salary;
    document.getElementById('jobStartDate').textContent = formatDate(job.startDate);

    // Annual salary calculation
    const annualSalary = calculateAnnualSalary(job.salary);
    document.getElementById('jobAnnualSalary').textContent = annualSalary;

    // Job type badge
    const typeBadge = document.getElementById('jobTypeBadge');
    if (job.type === 'stage') {
        typeBadge.textContent = 'Stage';
        typeBadge.className = 'px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700';
    } else {
        typeBadge.textContent = 'Alternance';
        typeBadge.className = 'px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700';
    }

    // Score badge
    if (job.matchScore) {
        const scoreBadge = document.getElementById('jobScoreBadge');
        scoreBadge.textContent = `${job.matchScore}% match`;
        if (job.matchScore >= 80) {
            scoreBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold border bg-green-100 text-green-800 border-green-300';
        } else if (job.matchScore >= 60) {
            scoreBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold border bg-blue-100 text-blue-800 border-blue-300';
        } else {
            scoreBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold border bg-yellow-100 text-yellow-800 border-yellow-300';
        }
    }

    // Requirements
    const reqList = document.getElementById('jobRequirements');
    reqList.innerHTML = (job.requirements || []).map(req => `
        <li class="flex items-start gap-2">
            <i data-lucide="circle-check" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"></i>
            ${req}
        </li>
    `).join('');

    // Skills
    const skillsDiv = document.getElementById('jobSkills');
    skillsDiv.innerHTML = (job.skills || []).map(skill => `
        <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">${skill}</span>
    `).join('');

    // Study level
    document.getElementById('jobStudyLevel').textContent = Array.isArray(job.studyLevel) ? job.studyLevel.join(', ') : job.studyLevel;

    // Roadmap/Débouchés section
    displayRoadmap(job);

    setTimeout(() => lucide.createIcons(), 10);
}

// Display roadmap with career progression
function displayRoadmap(job) {
    const roadmapContainer = document.getElementById('jobRoadmap');
    if (!roadmapContainer) return;

    // Mock roadmap based on job domain
    const roadmapData = getRoadmapData(job.domain, job.type);

    roadmapContainer.innerHTML = roadmapData.map((step, index) => `
        <div class="relative flex gap-4">
            <div class="flex flex-col items-center">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold z-10">
                    ${index + 1}
                </div>
                ${index < roadmapData.length - 1 ? '<div class="w-0.5 h-full bg-blue-200 my-2"></div>' : ''}
            </div>
            <div class="flex-1 pb-6">
                <div class="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                    <h4 class="font-bold text-gray-900 text-lg">${step.title}</h4>
                    <p class="text-sm text-gray-600 mt-1">${step.description}</p>
                    <div class="mt-3 flex items-center gap-3 text-sm">
                        <span class="px-2 py-1 bg-green-50 text-green-700 rounded-lg font-medium">${step.salary}</span>
                        ${step.requirements ? `<span class="text-gray-500">Requiert: ${step.requirements}</span>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Get roadmap data based on domain
function getRoadmapData(domain, type) {
    const roadmaps = {
        'Tech & IT': [
            { title: 'Stage/Alternance', description: 'Première expérience en développement web', salary: '1 200-1 600€/mois', requirements: 'Bac+3, JavaScript' },
            { title: 'Développeur Junior', description: '2-3 ans d\'expérience', salary: '35k-45k€/an', requirements: 'Bac+4/5, Stack technique' },
            { title: 'Développeur Senior', description: '5+ ans d\'expérience', salary: '50k-70k€/an', requirements: 'Expertise technique, Architecture' },
            { title: 'Tech Lead / CTO', description: 'Direction technique', salary: '70k-120k€/an', requirements: 'Leadership, Management' }
        ],
        'Marketing': [
            { title: 'Marketing Assistant', description: 'Support marketing et communication', salary: '1 300-1 600€/mois', requirements: 'Bac+3, Passion marketing' },
            { title: 'Chef de Projet Marketing', description: 'Gestion de campagnes', salary: '38k-48k€/an', requirements: 'Bac+5, 3 ans expérience' },
            { title: 'Marketing Manager', description: 'Direction marketing', salary: '55k-75k€/an', requirements: 'Expertise globale' },
            { title: 'CMO', description: 'Directeur marketing', salary: '80k-150k€/an', requirements: 'Stratégie globale' }
        ],
        'Finance': [
            { title: 'Analyste Finance', description: 'Analyse financière et reporting', salary: '1 400-1 700€/mois', requirements: 'Bac+4/5, Excel' },
            { title: 'Comptable', description: 'Comptabilité et fiscalité', salary: '40k-50k€/an', requirements: 'Bac+5, Expertise comptable' },
            { title: 'Finance Manager', description: 'Direction financière', salary: '60k-85k€/an', requirements: 'Expertise' },
            { title: 'CFO', description: 'Directeur financier', salary: '90k-200k€/an', requirements: 'Stratégie' }
        ],
        'Consulting': [
            { title: 'Consultant Junior', description: 'Mission terrain et analyse', salary: '1 500-1 800€/mois', requirements: 'Bac+5, École de commerce' },
            { title: 'Consultant', description: 'Gestion de projet', salary: '45k-55k€/an', requirements: '3 ans expérience' },
            { title: 'Senior Consultant', description: 'Expertise sectorielle', salary: '65k-80k€/an', requirements: 'Expertise avérée' },
            { title: 'Partner', description: 'Dirigeant de cabinet', salary: '150k€+/an', requirements: 'Création de cabinet' }
        ],
        'Design': [
            { title: 'Designer Junior', description: 'Support design graphique', salary: '1 300-1 600€/mois', requirements: 'Bac+3,Portfolio' },
            { title: 'Designer', description: 'Création de solutions', salary: '38k-48k€/an', requirements: 'Bac+5, 2 ans expérience' },
            { title: 'Creative Director', description: 'Direction créative', salary: '55k-75k€/an', requirements: 'Portfolio solide' },
            { title: 'Art Director', description: 'Direction artistique', salary: '70k-100k€/an', requirements: 'Expérience' }
        ],
        'Ressources Humaines': [
            { title: 'RH Assistant', description: 'Support RH et recrutement', salary: '1 300-1 600€/mois', requirements: 'Bac+3, Bafa' },
            { title: 'Charge de Recrutement', description: 'Recrutement et intégration', salary: '38k-48k€/an', requirements: 'Bac+5, 3 ans' },
            { title: 'HR Manager', description: 'Direction RH', salary: '55k-75k€/an', requirements: 'Expertise' },
            { title: 'DRH', description: 'Directeur RH', salary: '80k-150k€/an', requirements: 'Stratégie' }
        ],
        'Default': [
            { title: 'Stage/Alternance', description: 'Première expérience professionnelle', salary: '1 200-1 600€/mois', requirements: 'Bac+3' },
            { title: 'Junior', description: 'Début de carrière', salary: '30k-40k€/an', requirements: 'Bac+4' },
            { title: 'Cadre', description: 'Experience confirmée', salary: '45k-60k€/an', requirements: 'Bac+5, 3 ans' },
            { title: 'Senior/Manager', description: 'Poste à responsabilité', salary: '60k-90k€/an', requirements: 'Expérience' }
        ]
    };

    return roadmaps[domain] || roadmaps['Default'];
}

// Apply to job
async function applyToJob() {
    const user = getCurrentUser();
    if (!user) {
        alert('Vous devez être connecté pour postuler');
        window.location.href = 'connexion.html';
        return;
    }

    const job = currentJob;
    const btn = event.currentTarget;
    const originalText = btn.textContent;
    btn.textContent = 'Envoi en cours...';
    btn.disabled = true;

    try {
        const application = {
            jobId: job.id,
            status: 'sent',
            appliedAt: new Date().toISOString()
        };

        const response = await fetch(`${API_URL}/applications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(application)
        });

        if (response.ok) {
            alert('Candidature envoyée avec succès !');
            window.location.href = 'candidatures.html';
        } else {
            alert('Erreur lors de l\'envoi de la candidature');
        }
    } catch (err) {
        console.error('Error applying:', err);
        alert('Erreur lors de l\'envoi de la candidature');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// Save job
function saveJob() {
    const job = currentJob;
    const btn = event.currentTarget;

    // Toggle saved state
    btn.classList.toggle('bg-blue-50');
    btn.classList.toggle('text-blue-700');

    if (btn.classList.contains('bg-blue-50')) {
        btn.innerHTML = '<i data-lucide="bookmark" class="w-5 h-5 fill-current"></i> Sauvegardé';
        alert('Offre sauvegardée dans votre liste');
    } else {
        btn.innerHTML = '<i data-lucide="bookmark" class="w-5 h-5"></i> Sauvegarder';
    }

    setTimeout(() => lucide.createIcons(), 10);
}

// Check if user is logged in on page load
function checkAuth() {
    const user = getCurrentUser();
    if (user) {
        // Update profile link
        const profileLink = document.querySelector('a[href="mon-profil.html"]');
        if (profileLink) {
            profileLink.innerHTML = '<i data-lucide="user" class="w-4 h-4"></i> Mon profil';
            profileLink.href = 'mon-profil.html';
        }
    }
}

// Logout function
function logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        sessionStorage.removeItem('jobsurmesure_user');
        window.location.href = 'index.html';
    }
}

// Initialize
let currentJob = null;

document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    checkAuth();

    // Load job data from API
    fetchJob().then(job => {
        if (job) {
            displayJob(job);
        } else {
            document.getElementById('jobTitleDisplay').textContent = 'Offre non trouvée';
            document.getElementById('jobDescription').textContent = 'L\'offre que vous recherchez n\'existe pas ou a été supprimée.';
        }
    });
});
