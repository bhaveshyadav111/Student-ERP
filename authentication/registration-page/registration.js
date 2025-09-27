// DOM Elements
const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const btnText = document.getElementById('btnText');
const successMessage = document.getElementById('successMessage');
const progressFill = document.getElementById('progressFill');

// Required fields for progress tracking
const requiredFields = [
    'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender',
    'studentId', 'course', 'semester', 'admissionYear',
    'address', 'city', 'state', 'pincode',
    'password', 'confirmPassword'
];

// Validation patterns
const validationPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[6-9]\d{9}$/,
    pincode: /^\d{6}$/,
    studentId: /^[A-Z0-9]{6,12}$/
};

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeValidation();
    initializeProgressTracking();
    initializePasswordStrength();
    initializeFileUpload();
});

// Form submission handler
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
        submitForm();
    }
});

// Initialize real-time validation
function initializeValidation() {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', function() {
            validateField(this);
            updateProgress();
        });
        
        // Clear errors on focus
        input.addEventListener('focus', function() {
            clearFieldError(this);
        });
        
        // Real-time validation for specific fields
        if (input.type === 'email') {
            input.addEventListener('input', debounce(() => validateField(input), 300));
        }
        
        if (input.name === 'confirmPassword') {
            input.addEventListener('input', () => validatePasswordMatch());
        }
        
        if (input.name === 'phone') {
            input.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '').substring(0, 10);
            });
        }
        
        if (input.name === 'pincode') {
            input.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '').substring(0, 6);
            });
        }
        
        if (input.name === 'studentId') {
            input.addEventListener('input', function() {
                this.value = this.value.toUpperCase();
            });
        }
    });
}

// Initialize progress tracking
function initializeProgressTracking() {
    updateProgress();
    
    // Update progress when any field changes
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updateProgress);
        input.addEventListener('change', updateProgress);
    });
}

// Initialize password strength indicator
function initializePasswordStrength() {
    const passwordField = document.getElementById('password');
    const passwordGroup = passwordField.closest('.form-group');
    
    // Create password strength indicator
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'password-strength';
    strengthIndicator.innerHTML = '<div class="password-strength-fill"></div>';
    
    // Create password requirements list
    const requirements = document.createElement('ul');
    requirements.className = 'password-requirements';
    requirements.innerHTML = `
        <li id="req-length">At least 8 characters</li>
        <li id="req-uppercase">One uppercase letter</li>
        <li id="req-lowercase">One lowercase letter</li>
        <li id="req-number">One number</li>
    `;
    
    passwordField.parentNode.appendChild(strengthIndicator);
    passwordField.parentNode.appendChild(requirements);
    
    passwordField.addEventListener('input', function() {
        checkPasswordStrength(this.value);
    });
}

// Initialize file upload
function initializeFileUpload() {
    const fileInput = document.getElementById('profilePhoto');
    const fileLabel = document.querySelector('.file-upload-label');
    
    fileInput.addEventListener('change', function() {
        const fileName = this.files[0]?.name || 'Choose Profile Photo';
        fileLabel.textContent = fileName;
        
        if (this.files[0]) {
            fileLabel.style.color = '#667eea';
            fileLabel.style.borderColor = '#667eea';
        }
    });
}

// Validate individual field
function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const formGroup = field.closest('.form-group');
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.required && !value) {
        isValid = false;
        errorMessage = getRequiredMessage(fieldName);
    }
    // Pattern validation
    else if (value && validationPatterns[fieldName]) {
        if (!validationPatterns[fieldName].test(value)) {
            isValid = false;
            errorMessage = getPatternMessage(fieldName);
        }
    }
    // Custom validations
    else if (fieldName === 'password' && value.length > 0 && value.length < 8) {
        isValid = false;
        errorMessage = 'Password must be at least 8 characters long';
    }
    else if (fieldName === 'confirmPassword' && value !== document.getElementById('password').value) {
        isValid = false;
        errorMessage = 'Passwords do not match';
    }
    else if (fieldName === 'dateOfBirth' && value) {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 16 || age > 100) {
            isValid = false;
            errorMessage = 'Please enter a valid date of birth';
        }
    }
    
    // Update UI based on validation result
    if (isValid) {
        formGroup.classList.remove('invalid');
        formGroup.classList.add('valid');
        hideFieldError(field);
    } else {
        formGroup.classList.remove('valid');
        formGroup.classList.add('invalid');
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Validate entire form
function validateForm() {
    let isFormValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    // Check terms and conditions
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        isFormValid = false;
        showFieldError(termsCheckbox, 'You must agree to the terms and conditions');
    }
    
    return isFormValid;
}

// Password strength checker
function checkPasswordStrength(password) {
    const strengthIndicator = document.querySelector('.password-strength');
    const requirements = document.querySelectorAll('.password-requirements li');
    
    let score = 0;
    
    // Check requirements
    const checks = {
        'req-length': password.length >= 8,
        'req-uppercase': /[A-Z]/.test(password),
        'req-lowercase': /[a-z]/.test(password),
        'req-number': /\d/.test(password)
    };
    
    Object.entries(checks).forEach(([id, isValid]) => {
        const element = document.getElementById(id);
        if (isValid) {
            element.classList.add('valid');
            element.classList.remove('invalid');
            score++;
        } else {
            element.classList.add('invalid');
            element.classList.remove('valid');
        }
    });
    
    // Update strength indicator
    strengthIndicator.classList.remove('weak', 'medium', 'strong');
    
    if (password.length === 0) {
        // No password entered
    } else if (score < 2) {
        strengthIndicator.classList.add('weak');
    } else if (score < 4) {
        strengthIndicator.classList.add('medium');
    } else {
        strengthIndicator.classList.add('strong');
    }
}

// Validate password match
function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (confirmPassword && password !== confirmPassword) {
        showFieldError(document.getElementById('confirmPassword'), 'Passwords do not match');
        return false;
    } else if (confirmPassword) {
        hideFieldError(document.getElementById('confirmPassword'));
        return true;
    }
    return true;
}

// Update progress bar
function updateProgress() {
    let filledFields = 0;
    
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field && field.value.trim()) {
            filledFields++;
        }
    });
    
    // Check terms checkbox
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox && termsCheckbox.checked) {
        filledFields++;
    }
    
    const totalFields = requiredFields.length + 1; // +1 for terms checkbox
    const progressPercentage = (filledFields / totalFields) * 100;
    
    progressFill.style.width = progressPercentage + '%';
}

// Submit form
function submitForm() {
    showLoading(true);
    
    // Collect form data
    const formData = new FormData(form);
    const registrationData = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        registrationData[key] = value;
    }
    
    // Simulate API call (replace with actual endpoint)
    setTimeout(() => {
        // Simulate successful registration
        console.log('Registration Data:', registrationData);
        
        // Show success message
        successMessage.style.display = 'block';
        form.style.display = 'none';
        
        // Scroll to top to show success message
        document.querySelector('.container').scrollIntoView({ 
            behavior: 'smooth' 
        });
        
        showLoading(false);
        
        // Optional: Redirect to login page after delay
        // setTimeout(() => {
        //     window.location.href = 'login.html';
        // }, 3000);
        
    }, 2000);
    
    /* 
    // Actual API call implementation:
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            successMessage.style.display = 'block';
            form.style.display = 'none';
        } else {
            alert(data.message || 'Registration failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Network error. Please check your connection and try again.');
    })
    .finally(() => {
        showLoading(false);
    });
    */
}

// Show/hide loading state
function showLoading(loading) {
    if (loading) {
        submitBtn.disabled = true;
        loadingSpinner.style.display = 'inline-block';
        btnText.textContent = 'Creating Account...';
    } else {
        submitBtn.disabled = false;
        loadingSpinner.style.display = 'none';
        btnText.textContent = 'Create Account';
    }
}

// Error message helpers
function showFieldError(field, message) {
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function hideFieldError(field) {
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('invalid', 'valid');
    hideFieldError(field);
}

// Get required field error messages
function getRequiredMessage(fieldName) {
    const messages = {
        firstName: 'First name is required',
        lastName: 'Last name is required',
        email: 'Email address is required',
        phone: 'Phone number is required',
        dateOfBirth: 'Date of birth is required',
        gender: 'Please select your gender',
        studentId: 'Student ID is required',
        course: 'Please select your course',
        semester: 'Please select your semester',
        admissionYear: 'Please select admission year',
        address: 'Address is required',
        city: 'City is required',
        state: 'State is required',
        pincode: 'PIN code is required',
        password: 'Password is required',
        confirmPassword: 'Please confirm your password'
    };
    
    return messages[fieldName] || 'This field is required';
}

// Get pattern validation error messages
function getPatternMessage(fieldName) {
    const messages = {
        email: 'Please enter a valid email address',
        phone: 'Please enter a valid 10-digit phone number',
        pincode: 'Please enter a valid 6-digit PIN code',
        studentId: 'Student ID should be 6-12 characters (letters and numbers only)'
    };
    
    return messages[fieldName] || 'Please enter a valid value';
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle course change to update semester options
document.getElementById('course').addEventListener('change', function() {
    const course = this.value;
    const semesterSelect = document.getElementById('semester');
    
    // Clear current semester selection
    semesterSelect.value = '';
    
    // Update semester options based on course
    let maxSemesters = 8; // Default for B.Tech
    
    if (course.includes('mtech') || course === 'mba' || course === 'mca') {
        maxSemesters = 4;
    } else if (course === 'bca') {
        maxSemesters = 6;
    }
    
    // Update semester options
    const semesterOptions = semesterSelect.querySelectorAll('option:not(:first-child)');
    semesterOptions.forEach((option, index) => {
        if (index + 1 <= maxSemesters) {
            option.style.display = 'block';
        } else {
            option.style.display = 'none';
        }
    });
});

// Auto-generate student ID based on course and year
document.getElementById('admissionYear').addEventListener('change', function() {
    const year = this.value;
    const course = document.getElementById('course').value;
    const studentIdField = document.getElementById('studentId');
    
    if (year && course && !studentIdField.value) {
        let courseCode = '';
        
        // Generate course code
        if (course.includes('cse')) courseCode = 'CS';
        else if (course.includes('ece')) courseCode = 'EC';
        else if (course.includes('me')) courseCode = 'ME';
        else if (course.includes('ce')) courseCode = 'CE';
        else if (course === 'mba') courseCode = 'MB';
        else if (course === 'bca') courseCode = 'BC';
        else if (course === 'mca') courseCode = 'MC';
        
        if (courseCode) {
            // Generate random 3-digit number
            const randomNum = Math.floor(100 + Math.random() * 900);
            const suggestedId = year + courseCode + randomNum;
            studentIdField.value = suggestedId;
            validateField(studentIdField);
        }
    }
});

// Handle form reset
function resetForm() {
    form.reset();
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('valid', 'invalid');
    });
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });
    updateProgress();
    
    // Reset file upload label
    const fileLabel = document.querySelector('.file-upload-label');
    fileLabel.textContent = 'Choose Profile Photo';
    fileLabel.style.color = '';
    fileLabel.style.borderColor = '';
}

// Export functions for external use (if needed)
window.registrationForm = {
    validateForm,
    resetForm,
    submitForm
};