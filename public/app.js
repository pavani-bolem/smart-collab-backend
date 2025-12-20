const API_URL = '/api';

// DOM Elements
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const dashboardSection = document.getElementById('dashboardSection');
const updateSection = document.getElementById('updateSection'); // New Section
const logoutBtn = document.getElementById('logoutBtn');
const taskList = document.getElementById('taskList');

// --- 1. TOKEN MANAGEMENT (The Security Part) ---

function getToken() {
    return localStorage.getItem('token');
}

function saveToken(token) {
    localStorage.setItem('token', token);
}

function removeToken() {
    localStorage.removeItem('token');
}

// --- 2. NAVIGATION (Hiding/Showing Pages) ---

function showPage(pageName) {
    // Hide everything first
    loginSection.classList.add('hidden');
    registerSection.classList.add('hidden');
    dashboardSection.classList.add('hidden');
    updateSection.classList.add('hidden');
    logoutBtn.style.display = 'none';

    // Show only what is requested
    if (pageName === 'login') {
        loginSection.classList.remove('hidden');
    } else if (pageName === 'register') {
        registerSection.classList.remove('hidden');
    } else if (pageName === 'dashboard') {
        dashboardSection.classList.remove('hidden');
        logoutBtn.style.display = 'block';
        loadTasks(); // Fetch data immediately
    } else if (pageName === 'update') {
        updateSection.classList.remove('hidden');
        logoutBtn.style.display = 'block';
    }
}

// Check if user is already logged in when page loads
function init() {
    const token = getToken();
    if (token) {
        showPage('dashboard');
    } else {
        showPage('login');
    }
}

// --- 3. API ACTIONS ---

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
            saveToken(data.token); 
            showPage('dashboard'); 
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert('Login failed');
    }
});

// Register
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 1. Get the Name (Username) value
    const username = document.getElementById('regName').value; // <--- Add this line
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // 2. Send 'username' in the body
            body: JSON.stringify({ username, email, password }) // <--- Add username here
        });
        
        if (res.ok) {
            alert('Registration successful! Please login.');
            showPage('login');
        } else {
            const data = await res.json();
            alert(data.message);
        }
    } catch (err) {
        alert('Registration failed');
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    removeToken();
    showPage('login');
});

// Toggle Links
document.getElementById('showRegister').addEventListener('click', () => showPage('register'));
document.getElementById('showLogin').addEventListener('click', () => showPage('login'));

// --- 4. TASK MANAGEMENT (Dashboard Logic) ---

async function loadTasks() {
    const token = getToken();
    const res = await fetch(`${API_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasks = await res.json();

    taskList.innerHTML = ''; 
    tasks.forEach(task => {
        const li = document.createElement('li');
        
        // Color Badge Logic
        let badgeClass = 'badge-medium';
        if(task.priority === 'high') badgeClass = 'badge-high';
        if(task.priority === 'low') badgeClass = 'badge-low';

        // FIX: Added '${task.description || ''}' to the onclick below
        li.innerHTML = `
            <div>
                <strong>${task.title}</strong> <span class="badge ${badgeClass}">${task.priority}</span><br>
                <small>${task.description || ''}</small>
                <br>
                <small style="color: #666;">Status: <b>${task.status}</b></small>
            </div>
            <div style="display:flex; align-items:center; gap: 5px;">
                <button class="edit-btn" onclick="editTask(${task.id}, '${task.title}', '${task.status}', '${task.description || ''}')">✏️</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">X</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// Create Task
document.getElementById('createTaskBtn').addEventListener('click', async () => {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDesc').value;
    const token = getToken();

    if(!title) return alert("Title is required");

    const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
    });

    if(res.ok) {
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDesc').value = '';
        loadTasks(); // Refresh list to see new task
    }
});

// Delete Task 
window.deleteTask = async (id) => {
    if(!confirm('Delete this task?')) return;
    const token = getToken();
    await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    loadTasks();
};

// --- 5. UPDATE TASK LOGIC ---

// Open the Update Page (Called by the Pencil Button)
window.editTask = (id, title, status, description) => {
    // 1. Fill the form with existing data
    document.getElementById('updateTaskId').value = id;
    document.getElementById('updateTitle').value = title;
    document.getElementById('updateDesc').value = description || ''; 
    document.getElementById('updateStatus').value = status;

    // 2. Switch to the Update Page
    showPage('update');
};

// Handle Update Form Submission
document.getElementById('updateForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('updateTaskId').value;
    const title = document.getElementById('updateTitle').value;
    const description = document.getElementById('updateDesc').value;
    const status = document.getElementById('updateStatus').value;
    const token = getToken();

    try {
        const res = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ title, description, status })
        });

        if (res.ok) {
            alert("Task Updated Successfully!");
            showPage('dashboard'); // Go back to list
        } else {
            const data = await res.json();
            alert(data.message || "Update failed");
        }
    } catch (err) {
        alert("Error updating task");
    }
});

// Cancel Button Logic
document.getElementById('cancelUpdate').addEventListener('click', () => {
    showPage('dashboard');
});

// Start App
init();