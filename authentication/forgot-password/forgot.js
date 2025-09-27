const form = document.getElementById('forgotPasswordForm');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const loadingSpinner = document.getElementById('loadingSpinner');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');


form.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();

    // Hide previous messages
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    // Validate email
    if (!email || !isValidEmail(email)) {
        showError('Please enter a valid email address.');
        return;
    }

    // Show loading state
    showLoading(true);

    // Simulate API call (replace with actual API endpoint)
    setTimeout(() => {
        // Simulate successful response
        if (email.includes('@') && email.includes('.')) {
            showSuccess();
        } else {
            showError('Email address not found in our records.');
        }
        showLoading(false);
    }, 2000);
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showLoading(loading) {
    if (loading) {
        submitBtn.disabled = true;
        loadingSpinner.style.display = 'inline-block';
        btnText.textContent = 'Sending...';
    } else {
        submitBtn.disabled = false;
        loadingSpinner.style.display = 'none';
        btnText.textContent = 'Send Reset Link';
    }
}

function showSuccess() {
    successMessage.style.display = 'block';
    form.style.display = 'none';
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
}

function goBack() {
    // Replace with actual navigation logic
    window.history.back();
    // Or redirect to login page: window.location.href = 'login.html';
}

// Auto-hide error message on input focus
emailInput.addEventListener('focus', function () {
    errorMessage.style.display = 'none';
});