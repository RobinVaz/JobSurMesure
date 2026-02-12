// Registration Page JavaScript
const API_URL = 'http://localhost:3000/api';

// Password strength calculation
function passwordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
}

function getStrengthColor(strength) {
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 2) return 'bg-orange-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-green-400';
    return 'bg-green-600';
}

function getStrengthText(strength) {
    if (strength <= 1) return 'Très faible';
    if (strength <= 2) return 'Faible';
    if (strength <= 3) return 'Moyen';
    if (strength <= 4) return 'Fort';
    return 'Très fort';
}

function updatePasswordStrength(password) {
    const strength = passwordStrength(password);
    const strengthText = getStrengthText(strength);
    const color = getStrengthColor(strength);

    // Update strength bars
    for (let i = 1; i <= 5; i++) {
        const bar = document.getElementById(`strength${i}`);
        if (i <= strength) {
            bar.className = `h-1 flex-1 rounded ${color}`;
        } else {
            bar.className = 'h-1 flex-1 rounded bg-gray-200';
        }
    }

    document.getElementById('strengthText').textContent = `Force : ${strengthText}`;
    document.getElementById('strengthText').className = strength < 3 ? 'text-xs text-red-600' : 'text-xs text-green-600';
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const eyeIcon = document.getElementById(inputId === 'password' ? 'eyePassword' : 'eyeConfirmPassword');
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;

    if (type === 'text') {
        eyeIcon.innerHTML = '<i data-lucide="eye-off" class="w-5 h-5"></i>';
    } else {
        eyeIcon.innerHTML = '<i data-lucide="eye" class="w-5 h-5"></i>';
    }
    setTimeout(() => lucide.createIcons(), 10);
}

// Show/hide confirmation checkmark
function updateConfirmPassword(password, confirmPassword) {
    const checkIcon = document.getElementById('confirmCheck');
    if (confirmPassword && confirmPassword === password) {
        checkIcon.classList.remove('hidden');
    } else {
        checkIcon.classList.add('hidden');
    }
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

// Validate form
function validateForm(formData) {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.dateOfBirth) {
        return 'Veuillez remplir tous les champs obligatoires';
    }

    if (formData.password !== formData.confirmPassword) {
        return 'Les mots de passe ne correspondent pas';
    }

    const strength = passwordStrength(formData.password);
    if (strength < 3) {
        return 'Le mot de passe est trop faible';
    }

    if (!document.getElementById('terms').checked) {
        return 'Vous devez accepter les conditions d\'utilisation';
    }

    return null;
}

// Handle registration
async function handleRegistration(e) {
    e.preventDefault();
    hideError();

    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        dateOfBirth: document.getElementById('dateOfBirth').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };

    const errorMsg = validateForm(formData);
    if (errorMsg) {
        showError(errorMsg);
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Création du compte...';
    submitBtn.disabled = true;

    try {
        // Call API to register
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Store user in local storage
            const user = {
                id: data.user.id,
                email: data.user.email,
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                dateOfBirth: formData.dateOfBirth,
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
            localStorage.setItem('jobsurmesure_user', JSON.stringify(user));

            // Redirect to profile
            window.location.href = 'mon-profil.html';
        } else {
            showError(data.error || 'Erreur lors de la création du compte');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    } catch (err) {
        console.error('Registration error:', err);
        showError('Erreur de connexion. Vérifiez votre connexion internet.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();

    // Real-time password strength update
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }

    // Password confirmation check
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordInput2 = document.getElementById('password');
    if (confirmPasswordInput && passwordInput2) {
        confirmPasswordInput.addEventListener('input', function() {
            updateConfirmPassword(passwordInput2.value, this.value);
        });
        passwordInput2.addEventListener('input', function() {
            updateConfirmPassword(this.value, confirmPasswordInput.value);
        });
    }

    // Hide error on input
    const formInputs = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    formInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', hideError);
        }
    });

    // Form submission
    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', handleRegistration);
    }
});
