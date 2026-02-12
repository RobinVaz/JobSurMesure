// Login Page JavaScript - JobSurMesure
const API_URL = 'http://localhost:3000/api';

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
async function handleLogin(e) {
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

    try {
        // Call API to login
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Store user in local storage with new key (persists across refreshes)
            localStorage.setItem('jobsurmesure_user', JSON.stringify(data.user));
            // Redirect to profile
            window.location.href = 'mon-profil.html';
        } else {
            showError(data.error || 'Erreur de connexion');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    } catch (err) {
        console.error('Login error:', err);
        showError('Erreur de connexion. Vérifiez votre connexion internet.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
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
    const savedUser = localStorage.getItem('jobsurmesure_user');
    if (savedUser) {
        window.location.href = 'mon-profil.html';
    }
});
