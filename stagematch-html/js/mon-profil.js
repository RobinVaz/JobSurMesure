// Mon Profil Page JavaScript - JobSurMesure

const API_URL = 'http://localhost:3000/api';
let currentUser = null;

// Get current user from session
function getCurrentUser() {
    const user = sessionStorage.getItem('jobsurmesure_user');
    if (user) {
        return JSON.parse(user);
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

    try {
        const response = await fetch(`${API_URL}/users/${currentUser.id}`);
        const data = await response.json();

        if (data.success) {
            const user = data.user;
            displayUserProfile(user);
        }
    } catch (err) {
        console.error('Error loading profile:', err);
        // Fallback to session data
        displayUserProfile(currentUser);
    }
}

// Display user profile
function displayUserProfile(user) {
    // Profile header
    document.getElementById('userAvatar').textContent = `${user.firstName[0]}${user.lastName[0]}`;
    document.getElementById('userName').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('userEmail').textContent = user.email;

    // Personal info form
    document.getElementById('firstNameInput').value = user.firstName || '';
    document.getElementById('lastNameInput').value = user.lastName || '';
    document.getElementById('emailInput').value = user.email || '';
    document.getElementById('dateOfBirthInput').value = user.dateOfBirth || '';

    // User profile form
    document.getElementById('schoolInput').value = user.profile?.school || '';
    document.getElementById('studyLevelInput').value = user.profile?.studyLevel || 'bac+3';
    document.getElementById('locationInput').value = user.profile?.location || '';

    // Skills input (comma separated)
    const skills = Array.isArray(user.profile?.skills) ? user.profile.skills.join(', ') : '';
    document.getElementById('skillsInput').value = skills;

    // Languages
    const languages = Array.isArray(user.profile?.languages) ? user.profile.languages.join(', ') : '';
    document.getElementById('languagesInput').value = languages;

    // Preferred locations
    const preferredLocations = Array.isArray(user.profile?.preferredLocations) ? user.profile.preferredLocations.join(', ') : '';
    document.getElementById('preferredLocationsInput').value = preferredLocations;

    // Preferred domains
    const preferredDomains = Array.isArray(user.profile?.preferredDomains) ? user.profile.preferredDomains.join(', ') : '';
    document.getElementById('preferredDomainsInput').value = preferredDomains;

    // Preferred types
    if (user.profile?.preferredTypes) {
        const types = user.profile.preferredTypes;
        if (types.includes('stage')) document.getElementById('prefStage').checked = true;
        if (types.includes('alternance')) document.getElementById('prefAlternance').checked = true;
    }

    // CV and LM files
    if (user.profile?.cvUrl) {
        const cvFileNameEl = document.getElementById('cvFileName');
        const cvFileStatusEl = document.getElementById('cvFileStatus');
        const cvFileContainer = document.getElementById('cvFileContainer');
        const cvPlaceholder = document.getElementById('cvPlaceholder');

        if (cvFileNameEl) cvFileNameEl.textContent = user.profile.cvName || 'CV_uploadé.pdf';
        if (cvFileStatusEl) {
            cvFileStatusEl.classList.remove('text-gray-500');
            cvFileStatusEl.classList.add('text-green-600');
            cvFileStatusEl.textContent = 'Uploadé le ' + new Date().toLocaleDateString('fr-FR');
        }
        if (cvFileContainer) cvFileContainer.classList.remove('hidden');
        if (cvPlaceholder) cvPlaceholder.classList.add('hidden');
    }

    if (user.profile?.coverLetterUrl) {
        const lmFileNameEl = document.getElementById('lmFileName');
        const lmFileStatusEl = document.getElementById('lmFileStatus');
        const lmFileContainer = document.getElementById('lmFileContainer');
        const lmPlaceholder = document.getElementById('lmPlaceholder');

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

    document.getElementById('cvPreviewFrame').src = cvUrl;
    document.getElementById('cvModal').classList.remove('hidden');
}

// Close CV modal
function closeCvModal() {
    document.getElementById('cvModal').classList.add('hidden');
    document.getElementById('cvPreviewFrame').src = '';
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
        const profile = {
            school: document.getElementById('schoolInput') ? document.getElementById('schoolInput').value.trim() : '',
            studyLevel: document.getElementById('studyLevelInput').value,
            location: document.getElementById('locationInput').value.trim(),
            skills: document.getElementById('skillsInput').value.split(',').map(s => s.trim()).filter(s => s),
            languages: document.getElementById('languagesInput').value.split(',').map(l => l.trim()).filter(l => l),
            preferredLocations: document.getElementById('preferredLocationsInput').value.split(',').map(l => l.trim()).filter(l => l),
            preferredDomains: document.getElementById('preferredDomainsInput').value.split(',').map(d => d.trim()).filter(d => d),
            preferredTypes: []
        };

        if (document.getElementById('prefStage') && document.getElementById('prefStage').checked) profile.preferredTypes.push('stage');
        if (document.getElementById('prefAlternance') && document.getElementById('prefAlternance').checked) profile.preferredTypes.push('alternance');

        const response = await fetch(`${API_URL}/users/${currentUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile })
        });

        if (response.ok) {
            alert('Profil sauvegardé avec succès !');
            // Update current user
            currentUser.profile = profile;
            sessionStorage.setItem('jobsurmesure_user', JSON.stringify(currentUser));

            // Update display
            document.getElementById('userStudyLevel').textContent = `Étudiant en ${profile.studyLevel || 'Bac+3'}`;

            // Reload jobs with new match scores if on search page
            if (typeof searchJobs === 'function') {
                searchJobs();
            }
        } else {
            alert('Erreur lors de la sauvegarde');
        }
    } catch (err) {
        console.error('Error saving profile:', err);
        alert('Erreur lors de la sauvegarde');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Upload CV file
function uploadCv(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Load current user if not available
    if (!currentUser) {
        currentUser = getCurrentUser();
    }

    if (currentUser) {
        // In a real app, this would upload to a server
        const reader = new FileReader();
        reader.onload = function(e) {
            // Store file as base64 in session
            currentUser.profile = currentUser.profile || {};
            currentUser.profile.cvUrl = e.target.result;
            currentUser.profile.cvName = file.name;
            sessionStorage.setItem('jobsurmesure_user', JSON.stringify(currentUser));

            // Update UI
            const cvFileNameEl = document.getElementById('cvFileName');
            const cvFileStatusEl = document.getElementById('cvFileStatus');
            const cvFileContainer = document.getElementById('cvFileContainer');
            const cvPlaceholder = document.getElementById('cvPlaceholder');

            if (cvFileNameEl) {
                cvFileNameEl.textContent = file.name;
            }
            if (cvFileStatusEl) {
                cvFileStatusEl.classList.remove('text-gray-500', 'text-red-500');
                cvFileStatusEl.classList.add('text-green-600');
                cvFileStatusEl.textContent = 'Uploadé le ' + new Date().toLocaleDateString('fr-FR');
            }
            if (cvFileContainer) {
                cvFileContainer.classList.remove('hidden');
            }
            if (cvPlaceholder) {
                cvPlaceholder.classList.add('hidden');
            }
        };
        reader.readAsDataURL(file);
    } else {
        alert('Veuillez vous connecter pour uploader votre CV');
        window.location.href = 'connexion.html';
    }
}

// Upload LM file
function uploadLm(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Load current user if not available
    if (!currentUser) {
        currentUser = getCurrentUser();
    }

    if (currentUser) {
        // In a real app, this would upload to a server
        const reader = new FileReader();
        reader.onload = function(e) {
            // Store file as base64 in session
            currentUser.profile = currentUser.profile || {};
            currentUser.profile.coverLetterUrl = e.target.result;
            currentUser.profile.lmName = file.name;
            sessionStorage.setItem('jobsurmesure_user', JSON.stringify(currentUser));

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
        sessionStorage.removeItem('jobsurmesure_user');
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
