# 🦆 DUCKSHOW - Premium Streaming Platform

Welcome to **Duckshow**, the ultimate streaming experience. This project uses a modern **React + Vite** frontend and a **Node.js/Express** backend with **MongoDB**.

## 🚀 Quick Start (Production Mode)

The project is already pre-built. You can start the entire platform with a single command:

```bash
# Start the backend (serves both API and Frontend)
node server.js
```
Then open: **[http://localhost:3000](http://localhost:3000)**

---

## 🛠️ Development Setup

If you want to modify the code and see changes in real-time, follow these steps:

### 1. Environment Variables (`.env`)
Ensure you have a `.env` file in the root directory with the following:
```env
MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
PORT=3000
```

### 2. Start the Backend
```bash
# From the root directory
node server.js
```
The API will run at `http://localhost:3000/api`.

### 3. Start the Frontend (Vite)
Open a **new terminal** window:
```bash
cd client
npm install   # If first time
npm run dev
```
The frontend will run at **[http://localhost:5173](http://localhost:5173)**. 
*Note: Vite is configured to proxy API calls to the backend on port 3000.*

---

## 📧 Email Notifications
This app sends dual login notifications (User & Admin). 
- **Requirement**: Use a **Gmail App Password** (not your regular password).
- **Settings**: Enable 2FA on your Google account, then search for "App Passwords" in Google settings to generate one.

---

## 🧪 Testing Account
You can use the built-in test account for verification:
- **Email**: `tester@test.com`
- **Password**: `password123`

---

## 📂 Project Structure
- `/server.js`: Express server and API routes.
- `/models`: Mongoose database schemas.
- `/client`: React frontend (Vite).
- `/client/src/pages`: UI Pages (Home, Login, Info, etc.).
- `/client/src/components`: Reusable UI elements (Navbar, Footer, Notifications).

Enjoy streaming! 🍿🦆
