# 🚀 GenWeb.AI - AI Website Builder SaaS Platform

An enterprise-grade, full-stack AI SaaS platform built with the MERN stack (MongoDB, Express, React, Node.js) that empowers users to generate, edit, manage, and deploy responsive websites instantly using AI prompts.

---

## 🌟 Overview

GenWeb.AI provides an automated website creation workspace where users can:

* **Generate Web Apps**: Create single-page applications (SPAs) with modern CSS and interactive JS from prompt descriptions.
* **Co-Pilot Editor**: Modify website layouts, content, and styling in real-time with an AI assistant co-pilot.
* **Monaco Editor Integration**: Inspect and tweak the generated HTML/CSS/JS source code directly.
* **Google OAuth Authentication**: Secure login and persistent session state.
* **One-Click Live Deployment**: Deploy generated websites with unique live share links.

---

## 🧩 Architecture

```text
ai-website-generator-project/
├── backend/
│   ├── config/          # Database & subscription configurations
│   ├── controllers/     # Express business logic handlers
│   ├── middlewares/     # JWT authentication & session verification
│   ├── models/          # Mongoose database schemas (User, Website)
│   ├── routes/          # API endpoint route definitions
│   ├── services/        # AI API integration service layer (Groq/LLaMA)
│   ├── utils/           # Helper extraction utilities
│   └── index.js         # Backend server entrypoint
│
└── client/
    ├── src/
    │   ├── components/  # Modular React components (auth, profile)
    │   ├── hooks/       # Custom React hooks (useAuthInit)
    │   ├── pages/       # Application routes (Home, Dashboard, Generate, Editor, LivePreview, Pricing)
    │   ├── services/    # Central API client configuration
    │   ├── store/       # Redux Toolkit state slices
    │   ├── App.jsx      # React Router configuration
    │   └── main.jsx     # Client app bootstrap
    ├── index.html
    └── vite.config.js
```

---

## ⚙️ Quick Start

### 1️⃣ Prerequisites & Clone

```bash
git clone https://github.com/Rishabh-055/ai-website-generator-project.git
cd ai-website-generator-project
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the `backend` directory:

```env
PORT=7000
MONGO_URL=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
SECRET_KEY=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
```

Start backend development server:

```bash
npm run dev
```

### 3️⃣ Frontend Client Setup

```bash
cd ../client
npm install
npm run dev
```

The frontend client will launch at `http://localhost:5173`.

---

## 🔐 Environment Variables Summary

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Backend server port | `7000` |
| `MONGO_URL` | MongoDB Database Connection URI | - |
| `GROQ_API_KEY` | Groq LLaMA 3.3 70B AI API Key | - |
| `SECRET_KEY` | Secret key used for JWT signing | - |
| `FRONTEND_URL` | Cross-Origin resource sharing origin URL | `http://localhost:5173` |

---

## 👨‍💻 Author

**Rishabh** ([@Rishabh-055](https://github.com/Rishabh-055))

---

## 📄 License

This project is licensed under the MIT License.
