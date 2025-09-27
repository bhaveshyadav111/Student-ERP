// DOM Elements
const editProfileBtn = document.getElementById('editProfileBtn');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const successMessage = document.getElementById('successMessage');
const profilePicInput = document.getElementById('profilePicInput');
const profilePicture = document.getElementById('profilePicture');
const editProfilePicBtn = document.getElementById('editProfilePicBtn');

// Tab functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

// Security elements
const changePasswordBtn = document.getElementById('changePasswordBtn');
const passwordChangeCard = document.getElementById('passwordChangeCard');
const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
const passwordChangeForm = document.getElementById('passwordChangeForm');

// Original data storage for cancel functionality
let originalData = {};
let isEditMode = false;

// Initialize the profile page
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeProfileActions();
    initializeSecurityActions();
    storeOriginalData();
    
    // Load user data (simulate API call)
    loadUserProfile();
});

// Tab functionality
function initializeTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    // Remove active class from all tabs and panels
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanels.forEach(panel => panel.classList.remove('active'));
    
    // Add active class to selected tab and panel
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// Profile actions initialization
function initializeProfileActions() {
    editProfileBtn.addEventListener('click', enableEditMode);
    saveProfileBtn.addEventListener('click', saveProfile);
    cancelEditBtn.addEventListener('click', cancelEdit);
    
    // Profile picture upload
    editProfilePicBtn.addEventListener('click', () => {
        profilePicInput.click();
    });
    
    profilePicInput.addEventListener('change', handleProfilePicture);
}

// Security actions initialization
function initializeSecurityActions() {
    changePasswordBtn.addEventListener('click', showPasswordChangeForm);
    cancelPasswordBtn.addEventListener('click', hidePasswordChangeForm);
    passwordChangeForm.addEventListener('submit', handlePasswordChange);
    
    // 2FA and sessions (placeholder functionality)
    document.getElementById('enable2faBtn').addEventListener('click', enable2FA);
    document.getElementById('viewSessionsBtn').addEventListener('click', viewSessions);
}

// Store original form data
function storeOriginalData() {
    const inputs = document.querySelectorAll('input, select, textarea');
    originalData = {};
    
    inputs.forEach(input => {
        if (input.id) {
            originalData[input.id] = input.value;
        }
    });
}

// Enable edit mode
function enableEditMode() {
    isEditMode = true;
    document.body.classList.add('edit-mode');
    
    // Enable editable fields (except readonly ones)
    const personalTab = document.getElementById('personal');
    const contactTab = document.getElementById('contact');
    
    enableTabInputs(personalTab);
    enableTabInputs(contactTab);
    
    // Show/hide buttons
    editProfileBtn.style.display = 'none';
    saveProfileBtn.style.display = 'flex';
    cancelEditBtn.style.display = 'flex';
    
    showNotification('Edit mode enabled. Make your changes and click Save.', 'info');
}

// Enable inputs in a specific tab
function enableTabInputs(tab) {
    const inputs = tab.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        // Don't enable certain readonly fields
        const readonlyFields = ['studentId', 'course', 'semester', 'admissionYear', 'rollNumber'];
        if (!readonlyFields.some(field => input.id.includes(field))) {
            input.removeAttribute('readonly');
            input.removeAttribute('disabled');
        }
    });
}

// Disable inputs in a specific tab
function disableTabInputs(tab) {
    const inputs = tab.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type !== 'file') {
            input.setAttribute('readonly', 'readonly');
            if (input.tagName === 'SELECT') {
                input.setAttribute('disabled', 'disabled');
            }
        }
    });
}

// Save profile changes
function saveProfile() {
    // Validate form data
    if (!validateProfileData()) {
        return;
    }
    
    // Show loading state
    saveProfileBtn.innerHTML = '<span class="loading-spinner"></span> Saving...';
    saveProfileBtn.disabled = true;
    
    // Collect form data
    const formData = collectFormData();
    
    // Simulate API call
    setTimeout(() => {
        // API call would go here
        console.log('Saving profile data:', formData);
        
        // Success
        exitEditMode();
        showSuccessMessage();
        storeOriginalData(); // Update original data
        
        // Reset button
        saveProfileBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Save Changes';
        saveProfileBtn.disabled = false;
        
    }, 1500);
    
    /*
    // Actual API call implementation:
    fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            exitEditMode();
            showSuccessMessage();
            storeOriginalData();
        } else {
            showNotification(data.message || 'Failed to save changes', 'error');
        }
    })
    .catch(error => {
        console.error('Error saving profile:', error);
        showNotification('Network error. Please try again.', 'error');
    })
    .finally(() => {
        saveProfileBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Save Changes';
        saveProfileBtn.disabled = false;
    });
    */
}

// Cancel edit mode
function cancelEdit() {
    // Restore original values
    Object.keys(originalData).forEach(id => {
        const element = document.getElementById(id);
        if (element && element.value !== undefined) {
            element.value = originalData[id];
        }
    });
    
    exitEditMode();
    showNotification('Changes cancelled', 'info');
}

// Exit edit mode
function exitEditMode() {
    isEditMode = false;
    document.body.classList.remove('edit-mode');
    
    // Disable all inputs again
    const personalTab = document.getElementById('personal');
    const contactTab = document.getElementById('contact');
    
    disableTabInputs(personalTab);
    disableTabInputs(contactTab);
    
    // Show/hide buttons
    editProfileBtn.style.display = 'flex';
    saveProfileBtn.style.display = 'none';
    cancelEditBtn.style.display = 'none';
}

// Validate profile data
function validateProfileData() {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            showNotification(`${fieldId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`, 'error');
            field.focus();
            isValid = false;
            return false;
        }
    });
    
    // Email validation
    const email = document.getElementById('email').value;
    if (email && !isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        document.getElementById('email').focus();
        isValid = false;
    }
    
    // Phone validation
    const phone = document.getElementById('phone').value;
    if (phone && !isValidPhone(phone)) {
        showNotification('Please enter a valid phone number', 'error');
        document.getElementById('phone').focus();
        isValid = false;
    }
    
    return isValid;
}

// Collect form data
function collectFormData() {
    const formData = {};
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (input.id && input.type !== 'file') {
            formData[input.id] = input.value;
        }
    });
    
    return formData;
}

// Handle profile picture upload
function handleProfilePicture(event) {
    const file = event.target.files[0];
    if (file) {
        // Validate file
        if (!file.type.startsWith('image/')) {
            showNotification('Please select a valid image file', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            showNotification('Image file too large. Please select a file under 5MB', 'error');
            return;
        }
        
        // Preview image
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePicture.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        // In real implementation, you would upload the file to server
        showNotification('Profile picture updated. Click Save Changes to confirm.', 'success');
    }
}

// Password change functionality
function showPasswordChangeForm() {
    passwordChangeCard.style.display = 'block';
    passwordChangeCard.scrollIntoView({ behavior: 'smooth' });
}

function hidePasswordChangeForm() {
    passwordChangeCard.style.display = 'none';
    passwordChangeForm.reset();
}

function handlePasswordChange(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification('All password fields are required', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        showNotification('New password must be at least 8 characters long', 'error');
        return;
    }
    
    // Check password strength
    if (!isStrongPassword(newPassword)) {
        showNotification('Password must contain at least one uppercase letter, one lowercase letter, and one number', 'error');
        return;
    }
    
    // Simulate API call
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Updating...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Success
        hidePasswordChangeForm();
        showNotification('Password updated successfully', 'success');
        
        // Reset button
        submitBtn.textContent = 'Update Password';
        submitBtn.disabled = false;
    }, 1500);
    
    /*
    // Actual API implementation:
    fetch('/api/profile/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            currentPassword,
            newPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            hidePasswordChangeForm();
            showNotification('Password updated successfully', 'success');
        } else {
            showNotification(data.message || 'Failed to update password', 'error');
        }
    })
    .catch(error => {
        console.error('Error updating password:', error);
        showNotification('Network error. Please try again.', 'error');
    })
    .finally(() => {
        submitBtn.textContent = 'Update Password';
        submitBtn.disabled = false;
    });
    */
}

// 2FA functionality (placeholder)
function enable2FA() {
    showNotification('Two-Factor Authentication setup will be implemented soon', 'info');
    
    /*
    // Actual implementation would redirect to 2FA setup
    window.location.href = 'setup-2fa.html';
    */
}

// View sessions functionality (placeholder)
function viewSessions() {
    showNotification('Session management will be implemented soon', 'info');
    
    /*
    // Actual implementation would show active sessions
    window.location.href = 'active-sessions.html';
    */
}

// Load user profile data
function loadUserProfile() {
    // This would typically fetch data from your API
    // For demo purposes, we're using the default values already in the HTML
    
    // You can uncomment this to load real data:
    /*
    fetch('/api/profile', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            populateProfileData(data.profile);
        } else {
            showNotification('Failed to load profile data', 'error');
        }
    })
    .catch(error => {
        console.error('Error loading profile:', error);
        showNotification('Failed to load profile data', 'error');
    });
    */
}

// Populate profile data
function populateProfileData(profileData) {
    Object.keys(profileData).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.value = profileData[key] || '';
        }
    });
    
    // Update profile header
    if (profileData.firstName && profileData.lastName) {
        document.getElementById('studentName').textContent = 
            `${profileData.firstName} ${profileData.lastName}`;
    }
    
    // Update profile picture if provided
    if (profileData.profilePicture) {
        document.getElementById('profilePicture').src = profileData.profilePicture;
    }
    
    // Store original data
    storeOriginalData();
}

// Show success message
function showSuccessMessage() {
    successMessage.classList.add('show');
    
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 24px;
        padding: 16px 20px;
        border-radius: 8px;
        color: white;
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        case 'info':
            notification.style.background = '#17a2b8';
            break;
        default:
            notification.style.background = '#6c757d';
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto hide after 4 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 4000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

// Hide notification
function hideNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Validation helpers
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Remove all non-digits
    const cleanPhone = phone.replace(/\D/g, '');
    // Check if it's a valid Indian phone number (10 digits starting with 6-9)
    return /^[6-9]\d{9}$/.test(cleanPhone);
}

function isStrongPassword(password) {
    // Check if password has at least one uppercase, one lowercase, and one number
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumber && password.length >= 8;
}

// Logout functionality
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear session data
        sessionStorage.clear();
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        
        // Show logout message
        showNotification('Logging out...', 'info');
        
        // Redirect to login page after short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

// Navigation functions
function goToDashboard() {
    if (isEditMode) {
        if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        window.location.href = 'dashboard.html';
    }
}

function goToGrades() {
    if (isEditMode) {
        if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
            window.location.href = 'grades.html';
        }
    } else {
        window.location.href = 'grades.html';
    }
}

function goToAttendance() {
    if (isEditMode) {
        if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
            window.location.href = 'attendance.html';
        }
    } else {
        window.location.href = 'attendance.html';
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to save in edit mode
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (isEditMode) {
            saveProfile();
        }
    }
    
    // Escape key to cancel edit mode
    if (e.key === 'Escape') {
        if (isEditMode) {
            cancelEdit();
        }
    }
});

// Prevent data loss on page unload if in edit mode
window.addEventListener('beforeunload', function(e) {
    if (isEditMode) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
    }
});

// Auto-save draft functionality (optional)
let autoSaveTimer;
function enableAutoSave() {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
    }
    
    autoSaveTimer = setInterval(() => {
        if (isEditMode) {
            const formData = collectFormData();
            localStorage.setItem('profileDraft', JSON.stringify(formData));
        }
    }, 30000); // Auto-save every 30 seconds
}

// Load draft on page load
function loadDraft() {
    const draft = localStorage.getItem('profileDraft');
    if (draft && confirm('Would you like to restore your previously unsaved changes?')) {
        const draftData = JSON.parse(draft);
        Object.keys(draftData).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = draftData[key];
            }
        });
        enableEditMode();
    }
}

// Clear draft after successful save
function clearDraft() {
    localStorage.removeItem('profileDraft');
}

// Export functions for external use
window.profileManager = {
    enableEditMode,
    saveProfile,
    cancelEdit,
    logout,
    goToDashboard,
    goToGrades,
    goToAttendance,
    showNotification
};