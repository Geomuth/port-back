const API_BASE = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');
let currentAdmin = JSON.parse(localStorage.getItem('currentAdmin')) || {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        showDashboard();
        loadDashboardData();
    } else {
        showLoginPage();
    }

    // Event listeners
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
    document.getElementById('replyForm')?.addEventListener('submit', handleReply);
});

// Toggle between login and register
function toggleForms(e) {
    e.preventDefault();
    document.getElementById('loginPage').classList.toggle('active');
    document.getElementById('registerPage').classList.toggle('active');
}

// Show pages
function showLoginPage() {
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('dashboardPage').classList.remove('active');
}

function showDashboard() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('registerPage').classList.remove('active');
    document.getElementById('dashboardPage').classList.add('active');
    document.getElementById('adminUsername').textContent = currentAdmin.username || 'Admin';
}

// Authentication
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.success) {
            authToken = data.token;
            currentAdmin = data.admin;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentAdmin', JSON.stringify(currentAdmin));
            showDashboard();
            loadDashboardData();
            document.getElementById('loginForm').reset();
        } else {
            alert('Login failed: ' + data.error);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (data.success) {
            authToken = data.token;
            currentAdmin = data.admin;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentAdmin', JSON.stringify(currentAdmin));
            showDashboard();
            loadDashboardData();
            document.getElementById('registerForm').reset();
        } else {
            alert('Registration failed: ' + data.error);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentAdmin');
    authToken = null;
    currentAdmin = {};
    showLoginPage();
}

// Tab switching
function switchTab(tab) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');

    // Update page title
    const titles = {
        'overview': 'Dashboard Overview',
        'subscribers': 'Subscribers Management',
        'emails': 'Email Management'
    };
    document.getElementById('pageTitle').textContent = titles[tab];

    // Show tab
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
    });
    document.getElementById(tab + 'Tab').classList.add('active');

    // Load data
    if (tab === 'subscribers') {
        loadSubscribers();
    } else if (tab === 'emails') {
        loadEmails();
    }
}

// Load dashboard data
async function loadDashboardData() {
    await Promise.all([
        loadSubscriberStats(),
        loadEmailStats(),
        loadRecentSubscribers(),
        loadRecentEmails()
    ]);
}

// Subscribers
async function loadSubscriberStats() {
    try {
        const response = await fetch(`${API_BASE}/subscribers/stats/overview`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        if (data.success) {
            document.getElementById('totalSubscribers').textContent = data.data.total;
        }
    } catch (err) {
        console.error('Error loading subscriber stats:', err);
    }
}

async function loadSubscribers() {
    try {
        const response = await fetch(`${API_BASE}/subscribers`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        if (data.success) {
            const tbody = document.getElementById('subscribersList');
            tbody.innerHTML = '';
            data.data.forEach(sub => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${sub.email}</td>
                    <td>${sub.name}</td>
                    <td>${new Date(sub.subscribedAt).toLocaleDateString()}</td>
                    <td><span class="status-badge status-active">Active</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-sm btn-delete" onclick="deleteSubscriber('${sub._id}')">Delete</button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (err) {
        console.error('Error loading subscribers:', err);
    }
}

async function loadRecentSubscribers() {
    try {
        const response = await fetch(`${API_BASE}/subscribers`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        if (data.success) {
            const container = document.getElementById('recentSubscribers');
            container.innerHTML = '';
            data.data.slice(0, 5).forEach(sub => {
                const item = document.createElement('div');
                item.className = 'recent-item';
                item.innerHTML = `
                    <strong>${sub.email}</strong>
                    <span>${new Date(sub.subscribedAt).toLocaleDateString()}</span>
                `;
                container.appendChild(item);
            });
            if (data.data.length === 0) {
                container.innerHTML = '<p style="color: #718096;">No subscribers yet</p>';
            }
        }
    } catch (err) {
        console.error('Error loading recent subscribers:', err);
    }
}

async function deleteSubscriber(id) {
    if (confirm('Are you sure you want to delete this subscriber?')) {
        try {
            const response = await fetch(`${API_BASE}/subscribers/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            const data = await response.json();
            if (data.success) {
                alert('Subscriber deleted');
                loadSubscribers();
                loadRecentSubscribers();
                loadSubscriberStats();
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
    }
}

function refreshSubscribers() {
    loadSubscribers();
}

// Emails
async function loadEmailStats() {
    try {
        const response = await fetch(`${API_BASE}/emails/stats/overview`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        if (data.success) {
            document.getElementById('totalEmails').textContent = data.data.total;
            document.getElementById('newEmails').textContent = data.data.new;
            document.getElementById('repliedEmails').textContent = data.data.replied;
        }
    } catch (err) {
        console.error('Error loading email stats:', err);
    }
}

async function loadEmails() {
    try {
        const response = await fetch(`${API_BASE}/emails`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        if (data.success) {
            const container = document.getElementById('emailsList');
            container.innerHTML = '';
            data.data.forEach(email => {
                const item = document.createElement('div');
                item.className = `email-item ${email.status}`;
                item.innerHTML = `
                    <div class="email-header">
                        <div>
                            <div class="email-from">${email.senderName} &lt;${email.senderEmail}&gt;</div>
                            <div class="email-time">${new Date(email.receivedAt).toLocaleDateString()}</div>
                        </div>
                        <span class="status-badge" style="background: ${getStatusColor(email.status)}">
                            ${email.status.toUpperCase()}
                        </span>
                    </div>
                    <div class="email-subject">${email.subject}</div>
                    <div class="email-message">${email.message}</div>
                    ${email.isReplied ? `
                        <div style="background: #f0f8e8; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                            <strong style="color: #22543d;">Reply:</strong>
                            <p style="color: #4a5568; margin-top: 5px;">${email.replyMessage}</p>
                        </div>
                    ` : ''}
                    <div class="email-actions">
                        ${!email.isReplied ? `
                            <button class="btn-sm btn-reply" onclick="openReplyModal('${email._id}', '${email.senderName}', '${email.senderEmail}', '${email.subject}')">Reply</button>
                        ` : ''}
                        <button class="btn-sm btn-delete" onclick="deleteEmail('${email._id}')">Delete</button>
                    </div>
                `;
                container.appendChild(item);
            });
            if (data.data.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #718096;">No emails</p>';
            }
        }
    } catch (err) {
        console.error('Error loading emails:', err);
    }
}

async function loadRecentEmails() {
    try {
        const response = await fetch(`${API_BASE}/emails/new/list`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        if (data.success) {
            const container = document.getElementById('recentEmails');
            container.innerHTML = '';
            data.data.slice(0, 5).forEach(email => {
                const item = document.createElement('div');
                item.className = 'recent-item';
                item.innerHTML = `
                    <strong>${email.subject}</strong>
                    <span>From: ${email.senderEmail}</span>
                `;
                container.appendChild(item);
            });
            if (data.data.length === 0) {
                container.innerHTML = '<p style="color: #718096;">No new emails</p>';
            }
        }
    } catch (err) {
        console.error('Error loading recent emails:', err);
    }
}

function getStatusColor(status) {
    const colors = {
        'new': '#dbeafe',
        'read': '#fef3c7',
        'replied': '#dcfce7'
    };
    return colors[status] || '#f3f4f6';
}

async function deleteEmail(id) {
    if (confirm('Are you sure you want to delete this email?')) {
        try {
            const response = await fetch(`${API_BASE}/emails/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            const data = await response.json();
            if (data.success) {
                alert('Email deleted');
                loadEmails();
                loadRecentEmails();
                loadEmailStats();
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
    }
}

function refreshEmails() {
    loadEmails();
}

// Reply Modal
function openReplyModal(emailId, senderName, senderEmail, subject) {
    const modal = document.getElementById('replyModal');
    const details = document.getElementById('emailDetails');
    details.innerHTML = `
        <p><strong>From:</strong> ${senderName} &lt;${senderEmail}&gt;</p>
        <p><strong>Subject:</strong> ${subject}</p>
    `;
    modal.emailId = emailId;
    modal.classList.add('active');
}

function closeReplyModal() {
    document.getElementById('replyModal').classList.remove('active');
    document.getElementById('replyForm').reset();
}

async function handleReply(e) {
    e.preventDefault();
    const modal = document.getElementById('replyModal');
    const replyMessage = document.getElementById('replyMessage').value;

    try {
        const response = await fetch(`${API_BASE}/emails/${modal.emailId}/reply`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ replyMessage })
        });

        const data = await response.json();
        if (data.success) {
            alert('Reply sent successfully');
            closeReplyModal();
            loadEmails();
            loadRecentEmails();
            loadEmailStats();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// Close modal on outside click
window.onclick = function(e) {
    const modal = document.getElementById('replyModal');
    if (e.target === modal) {
        closeReplyModal();
    }
}
