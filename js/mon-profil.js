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

    if (user.profile?.cvUrl) {
        if (cvFileNameEl) cvFileNameEl.textContent = user.profile.cvName || 'CV_uploadé.pdf';
        if (cvFileStatusEl) {
            cvFileStatusEl.classList.remove('text-gray-500');
            cvFileStatusEl.classList.add('text-green-600');
            cvFileStatusEl.textContent = 'Uploadé le ' + new Date().toLocaleDateString('fr-FR');
        }
        if (cvFileContainer) cvFileContainer.classList.remove('hidden');
        if (cvPlaceholder) cvPlaceholder.classList.add('hidden');
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
    if (!cvUrl) {
        alert('Veuillez d\'abord uploader votre CV');
        return;
    }

    // Update modal title and filename
    const cvModalTitle = document.getElementById('cvModalTitle');
    const cvModalFilename = document.getElementById('cvModalFilename');
    const cvFileNameEl = document.getElementById('cvFileName');

    if (cvModalTitle) {
        cvModalTitle.textContent = `${currentUser.firstName} ${currentUser.lastName} - CV`;
    }
    if (cvModalFilename && cvFileNameEl) {
        cvModalFilename.textContent = cvFileNameEl.textContent;
    }

    document.getElementById('cvPreviewFrame').src = cvUrl;
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
    if (!lmUrl) {
        alert('Veuillez d\'abord uploader votre lettre de motivation');
        return;
    }

    // Update modal title and filename
    const cvModalTitle = document.getElementById('cvModalTitle');
    const cvModalFilename = document.getElementById('cvModalFilename');
    const lmFileNameEl = document.getElementById('lmFileName');

    if (cvModalTitle) {
        cvModalTitle.textContent = `${currentUser.firstName} ${currentUser.lastName} - Lettre de motivation`;
    }
    if (cvModalFilename && lmFileNameEl) {
        cvModalFilename.textContent = lmFileNameEl.textContent;
    }

    document.getElementById('cvPreviewFrame').src = lmUrl;
    document.getElementById('cvModal').classList.remove('hidden');
}

// Save profile
async function saveProfile() {
    if (!currentUser) {
        alert('Veuillez vous connecter');
        return;
    }

    const submitBtn = document.getElementById('saveProfileBtn');
    if (!submitBtn) {
        alert('Erreur: bouton de sauvegarde non trouvé');
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

        alert('Profil sauvegardé avec succès !');

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

// Upload CV file
async function uploadCv(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Load current user if not available
    if (!currentUser) {
        currentUser = getCurrentUser();
    }

    if (currentUser) {
        // Use FileReader to read as DataURL for proper base64 encoding
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileContent = e.target.result;

            console.log('File read successfully, size:', fileContent.length);

            // Analyze CV text for skills extraction (only for text files or simple PDF preview)
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

                // Update UI
                const cvFileNameEl = document.getElementById('cvFileName');
                const cvFileStatusEl = document.getElementById('cvFileStatus');
                const cvFileContainer = document.getElementById('cvFileContainer');
                const cvPlaceholder = document.getElementById('cvPlaceholder');

                if (cvFileNameEl) {
                    cvFileNameEl.textContent = file.name;
                }
                if (cvFileStatusEl) {
                    cvFileStatusEl.classList.remove('text-gray-500', 'text-blue-600');
                    cvFileStatusEl.classList.add('text-green-600');
                    cvFileStatusEl.textContent = 'Uploadé le ' + new Date().toLocaleDateString('fr-FR') + ' - ' + newSkills.length + ' compétences détectées';
                }
                if (cvFileContainer) {
                    cvFileContainer.classList.remove('hidden');
                }
                if (cvPlaceholder) {
                    cvPlaceholder.classList.add('hidden');
                }

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
            };
            textReader.readAsText(file);
        };
        reader.readAsDataURL(file);
    } else {
        alert('Veuillez vous connecter pour uploader votre CV');
        window.location.href = 'connexion.html';
    }
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
        alert('Veuillez vous connecter pour uploader votre lettre de motivation');
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
});
