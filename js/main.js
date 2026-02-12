// JobSurMesure - Main JavaScript
console.log('main.js loaded'); // Debug

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

// Mock Jobs Data
const mockJobs = [
    {
        id: '1',
        title: 'Développeur Full Stack Junior',
        company: 'TechStartup Paris',
        companyLogo: 'https://ui-avatars.com/api/?name=TS&background=3b82f6&color=fff',
        location: 'Paris, France',
        type: 'alternance',
        domain: 'Tech & IT',
        description: `Rejoignez une startup en pleine croissance pour développer des applications web innovantes.

Vos missions :
- Développement de nouvelles fonctionnalités front-end et back-end
- Participation aux revues de code et à l'amélioration continue
- Collaboration avec l'équipe produit pour définir les spécifications
- Mise en place de tests automatisés

Environnement technique : React, Node.js, PostgreSQL, AWS`,
        requirements: [
            'Formation en informatique (Bac+3 à Bac+5)',
            'Connaissance de JavaScript/TypeScript',
            'Esprit d\'équipe et bonne communication',
            'Curiosité et envie d\'apprendre'
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Git'],
        studyLevel: ['bac+3', 'bac+4', 'bac+5'],
        duration: '12 mois',
        salary: '1 200€ - 1 500€/mois',
        startDate: '2026-03-01',
        postedAt: new Date('2026-01-25'),
        deadline: '2026-02-15',
        remote: true,
        matchScore: 92
    },
    {
        id: '2',
        title: 'Stage Marketing Digital',
        company: 'L\'Oréal',
        companyLogo: 'https://ui-avatars.com/api/?name=LO&background=e11d48&color=fff',
        location: 'Clichy, France',
        type: 'stage',
        domain: 'Marketing',
        description: `Intégrez l'équipe marketing digital d'une marque leader mondiale.

Vos missions :
- Gestion des réseaux sociaux et création de contenu
- Analyse des performances des campagnes digitales
- Participation au lancement de nouveaux produits
- Veille concurrentielle et tendances`,
        requirements: [
            'Formation en marketing ou communication',
            'Créativité et sensibilité digitale',
            'Maîtrise des outils de création (Canva, Adobe)',
            'Anglais courant'
        ],
        skills: ['Social Media', 'Google Analytics', 'SEO', 'Content Marketing', 'Canva'],
        studyLevel: ['bac+4', 'bac+5'],
        duration: '6 mois',
        salary: '1 000€/mois',
        startDate: '2026-04-01',
        postedAt: new Date('2026-01-20'),
        deadline: '2026-02-28',
        remote: false,
        matchScore: 78
    },
    {
        id: '3',
        title: 'Data Analyst Junior',
        company: 'BNP Paribas',
        companyLogo: 'https://ui-avatars.com/api/?name=BNP&background=00965e&color=fff',
        location: 'La Défense, France',
        type: 'alternance',
        domain: 'Data Science',
        description: `Rejoignez l'équipe Data Analytics d'une banque de premier plan.

Vos missions :
- Analyse et visualisation de données business
- Création de dashboards et reporting automatisé
- Support aux équipes métiers dans leurs analyses
- Contribution à des projets de Machine Learning`,
        requirements: [
            'Formation en Data Science, Statistiques ou École d\'ingénieur',
            'Maîtrise de Python et SQL',
            'Connaissance des outils de visualisation',
            'Rigueur et esprit analytique'
        ],
        skills: ['Python', 'SQL', 'Power BI', 'Tableau', 'Excel', 'Machine Learning'],
        studyLevel: ['bac+4', 'bac+5'],
        duration: '24 mois',
        salary: '1 400€ - 1 800€/mois',
        startDate: '2026-09-01',
        postedAt: new Date('2026-01-28'),
        deadline: '2026-04-30',
        remote: true,
        matchScore: 85
    },
    {
        id: '4',
        title: 'Stage Assistant Chef de Projet',
        company: 'Capgemini',
        companyLogo: 'https://ui-avatars.com/api/?name=CG&background=0070ad&color=fff',
        location: 'Lyon, France',
        type: 'stage',
        domain: 'Consulting',
        description: `Participez à des projets de transformation digitale pour des clients grands comptes.

Vos missions :
- Support à la gestion de projets IT
- Préparation de livrables et présentations clients
- Suivi des plannings et coordination d'équipes
- Animation de réunions et ateliers`,
        requirements: [
            'Formation en école de commerce ou d\'ingénieur',
            'Excellentes capacités de communication',
            'Maîtrise de la suite Office',
            'Anglais professionnel'
        ],
        skills: ['Gestion de projet', 'PowerPoint', 'Excel', 'Agile', 'Communication'],
        studyLevel: ['bac+4', 'bac+5'],
        duration: '6 mois',
        salary: '1 100€/mois',
        startDate: '2026-03-15',
        postedAt: new Date('2026-01-22'),
        remote: false,
        matchScore: 71
    },
    {
        id: '5',
        title: 'Développeur Mobile iOS/Android',
        company: 'Doctolib',
        companyLogo: 'https://ui-avatars.com/api/?name=DO&background=6366f1&color=fff',
        location: 'Paris, France',
        type: 'alternance',
        domain: 'Tech & IT',
        description: `Développez les applications mobiles qui transforment le secteur de la santé.

Vos missions :
- Développement de nouvelles fonctionnalités mobiles
- Optimisation des performances et de l'UX
- Tests et déploiement sur les stores
- Participation aux choix techniques de l'équipe`,
        requirements: [
            'Formation en développement mobile',
            'Expérience avec Swift ou Kotlin',
            'Sensibilité UX/UI',
            'Intérêt pour le secteur de la santé'
        ],
        skills: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Firebase', 'REST API'],
        studyLevel: ['bac+3', 'bac+4', 'bac+5'],
        duration: '12 mois',
        salary: '1 300€ - 1 600€/mois',
        startDate: '2026-09-01',
        postedAt: new Date('2026-01-26'),
        deadline: '2026-05-15',
        remote: true,
        matchScore: 88
    },
    {
        id: '6',
        title: 'Stage Ressources Humaines',
        company: 'Decathlon',
        companyLogo: 'https://ui-avatars.com/api/?name=DE&background=0082c3&color=fff',
        location: 'Lille, France',
        type: 'stage',
        domain: 'Ressources Humaines',
        description: `Découvrez les métiers RH au sein d'un leader du sport.

Vos missions :
- Participation au processus de recrutement
- Organisation d'événements internes
- Gestion administrative du personnel
- Projets d'amélioration de la qualité de vie au travail`,
        requirements: [
            'Formation en RH, Psychologie ou École de commerce',
            'Aisance relationnelle',
            'Organisation et rigueur',
            'Passion pour le sport appréciée'
        ],
        skills: ['Recrutement', 'Communication', 'Excel', 'Gestion administrative', 'Organisation'],
        studyLevel: ['bac+3', 'bac+4', 'bac+5'],
        duration: '4 mois',
        salary: '800€/mois',
        startDate: '2026-05-01',
        postedAt: new Date('2026-01-24'),
        remote: false,
        matchScore: 65
    },
    {
        id: '7',
        title: 'Ingénieur DevOps Junior',
        company: 'OVHcloud',
        companyLogo: 'https://ui-avatars.com/api/?name=OVH&background=000e9c&color=fff',
        location: 'Roubaix, France',
        type: 'alternance',
        domain: 'Tech & IT',
        description: `Rejoignez le leader européen du cloud computing.

Vos missions :
- Automatisation des déploiements CI/CD
- Gestion et monitoring d'infrastructures
- Scripting et développement d'outils internes
- Participation aux incidents et astreintes`,
        requirements: [
            'Formation en informatique/systèmes',
            'Connaissance de Linux et Docker',
            'Notions de scripting (Python, Bash)',
            'Intérêt pour l\'infrastructure cloud'
        ],
        skills: ['Docker', 'Kubernetes', 'Linux', 'CI/CD', 'Python', 'Terraform', 'AWS'],
        studyLevel: ['bac+4', 'bac+5'],
        duration: '24 mois',
        salary: '1 500€ - 1 800€/mois',
        startDate: '2026-09-01',
        postedAt: new Date('2026-01-27'),
        deadline: '2026-04-01',
        remote: true,
        matchScore: 79
    },
    {
        id: '8',
        title: 'Stage Design UX/UI',
        company: 'BlaBlaCar',
        companyLogo: 'https://ui-avatars.com/api/?name=BB&background=00aff5&color=fff',
        location: 'Paris, France',
        type: 'stage',
        domain: 'Design',
        description: `Créez des expériences utilisateur pour des millions de voyageurs.

Vos missions :
- Création de maquettes et prototypes
- Réalisation de tests utilisateurs
- Contribution au design system
- Collaboration avec les équipes produit et tech`,
        requirements: [
            'Formation en design digital',
            'Maîtrise de Figma',
            'Portfolio démontrant votre créativité',
            'Sensibilité à l\'accessibilité'
        ],
        skills: ['Figma', 'Adobe XD', 'Prototypage', 'User Research', 'Design System'],
        studyLevel: ['bac+3', 'bac+4', 'bac+5'],
        duration: '6 mois',
        salary: '1 000€/mois',
        startDate: '2026-04-01',
        postedAt: new Date('2026-01-23'),
        remote: true,
        matchScore: 73
    }
];

// Auth State
let currentUser = null;

// Load user from localStorage (persists across page refreshes)
function loadUser() {
    const savedUser = localStorage.getItem('jobsurmesure_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        // Add displayName if not present (for backward compatibility)
        if (!currentUser.displayName) {
            currentUser.displayName = (currentUser.firstName || '') + ' ' + (currentUser.lastName || '');
        }
        updateAuthUI();
    }
}

// Store user in localStorage
function storeUser(user) {
    // Add displayName if not present
    if (user && !user.displayName) {
        user.displayName = (user.firstName || '') + ' ' + (user.lastName || '');
    }
    localStorage.setItem('jobsurmesure_user', JSON.stringify(user));
}

// Remove user
function removeUser() {
    localStorage.removeItem('jobsurmesure_user');
    currentUser = null;
    updateAuthUI();
}

// Update UI based on auth state
function updateAuthUI() {
    const authLinks = document.getElementById('authLinks');
    const userLinks = document.getElementById('userLinks');

    if (currentUser) {
        if (authLinks) authLinks.style.display = 'none';
        if (userLinks) {
            userLinks.style.display = 'flex';
            document.getElementById('userDisplayName').textContent = currentUser.displayName || (currentUser.firstName + ' ' + currentUser.lastName) || 'Bonjour';
        }
    } else {
        if (authLinks) authLinks.style.display = 'flex';
        if (userLinks) userLinks.style.display = 'none';
    }
}

// Logout function
function logout() {
    if (currentUser && confirm('Voulez-vous vraiment vous déconnecter ?')) {
        removeUser();
        window.location.href = 'index.html';
    } else if (!currentUser) {
        window.location.href = 'connexion.html';
    }
}

// Carousel Functions
let currentSlide = 0;
const slideCount = 4;
let carouselInterval = null;
let isAnimating = false;

function updateCarousel() {
    const slides = document.querySelectorAll('#carouselContainer > div');

    // Hide all slides first
    slides.forEach(slide => {
        slide.style.display = 'none';
    });

    // Show current slide
    const currentSlideEl = slides[currentSlide];
    currentSlideEl.style.display = 'flex';

    // Update dot indicators
    updateDots();

    // Re-initialize Lucide icons after carousel transition
    setTimeout(() => {
        lucide.createIcons();
    }, 0);
}

function updateDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.remove('bg-white/50', 'w-4');
            dot.classList.add('bg-white', 'w-12');
        } else {
            dot.classList.remove('bg-white', 'w-12');
            dot.classList.add('bg-white/50', 'w-4');
        }
    });
}

function nextSlide() {
    if (isAnimating) return;
    isAnimating = true;

    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }

    const slides = document.querySelectorAll('#carouselContainer > div');
    const nextIndex = (currentSlide + 1) % slideCount;

    // Animate current slide out to left
    slides[currentSlide].style.transition = 'transform 0s ease-in-out';
    slides[currentSlide].style.transform = 'translateX(-100vw)';

    // Prepare next slide on the right
    slides[nextIndex].style.display = 'flex';
    slides[nextIndex].style.transition = 'transform 0s ease-in-out';
    slides[nextIndex].style.transform = 'translateX(100vw)';

    setTimeout(() => {
        // Show next slide in center
        slides[nextIndex].style.transform = 'translateX(0)';
        slides[currentSlide].style.display = 'none';

        currentSlide = nextIndex;
        updateCarousel();
        isAnimating = false;
    }, 0);
}

function prevSlide() {
    if (isAnimating) return;
    isAnimating = true;

    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }

    const slides = document.querySelectorAll('#carouselContainer > div');
    const prevIndex = (currentSlide - 1 + slideCount) % slideCount;

    // Animate current slide out to right
    slides[currentSlide].style.transition = 'transform 0s ease-in-out';
    slides[currentSlide].style.transform = 'translateX(100vw)';

    // Prepare prev slide on the left
    slides[prevIndex].style.display = 'flex';
    slides[prevIndex].style.transition = 'transform 0s ease-in-out';
    slides[prevIndex].style.transform = 'translateX(-100vw)';

    setTimeout(() => {
        // Show prev slide in center
        slides[prevIndex].style.transform = 'translateX(0)';
        slides[currentSlide].style.display = 'none';

        currentSlide = prevIndex;
        updateCarousel();
        isAnimating = false;
    }, 0);
}

function goToSlide(index) {
    if (isAnimating) return;
    isAnimating = true;

    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }

    const slides = document.querySelectorAll('#carouselContainer > div');

    if (index > currentSlide) {
        // Moving forward
        slides[currentSlide].style.transition = 'transform 0s ease-in-out';
        slides[currentSlide].style.transform = 'translateX(-100vw)';

        slides[index].style.display = 'flex';
        slides[index].style.transition = 'transform 0s ease-in-out';
        slides[index].style.transform = 'translateX(100vw)';
    } else {
        // Moving backward
        slides[currentSlide].style.transition = 'transform 0s ease-in-out';
        slides[currentSlide].style.transform = 'translateX(100vw)';

        slides[index].style.display = 'flex';
        slides[index].style.transition = 'transform 0s ease-in-out';
        slides[index].style.transform = 'translateX(-100vw)';
    }

    setTimeout(() => {
        // Show target slide in center
        slides[index].style.transform = 'translateX(0)';
        slides[currentSlide].style.display = 'none';

        currentSlide = index;
        updateCarousel();
        isAnimating = false;
    }, 0);
}

// Autocomplete Functions
function handleJobInputChange() {
    const value = document.getElementById('searchQuery').value;
    const suggestionsDiv = document.getElementById('jobSuggestions');
    const input = document.getElementById('searchQuery');

    if (value.length > 0) {
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
}

function handleLocationInputChange() {
    const value = document.getElementById('location').value;
    const suggestionsDiv = document.getElementById('locationSuggestions');

    if (value.length > 0) {
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
}

function selectJob(job) {
    document.getElementById('searchQuery').value = job;
    document.getElementById('jobSuggestions').classList.add('hidden');
    setTimeout(() => searchJobs(), 100);
}

function selectLocation(region) {
    document.getElementById('location').value = region;
    document.getElementById('locationSuggestions').classList.add('hidden');
    setTimeout(() => searchJobs(), 100);
}

// Close suggestions when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target || !(e.target instanceof HTMLElement)) return;

    const isSearchInput = e.target.closest('.search-input');
    const isJobSuggestion = e.target.closest('.suggestions-job');
    const isLocationSuggestion = e.target.closest('.suggestions-location');

    if (!isSearchInput && !isJobSuggestion) {
        document.getElementById('jobSuggestions').classList.add('hidden');
    }
    if (!isSearchInput && !isLocationSuggestion) {
        document.getElementById('locationSuggestions').classList.add('hidden');
    }
});

// Search Function
function searchJobs() {
    console.log('searchJobs called'); // Debug log

    const queryEl = document.getElementById('searchQuery');
    const locationEl = document.getElementById('location');
    const stageCheckedEl = document.getElementById('stageChecked');
    const alternanceCheckedEl = document.getElementById('alternanceChecked');
    const studyLevelEl = document.getElementById('studyLevel');

    if (!queryEl || !locationEl || !stageCheckedEl || !alternanceCheckedEl || !studyLevelEl) {
        console.error('One or more search elements not found');
        return;
    }

    const query = queryEl.value.toLowerCase();
    const location = locationEl.value.toLowerCase();
    const stageChecked = stageCheckedEl.checked;
    const alternanceChecked = alternanceCheckedEl.checked;
    const studyLevel = studyLevelEl.value;

    console.log('Query:', query, 'Location:', location, 'Stage:', stageChecked, 'Alternance:', alternanceChecked); // Debug log

    // Filter jobs
    let filtered = [...mockJobs];

    if (query) {
        filtered = filtered.filter(job =>
            job.title.toLowerCase().includes(query) ||
            job.company.toLowerCase().includes(query) ||
            job.skills.some(skill => skill.toLowerCase().includes(query))
        );
    }

    if (location) {
        filtered = filtered.filter(job => job.location.toLowerCase().includes(location));
    }

    if (stageChecked && !alternanceChecked) {
        filtered = filtered.filter(job => job.type === 'stage');
    } else if (!stageChecked && alternanceChecked) {
        filtered = filtered.filter(job => job.type === 'alternance');
    }

    if (studyLevel) {
        filtered = filtered.filter(job => {
            const levels = Array.isArray(job.studyLevel) ? job.studyLevel : [job.studyLevel];
            return levels.some(l => l.toLowerCase().includes(studyLevel.toLowerCase()));
        });
    }

    // Sort by score
    filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    displayJobs(filtered);

    // Update results count
    document.getElementById('resultsCount').textContent = `${filtered.length} offre${filtered.length > 1 ? 's' : ''} trouvée${filtered.length > 1 ? 's' : ''}`;
    document.getElementById('resultsSection').classList.remove('hidden');
    document.getElementById('popularJobsSection').classList.add('hidden');
}

// Display Jobs Function
function displayJobs(jobs) {
    const grid = document.getElementById('jobsGrid');
    grid.innerHTML = '';

    if (jobs.length === 0) {
        grid.innerHTML = `
            <div class="col-span-3 text-center py-12">
                <div class="text-6xl mb-4">🔍</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucune offre trouvée</h3>
                <p class="text-gray-600">Essayez avec d'autres mots-clés ou filtres</p>
            </div>`;
        return;
    }

    jobs.forEach(job => {
        const scoreClass = getScoreClass(job.matchScore);
        const typeClass = job.type === 'stage' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700';

        let html = `
        <div class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group" onclick="window.location.href='offre.html?id=${job.id}'">
            <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-3">
                    <img src="${job.companyLogo}" alt="${job.company}" class="w-12 h-12 rounded-xl object-cover">
                    <div>
                        <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">${job.title}</h3>
                        <p class="text-gray-600 text-sm">${job.company}</p>
                    </div>
                </div>
                ${job.matchScore ? `<div class="px-3 py-1 rounded-full text-sm font-semibold border ${scoreClass}">${job.matchScore}% match</div>` : ''}
            </div>
            <div class="flex flex-wrap gap-2 mb-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium ${typeClass}">${job.type === 'stage' ? '🎓 Stage' : '💼 Alternance'}</span>
                <span class="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">${job.domain}</span>
                ${job.remote ? '<span class="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1"><i data-lucide="laptop" class="w-3 h-3"></i> Télétravail</span>' : ''}
            </div>
            <div class="space-y-2 text-sm text-gray-600 mb-4">
                <div class="flex items-center gap-2"><i data-lucide="map-pin" class="w-4 h-4 text-gray-400"></i>${job.location}</div>
                <div class="flex items-center gap-2"><i data-lucide="clock" class="w-4 h-4 text-gray-400"></i>${job.duration}</div>
                <div class="flex items-center gap-2"><i data-lucide="graduation-cap" class="w-4 h-4 text-gray-400"></i>${Array.isArray(job.studyLevel) ? job.studyLevel.join(' - ') : job.studyLevel}</div>
            </div>
            <div class="flex flex-wrap gap-1 mb-4">
                ${job.skills.slice(0, 4).map(skill => `<span class="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">${skill}</span>`).join('')}
                ${job.skills.length > 4 ? `<span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">+${job.skills.length - 4}</span>` : ''}
            </div>
            <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                <span class="text-xs text-gray-500">${formatDate(job.postedAt)}</span>
            </div>
        </div>`;

        grid.innerHTML += html;
    });

    // Initialize icons
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
}

function getScoreClass(score) {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
}

function formatDate(date) {
    if (!date) return 'Récent';
    const now = new Date();
    const dateObj = new Date(date);
    const diff = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Aujourd'hui";
    if (diff === 1) return 'Hier';
    if (diff < 7) return `Il y a ${diff} jours`;
    if (diff < 30) return `Il y a ${Math.floor(diff / 7)} semaines`;
    return `Il y a ${Math.floor(diff / 30)} mois`;
}

// Display Popular Jobs (non-search mode)
function displayPopularJobs() {
    const grid = document.getElementById('popularJobsGrid');
    grid.innerHTML = '';

    mockJobs.slice(0, 6).forEach(job => {
        const scoreClass = getScoreClass(job.matchScore);
        const typeClass = job.type === 'stage' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700';

        let html = `
        <div class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group" onclick="window.location.href='offre.html?id=${job.id}'">
            <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-3">
                    <img src="${job.companyLogo}" alt="${job.company}" class="w-12 h-12 rounded-xl object-cover">
                    <div>
                        <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">${job.title}</h3>
                        <p class="text-gray-600 text-sm">${job.company}</p>
                    </div>
                </div>
                ${job.matchScore ? `<div class="px-3 py-1 rounded-full text-sm font-semibold border ${scoreClass}">${job.matchScore}% match</div>` : ''}
            </div>
            <div class="flex flex-wrap gap-2 mb-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium ${typeClass}">${job.type === 'stage' ? '🎓 Stage' : '💼 Alternance'}</span>
                <span class="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">${job.domain}</span>
            </div>
            <div class="space-y-2 text-sm text-gray-600 mb-4">
                <div class="flex items-center gap-2"><i data-lucide="map-pin" class="w-4 h-4 text-gray-400"></i>${job.location}</div>
                <div class="flex items-center gap-2"><i data-lucide="clock" class="w-4 h-4 text-gray-400"></i>${job.duration}</div>
            </div>
            <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                <span class="text-xs text-gray-500">${formatDate(job.postedAt)}</span>
                ${job.salary ? `<span class="text-sm font-medium text-green-600">${job.salary}</span>` : ''}
            </div>
        </div>`;
        grid.innerHTML += html;
    });

    setTimeout(() => {
        lucide.createIcons();
    }, 100);
}

// CV/ LM Upload Functions
function initUploads() {
    const cvFileInput = document.getElementById('cvFileInput');
    const lmFileInput = document.getElementById('lmFileInput');

    if (cvFileInput) {
        cvFileInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    const base64 = e.target.result;
                    // In a real app, this would be saved to backend
                    // For demo, we show success message
                    alert(`CV "${file.name}" uploadé avec succès !`);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (lmFileInput) {
        lmFileInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    alert(`Lettre de motivation "${file.name}" uploadée avec succès !`);
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Mobile Menu Toggle
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
(function init() {
    console.log('Init function called'); // Debug
    // Load user
    loadUser();

    // Update upload content based on auth
    updateUploadContent();

    // Initialize carousel
    updateCarousel();
    // Carousel is now manual - user must click buttons to navigate

    // Initialize icons
    lucide.createIcons();

    // Initialize mobile menu
    initMobileMenu();

    // Initialize uploads
    initUploads();

    // Display popular jobs if not searching
    if (document.getElementById('popularJobsSection').classList.contains('hidden')) {
        displayPopularJobs();
        document.getElementById('popularJobsSection').classList.remove('hidden');
    }

    // Load stats
    loadStats();

    // Add input event listeners for autocomplete
    const searchQueryInput = document.getElementById('searchQuery');
    const locationInput = document.getElementById('location');

    if (searchQueryInput) {
        searchQueryInput.addEventListener('input', handleJobInputChange);
    }

    if (locationInput) {
        locationInput.addEventListener('input', handleLocationInputChange);
    }

})();

function updateUploadContent() {
    const cvUploadContent = document.getElementById('cvUploadContent');
    const lmUploadContent = document.getElementById('lmUploadContent');

    if (currentUser) {
        cvUploadContent.innerHTML = `<label class="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <i data-lucide="upload" class="w-5 h-5 text-blue-500"></i>
            <span class="text-blue-600 font-medium">Télécharger mon CV</span>
            <input type="file" accept=".pdf,.doc,.docx" class="hidden" id="cvFileInput">
        </label>`;

        lmUploadContent.innerHTML = `<label class="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-dashed border-green-300 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors">
            <i data-lucide="upload" class="w-5 h-5 text-green-500"></i>
            <span class="text-green-600 font-medium">Télécharger ma LM</span>
            <input type="file" accept=".pdf,.doc,.docx" class="hidden" id="lmFileInput">
        </label>`;

        setTimeout(() => lucide.createIcons(), 10);
    } else {
        cvUploadContent.innerHTML = `<a href="connexion.html" class="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-colors">
            <i data-lucide="lock" class="w-4 h-4"></i>
            <span class="font-medium">Créer un compte pour uploader</span>
        </a>`;

        lmUploadContent.innerHTML = `<a href="connexion.html" class="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-colors">
            <i data-lucide="lock" class="w-4 h-4"></i>
            <span class="font-medium">Créer un compte pour uploader</span>
        </a>`;
    }
}

function loadStats() {
    // Simulated stats
    document.getElementById('totalJobs').textContent = '1500+';
    document.getElementById('totalCompanies').textContent = '350+';
}

// Modal functions
function closeCvModal() {
    document.getElementById('cvModal').classList.add('hidden');
    document.getElementById('cvPreviewFrame').src = '';
}

// Show AI CV generation modal
function showAICVModal() {
    if (!currentUser) {
        alert('Vous devez être connecté pour générer votre CV avec IA');
        window.location.href = 'connexion.html';
        return;
    }
    alert('Fonctionnalité de génération de CV avec IA bientôt disponible !');
}

// Show AI LM generation modal
function showAILMModal() {
    if (!currentUser) {
        alert('Vous devez être connecté pour générer votre lettre de motivation avec IA');
        window.location.href = 'connexion.html';
        return;
    }
    alert('Fonctionnalité de génération de lettre de motivation avec IA bientôt disponible !');
}
