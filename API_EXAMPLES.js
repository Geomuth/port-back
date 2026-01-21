// Example API Usage for TechGeo Backend

// ==========================================
// 1. AUTHENTICATION
// ==========================================

// Register Admin
async function registerAdmin() {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'admin1',
      email: 'admin@techgeo.com',
      password: 'securepassword123'
    })
  });
  const data = await response.json();
  console.log(data); // { success: true, token: "...", admin: {...} }
  localStorage.setItem('authToken', data.token);
}

// Login Admin
async function loginAdmin() {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'admin1',
      password: 'securepassword123'
    })
  });
  const data = await response.json();
  console.log(data);
  localStorage.setItem('authToken', data.token);
}

// ==========================================
// 2. SUBSCRIBER ENDPOINTS
// ==========================================

// Get All Subscribers (Requires Auth)
async function getAllSubscribers() {
  const token = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:5000/api/subscribers', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log(data.data); // Array of subscribers
}

// Add New Subscriber (Public - No Auth Needed)
async function addSubscriber(email, name = 'Subscriber') {
  const response = await fetch('http://localhost:5000/api/subscribers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name })
  });
  const data = await response.json();
  console.log(data);
  return data.success;
}

// Get Subscriber Statistics (Requires Auth)
async function getSubscriberStats() {
  const token = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:5000/api/subscribers/stats/overview', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log(data.data); // { total: 10, active: 9, newThisMonth: 3 }
}

// Delete Subscriber (Requires Auth)
async function deleteSubscriber(subscriberId) {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`http://localhost:5000/api/subscribers/${subscriberId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log(data);
}

// ==========================================
// 3. EMAIL ENDPOINTS
// ==========================================

// Get All Emails (Requires Auth)
async function getAllEmails() {
  const token = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:5000/api/emails', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log(data.data); // Array of emails
}

// Get Only New Emails (Requires Auth)
async function getNewEmails() {
  const token = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:5000/api/emails/new/list', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log(data.data); // Array of new emails only
}

// Submit New Email (Public - No Auth Needed)
async function submitContactEmail(senderName, senderEmail, subject, message) {
  const response = await fetch('http://localhost:5000/api/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      senderName,
      senderEmail,
      subject,
      message
    })
  });
  const data = await response.json();
  console.log(data);
  return data.success;
}

// Mark Email as Read (Requires Auth)
async function markEmailAsRead(emailId) {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`http://localhost:5000/api/emails/${emailId}/read`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log(data);
}

// Reply to Email (Requires Auth)
async function replyToEmail(emailId, replyMessage) {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`http://localhost:5000/api/emails/${emailId}/reply`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ replyMessage })
  });
  const data = await response.json();
  console.log(data);
}

// Get Email Statistics (Requires Auth)
async function getEmailStats() {
  const token = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:5000/api/emails/stats/overview', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log(data.data); // { total: 15, new: 3, replied: 12 }
}

// Delete Email (Requires Auth)
async function deleteEmail(emailId) {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`http://localhost:5000/api/emails/${emailId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log(data);
}

// ==========================================
// 4. REAL-WORLD EXAMPLES
// ==========================================

// Example: Newsletter Subscribe Form
document.getElementById('newsletterForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const success = await addSubscriber(email);
  if (success) {
    alert('Successfully subscribed!');
    e.target.reset();
  }
});

// Example: Contact Form
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const success = await submitContactEmail(
    formData.get('name'),
    formData.get('email'),
    formData.get('subject'),
    formData.get('message')
  );
  if (success) {
    alert('Message sent! We will get back to you soon.');
    e.target.reset();
  }
});

// Example: Admin Dashboard - Load all data
async function loadAdminDashboard() {
  const subscribers = await getAllSubscribers();
  const emails = await getAllEmails();
  const emailStats = await getEmailStats();
  const subscriberStats = await getSubscriberStats();
  
  console.log('Dashboard Data:', {
    subscribers,
    emails,
    emailStats,
    subscriberStats
  });
}

// Example: Auto-refresh admin data every 30 seconds
setInterval(async () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    await loadAdminDashboard();
  }
}, 30000);

// ==========================================
// 5. ERROR HANDLING
// ==========================================

// Enhanced version with error handling
async function submitContactEmailSafe(senderName, senderEmail, subject, message) {
  try {
    if (!senderEmail || !message) {
      throw new Error('Email and message are required');
    }

    const response = await fetch('http://localhost:5000/api/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderName: senderName || 'Anonymous',
        senderEmail,
        subject: subject || 'No Subject',
        message
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error');
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Usage with error handling
async function testFormSubmission() {
  const result = await submitContactEmailSafe(
    'John Doe',
    'john@example.com',
    'Service Inquiry',
    'I am interested in your services'
  );

  if (result.success) {
    console.log('Email sent:', result.data);
  } else {
    console.error('Failed to send email:', result.error);
  }
}
