# Smart-Collab: AI-Powered Task Management System

Smart-Collab is a full-stack enterprise task manager that uses **Artificial Intelligence** to automate workflow decisions. Unlike traditional CRUD applications, it features a **Microservice Architecture** where a Node.js backend communicates with a dedicated Python AI service to analyze task descriptions and automatically assign priority levels.

## 🚀 Key Features
* **Microservice Architecture:** Decoupled Node.js and Python services communicating via REST APIs.
* **AI Automation:** Uses NLP (TextBlob) to analyze task sentiment and urgency keywords (e.g., "crash", "critical").
* **Secure Authentication:** JWT-based stateless authentication with bcrypt password hashing.
* **Role-Based Data:** Users can only access and manage their own isolated data.
* **Scalable Backend:** Built with Express.js and MySQL (Relational Data Model).

## 🛠️ Tech Stack
* **Core Backend:** Node.js, Express.js
* **AI Service:** Python, Flask, TextBlob
* **Database:** MySQL
* **Authentication:** JWT (JSON Web Tokens)
* **DevOps:** Git, GitHub Projects (Kanban)

## 🏗️ Architecture
**User** -> [ **Node.js API** ] <--> [ **MySQL Database** ]
                  |
                  v
           [ **Python AI Service** ]

## ⚙️ Installation & Setup

### 1. Backend (Node.js)
```bash
# Clone the repository
git clone [https://github.com/YOUR_USERNAME/smart-collab-backend.git](https://github.com/YOUR_USERNAME/smart-collab-backend.git)

# Install dependencies
npm install

# Setup Environment Variables (.env)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret

# Run Server
node server.js
```

### 2. AI Microservice (Python)
```bash
cd ai_service

# Create Virtual Environment
python -m venv venv
# Windows
.\venv\Scripts\Activate
# Mac/Linux
source venv/bin/activate

# Install Requirements
pip install -r requirements.txt

# Run Service
python app.py
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create a new user account |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/tasks` | Fetch all user-specific tasks |
| `POST` | `/api/tasks` | Create task (Triggers AI Priority Check) |
| `PUT` | `/api/tasks/:id` | Update a task (e.g., change status) |
| `DELETE` | `/api/tasks/:id` | Delete a task permanently |