// Recherche Page JavaScript - Fetches jobs from API

const API_URL = 'http://localhost:3000/api';

// Get current user from session
function getCurrentUser() {
    const user = localStorage.getItem('jobsurmesure_user');
    if (user) {
        return JSON.parse(user);
    }
    return null;
}

// Popular Jobs Dataset (120+ jobs)
const popularJobs = [
    // Tech & IT
    'Développeur', 'Développeur Full Stack', 'Développeur Front-end', 'Développeur Back-end',
    'Développeur Mobile', 'Développeur iOS', 'Développeur Android', 'Développeur Web',
    'Développeur React', 'Développeur Angular', 'Développeur Vue.js', 'Développeur Node.js',
    'Développeur Python', 'Développeur Java', 'Développeur PHP', 'Développeur C#',
    'Développeur C++', 'Développeur JavaScript', 'Développeur TypeScript', 'DevOps',
    'Ingénieur DevOps', 'SRE', 'Sysadmin', 'Administrateur Système', 'Architecte Cloud',
    'Ingénieur Cloud', 'Data Engineer', 'Data Analyst', 'Data Scientist', 'Machine Learning Engineer',
    'AI Engineer', 'Data Architect', 'Business Intelligence', 'Analyste Data',
    'Cyber Sécurité', 'Sécurité Informatique', 'Pentester', 'Analyste Sécurité',
    'Réseaux & Télécoms', 'Ingénieur Réseaux', 'Administrateur Réseau', 'Technicien Support',
    'Help Desk', 'Technicien Maintenance', 'Technicien Informatique', 'QA Engineer',
    'Testeur', 'Analyste Qualité', 'Technical Writer', 'Tech Lead', 'CTO', 'Product Owner',
    'Scrum Master', 'Chef de Projet IT', 'Chef de Projet Digital',

    // Design & Creative
    'Designer UX/UI', 'Designer Interface', 'Designer Graphique', 'Designer Web',
    'Designer Motion', 'Designer 3D', 'Infographiste', 'Illustrateur', 'Art Director',
    'Chef de Création', 'Responsable Création', 'Web Designer', 'UI Designer',
    'Motion Designer', '3D Artist', 'Game Designer', 'Game Developer',

    // Marketing & Communication
    'Marketing Digital', 'Responsable Marketing', 'Chef de Projet Marketing',
    'Community Manager', 'Community Manager Senior', 'Social Media Manager',
    'Content Manager', 'Content Strategist', 'Content Writer', 'Rédacteur Web',
    'Rédacteur Créatif', 'Rédacteur Technique', 'Copywriter', 'SEO Specialist',
    'SEO Manager', 'SEM Manager', 'SEO Référencement', 'Web Marketeur',
    'Responsable Communication', 'Chef de Projet Communication', 'Relations Presse',
    'Responsable E-commerce', 'Chef de Projet E-commerce',
    'Responsable Business Development', 'Responsable Commerciale', 'Commercial',
    'Commercial B2B', 'Commercial B2C', 'Account Manager',
    'Responsable Relation Client', 'Responsable Service Client', 'Conseiller Client',
    'Conseiller Vente', 'Key Account Manager',

    // Finance & Management
    'Expert Comptable', 'Comptable', 'Auditeur', 'Controller', 'Responsable Finance',
    'Directeur Finance', 'Trésorier', 'Analyste Financier', 'Analyste Credit',
    'Responsable Comptabilité', 'Chef Comptable', 'Directeur Administratif',
    'Directeur Général', 'Directeur Opérationnel', 'Directeur Adjoint', 'Directeur',
    'Responsable Operations', 'Responsable Admin', 'Responsable Ressources Humaines',
    'Chef des Operations', 'Chef de Production', 'Responsable Logistique',
    'Responsable Supply Chain', 'ACHATS', 'Responsable Achat', 'Buyer',
    'Responsable Qualité', 'Responsable Sécurité', 'Responsable Environnement',

    // Engineering & Industrial
    'Ingénieur', 'Ingénieur Génie Civil', 'Ingénieur Mécanique', 'Ingénieur Électrique',
    'Ingénieur Génie Électrique', 'Ingénieur Génie Industriel', 'Ingénieur Matériaux',
    'Ingénieur Chimique', 'Ingénieur Agronome', 'Ingénieur Biotechnologies',

    // Science & Research
    'Chercheur', 'Scientifique', 'Biologiste', 'Chimiste', 'Physicien', 'Mathématicien',
    'Statisticien', 'Economètre', 'Economiste', 'Sociologue', 'Psychologue',

    // Law & Legal
    'Juriste', 'Avocat', 'Notaire', 'Huissier', 'Mandataire Judiciaire',
    'Responsable Juridique', 'Juriste Contractuel', 'Juriste Contentieux',
    'Juriste Droit des Sociétés', 'Juriste Fiscal', 'Juriste Social',
    'Legal Counsel', 'Compliance Officer', 'Risk Manager',

    // Health & Pharma
    'Pharmacien', 'Médecin', 'Infirmier', 'Masseur Kinésithérapeute',
    'Orthophoniste', 'Orthoptiste', 'Podologue', 'Opticien', 'Audiologue',
    'Biologiste Médical', 'Technicien Labo', 'Engineer Pharma', 'Responsable QA Pharma',

    // Education & Training
    'Enseignant', 'Professeur', 'Formateur', 'Coach', 'Mentor', 'Conseiller dOrientation',

    // Agriculture & Environment
    'Agriculteur', 'Agronome', 'Enologiste', 'Arboriculteur', 'Horticulteur',
    'Paysagiste', 'Technicien Environnement', 'Responsable Développement Durable',
    'Responsable RSE', 'Responsable Durable',

    // Art & Culture
    'Artiste', 'Musicien', 'Chanteur', 'Acteur', 'Réalisateur', 'Producteur',
    'Curateur', 'Médiateur Culturel', 'Responsable Patrimoine', 'Conservateur Musée',

    // Media & Journalism
    'Journaliste', 'Rédacteur', 'Photographe', 'Vidéaste', 'Caméraman', 'Monteur',

    // Hospitality & Tourism
    'Chef de Projet Tourisme', 'Responsable Hôtellerie', 'Gérant Hôtel', 'Receptionniste',
    'Responsable Resa', 'Responsable Events', 'Organisateur Événementiel',

    // Transport & Logistics
    'Logisticien', 'Responsable Flotte', 'Responsable Transport',

    // Public Service
    'Agent Public', 'Fonctionnaire', 'Agent Municipal', 'Agent Territorial'
];

// Popular Regions Dataset (300+ regions/cities)
const popularRegions = [
    // Régions Métropolitaines
    'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Bretagne',
    'Centre-Val de Loire', 'Corse', 'Grand Est', 'Hauts-de-France',
    'Île-de-France', 'Normandie', 'Nouvelle-Aquitaine', 'Occitanie',
    'Pays de la Loire', 'Provence-Alpes-Côte dAzur',

    // DOM-TOM
    'Guadeloupe', 'Martinique', 'Guyane', 'La Réunion', 'Mayotte',

    // Départements - Auvergne-Rhône-Alpes
    'Ain', 'Allier', 'Ardèche', 'Cantal', 'Drôme', 'Isère', 'Loire', 'Haute-Loire',
    'Puy-de-Dôme', 'Rhône', 'Savoie', 'Haute-Savoie', 'Lyon', 'Saint-Étienne',
    'Grenoble', 'Annecy', 'Chambéry', 'Villeurbanne', 'Clermont-Ferrand', 'Aubière',

    // Départements - Bourgogne-Franche-Comté
    'Côte-dOr', 'Doubs', 'Jura', 'Haute-Saône', 'Nièvre', 'Saône-et-Loire',
    'Yonne', 'Territoire de Belfort', 'Dijon', 'Besançon', 'Auxerre', 'Belfort',
    'Montbéliard', 'Chalon-sur-Saône', 'Autun',

    // Départements - Bretagne
    'Côtes-dArmor', 'Finistère', 'Ille-et-Vilaine', 'Morbihan', 'Rennes', 'Brest',
    'Quimper', 'Lorient', 'Saint-Malo', 'Vannes', 'Auray', 'Dinard', 'Ploemeur',

    // Départements - Centre-Val de Loire
    'Cher', 'Eure-et-Loir', 'Indre', 'Indre-et-Loire', 'Loir-et-Cher', 'Tours',
    'Orléans', 'Blois', 'Chartres', 'Bourges', 'Châteauroux', 'Dreux',

    // Départements - Grand Est
    'Ardennes', 'Aube', 'Marne', 'Haute-Marne', 'Meuse', 'Meurthe-et-Moselle',
    'Moselle', 'Bas-Rhin', 'Haut-Rhin', 'Vosges', 'Strasbourg', 'Metz', 'Nancy',
    'Reims', 'Chaumont', 'Épinal', 'Colmar', 'Phalsbourg', 'Sarrebourg', 'Langres',

    // Départements - Hauts-de-France
    'Aisne', 'Nord', 'Oise', 'Pas-de-Calais', 'Somme', 'Lille', 'Amiens', 'Arras',
    'Calais', 'Compiègne', 'Cambrai', 'Valenciennes', 'Maubeuge', 'Beauvais',
    'Abeville', 'Hénin-Beaumont',

    // Départements - Île-de-France
    'Paris', 'Seine-et-Marne', 'Yvelines', 'Essonne', 'Hauts-de-Seine',
    'Seine-Saint-Denis', 'Val-de-Marne', 'Val-dOise', 'Paris', 'Boulogne-Billancourt',
    'Maisons-Alfort', 'Créteil', 'Ivry-sur-Seine', 'Montrouge', 'Le Chesnay',
    'Saint-Germain-en-Laye', 'Rueil-Malmaison', 'Nanterre', 'Antony', 'Champigny-sur-Marne',
    'Neuilly-sur-Seine', 'Puteaux', 'Suresnes', 'Asnières-sur-Seine', 'Aulnay-sous-Bois',
    'Saint-Denis', 'Bobigny', 'Montreuil', 'Bagnolet', 'Le Blanc-Mesnil', 'Dugny',

    // Départements - Normandie
    'Calvados', 'Eure', 'Manche', 'Orne', 'Seine-Maritime', 'Rouen', 'Le Havre',
    'Caen', 'Cherbourg-en-Cotentin', 'Deauville', 'Lisieux', 'Alençon', 'Dieppe',

    // Départements - Nouvelle-Aquitaine
    'Charente', 'Charente-Maritime', 'Corrèze', 'Creuse', 'Dordogne', 'Gironde',
    'Landes', 'Lot-et-Garonne', 'Pyrénées-Atlantiques', 'Deux-Sèvres', 'Vienne',
    'Haute-Vienne', 'Bordeaux', 'Limoges', 'Poitiers', 'Talence', 'Pessac',
    'Bègles', 'Mérignac', 'Merignac', 'Le Bouscat', 'Lormont', 'Floirac',
    'Pessac', 'Cenon', 'Bassens', 'Gradignan', 'Le Haillan', 'Les Habitez',
    'Villenave-dOrnon', 'Saint-Médard-en-Jalles', 'Bruges', 'Biganos',
    'Arcachon', 'La Teste-de-Buch', 'Gujan-Mestras', 'Agen', 'Marmande',
    'Villeneuve-sur-Lot', 'Montauban', 'Rivedoux-Plage', 'Nerac', 'Aiguillon',
    'Sarlat-la-Canéda', 'Bergerac', 'Libourne', 'Langon', 'Dax', 'Saint-Plantaire',
    'Orthez', 'Pau', 'Aire-sur-Ladour', 'Lourdes', 'Tarbes', 'Bagnères-de-Bigorre',
    'Mont-de-Marsan', 'Aire-sur-lAdour', 'Rochefort', 'Royan', 'Châtelaillon-Plage',
    'Saintes', 'Bords', 'Ruffec', 'Fleurac', 'Jonzac', 'Cognac', 'Confolens',
    'Angoulême', 'Bassillac',

    // Départements - Occitanie
    'Ariège', 'Aude', 'Aveyron', 'Gard', 'Hérault', 'Lot', 'Lozère',
    'Haute-Garonne', 'Gers', 'Hautes-Pyrénées', 'Pyrénées-Orientales',
    'Tarn', 'Tarn-et-Garonne', 'Toulouse', 'Montpellier', 'Perpignan',
    'Béziers', 'Nîmes', 'Avignon', 'Alès', 'Castres', 'Millau', 'Rodez',
    'Carcassonne', 'Albi', 'Mende', 'Saint-Girons', 'Foix', 'Lombez',
    'Villefranche-de-Rouergue', 'Lavaur', 'Cahors', 'Montauban',
    'Tarbes', 'Lourdes', 'Bayonne', 'Biarritz', 'Anglet', 'Saint-Jean-de-Luz',
    'Hendaye', 'Ciboure', 'Sète', 'Béziers', 'Agde', 'Marseillan',
    'Portiragnes', 'Lézignan-Corbières', 'Narbonne', 'Arles', 'Montpellier',
    'Lunel', 'Castelnau-le-Lez', 'Juvignac', 'Fabrègues', 'Cournon-dAuvergne',
    'Clermont-Ferrand', 'Riom', 'Thiers', 'Saint-Flour',

    // Départements - Pays de la Loire
    'Loire-Atlantique', 'Maine-et-Loire', 'Mayenne', 'Sarthe', 'Vendée',
    'Nantes', 'Angers', 'Le Mans', 'La Roche-sur-Yon', 'Saint-Nazaire',
    'Chambray-lès-Tours', 'Tours', 'Orléans', 'Blois', 'Chartres',

    // Départements - Provence-Alpes-Côte dAzur
    'Alpes-de-Haute-Provence', 'Hautes-Alpes', 'Alpes-Maritimes',
    'Bouches-du-Rhône', 'Var', 'Vaucluse', 'Marseille', 'Nice', 'Toulon',
    'Aix-en-Provence', 'Arles', 'Avignon', 'Cannes', 'Antibes', 'Juan-les-Pins',
    'Hyères', 'Saint-Tropez', 'Draguignan', 'Fréjus', 'Saint-Raphaël',
    'Gap', 'Briançon', 'Digne-les-Bains', 'Manosque', 'Sisteron',
    'Castellane', 'Barcelonnette', 'Forcalquier'
];

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

// Autocomplete Functions for Jobs
function handleJobInputChange() {
    const value = document.getElementById('searchQuery').value;
    const suggestionsDiv = document.getElementById('jobSuggestions');

    if (value && value.length > 0) {
        const filtered = popularJobs.filter(job => job.toLowerCase().includes(value.toLowerCase()));
        if (filtered.length > 0) {
            let html = '';
            filtered.slice(0, 10).forEach((job, index) => {
                html += `<div class="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0" onclick="selectJob('${job.replace(/'/g, "\\'")}')"><span class="text-gray-700">${job}</span></div>`;
            });
            suggestionsDiv.innerHTML = html;
            suggestionsDiv.classList.remove('hidden');
        } else {
            suggestionsDiv.classList.add('hidden');
        }
    } else {
        suggestionsDiv.classList.add('hidden');
    }
    // Filter jobs immediately when typing
    searchJobs();
}

// Autocomplete Functions for Regions
function handleLocationInputChange() {
    const value = document.getElementById('location').value;
    const suggestionsDiv = document.getElementById('locationSuggestions');

    if (value && value.length > 0) {
        const filtered = popularRegions.filter(region => region.toLowerCase().includes(value.toLowerCase()));
        if (filtered.length > 0) {
            let html = '';
            filtered.slice(0, 10).forEach((region, index) => {
                html += `<div class="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0" onclick="selectLocation('${region.replace(/'/g, "\\'")}')"><span class="text-gray-700">${region}</span></div>`;
            });
            suggestionsDiv.innerHTML = html;
            suggestionsDiv.classList.remove('hidden');
        } else {
            suggestionsDiv.classList.add('hidden');
        }
    } else {
        suggestionsDiv.classList.add('hidden');
    }
    // Filter jobs immediately when typing
    searchJobs();
}

function selectJob(job) {
    document.getElementById('searchQuery').value = job;
    document.getElementById('jobSuggestions').classList.add('hidden');
    searchJobs();
}

function selectLocation(region) {
    document.getElementById('location').value = region;
    document.getElementById('locationSuggestions').classList.add('hidden');
    searchJobs();
}

// Close suggestions when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target || !(e.target instanceof HTMLElement)) return;

    const isSearchInput = e.target.closest('#searchQuery');
    const isLocationInput = e.target.closest('#location');
    const isJobSuggestion = e.target.closest('#jobSuggestions');
    const isLocationSuggestion = e.target.closest('#locationSuggestions');

    if (!isSearchInput && !isJobSuggestion) {
        document.getElementById('jobSuggestions').classList.add('hidden');
    }
    if (!isLocationInput && !isLocationSuggestion) {
        document.getElementById('locationSuggestions').classList.add('hidden');
    }
});

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

    // Add user ID for matching score calculation
    const currentUser = getCurrentUser();
    if (currentUser) {
        params.append('userId', currentUser.id);
    }

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
    // Display top 6 jobs sorted by match score
    const sortedJobs = jobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)).slice(0, 6);
    displayJobs(sortedJobs);
}

// Logout function
function logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        localStorage.removeItem('jobsurmesure_user');
        localStorage.removeItem('jobsurmesure_files');
        window.location.href = 'index.html';
    }
}

// Mobile menu
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

document.addEventListener('DOMContentLoaded', async function() {
    lucide.createIcons();
    initMobileMenu();
    await loadStats();
    await displayPopularJobs();

    // Add input event listeners for autocomplete
    const searchQueryInput = document.getElementById('searchQuery');
    const locationInput = document.getElementById('location');

    if (searchQueryInput) {
        searchQueryInput.addEventListener('input', handleJobInputChange);
    }

    if (locationInput) {
        locationInput.addEventListener('input', handleLocationInputChange);
    }
});
