// Student ERP System JavaScript

// Global variables
let currentRole = 'student';
let currentTheme = 'light';
let assignments = [];
let certificates = [];
let attendanceChart = null;
let attendancePieChart = null;

// Sample data
const sampleAssignments = [
    {
        id: 1,
        title: 'Calculus Problem Set #3',
        subject: 'Mathematics',
        description: 'Complete problems 1-20 from Chapter 5',
        dueDate: '2024-01-20T23:59',
        status: 'pending',
        grade: null,
        feedback: null
    },
    {
        id: 2,
        title: 'Physics Lab Report',
        subject: 'Physics',
        description: 'Write a comprehensive report on the pendulum experiment',
        dueDate: '2024-01-25T23:59',
        status: 'submitted',
        grade: null,
        feedback: null
    },
    {
        id: 3,
        title: 'English Essay',
        subject: 'English Literature',
        description: 'Write an analysis of Shakespeare\'s Hamlet',
        dueDate: '2024-01-15T23:59',
        status: 'graded',
        grade: 92,
        feedback: 'Excellent analysis of character development!'
    }
];

const sampleCertificates = [
    {
        id: 1,
        title: 'Python Programming Certificate',
        issuer: 'TechCorp Academy',
        dateIssued: '2023-12-15',
        status: 'verified',
        file: 'python-cert.pdf'
    },
    {
        id: 2,
        title: 'Data Science Fundamentals',
        issuer: 'DataLearn Institute',
        dateIssued: '2024-01-10',
        status: 'pending',
        file: 'data-science-cert.pdf'
    }
];

const subjectProgress = [
    { subject: 'Mathematics', grade: 88, attendance: 95, completion: 90 },
    { subject: 'Physics', grade: 92, attendance: 88, completion: 85 },
    { subject: 'Chemistry', grade: 85, attendance: 92, completion: 95 },
    { subject: 'English Literature', grade: 90, attendance: 98, completion: 88 },
    { subject: 'History', grade: 87, attendance: 90, completion: 92 }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    assignments = [...sampleAssignments];
    certificates = [...sampleCertificates];
    
    initializeCharts();
    renderAssignments();
    renderCertificates();
    renderProgressSubjects();
    updateRoleVisibility();
});

// Navigation functions
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.add('d-none');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.remove('d-none');
    }
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Find and activate the clicked nav link
    const activeLink = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Reinitialize charts if showing attendance section
    if (sectionName === 'attendance') {
        setTimeout(() => {
            initializeCharts();
        }, 100);
    }
}

// Role switching
function switchRole(role) {
    currentRole = role;
    updateRoleVisibility();
    updateUserName(role);
}

function updateRoleVisibility() {
    const createAssignmentBtn = document.getElementById('create-assignment-btn');
    
    if (currentRole === 'student') {
        createAssignmentBtn.style.display = 'none';
    } else {
        createAssignmentBtn.style.display = 'inline-block';
    }
    
    renderAssignments();
    renderCertificates();
}

function updateUserName(role) {
    const names = {
        student: 'John Doe',
        teacher: 'Prof. Smith',
        admin: 'Admin User'
    };
    
    document.getElementById('current-user').textContent = names[role];
    document.getElementById('welcome-name').textContent = names[role];
}

// Theme toggle
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    
    if (currentTheme === 'light') {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'bi bi-sun';
        currentTheme = 'dark';
    } else {
        body.removeAttribute('data-theme');
        themeIcon.className = 'bi bi-moon-stars';
        currentTheme = 'light';
    }
}

// Assignment functions
function createAssignment() {
    const title = document.getElementById('assignmentTitle').value;
    const subject = document.getElementById('assignmentSubject').value;
    const description = document.getElementById('assignmentDescription').value;
    const dueDate = document.getElementById('assignmentDueDate').value;
    
    if (!title || !subject || !description || !dueDate) {
        alert('Please fill in all fields');
        return;
    }
    
    const newAssignment = {
        id: assignments.length + 1,
        title,
        subject,
        description,
        dueDate,
        status: 'pending',
        grade: null,
        feedback: null
    };
    
    assignments.push(newAssignment);
    renderAssignments();
    
    // Clear form
    document.getElementById('assignmentForm').reset();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('assignmentModal'));
    modal.hide();
    
    showNotification('Assignment created successfully!', 'success');
}

function renderAssignments() {
    const grid = document.getElementById('assignments-grid');
    grid.innerHTML = '';
    
    assignments.forEach(assignment => {
        const card = createAssignmentCard(assignment);
        grid.appendChild(card);
    });
}

function createAssignmentCard(assignment) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6';
    
    const statusBadge = getStatusBadge(assignment.status);
    const actionButtons = getAssignmentActionButtons(assignment);
    
    col.innerHTML = `
        <div class="card assignment-card border-0 shadow-sm h-100">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    ${statusBadge}
                </div>
                <h5 class="card-title">${assignment.title}</h5>
                <p class="card-text text-muted small">${assignment.subject}</p>
                <p class="card-text">${assignment.description}</p>
                <p class="card-text">
                    <small class="text-muted">
                        Due: ${new Date(assignment.dueDate).toLocaleDateString()}
                    </small>
                </p>
                ${assignment.grade ? `
                    <div class="alert alert-success">
                        <strong>Grade: ${assignment.grade}%</strong>
                        ${assignment.feedback ? `<br><small>${assignment.feedback}</small>` : ''}
                    </div>
                ` : ''}
                <div class="d-flex gap-2">
                    ${actionButtons}
                </div>
            </div>
        </div>
    `;
    
    return col;
}

function getStatusBadge(status) {
    const badges = {
        pending: '<span class="badge bg-warning">Pending</span>',
        submitted: '<span class="badge bg-info">Submitted</span>',
        graded: '<span class="badge bg-success">Graded</span>'
    };
    return badges[status] || '';
}

function getAssignmentActionButtons(assignment) {
    if (currentRole === 'student') {
        if (assignment.status === 'pending') {
            return `<button class="btn btn-primary btn-sm" onclick="submitAssignment(${assignment.id})">
                        <i class="bi bi-upload me-1"></i>Submit
                    </button>`;
        }
    } else if (currentRole === 'teacher' || currentRole === 'admin') {
        if (assignment.status === 'submitted') {
            return `<button class="btn btn-success btn-sm" onclick="gradeAssignment(${assignment.id})">
                        <i class="bi bi-award me-1"></i>Grade
                    </button>`;
        }
    }
    
    return `<button class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-eye me-1"></i>View
            </button>`;
}

function submitAssignment(id) {
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
        assignment.status = 'submitted';
        renderAssignments();
        showNotification('Assignment submitted successfully!', 'success');
    }
}

function gradeAssignment(id) {
    const grade = prompt('Enter grade (0-100):');
    const feedback = prompt('Enter feedback:');
    
    if (grade && feedback) {
        const assignment = assignments.find(a => a.id === id);
        if (assignment) {
            assignment.status = 'graded';
            assignment.grade = parseInt(grade);
            assignment.feedback = feedback;
            renderAssignments();
            showNotification('Assignment graded successfully!', 'success');
        }
    }
}

// Certificate functions
function uploadCertificate() {
    const title = document.getElementById('certificateTitle').value;
    const issuer = document.getElementById('certificateIssuer').value;
    const dateIssued = document.getElementById('certificateDate').value;
    const file = document.getElementById('certificateFile').files[0];
    
    if (!title || !issuer || !dateIssued || !file) {
        alert('Please fill in all fields and select a file');
        return;
    }
    
    const newCertificate = {
        id: certificates.length + 1,
        title,
        issuer,
        dateIssued,
        status: 'pending',
        file: file.name
    };
    
    certificates.push(newCertificate);
    renderCertificates();
    
    // Clear form
    document.getElementById('certificateForm').reset();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('certificateModal'));
    modal.hide();
    
    showNotification('Certificate uploaded successfully!', 'success');
}

function renderCertificates() {
    const grid = document.getElementById('certificates-grid');
    grid.innerHTML = '';
    
    certificates.forEach(certificate => {
        const card = createCertificateCard(certificate);
        grid.appendChild(card);
    });
}

function createCertificateCard(certificate) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6';
    
    const statusBadge = getCertificateStatusBadge(certificate.status);
    const actionButtons = getCertificateActionButtons(certificate);
    
    col.innerHTML = `
        <div class="card certificate-card border-0 shadow-sm h-100">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    ${statusBadge}
                    <i class="bi bi-file-earmark-text text-muted" style="font-size: 1.5rem;"></i>
                </div>
                <h5 class="card-title">${certificate.title}</h5>
                <p class="card-text text-muted small">Issued by: ${certificate.issuer}</p>
                <p class="card-text">
                    <small class="text-muted">
                        Date: ${new Date(certificate.dateIssued).toLocaleDateString()}
                    </small>
                </p>
                <div class="d-flex gap-2">
                    ${actionButtons}
                </div>
            </div>
        </div>
    `;
    
    return col;
}

function getCertificateStatusBadge(status) {
    const badges = {
        pending: '<span class="badge bg-warning">Pending</span>',
        verified: '<span class="badge bg-success">Verified</span>',
        rejected: '<span class="badge bg-danger">Rejected</span>'
    };
    return badges[status] || '';
}

function getCertificateActionButtons(certificate) {
    let buttons = `<button class="btn btn-outline-secondary btn-sm">
                       <i class="bi bi-eye me-1"></i>View
                   </button>`;
    
    if ((currentRole === 'admin' || currentRole === 'teacher') && certificate.status === 'pending') {
        buttons += `
            <button class="btn btn-success btn-sm" onclick="verifyCertificate(${certificate.id})">
                <i class="bi bi-check-circle me-1"></i>Verify
            </button>
            <button class="btn btn-danger btn-sm" onclick="rejectCertificate(${certificate.id})">
                <i class="bi bi-x-circle me-1"></i>Reject
            </button>
        `;
    }
    if ((currentRole === 'student')) {

    }   
    
    return buttons;
}

function verifyCertificate(id) {
    const certificate = certificates.find(c => c.id === id);
    if (certificate) {
        certificate.status = 'verified';
        renderCertificates();
        showNotification('Certificate verified successfully!', 'success');
    }
}

function rejectCertificate(id) {
    const certificate = certificates.find(c => c.id === id);
    if (certificate) {
        certificate.status = 'rejected';
        renderCertificates();
        showNotification('Certificate rejected.', 'warning');
    }
}

// Progress tracking
function renderProgressSubjects() {
    const container = document.getElementById('progress-subjects');
    container.innerHTML = '';
    
    subjectProgress.forEach(subject => {
        const progressItem = createProgressItem(subject);
        container.appendChild(progressItem);
    });
}

function createProgressItem(subject) {
    const div = document.createElement('div');
    div.className = 'subject-progress';
    
    const overallScore = Math.round((subject.grade * 0.6) + (subject.attendance * 0.2) + (subject.completion * 0.2));
    const gradeColor = getGradeColor(overallScore);
    
    div.innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-8">
                <h5 class="mb-2">${subject.subject}</h5>
                <div class="row">
                    <div class="col-4">
                        <small class="text-muted">Grade</small>
                        <div class="progress mb-1" style="height: 6px;">
                            <div class="progress-bar bg-primary" style="width: ${subject.grade}%"></div>
                        </div>
                        <small>${subject.grade}%</small>
                    </div>
                    <div class="col-4">
                        <small class="text-muted">Attendance</small>
                        <div class="progress mb-1" style="height: 6px;">
                            <div class="progress-bar bg-success" style="width: ${subject.attendance}%"></div>
                        </div>
                        <small>${subject.attendance}%</small>
                    </div>
                    <div class="col-4">
                        <small class="text-muted">Completion</small>
                        <div class="progress mb-1" style="height: 6px;">
                            <div class="progress-bar bg-info" style="width: ${subject.completion}%"></div>
                        </div>
                        <small>${subject.completion}%</small>
                    </div>
                </div>
            </div>
            <div class="col-md-4 text-center">
                <div class="subject-grade-circle ${gradeColor}">
                    ${overallScore}%
                </div>
                <small class="text-muted">Overall Score</small>
            </div>
        </div>
    `;
    
    return div;
}

function getGradeColor(grade) {
    if (grade >= 90) return 'bg-success';
    if (grade >= 80) return 'bg-primary';
    if (grade >= 70) return 'bg-warning';
    return 'bg-danger';
}

// Chart initialization
function initializeCharts() {
    initializeAttendanceChart();
    initializeAttendancePieChart();
}

function initializeAttendanceChart() {
    const ctx = document.getElementById('attendanceChart');
    if (!ctx) return;
    
    if (attendanceChart) {
        attendanceChart.destroy();
    }
    
    attendanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mathematics', 'Physics', 'Chemistry', 'English', 'History'],
            datasets: [{
                label: 'Attendance Percentage',
                data: [95, 88, 92, 98, 90],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ],
                borderColor: [
                    'rgb(54, 162, 235)',
                    'rgb(255, 99, 132)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function initializeAttendancePieChart() {
    const ctx = document.getElementById('attendancePieChart');
    if (!ctx) return;
    
    if (attendancePieChart) {
        attendancePieChart.destroy();
    }
    
    attendancePieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Present', 'Absent', 'Medical Leave'],
            datasets: [{
                data: [46, 4, 2],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(255, 205, 86, 0.8)'
                ],
                borderColor: [
                    'rgb(75, 192, 192)',
                    'rgb(255, 99, 132)',
                    'rgb(255, 205, 86)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const alertClass = {
        success: 'alert-success',
        warning: 'alert-warning',
        danger: 'alert-danger',
        info: 'alert-info'
    };
    
    const notification = document.createElement('div');
    notification.className = `alert ${alertClass[type]} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
}