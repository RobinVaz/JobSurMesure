// Mon Profil Page JavaScript - JobSurMesure

const API_URL = 'http://localhost:3000/api';
let currentUser = null;

// File storage keys - will be set when user is loaded
let cvFileKey = '';
let lmFileKey = '';

// Common skills keywords by category
const SKILL_KEYWORDS = {
    'JavaScript': ['javascript', 'js', 'node.js', 'nodejs', 'node', 'react', 'angular', 'vue', 'typescript', 'ts'],
    'Python': ['python', 'django', 'flask', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'django'],
    'Java': ['java', 'spring', 'spring boot', 'hibernate', 'maven', 'gradle'],
    'C#': ['c#', 'csharp', '.net', 'asp.net', 'entity framework', 'xamarin'],
    'PHP': ['php', 'laravel', 'symfony', 'wordpress', 'prestashop'],
    'SQL': ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 'oracle', 'mongodb', 'nosql', 'mongodb'],
    'HTML/CSS': ['html', 'css', 'sass', 'less', 'bootstrap', 'tailwind', 'bulma'],
    'Frontend': ['frontend', 'frontend developer', 'ui', 'ux', 'react', 'vue', 'angular', 'javascript'],
    'Backend': ['backend', 'backend developer', 'api', 'rest', 'graphql', 'node.js', 'java', 'python'],
    'Full Stack': ['full stack', 'fullstack', 'full-stack', 'full stack developer'],
    'DevOps': ['devops', 'ci/cd', 'jenkins', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'ansible'],
    'Data Science': ['data science', 'data analyst', 'machine learning', 'deep learning', 'ai', 'artificial intelligence', 'data modeling'],
    'Business Intelligence': ['bi', 'business intelligence', 'power bi', 'tableau', 'looker'],
    'Mobile': ['mobile', 'android', 'ios', 'react native', 'flutter', 'native', 'kotlin', 'swift'],
    'Testing': ['testing', 'test', 'qa', 'automated testing', 'selenium', 'jest', 'cypress', 'unit testing'],
    'Cloud': ['cloud', 'aws', 'azure', 'gcp', 'cloud computing', 'serverless'],
    'Security': ['security', 'cybersecurity', 'penetration testing', 'ethics hacking', 'encryption'],
    'Design': ['design', 'designer', 'figma', 'photoshop', 'illustrator', 'adobe', 'graphic design', 'ui design', 'ux design'],
    'Communication': ['communication', 'english', 'français', 'speaker', 'presentation', 'marketing', 'seo', 'social media'],
    'Management': ['management', 'manager', 'scrum', 'agile', 'leader', 'team lead', 'product owner'],
    'Finance': ['finance', 'financial', 'accounting', ' comptabilité', 'economie', 'economics'],
    'Marketing': ['marketing', 'digital marketing', 'content marketing', 'seo', 'sem', 'social media marketing']
};

// Skills pattern for extraction
const TECH_SKILLS_PATTERN = /\b(javascript|js|node\.?js|react|angular|vue|typescript|python|java|c[#\s]?|\.net|php|sql|mysql|postgres|html|css|bootstrap|docker|kubernetes|aws|azure|gcp|git|mongodb|nosql|api|rest|graphql|security|testing|qa|jira|agile|scrum|devops|flutter|react\s*native|swift|kotlin|ui|ux|figma|photoshop|power\s*bi|tableau|machine\s*learning|data\s*science|data\s*analyst)\b/gi;

// Analyze CV text and extract skills
function analyzeCVText(cvText) {
    if (!cvText || typeof cvText !== 'string') {
        return { skills: [], extractedText: '', analysis: {} };
    }

    // Convert to lowercase for matching
    const textLower = cvText.toLowerCase();

    // Extract skills using pattern matching
    const foundSkills = new Set();

    // Check each skill category
    for (const [skillName, keywords] of Object.entries(SKILL_KEYWORDS)) {
        for (const keyword of keywords) {
            if (textLower.includes(keyword)) {
                foundSkills.add(skillName);
                break;
            }
        }
    }

    // Also extract using regex pattern
    const regexMatches = cvText.match(TECH_SKILLS_PATTERN);
    if (regexMatches) {
        regexMatches.forEach(match => {
            // Normalize the match
            const normalized = match.toLowerCase().trim();
            // Map common variations to standard names
            const skillMap = {
                'js': 'JavaScript',
                'nodejs': 'JavaScript',
                'node.js': 'JavaScript',
                'node': 'JavaScript',
                'c#': 'C#',
                'c# ': 'C#',
                '.net': 'C#',
                'csharp': 'C#',
                'postgres': 'SQL',
                'sql': 'SQL',
                'mongodb': 'SQL',
                'nosql': 'SQL',
                'rest api': 'Backend',
                'graphql': 'Backend',
                'react native': 'Mobile',
                'reactnative': 'Mobile',
                'swift ': 'Mobile',
                'kotlin ': 'Mobile',
                'ai': 'Data Science',
                'ml': 'Data Science',
                'machine learning': 'Data Science',
                'data science': 'Data Science',
                'data analyst': 'Data Science',
                'business intelligence': 'Business Intelligence',
                'bi': 'Business Intelligence',
                'digital marketing': 'Marketing',
                'social media': 'Marketing',
                'seo': 'Marketing',
                'sem': 'Marketing',
                'content marketing': 'Marketing',
                'pentesting': 'Security',
                'penetration testing': 'Security',
                'ethical hacking': 'Security',
                'cybersecurity': 'Security',
                'information security': 'Security'
            };
            if (skillMap[normalized]) {
                foundSkills.add(skillMap[normalized]);
            }
        });
    }

    // Extract education level
    const educationPatterns = [
        /bac\s*\+?\s*[0-6+]/gi,
        /master|master['\s]?s?|mastère/gi,
        /ingénieur|ingénierie/gi,
        /bachelor|baccalauréat/gi,
        /dut|bts|licence/gi
    ];
    const educationFound = [];
    educationPatterns.forEach(pattern => {
        const match = cvText.match(pattern);
        if (match) educationFound.push(match[0]);
    });

    // Extract experience years
    let experienceYears = 0;
    const expPatterns = [
        /(\d+)\s*(ans| années?| an| year| years)/gi,
        /(\d+)\s*(d'|de\s*)?expérience/gi
    ];
    expPatterns.forEach(pattern => {
        const match = cvText.match(pattern);
        if (match && match[1]) {
            experienceYears = Math.max(experienceYears, parseInt(match[1]));
        }
    });

    // Extract email
    const emailMatch = cvText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : '';

    // Extract phone
    const phoneMatch = cvText.match(/(\+?\d{1,3}[\s-]?)?(\d{2}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2})/);
    const phone = phoneMatch ? phoneMatch[0] : '';

    // Extract name (simple heuristic - first line or line with "Nom" or "Nom et prénom")
    const nameMatch = cvText.match(/(?:Nom\s*[:\-]?\s*|Prénom\s*[:\-]?\s*)?([A-Z][a-zÀ-ÿ]+(?:\s+[A-Z][a-zÀ-ÿ]+){0,2})/i);
    const potentialName = nameMatch ? nameMatch[1] : '';

    return {
        skills: Array.from(foundSkills),
        extractedText: cvText.substring(0, 500), // First 500 chars as preview
        analysis: {
            education: educationFound,
            experienceYears: experienceYears,
            email: email,
            phone: phone,
            potentialName: potentialName
        }
    };
}

// Function to extract text from PDF (client-side with pdf.js)
async function extractTextFromPDF(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = e.target.result;
                // Try to parse as PDF
                if (data && typeof data === 'string') {
                    resolve(data);
                } else {
                    resolve('');
                }
            } catch (err) {
                resolve('');
            }
        };
        reader.readAsText(file);
    });
}

// Fallback method to read file content
async function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        reader.readAsText(file);
    });
}

// Get current user from local storage (persists across page refreshes)
function getCurrentUser() {
    const user = localStorage.getItem('jobsurmesure_user');
    if (user) {
        const parsedUser = JSON.parse(user);
        // Add displayName if not present (for backward compatibility)
        if (!parsedUser.displayName) {
            parsedUser.displayName = (parsedUser.firstName || '') + ' ' + (parsedUser.lastName || '');
        }
        // Initialize file keys based on user ID
        cvFileKey = `cv_${parsedUser.id}`;
        lmFileKey = `lm_${parsedUser.id}`;
        return parsedUser;
    }
    return null;
}

// Load user profile from API
async function loadUserProfile() {
    currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'connexion.html';
        return;
    }

    // Always restore files from localStorage first
    const savedFiles = JSON.parse(localStorage.getItem('jobsurmesure_files') || '{}');
    if (savedFiles[cvFileKey]) {
        currentUser.profile = currentUser.profile || {};
        currentUser.profile.cvUrl = savedFiles[cvFileKey].url;
        currentUser.profile.cvName = savedFiles[cvFileKey].name;
        console.log('CV restored from localStorage:', currentUser.profile.cvName);
    }
    if (savedFiles[lmFileKey]) {
        currentUser.profile = currentUser.profile || {};
        currentUser.profile.coverLetterUrl = savedFiles[lmFileKey].url;
        currentUser.profile.lmName = savedFiles[lmFileKey].name;
        console.log('LM restored from localStorage:', currentUser.profile.lmName);
    }

    displayUserProfile(currentUser);

    // Update localStorage with current user to ensure consistency
    localStorage.setItem('jobsurmesure_user', JSON.stringify(currentUser));

    // Optional: try to sync with server (silent fail if server not available)
    try {
        const response = await fetch(`${API_URL}/users/${currentUser.id}`);
        const data = await response.json();
        console.log('API Response:', data);

        if (data.success && data.user) {
            // Only update from server if we don't have CV/LM yet
            if (!savedFiles[cvFileKey] && data.user.profile?.cvUrl) {
                console.log('CV found on server, saving to localStorage...');
                savedFiles[cvFileKey] = {
                    url: data.user.profile.cvUrl,
                    name: data.user.profile.cvName || 'CV_uploadé.pdf',
                    type: 'cv',
                    timestamp: new Date().toISOString()
                };
            }
            if (!savedFiles[lmFileKey] && data.user.profile?.coverLetterUrl) {
                console.log('LM found on server, saving to localStorage...');
                savedFiles[lmFileKey] = {
                    url: data.user.profile.coverLetterUrl,
                    name: data.user.profile.lmName || 'LM_uploadée.pdf',
                    type: 'lm',
                    timestamp: new Date().toISOString()
                };
            }
            if (Object.keys(savedFiles).length > 0) {
                localStorage.setItem('jobsurmesure_files', JSON.stringify(savedFiles));
            }
        }
    } catch (err) {
        console.log('Server not reachable, using local data only');
    }
}

// Display user profile
function displayUserProfile(user) {
    // Profile header
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');

    if (userAvatar) userAvatar.textContent = `${user.firstName[0]}${user.lastName[0]}`;
    if (userName) userName.textContent = `${user.firstName} ${user.lastName}`;
    if (userEmail) userEmail.textContent = user.email;

    // Personal info form
    const firstNameInput = document.getElementById('firstNameInput');
    const lastNameInput = document.getElementById('lastNameInput');
    const emailInput = document.getElementById('emailInput');
    const dateOfBirthInput = document.getElementById('dateOfBirthInput');

    if (firstNameInput) firstNameInput.value = user.firstName || '';
    if (lastNameInput) lastNameInput.value = user.lastName || '';
    if (emailInput) emailInput.value = user.email || '';
    if (dateOfBirthInput) dateOfBirthInput.value = user.dateOfBirth || '';

    // User profile form
    const schoolInput = document.getElementById('schoolInput');
    const studyLevelInput = document.getElementById('studyLevelInput');
    const locationInput = document.getElementById('locationInput');

    if (schoolInput) schoolInput.value = user.profile?.school || '';
    if (studyLevelInput) studyLevelInput.value = user.profile?.studyLevel || 'bac+3';
    if (locationInput) locationInput.value = user.profile?.location || '';

    // Skills input (comma separated)
    const skillsInput = document.getElementById('skillsInput');
    const skills = Array.isArray(user.profile?.skills) ? user.profile.skills.join(', ') : '';
    if (skillsInput) skillsInput.value = skills;

    // Languages
    const languagesInput = document.getElementById('languagesInput');
    const languages = Array.isArray(user.profile?.languages) ? user.profile.languages.join(', ') : '';
    if (languagesInput) languagesInput.value = languages;

    // Preferred locations
    const preferredLocationsInput = document.getElementById('preferredLocationsInput');
    const preferredLocations = Array.isArray(user.profile?.preferredLocations) ? user.profile.preferredLocations.join(', ') : '';
    if (preferredLocationsInput) preferredLocationsInput.value = preferredLocations;

    // Preferred domains
    const preferredDomainsInput = document.getElementById('preferredDomainsInput');
    const preferredDomains = Array.isArray(user.profile?.preferredDomains) ? user.profile.preferredDomains.join(', ') : '';
    if (preferredDomainsInput) preferredDomainsInput.value = preferredDomains;

    // Preferred types
    const prefStage = document.getElementById('prefStage');
    const prefAlternance = document.getElementById('prefAlternance');

    if (prefStage && user.profile?.preferredTypes) {
        const types = user.profile.preferredTypes;
        if (types.includes('stage')) prefStage.checked = true;
        if (types.includes('alternance')) prefAlternance.checked = true;
    }

    // CV and LM files
    const cvFileNameEl = document.getElementById('cvFileName');
    const cvFileStatusEl = document.getElementById('cvFileStatus');
    const cvFileContainer = document.getElementById('cvFileContainer');
    const cvPlaceholder = document.getElementById('cvPlaceholder');
    const cvFileSizeEl = document.getElementById('cvFileSize');
    const cvSkillsInfo = document.getElementById('cvSkillsInfo');
    const cvSkillsList = document.getElementById('cvSkillsList');

    if (user.profile?.cvUrl) {
        if (cvFileNameEl) cvFileNameEl.textContent = user.profile.cvName || 'CV_uploadé.pdf';
        if (cvFileStatusEl) {
            cvFileStatusEl.classList.remove('text-gray-500');
            cvFileStatusEl.classList.add('text-green-600');
            cvFileStatusEl.textContent = 'Uploadé le ' + new Date().toLocaleDateString('fr-FR');
        }
        if (cvFileContainer) cvFileContainer.classList.remove('hidden');
        if (cvPlaceholder) cvPlaceholder.classList.add('hidden');
        if (cvFileSizeEl) cvFileSizeEl.textContent = 'Fichier chargé';
        if (cvSkillsInfo) cvSkillsInfo.classList.add('hidden');
        if (cvSkillsList) cvSkillsList.innerHTML = '';
    }

    const lmFileNameEl = document.getElementById('lmFileName');
    const lmFileStatusEl = document.getElementById('lmFileStatus');
    const lmFileContainer = document.getElementById('lmFileContainer');
    const lmPlaceholder = document.getElementById('lmPlaceholder');

    if (user.profile?.coverLetterUrl) {
        if (lmFileNameEl) lmFileNameEl.textContent = user.profile.lmName || 'LM_uploadée.pdf';
        if (lmFileStatusEl) {
            lmFileStatusEl.classList.remove('text-gray-500');
            lmFileStatusEl.classList.add('text-green-600');
            lmFileStatusEl.textContent = 'Uploadée le ' + new Date().toLocaleDateString('fr-FR');
        }
        if (lmFileContainer) lmFileContainer.classList.remove('hidden');
        if (lmPlaceholder) lmPlaceholder.classList.add('hidden');
    }

    setTimeout(() => lucide.createIcons(), 10);
}

// Preview CV
function previewCv() {
    const cvUrl = currentUser?.profile?.cvUrl;
    const cvName = currentUser?.profile?.cvName || 'CV_uploadé.pdf';

    if (!cvUrl) {
        Modal.error('Erreur', 'Veuillez d\'abord uploader votre CV');
        return;
    }

    // Display in modal
    const cvModalTitle = document.getElementById('cvModalTitle');
    const cvModalFilename = document.getElementById('cvModalFilename');

    if (cvModalTitle) {
        cvModalTitle.textContent = `Mon CV`;
    }
    if (cvModalFilename) {
        cvModalFilename.textContent = cvName;
    }

    // Check if it's a Word document
    if (cvName.toLowerCase().endsWith('.doc') || cvName.toLowerCase().endsWith('.docx')) {
        // Use Microsoft Word Viewer for Word documents
        const viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(cvUrl)}`;
        document.getElementById('cvPreviewFrame').src = viewerUrl;
    } else {
        // For PDF, display directly
        document.getElementById('cvPreviewFrame').src = cvUrl;
    }
    document.getElementById('cvModal').classList.remove('hidden');
}

// Close CV modal
function closeCvModal() {
    document.getElementById('cvModal').classList.add('hidden');
    document.getElementById('cvPreviewFrame').src = '';
}

// Preview LM
function previewLm() {
    const lmUrl = currentUser?.profile?.coverLetterUrl;
    const lmName = currentUser?.profile?.lmName || 'LM_uploadée.pdf';

    if (!lmUrl) {
        Modal.error('Erreur', 'Veuillez d\'abord uploader votre lettre de motivation');
        return;
    }

    // Display in modal
    const cvModalTitle = document.getElementById('cvModalTitle');
    const cvModalFilename = document.getElementById('cvModalFilename');

    if (cvModalTitle) {
        cvModalTitle.textContent = `Lettre de motivation`;
    }
    if (cvModalFilename) {
        cvModalFilename.textContent = lmName;
    }

    // Check if it's a Word document
    if (lmName.toLowerCase().endsWith('.doc') || lmName.toLowerCase().endsWith('.docx')) {
        // Use Microsoft Word Viewer for Word documents
        const viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(lmUrl)}`;
        document.getElementById('cvPreviewFrame').src = viewerUrl;
    } else {
        // For PDF, display directly
        document.getElementById('cvPreviewFrame').src = lmUrl;
    }
    document.getElementById('cvModal').classList.remove('hidden');
}

// Delete LM
function deleteLm() {
    if (confirm('Voulez-vous vraiment supprimer votre lettre de motivation ?')) {
        // Remove from user profile
        if (currentUser && currentUser.profile) {
            delete currentUser.profile.coverLetterUrl;
            delete currentUser.profile.lmName;
        }

        // Remove from localStorage
        const savedFiles = JSON.parse(localStorage.getItem('jobsurmesure_files') || '{}');
        if (savedFiles[lmFileKey]) {
            delete savedFiles[lmFileKey];
            localStorage.setItem('jobsurmesure_files', JSON.stringify(savedFiles));
        }

        // Update localStorage user
        localStorage.setItem('jobsurmesure_user', JSON.stringify(currentUser));

        // Update UI
        const lmFileNameEl = document.getElementById('lmFileName');
        const lmFileStatusEl = document.getElementById('lmFileStatus');
        const lmFileContainer = document.getElementById('lmFileContainer');
        const lmPlaceholder = document.getElementById('lmPlaceholder');

        if (lmFileNameEl) lmFileNameEl.textContent = 'Ma LM.pdf';
        if (lmFileStatusEl) {
            lmFileStatusEl.classList.remove('text-green-600');
            lmFileStatusEl.classList.add('text-gray-500');
            lmFileStatusEl.textContent = 'Uploadée le --/--/----';
        }
        if (lmFileContainer) lmFileContainer.classList.add('hidden');
        if (lmPlaceholder) lmPlaceholder.classList.remove('hidden');
    }
}

// Delete CV
function deleteCv() {
    if (confirm('Voulez-vous vraiment supprimer votre CV ?')) {
        // Remove from user profile
        if (currentUser && currentUser.profile) {
            delete currentUser.profile.cvUrl;
            delete currentUser.profile.cvName;
        }

        // Remove from localStorage
        const savedFiles = JSON.parse(localStorage.getItem('jobsurmesure_files') || '{}');
        if (savedFiles[cvFileKey]) {
            delete savedFiles[cvFileKey];
            localStorage.setItem('jobsurmesure_files', JSON.stringify(savedFiles));
        }

        // Update localStorage user
        localStorage.setItem('jobsurmesure_user', JSON.stringify(currentUser));

        // Update UI
        const cvFileNameEl = document.getElementById('cvFileName');
        const cvFileStatusEl = document.getElementById('cvFileStatus');
        const cvFileContainer = document.getElementById('cvFileContainer');
        const cvPlaceholder = document.getElementById('cvPlaceholder');
        const cvSkillsInfo = document.getElementById('cvSkillsInfo');
        const cvUploadText = document.getElementById('cvUploadText');
        const cvUploadIcon = document.getElementById('cvUploadIconContainer');

        if (cvFileNameEl) cvFileNameEl.textContent = 'Mon CV.pdf';
        if (cvFileStatusEl) {
            cvFileStatusEl.classList.remove('text-green-600');
            cvFileStatusEl.classList.add('text-gray-500');
            cvFileStatusEl.textContent = 'Uploadé le --/--/----';
        }
        if (cvFileContainer) cvFileContainer.classList.add('hidden');
        if (cvPlaceholder) cvPlaceholder.classList.remove('hidden');
        if (cvSkillsInfo) cvSkillsInfo.classList.add('hidden');

        // Reset upload zone
        if (cvUploadText) {
            cvUploadText.innerHTML = '<p class="text-lg font-semibold text-gray-700 mb-1">Glissez-déposez votre CV</p><p class="text-sm text-gray-500">ou cliquez pour parcourir (PDF, DOC)</p>';
        }
        if (cvUploadIcon) {
            cvUploadIcon.innerHTML = '<i data-lucide="upload" class="w-8 h-8 text-blue-500"></i>';
            setTimeout(() => lucide.createIcons(), 10);
        }

        Modal.info('Supprimé', 'Votre CV a été supprimé');
    }
}

// Save profile
async function saveProfile() {
    if (!currentUser) {
        Modal.error('Erreur', 'Veuillez vous connecter');
        return;
    }

    const submitBtn = document.getElementById('saveProfileBtn');
    if (!submitBtn) {
        Modal.error('Erreur', 'Bouton de sauvegarde non trouvé');
        return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sauvegarde...';
    submitBtn.disabled = true;

    try {
        // Get profile fields that exist in the form
        const studyLevel = document.getElementById('studyLevelInput') ? document.getElementById('studyLevelInput').value : 'bac+3';
        const location = document.getElementById('locationInput') ? document.getElementById('locationInput').value.trim() : '';
        const skillsInput = document.getElementById('skillsInput');
        const languagesInput = document.getElementById('languagesInput');
        const preferredLocationsInput = document.getElementById('preferredLocationsInput');
        const preferredDomainsInput = document.getElementById('preferredDomainsInput');
        const prefStage = document.getElementById('prefStage');
        const prefAlternance = document.getElementById('prefAlternance');

        // Add school if field exists
        const school = document.getElementById('schoolInput') ? document.getElementById('schoolInput').value.trim() : '';

        const profile = {
            school: school,
            studyLevel: studyLevel,
            location: location,
            skills: skillsInput ? skillsInput.value.split(',').map(s => s.trim()).filter(s => s) : [],
            languages: languagesInput ? languagesInput.value.split(',').map(l => l.trim()).filter(l => l) : [],
            preferredLocations: preferredLocationsInput ? preferredLocationsInput.value.split(',').map(l => l.trim()).filter(l => l) : [],
            preferredDomains: preferredDomainsInput ? preferredDomainsInput.value.split(',').map(d => d.trim()).filter(d => d) : [],
            preferredTypes: []
        };

        if (prefStage && prefStage.checked) profile.preferredTypes.push('stage');
        if (prefAlternance && prefAlternance.checked) profile.preferredTypes.push('alternance');

        console.log('Saving profile:', profile);

        // Preserve CV and LM files from localStorage
        const savedFiles = JSON.parse(localStorage.getItem('jobsurmesure_files') || '{}');
        if (savedFiles[cvFileKey]) {
            profile.cvUrl = savedFiles[cvFileKey].url;
            profile.cvName = savedFiles[cvFileKey].name;
        }
        if (savedFiles[lmFileKey]) {
            profile.coverLetterUrl = savedFiles[lmFileKey].url;
            profile.lmName = savedFiles[lmFileKey].name;
        }

        // Update current user with new profile (preserving files from localStorage)
        currentUser.profile = profile;
        localStorage.setItem('jobsurmesure_user', JSON.stringify(currentUser));

        // Always save files to localStorage for persistence
        if (currentUser.profile.cvUrl) {
            savedFiles[cvFileKey] = {
                url: currentUser.profile.cvUrl,
                name: currentUser.profile.cvName,
                type: 'cv',
                timestamp: new Date().toISOString()
            };
        }
        if (currentUser.profile.coverLetterUrl) {
            savedFiles[lmFileKey] = {
                url: currentUser.profile.coverLetterUrl,
                name: currentUser.profile.lmName,
                type: 'lm',
                timestamp: new Date().toISOString()
            };
        }
        localStorage.setItem('jobsurmesure_files', JSON.stringify(savedFiles));

        // Try to save to server (optional - for sync across devices)
        try {
            const response = await fetch(`${API_URL}/users/${currentUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile })
            });
            console.log('Server save response:', response.status);
        } catch (err) {
            // Server not available - this is expected on GitHub Pages
            // Data is already saved to localStorage
            console.log('Server not reachable, data saved locally only');
        }

        Modal.success('Succès', 'Profil sauvegardé avec succès !');

        // Update display
        document.getElementById('userStudyLevel').textContent = `Étudiant en ${profile.studyLevel || 'Bac+3'}`;

        // Reload jobs with new match scores if on search page
        if (typeof searchJobs === 'function') {
            searchJobs();
        }
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Upload CV file with drag & drop support and real-time preview
async function uploadCv(file = null) {
    // Handle file from drag & drop or file input
    if (!file) {
        const input = document.getElementById('cvFileInput');
        if (input && input.files && input.files[0]) {
            file = input.files[0];
        } else {
            return;
        }
    }

    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(pdf|doc|docx)$/)) {
        Modal.error('Erreur', 'Veuillez upload un fichier PDF, DOC ou DOCX');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        Modal.error('Erreur', 'Le fichier est trop volumineux (max 5MB)');
        return;
    }

    // Load current user if not available
    if (!currentUser) {
        currentUser = getCurrentUser();
    }

    if (!currentUser) {
        Modal.error('Erreur', 'Veuillez vous connecter');
        window.location.href = 'connexion.html';
        return;
    }

    // UI: Show loading state
    showCvLoadingState(true);

    // Create preview URL for immediate feedback
    const fileUrl = URL.createObjectURL(file);

    try {
        // Use FileReader to read as DataURL for proper base64 encoding
        const reader = new FileReader();

        // Progress tracking
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress = Math.min(progress + 10, 90);
            updateCvProgressBar(progress);
        }, 100);

        reader.onload = function(e) {
            clearInterval(progressInterval);
            updateCvProgressBar(100);

            const fileContent = e.target.result;

            console.log('File read successfully, size:', fileContent.length);

            // Analyze CV text for skills extraction
            let newSkills = [];
            let analysis = {};

            // Try to read as text for skill extraction
            const textReader = new FileReader();
            textReader.onload = function(textEvent) {
                const textContent = textEvent.target.result;
                analysis = analyzeCVText(textContent);
                newSkills = analysis.skills;

                console.log('CV Analysis Results:', analysis);
                console.log('Extracted skills:', newSkills);

                // Store file as base64 (for immediate use)
                currentUser.profile = currentUser.profile || {};
                currentUser.profile.cvUrl = fileContent;
                currentUser.profile.cvName = file.name;

                // Update profile with extracted skills if available
                if (newSkills.length > 0) {
                    const existingSkills = Array.isArray(currentUser.profile?.skills) ? currentUser.profile.skills : [];
                    const combinedSkills = [...new Set([...existingSkills, ...newSkills])];
                    currentUser.profile.skills = combinedSkills;
                }

                // Save to local storage for persistence across refreshes
                const savedFiles = JSON.parse(localStorage.getItem('jobsurmesure_files') || '{}');
                savedFiles[cvFileKey] = {
                    url: fileContent,
                    name: file.name,
                    type: 'cv',
                    timestamp: new Date().toISOString(),
                    analysis: analysis
                };
                localStorage.setItem('jobsurmesure_files', JSON.stringify(savedFiles));

                localStorage.setItem('jobsurmesure_user', JSON.stringify(currentUser));

                console.log('User saved to localStorage:', currentUser.email);
                console.log('Files saved:', Object.keys(savedFiles));

                // Update UI with file info
                updateCvUploadedUI(file, fileContent, newSkills, combinedSkills || []);

                // Show success feedback
                Modal.success('Succès', `CV "${file.name}" uploadé avec succès !`);

                // Update skills input field if it exists
                const skillsInput = document.getElementById('skillsInput');
                if (skillsInput && newSkills.length > 0) {
                    skillsInput.value = combinedSkills.join(', ');
                }

                // Update display
                displayUserProfile(currentUser);

                // Update match scores on search page if available
                if (typeof searchJobs === 'function') {
                    setTimeout(() => searchJobs(), 500);
                }

                // Close loading state after delay
                setTimeout(() => showCvLoadingState(false), 1500);
            };
            textReader.readAsText(file);
        };

        reader.onerror = function() {
            clearInterval(progressInterval);
            showCvLoadingState(false);
            Modal.error('Erreur', 'Impossible de lire le fichier');
        };

        reader.readAsDataURL(file);
    } catch (err) {
        clearInterval(progressInterval);
        showCvLoadingState(false);
        console.error('Upload error:', err);
        Modal.error('Erreur', 'Une erreur est survenue lors de l\'upload');
    }
}

// Show loading state for CV upload
function showCvLoadingState(show) {
    const uploadZone = document.getElementById('cvUploadZone');
    const uploadIcon = document.getElementById('cvUploadIconContainer');
    const uploadText = document.getElementById('cvUploadText');
    const loadingState = document.getElementById('cvLoadingState');

    if (uploadZone && uploadIcon && uploadText && loadingState) {
        if (show) {
            uploadIcon.innerHTML = '<i data-lucide="loader" class="w-8 h-8 text-blue-500 animate-spin"></i>';
            uploadText.innerHTML = '<p class="text-lg font-semibold text-gray-700 mb-1">Analyse en cours...</p>';
            loadingState.classList.remove('hidden');
        } else {
            uploadIcon.innerHTML = '<i data-lucide="upload" class="w-8 h-8 text-blue-500"></i>';
            uploadText.innerHTML = '<p class="text-lg font-semibold text-gray-700 mb-1">Glissez-déposez votre CV</p><p class="text-sm text-gray-500">ou cliquez pour parcourir (PDF, DOC)</p>';
            loadingState.classList.add('hidden');
            setTimeout(() => {
                if (!document.getElementById('cvFileContainer')?.classList.contains('hidden')) {
                    uploadIcon.innerHTML = '<i data-lucide="check" class="w-8 h-8 text-green-500"></i>';
                    uploadText.innerHTML = '<p class="text-lg font-semibold text-green-700">CV uploadé !</p>';
                }
            }, 1500);
        }
        setTimeout(() => lucide.createIcons(), 10);
    }
}

// Update CV progress bar
function updateCvProgressBar(percent) {
    const progressBar = document.getElementById('cvProgressBar');
    const progressBarContainer = document.getElementById('cvProgressBarContainer');
    if (progressBar && progressBarContainer) {
        progressBar.style.width = percent + '%';
        if (percent > 0) progressBarContainer.classList.remove('hidden');
        if (percent >= 100) {
            setTimeout(() => progressBarContainer.classList.add('hidden'), 1000);
        }
    }
}

// Update UI after CV is uploaded
function updateCvUploadedUI(file, fileContent, skills, combinedSkills) {
    // Show uploaded container
    const cvFileContainer = document.getElementById('cvFileContainer');
    const cvFileNameEl = document.getElementById('cvFileName');
    const cvFileSizeEl = document.getElementById('cvFileSize');
    const cvFileStatusEl = document.getElementById('cvFileStatus');
    const cvPlaceholder = document.getElementById('cvPlaceholder');
    const cvSkillsInfo = document.getElementById('cvSkillsInfo');
    const cvSkillsList = document.getElementById('cvSkillsList');

    if (cvFileContainer) cvFileContainer.classList.remove('hidden');
    if (cvPlaceholder) cvPlaceholder.classList.add('hidden');

    if (cvFileNameEl) cvFileNameEl.textContent = file.name;

    // Format file size
    let fileSizeStr = (file.size / 1024).toFixed(1) + ' KB';
    if (file.size > 1024 * 1024) {
        fileSizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    }
    if (cvFileSizeEl) cvFileSizeEl.textContent = fileSizeStr;

    if (cvFileStatusEl) {
        cvFileStatusEl.classList.remove('text-gray-500');
        cvFileStatusEl.classList.add('text-green-600');
        cvFileStatusEl.textContent = 'Uploadé le ' + new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) + ' - ' + skills.length + ' compétences détectées';
    }

    // Show skills info
    if (cvSkillsInfo && cvSkillsList) {
        if (skills.length > 0) {
            cvSkillsInfo.classList.remove('hidden');
            cvSkillsList.innerHTML = skills.map(skill =>
                `<span class="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium border border-blue-200">#${skill}</span>`
            ).join('');
        } else {
            cvSkillsInfo.classList.add('hidden');
        }
    }

    // Reset upload zone text after delay
    setTimeout(() => {
        const uploadText = document.getElementById('cvUploadText');
        const uploadIcon = document.getElementById('cvUploadIconContainer');
        if (uploadText && uploadIcon) {
            uploadText.innerHTML = '<p class="text-lg font-semibold text-gray-700 mb-1">Glissez-déposez un nouveau CV</p><p class="text-sm text-gray-500">pour le remplacer</p>';
            uploadIcon.innerHTML = '<i data-lucide="upload" class="w-8 h-8 text-blue-500"></i>';
            setTimeout(() => lucide.createIcons(), 10);
        }
    }, 1000);
}

// Upload LM file
async function uploadLm(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Load current user if not available
    if (!currentUser) {
        currentUser = getCurrentUser();
    }

    if (currentUser) {
        // In a real app, this would upload to a server
        const reader = new FileReader();
        reader.onload = async function(e) {
            // Store file as base64 in localStorage (for immediate use and persistence)
            currentUser.profile = currentUser.profile || {};
            currentUser.profile.coverLetterUrl = e.target.result;
            currentUser.profile.lmName = file.name;

            // Save to local storage for persistence across refreshes
            const savedFiles = JSON.parse(localStorage.getItem('jobsurmesure_files') || '{}');
            savedFiles[lmFileKey] = {
                url: e.target.result,
                name: file.name,
                type: 'lm',
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('jobsurmesure_files', JSON.stringify(savedFiles));

            // Save to server
            try {
                await fetch(`${API_URL}/users/${currentUser.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ profile: currentUser.profile })
                });
            } catch (err) {
                console.warn('Could not save to server:', err);
            }

            localStorage.setItem('jobsurmesure_user', JSON.stringify(currentUser));

            // Update UI
            const lmFileNameEl = document.getElementById('lmFileName');
            const lmFileStatusEl = document.getElementById('lmFileStatus');
            const lmFileContainer = document.getElementById('lmFileContainer');
            const lmPlaceholder = document.getElementById('lmPlaceholder');

            if (lmFileNameEl) {
                lmFileNameEl.textContent = file.name;
            }
            if (lmFileStatusEl) {
                lmFileStatusEl.classList.remove('text-gray-500', 'text-red-500');
                lmFileStatusEl.classList.add('text-green-600');
                lmFileStatusEl.textContent = 'Uploadée le ' + new Date().toLocaleDateString('fr-FR');
            }
            if (lmFileContainer) {
                lmFileContainer.classList.remove('hidden');
            }
            if (lmPlaceholder) {
                lmPlaceholder.classList.add('hidden');
            }
        };
        reader.readAsDataURL(file);
    } else {
        Modal.error('Erreur', 'Veuillez vous connecter pour uploader votre lettre de motivation');
        window.location.href = 'connexion.html';
    }
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

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    initMobileMenu();
    loadUserProfile();
    initDragAndDrop();
    initCvEditor();
});

// Initialize Drag & Drop for CV
function initDragAndDrop() {
    const uploadZone = document.getElementById('cvUploadZone');
    const uploadText = document.getElementById('cvUploadText');

    if (!uploadZone) return;

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    // Highlight on drag enter/over
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadZone.addEventListener(eventName, () => {
            uploadZone.classList.add('border-blue-500', 'bg-blue-50/30');
            if (uploadText) {
                uploadText.innerHTML = '<p class="text-lg font-semibold text-blue-700 mb-1">Relâchez pour upload</p>';
            }
        });
    });

    // Remove highlight on drag leave
    ['dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, () => {
            uploadZone.classList.remove('border-blue-500', 'bg-blue-50/30');
            if (uploadText) {
                uploadText.innerHTML = '<p class="text-lg font-semibold text-gray-700 mb-1">Glissez-déposez votre CV</p><p class="text-sm text-gray-500">ou cliquez pour parcourir (PDF, DOC)</p>';
            }
        });
    });

    // Handle drop
    uploadZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer?.files;
        if (files && files[0]) {
            const file = files[0];
            // Validate file type
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (validTypes.includes(file.type) || file.name.toLowerCase().match(/\.(pdf|doc|docx)$/)) {
                uploadCv(file);
            } else {
                Modal.error('Erreur', 'Format de fichier non supporté. Utilisez PDF, DOC ou DOCX');
            }
        }
    });
}

// ==================== CV Editor Functions ====================

// Toggle CV Editor
function toggleCvEditor() {
    const previewSection = document.getElementById('cvPreviewSection');
    const editorSection = document.getElementById('cvEditorSection');
    const toggleBtn = document.getElementById('toggleCvEditorBtn');

    if (previewSection && editorSection && toggleBtn) {
        if (previewSection.classList.contains('hidden')) {
            // Switch to preview
            previewSection.classList.remove('hidden');
            editorSection.classList.add('hidden');
            toggleBtn.innerHTML = '<i data-lucide="pen-line" class="w-4 h-4"></i> Éditer en ligne';
            setTimeout(() => lucide.createIcons(), 10);
        } else {
            // Switch to editor
            previewSection.classList.add('hidden');
            editorSection.classList.remove('hidden');
            loadCvEditorData();
            toggleBtn.innerHTML = '<i data-lucide="eye" class="w-4 h-4"></i> Voir le CV';
            setTimeout(() => lucide.createIcons(), 10);
        }
    }
}

// Load current user data into editor
function loadCvEditorData() {
    if (!currentUser) return;

    // Basic info
    const editorFirstName = document.getElementById('editorFirstName');
    const editorLastName = document.getElementById('editorLastName');
    const editorBio = document.getElementById('editorBio');
    const editorSkills = document.getElementById('editorSkills');

    if (editorFirstName) editorFirstName.value = currentUser.firstName || '';
    if (editorLastName) editorLastName.value = currentUser.lastName || '';
    if (editorBio) editorBio.value = currentUser.profile?.bio || '';
    if (editorSkills) editorSkills.value = Array.isArray(currentUser.profile?.skills) ?
        currentUser.profile.skills.join(', ') : '';

    // Load experiences
    loadExperiences(currentUser.profile?.experiences || []);

    // Load education
    loadEducations(currentUser.profile?.education || []);
}

// Load experiences into editor
function loadExperiences(experiences) {
    const list = document.getElementById('experienceList');
    if (!list) return;

    if (!experiences || !Array.isArray(experiences) || experiences.length === 0) {
        list.innerHTML = '<p class="text-sm text-blue-600 italic">Aucune expérience ajoutée</p>';
        return;
    }

    list.innerHTML = experiences.map((exp, index) => `
        <div class="bg-white p-4 rounded-lg border border-blue-200 shadow-sm" data-index="${index}">
            <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                    <input type="text" class="w-full font-semibold text-blue-900 mb-2 px-2 py-1 rounded border border-blue-200 focus:border-blue-500 outline-none"
                           placeholder="Poste" value="${exp.position || ''}">
                    <div class="flex gap-2">
                        <input type="text" class="flex-1 text-sm px-2 py-1 rounded border border-blue-200 focus:border-blue-500 outline-none"
                               placeholder="Entreprise" value="${exp.company || ''}">
                        <input type="text" class="w-32 text-sm px-2 py-1 rounded border border-blue-200 focus:border-blue-500 outline-none"
                               placeholder="Date" value="${exp.date || ''}">
                    </div>
                </div>
                <button class="text-red-500 hover:bg-red-50 p-2 rounded-lg" onclick="removeExperience(${index})">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>
            <textarea class="w-full text-sm px-2 py-1 rounded border border-blue-200 focus:border-blue-500 outline-none resize-none"
                      rows="3" placeholder="Détails de la mission...">${exp.description || ''}</textarea>
        </div>
    `).join('');
    setTimeout(() => lucide.createIcons(), 10);
}

// Add new experience
window.addExperience = function() {
    if (!currentUser) return;
    const experiences = currentUser.profile?.experiences || [];
    experiences.push({
        position: '',
        company: '',
        date: '',
        description: ''
    });
    currentUser.profile.experiences = experiences;
    loadExperiences(experiences);
    saveCvEditorDataToProfile();
};

// Remove experience
window.removeExperience = function(index) {
    if (!currentUser) return;
    const experiences = currentUser.profile?.experiences || [];
    if (index >= 0 && index < experiences.length) {
        experiences.splice(index, 1);
        currentUser.profile.experiences = experiences;
        loadExperiences(experiences);
        saveCvEditorDataToProfile();
    }
};

// Load educations into editor
function loadEducations(educations) {
    const list = document.getElementById('educationList');
    if (!list) return;

    if (!educations || !Array.isArray(educations) || educations.length === 0) {
        list.innerHTML = '<p class="text-sm text-blue-600 italic">Aucune formation ajoutée</p>';
        return;
    }

    list.innerHTML = educations.map((edu, index) => `
        <div class="bg-white p-4 rounded-lg border border-blue-200 shadow-sm" data-index="${index}">
            <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                    <input type="text" class="w-full font-semibold text-blue-900 mb-2 px-2 py-1 rounded border border-blue-200 focus:border-blue-500 outline-none"
                           placeholder="Diplôme" value="${edu.degree || ''}">
                    <div class="flex gap-2">
                        <input type="text" class="flex-1 text-sm px-2 py-1 rounded border border-blue-200 focus:border-blue-500 outline-none"
                               placeholder="Établissement" value="${edu.school || ''}">
                        <input type="text" class="w-32 text-sm px-2 py-1 rounded border border-blue-200 focus:border-blue-500 outline-none"
                               placeholder="Date" value="${edu.date || ''}">
                    </div>
                </div>
                <button class="text-red-500 hover:bg-red-50 p-2 rounded-lg" onclick="removeEducation(${index})">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>
        </div>
    `).join('');
    setTimeout(() => lucide.createIcons(), 10);
}

// Add new education
window.addEducation = function() {
    if (!currentUser) return;
    const educations = currentUser.profile?.education || [];
    educations.push({
        degree: '',
        school: '',
        date: ''
    });
    currentUser.profile.education = educations;
    loadEducations(educations);
    saveCvEditorDataToProfile();
};

// Remove education
window.removeEducation = function(index) {
    if (!currentUser) return;
    const educations = currentUser.profile?.education || [];
    if (index >= 0 && index < educations.length) {
        educations.splice(index, 1);
        currentUser.profile.education = educations;
        loadEducations(educations);
        saveCvEditorDataToProfile();
    }
};

// Save editor data to user profile
function saveCvEditorDataToProfile() {
    if (!currentUser) return;

    const editorFirstName = document.getElementById('editorFirstName');
    const editorLastName = document.getElementById('editorLastName');
    const editorBio = document.getElementById('editorBio');
    const editorSkills = document.getElementById('editorSkills');

    if (editorFirstName) currentUser.firstName = editorFirstName.value.trim();
    if (editorLastName) currentUser.lastName = editorLastName.value.trim();
    if (editorBio) currentUser.profile.bio = editorBio.value.trim();
    if (editorSkills) {
        currentUser.profile.skills = editorSkills.value.split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);
    }

    localStorage.setItem('jobsurmesure_user', JSON.stringify(currentUser));
}

// Reset editor
function resetCvEditor() {
    loadCvEditorData();
}

// Save editor and go back to preview
function saveCvEditor() {
    saveCvEditorDataToProfile();
    Modal.success('Succès', 'Vos modifications ont été sauvegardées !');
    toggleCvEditor();
}

// Initialize CV Editor
function initCvEditor() {
    const toggleBtn = document.getElementById('toggleCvEditorBtn');
    const resetBtn = document.getElementById('resetCvEditorBtn');
    const saveBtn = document.getElementById('saveCvEditorBtn');
    const addExpBtn = document.getElementById('addExperienceBtn');
    const addEduBtn = document.getElementById('addEducationBtn');

    if (toggleBtn) toggleBtn.addEventListener('click', toggleCvEditor);
    if (resetBtn) resetBtn.addEventListener('click', resetCvEditor);
    if (saveBtn) saveBtn.addEventListener('click', saveCvEditor);
    if (addExpBtn) addExpBtn.addEventListener('click', addExperience);
    if (addEduBtn) addEduBtn.addEventListener('click', addEducation);
}
