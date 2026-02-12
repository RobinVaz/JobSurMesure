// Offre Page JavaScript

const API_URL = 'http://localhost:3000/api';
let currentJob = null;

// Matching Engine client-side functions
function analyzeMatching(job, user) {
    if (!job || !user) return { score: 0, matchedSkills: [], missingSkills: [] };

    const matchedSkills = [];
    const missingSkills = [];

    // Get user skills
    const userSkills = Array.isArray(user.profile?.skills) ? user.profile.skills.map(s => s.toLowerCase()) : [];

    // Get job required skills
    const jobSkills = Array.isArray(job.skills) ? job.skills.map(s => s.toLowerCase()) : [];

    // Also extract skills from job description
    const jobDescSkills = [];
    if (job.description) {
        const descLower = job.description.toLowerCase();
        const commonSkills = ['javascript', 'python', 'java', 'c#', 'php', 'typescript', 'react', 'angular', 'vue', 'html', 'css', 'sql', 'mysql', 'postgres', 'docker', 'kubernetes', 'aws', 'azure', 'git', 'api', 'linux'];
        commonSkills.forEach(skill => {
            if (descLower.includes(skill)) jobDescSkills.push(skill);
        });
    }

    // Combine job skills
    const allJobSkills = [...new Set([...jobSkills, ...jobDescSkills])];

    // Check matches
    allJobSkills.forEach(skill => {
        const hasSkill = userSkills.some(usrSkill => usrSkill.includes(skill) || skill.includes(usrSkill));
        if (hasSkill) {
            matchedSkills.push(skill);
        } else {
            missingSkills.push(skill);
        }
    });

    // Calculate score based on user's actual skills vs job requirements
    // Use the job's matchScore as base if available, otherwise calculate
    let score = job.matchScore || 0;

    // If user has no skills in profile, use job's matchScore directly
    if (userSkills.length === 0) {
        score = job.matchScore || 50; // Default to job's stored score or 50
    } else {
        // Calculate skill coverage score
        const skillCoverage = allJobSkills.length > 0 ? matchedSkills.length / allJobSkills.length : 0;
        let calculatedScore = Math.round(skillCoverage * 100);

        // Location bonus
        if (user.profile?.location && job.location) {
            if (user.profile.location.toLowerCase() === job.location.toLowerCase()) {
                calculatedScore = Math.min(calculatedScore + 20, 100);
            }
        }

        // Type bonus
        const preferredTypes = user.profile?.preferredTypes || ['stage', 'alternance'];
        if (preferredTypes.includes(job.type)) {
            calculatedScore = Math.min(calculatedScore + 15, 100);
        }

        // Use calculated score if higher than stored score (user has relevant skills)
        // Or use stored score as baseline
        score = calculatedScore;
    }

    return { score, matchedSkills, missingSkills, allJobSkills };
}

// Get job ID from URL
function getJobId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Get current user from session
function getCurrentUser() {
    const user = localStorage.getItem('jobsurmesure_user');
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

    console.log('displayJob - job:', job);

    // Get current user for matching analysis
    const user = getCurrentUser();

    // Analyze matching if user is logged in
    if (user) {
        const matchAnalysis = analyzeMatching(job, user);
        displayMatchingAnalysis(matchAnalysis);
    }

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

    // Get roadmap based on job title analysis
    const roadmapData = getRoadmapDataBasedOnTitle(job.title, job.domain, job.type);

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

// Analyze job title to determine career path
function getRoadmapDataBasedOnTitle(jobTitle, domain, type) {
    const title = jobTitle ? jobTitle.toLowerCase() : '';

    console.log('getRoadmapDataBasedOnTitle - jobTitle:', jobTitle, 'domain:', domain, 'title:', title);

    // Always provide a default roadmap based on title analysis
    // Tech & IT paths based on job title keywords
    if ((domain === 'Tech & IT' || domain === 'Engineering' || domain === undefined) &&
        (title.includes('developpeur') || title.includes('developer') || title.includes('dev') ||
         title.includes('full stack') || title.includes('back end') || title.includes('front end'))) {
        console.log('Returning Tech roadmap');
        return [
            { title: 'Stage/Alternance Développeur', description: 'Première expérience en développement web', salary: '1 200-1 600€/mois', requirements: 'Bac+3, JavaScript/HTML/CSS' },
            { title: 'Développeur Junior', description: '2-3 ans d\'expérience', salary: '35k-45k€/an', requirements: 'Bac+4/5, Stack technique' },
            { title: 'Développeur Senior', description: '5+ ans d\'expérience - Expert technique', salary: '50k-70k€/an', requirements: 'Architecture, Bonnes pratiques' },
            { title: 'Tech Lead', description: 'Direction technique - Leader d\'équipe', salary: '65k-90k€/an', requirements: 'Leadership, Management d\'équipe' },
            { title: 'CTO', description: 'Directeur technique - Stratégie tech', salary: '90k-150k€/an', requirements: 'Stratégie, Innovation' }
        ];
    }
    if ((domain === 'Tech & IT' || domain === undefined) &&
        (title.includes('data') || title.includes('analyst') || title.includes('datascience') || title.includes('business'))) {
        console.log('Returning Data roadmap');
        return [
            { title: 'Stage/Alternance Data', description: 'Première expérience en analyse de données', salary: '1 200-1 600€/mois', requirements: 'Bac+3, Python/SQL' },
            { title: 'Data Analyst', description: '2-3 ans d\'expérience', salary: '35k-45k€/an', requirements: 'Bac+4/5, Excel, SQL' },
            { title: 'Data Scientist', description: '5+ ans d\'expérience - Modélisation', salary: '50k-70k€/an', requirements: 'Machine Learning, Python' },
            { title: 'Data Lead', description: 'Direction data - Leader d\'équipe', salary: '65k-90k€/an', requirements: 'Architecture data, Strategy' },
            { title: 'CDO', description: 'Directeur data/tech', salary: '90k-150k€/an', requirements: 'Stratégie data globale' }
        ];
    }
    if ((domain === 'Tech & IT' || domain === undefined) &&
        (title.includes('designer') || title.includes('ux') || title.includes('ui'))) {
        console.log('Returning Design roadmap');
        return [
            { title: 'Stage/Alternance Designer', description: 'Première expérience en design digital', salary: '1 200-1 600€/mois', requirements: 'Bac+3, Figma/Adobe' },
            { title: 'Designer Junior', description: '2-3 ans d\'expérience', salary: '35k-45k€/an', requirements: 'Bac+4/5, Portfolio solide' },
            { title: 'Designer Senior', description: '5+ ans d\'expérience - Expert', salary: '50k-70k€/an', requirements: 'UX Research, Prototyping' },
            { title: 'Creative Director', description: 'Direction créative', salary: '65k-90k€/an', requirements: 'Style graphique, Leadership' },
            { title: 'Art Director', description: 'Direction artistique', salary: '75k-110k€/an', requirements: 'Vision globale, Innovation' }
        ];
    }
    if ((domain === 'Tech & IT' || domain === undefined) &&
        (title.includes('devops') || title.includes('infra') || title.includes('sys') || title.includes('cloud'))) {
        console.log('Returning DevOps roadmap');
        return [
            { title: 'Stage/Alternance DevOps', description: 'Première expérience en infrastructures', salary: '1 200-1 600€/mois', requirements: 'Bac+3, Linux/Docker' },
            { title: 'DevOps Junior', description: '2-3 ans d\'expérience', salary: '35k-45k€/an', requirements: 'Bac+4/5, Cloud AWS/Azure' },
            { title: 'DevOps Senior', description: '5+ ans d\'expérience - CI/CD', salary: '50k-70k€/an', requirements: 'Kubernetes, Terraform' },
            { title: 'Site Reliability Engineer', description: 'Expertise reliability', salary: '65k-90k€/an', requirements: 'Monitoring, Scalabilité' },
            { title: 'CTO', description: 'Directeur technique', salary: '90k-150k€/an', requirements: 'Stratégie tech globale' }
        ];
    }

    // Marketing paths
    if ((domain === 'Marketing' || domain === undefined) &&
        (title.includes('marketing') || title.includes('comm') || title.includes('digital'))) {
        console.log('Returning Marketing roadmap');
        return [
            { title: 'Stage/Alternance Marketing', description: 'Première expérience en marketing', salary: '1 300-1 600€/mois', requirements: 'Bac+3, Passion marketing' },
            { title: 'Chef de Projet Marketing', description: '2-3 ans d\'expérience', salary: '38k-48k€/an', requirements: 'Bac+5, 2 ans expérience' },
            { title: 'Marketing Manager', description: '5+ ans d\'expérience - Direction', salary: '55k-75k€/an', requirements: 'Stratégie, Budget' },
            { title: 'Directeur Marketing', description: 'Leader marketing', salary: '70k-100k€/an', requirements: 'Team management, ROI' },
            { title: 'CMO', description: 'Directeur marketing global', salary: '85k-150k€/an', requirements: 'Stratégie globale, Innovation' }
        ];
    }
    if ((domain === 'Marketing' || domain === undefined) &&
        (title.includes('seo') || title.includes('referencement') || title.includes('traffic'))) {
        console.log('Returning SEO roadmap');
        return [
            { title: 'Stage/Alternance SEO', description: 'Stage en référencement naturel', salary: '1 300-1 600€/mois', requirements: 'Bac+3, SEO tools' },
            { title: 'SEO Specialist', description: 'Expert SEO', salary: '35k-45k€/an', requirements: 'Bac+4/5, Google Analytics' },
            { title: 'SEO Manager', description: 'Responsable SEO', salary: '50k-65k€/an', requirements: 'Team management, Strategy' },
            { title: 'Digital Marketing Manager', description: 'Dirigeant digital', salary: '60k-80k€/an', requirements: 'Multi-channel, ROI' },
            { title: 'CMO', description: 'Directeur marketing', salary: '75k-120k€/an', requirements: 'Stratégie globale' }
        ];
    }

    // Finance paths
    if ((domain === 'Finance' || domain === undefined) &&
        (title.includes('finance') || title.includes('analyste') || title.includes('comptable'))) {
        console.log('Returning Finance roadmap');
        return [
            { title: 'Stage/Alternance Finance', description: 'Stage en analyse financière', salary: '1 400-1 700€/mois', requirements: 'Bac+4, Excel avancé' },
            { title: 'Analyste Finance', description: '2-3 ans d\'expérience', salary: '40k-50k€/an', requirements: 'Bac+5, Modélisation' },
            { title: 'Finance Manager', description: '5+ ans d\'expérience - Direction', salary: '60k-85k€/an', requirements: 'Expertise, Leadership' },
            { title: 'Directeur Finance', description: 'Expert financier', salary: '80k-120k€/an', requirements: 'Stratégie, Audit' },
            { title: 'CFO', description: 'Directeur financier', salary: '100k-200k€/an', requirements: 'Stratégie globale, Governance' }
        ];
    }

    // Consulting paths
    if ((domain === 'Consulting' || domain === undefined) &&
        (title.includes('consultant'))) {
        console.log('Returning Consulting roadmap');
        return [
            { title: 'Stage/Alternance Consultant', description: 'Stage en conseil', salary: '1 500-1 800€/mois', requirements: 'Bac+5, École de commerce' },
            { title: 'Consultant Junior', description: '2-3 ans d\'expérience', salary: '45k-55k€/an', requirements: 'Bac+5, 2 ans expérience' },
            { title: 'Consultant', description: '5+ ans d\'expérience - Senior', salary: '60k-80k€/an', requirements: 'Expertise sectorielle' },
            { title: 'Senior Consultant', description: 'Expert senior', salary: '75k-95k€/an', requirements: 'Leadership de projet' },
            { title: 'Partner', description: 'Dirigeant de cabinet', salary: '120k-200k€/an', requirements: 'Création de cabinet' }
        ];
    }

    // Default career path based on domain
    console.log('Returning Default roadmap');
    const defaultRoadmap = getRoadmapData(domain, type);

    // Always return something - default roadmap has 4 items
    if (!defaultRoadmap || defaultRoadmap.length === 0) {
        console.log('Default roadmap is empty, returning fallback');
        return [
            { title: 'Stage/Alternance', description: 'Première expérience professionnelle', salary: '1 200-1 600€/mois', requirements: 'Bac+3' },
            { title: 'Junior', description: 'Début de carrière', salary: '30k-40k€/an', requirements: 'Bac+4' },
            { title: 'Cadre', description: 'Experience confirmée', salary: '45k-60k€/an', requirements: 'Bac+5, 3 ans' },
            { title: 'Senior/Manager', description: 'Poste à responsabilité', salary: '60k-90k€/an', requirements: 'Expérience' }
        ];
    }

    // Adapt default titles to job type
    if (title.includes('chef') || title.includes('manager') || title.includes('responsable')) {
        return defaultRoadmap.map(step => ({
            ...step,
            title: step.title.replace('Junior', 'Chef de Projet').replace('Cadre', 'Responsable').replace('Senior', 'Senior Manager')
        }));
    }

    return defaultRoadmap;
}

// Get roadmap data based on domain (fallback)
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

// Display matching analysis
function displayMatchingAnalysis(matchAnalysis) {
    const analysisContainer = document.getElementById('matchingAnalysis');
    if (!analysisContainer) return;

    const { score, matchedSkills, missingSkills, allJobSkills } = matchAnalysis;

    // Update score badge in main section
    const scoreBadge = document.getElementById('jobScoreBadge');
    if (scoreBadge) {
        scoreBadge.textContent = `${score}% match`;
        if (score >= 80) {
            scoreBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold border bg-green-100 text-green-800 border-green-300';
        } else if (score >= 60) {
            scoreBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold border bg-blue-100 text-blue-800 border-blue-300';
        } else {
            scoreBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold border bg-yellow-100 text-yellow-800 border-yellow-300';
        }
    }

    // Update analysis section
    const scoreBar = analysisContainer.querySelector('.w-full.bg-gray-200.rounded-full.h-2 div');
    if (scoreBar) {
        scoreBar.style.width = `${score}%`;
        if (score >= 80) {
            scoreBar.className = 'bg-green-500 h-2 rounded-full';
        } else if (score >= 60) {
            scoreBar.className = 'bg-blue-500 h-2 rounded-full';
        } else {
            scoreBar.className = 'bg-yellow-500 h-2 rounded-full';
        }
    }

    const scoreText = analysisContainer.querySelector('.text-green-600');
    if (scoreText) {
        scoreText.textContent = `${score}%`;
    }

    // Matched skills
    const matchedSkillsDiv = analysisContainer.querySelector('.matched-skills');
    if (matchedSkillsDiv) {
        matchedSkillsDiv.innerHTML = matchedSkills.length > 0 ? matchedSkills.map(skill => `
            <span class="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium">${skill.charAt(0).toUpperCase() + skill.slice(1)}</span>
        `).join('') : '<span class="text-gray-500 text-sm">Aucune compétence matchée</span>';
    }

    // Missing skills
    const missingSkillsDiv = analysisContainer.querySelector('.missing-skills');
    if (missingSkillsDiv) {
        missingSkillsDiv.innerHTML = missingSkills.length > 0 ? missingSkills.map(skill => `
            <span class="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">${skill.charAt(0).toUpperCase() + skill.slice(1)}</span>
        `).join('') : '<span class="text-gray-500 text-sm">Toutes les compétences sont présentes !</span>';
    }

    // Match percentage text
    const matchPercent = analysisContainer.querySelector('.text-green-600.font-semibold');
    if (matchPercent) {
        matchPercent.textContent = `${score}%`;
    }
}

// Logout function
function logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        localStorage.removeItem('jobsurmesure_user');
        window.location.href = 'index.html';
    }
}

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
