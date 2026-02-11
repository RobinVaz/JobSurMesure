// Login Page JavaScript - JobSurMesure

// Toggle password visibility
function togglePassword() {
    const input = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;

    if (type === 'text') {
        eyeIcon.innerHTML = '<i data-lucide="eye-off" class="w-5 h-5"></i>';
    } else {
        eyeIcon.innerHTML = '<i data-lucide="eye" class="w-5 h-5"></i>';
    }
    setTimeout(() => lucide.createIcons(), 10);
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorDiv');
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.textContent = message;
    errorDiv.classList.remove('hidden');
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
}

// Hide error message
function hideError() {
    document.getElementById('errorDiv').classList.add('hidden');
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    hideError();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showError('Veuillez remplir tous les champs');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Connexion...';
    submitBtn.disabled = true;

    // In a real app, this would make an API call
    // For demo, we just simulate success
    setTimeout(() => {
        // Create a mock user object
        const user = {
            id: 'user-' + Date.now(),
            email: email,
            firstName: email.split('@')[0],
            lastName: 'Utilisateur',
            dateOfBirth: '1995-01-01',
            createdAt: new Date(),
            profile: {
                cvFiles: [],
                preferredLocations: [],
                preferredTypes: ['stage', 'alternance'],
                preferredDomains: [],
                studyLevel: 'bac+3',
                skills: [],
                languages: []
            }
        };

        // Store user in session with new key
        sessionStorage.setItem('jobsurmesure_user', JSON.stringify(user));

        // Redirect to profile
        window.location.href = 'mon-profil.html';
    }, 1500);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();

    // Hide error on input
    ['email', 'password'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', hideError);
        }
    });

    // Form submission
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }

    // Check if user is already logged in
    const savedUser = sessionStorage.getItem('jobsurmesure_user');
    if (savedUser) {
        window.location.href = 'mon-profil.html';
    }
});
