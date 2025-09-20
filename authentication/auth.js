// Student ERP System - Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const alertContainer = document.getElementById('alertContainer');
    const Btn = document.getElementsByTagName('button')

    // Initialize
    init();

    function init() {
        // Load remembered email if exists
        loadRememberedCredentials();
        
        // Add event listeners
        togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
        loginForm.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        emailInput.addEventListener('input', validateEmail);
        Btn.addEventListener('click',validateEmail,validatePassword)
        // passwordInput.addEventListener('input', validatePassword);
        
        // Auto-focus first empty field
        if (!emailInput.value) {
            emailInput.focus();
        } else if (!passwordInput.value) {
            passwordInput.focus();
        }
        
        // Add smooth animations to form elements
        addFormAnimations();
    }

    function togglePasswordVisibility() {
        const icon = togglePasswordBtn.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
            togglePasswordBtn.setAttribute('title', 'Hide password');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
            togglePasswordBtn.setAttribute('title', 'Show password');
        }
        
        // Add smooth transition effect
        togglePasswordBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            togglePasswordBtn.style.transform = 'scale(1)';
        }, 150);
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email === '') {
            setFieldState(emailInput, 'neutral');
        } else if (emailRegex.test(email)) {
            setFieldState(emailInput, 'valid');
        } else {
            setFieldState(emailInput, 'invalid');
        }
    }

    function validatePassword() {
        const password = passwordInput.value;
        
        if (password === '') {
            setFieldState(passwordInput, 'neutral');
        } else if (password.length >= 6) {
            setFieldState(passwordInput, 'valid');
        } else {
            setFieldState(passwordInput, 'invalid');
        }
    }

    function setFieldState(field, state) {
        field.classList.remove('is-valid', 'is-invalid');
        
        if (state === 'valid') {
            field.classList.add('is-valid');
        } else if (state === 'invalid') {
            field.classList.add('is-invalid');
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        // Clear previous alerts
        clearAlerts();
        
        // Validate form
        if (!loginForm.checkValidity()) {
            loginForm.classList.add('was-validated');
            return;
        }
        
        const formData = {
            email: emailInput.value.trim(),
            password: passwordInput.value,
            remember: rememberMeCheckbox.checked
        };
        
        // Show loading state
        setLoadingState(true);
        
        try {
            // Simulate API call
            await simulateLogin(formData);
            
            // Handle successful login
            handleLoginSuccess(formData);
            
        } catch (error) {
            // Handle login error
            handleLoginError(error.message);
        } finally {
            // Remove loading state
            setLoadingState(false);
        }
    }

    function simulateLogin(formData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate different scenarios
                if (formData.email === 'ybhavesh540@gmail.com' && formData.password === 'password123') {
                    resolve({ success: true, message: 'Login successful!' });
                } else {
                    reject(new Error('Invalid credentials'))
                }
            }, 1500); // Simulate network delay
        });
    }

    function handleLoginSuccess(formData) {
        // Save credentials if remember me is checked
        if (formData.remember) {
            saveCredentials(formData.email);
        } else {
            clearSavedCredentials();
        }
        
        // Show success message
        showAlert('Login successful! Redirecting to dashboard...', 'success');
        
        // Simulate redirect to dashboard
        setTimeout(() => {
            // In a real application, you would redirect to the dashboard
            showAlert('Redirecting to dashboard... (This is a demo)', 'success');
        }, 2000);
        
        // Add success animation
        loginForm.style.transform = 'scale(0.98)';
        loginForm.style.opacity = '0.7';
        setTimeout(() => {
            loginForm.style.transform = 'scale(1)';
            loginForm.style.opacity = '1';
        }, 300);
    }

    function handleLoginError(message) {
        showAlert(message, 'danger');
        
        // Shake animation for error
        loginForm.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            loginForm.style.animation = '';
        }, 500);
        
        // Focus on password field for retry
        passwordInput.focus();
        passwordInput.select();
    }

    function setLoadingState(loading) {
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = submitBtn.querySelector('.btn-spinner');
        
        if (loading) {
            submitBtn.disabled = true;
            submitBtn.classList.add('btn-loading');
            btnText.textContent = 'Signing In...';
            spinner.classList.remove('d-none');
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
            btnText.textContent = 'Sign In';
            spinner.classList.add('d-none');
        }
    }

    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        alertContainer.appendChild(alertDiv);
        
        // Auto-dismiss success alerts
        if (type === 'success') {
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    const bsAlert = new bootstrap.Alert(alertDiv);
                    bsAlert.close();
                }
            }, 5000);
        }
    }

    function clearAlerts() {
        alertContainer.innerHTML = '';
    }

    function saveCredentials(email) {
        // In a real application, you might use more secure storage
        // For demo purposes, we'll use localStorage
        try {
            localStorage.setItem('rememberedEmail', email);
        } catch (e) {
            console.warn('Could not save credentials:', e);
        }
    }

    function loadRememberedCredentials() {
        try {
            const rememberedEmail = localStorage.getItem('rememberedEmail');
            if (rememberedEmail) {
                emailInput.value = rememberedEmail;
                rememberMeCheckbox.checked = true;
                passwordInput.focus();
            }
        } catch (e) {
            console.warn('Could not load saved credentials:', e);
        }
    }

    function clearSavedCredentials() {
        try {
            localStorage.removeItem('rememberedEmail');
        } catch (e) {
            console.warn('Could not clear saved credentials:', e);
        }
    }

    function addFormAnimations() {
        // Add staggered animation to form elements
        const formElements = loginForm.querySelectorAll('.mb-4, button');
        formElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }

    // Add CSS for shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // Add demo credentials helper
    setTimeout(() => {
        if (!emailInput.value && !passwordInput.value) {
            showAlert('Demo: Use john.doe@student.edu / password123 or demo@student.edu / demo123', 'info');
        }
    }, 3000);
});

// Utility function to add info alerts
function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    
    // Define colors for different alert types
    let bgColor, textColor;
    switch(type) {
        case 'info':
            bgColor = '#e0f2fe';
            textColor = '#0369a1';
            break;
        case 'success':
            bgColor = '#d1fae5';
            textColor = '#065f46';
            break;
        case 'danger':
            bgColor = '#fee2e2';
            textColor = '#991b1b';
            break;
        default:
            bgColor = '#f3f4f6';
            textColor = '#374151';
    }
    
    alertDiv.style.backgroundColor = bgColor;
    alertDiv.style.color = textColor;
    alertDiv.style.border = 'none';
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alertDiv);
    
    // Auto-dismiss info and success alerts
    if (type === 'info' || type === 'success') {
        setTimeout(() => {
            if (alertDiv.parentNode) {
                const bsAlert = new bootstrap.Alert(alertDiv);
                bsAlert.close();
            }
        }, type === 'info' ? 8000 : 5000);
    }
}