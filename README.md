# 🔍 GenUI - AI-Powered UI Design Platform

**GenUI** is a full-stack AI-powered web platform that enables users to design, build, and preview user interfaces (UIs) visually and programmatically. It focuses on enhancing the learning and productivity experience for developers—especially beginners—by integrating an interactive code editor, real-time preview, Firebase authentication, and Mistral AI integration for auto-generating educational content and code.

## ✨ Key Features

- **User Authentication:** Login/Signup via Firebase (Email/Google/GitHub)
- **Dashboard:** Users can create, manage, and delete their UI projects
- **Live Code Editor:**
  - Supports HTML, CSS, JS (more extensible)
  - Code preview using `<iframe>`
  - Save, Reset, Copy options
- **AI Integration (via Mistral):**
  - Generate learning chapters based on project descriptions
  - Generate UI code using a custom prompt
- **Real-time Preview Panel:** Shows the rendered HTML/CSS/JS result

## 📁 Project Structure

```
genUI/
├── backend/                    # Express.js server with AI routes
│   ├── server.js              # Main backend server with Mistral AI logic
│   ├── .env                   # Mistral API key and other env variables
│   └── package.json           # Backend dependencies
│
├── frontend/                   # React frontend
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── CodeEditor.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── Navbar.js
│   │   │   └── ProjectSettings.js
│   │   │
│   │   ├── context/           # Firebase Auth Context
│   │   │   └── AuthContext.js
│   │   │
│   │   ├── pages/             # Route-based components
│   │   │   ├── DashboardPage.js
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── ProjectPage.js
│   │   │   └── SignupPage.js
│   │   │
│   │   ├── firebase.js        # Firebase config using environment variables
│   │   ├── App.js             # App routing and providers
│   │   ├── index.css          # Tailwind + custom CSS
│   │   └── index.js           # React entry point
│   │
│   ├── .env                   #  prefixed Firebase env keys
│   ├── package.json           # React + Tailwind + Firebase setup
│   └── tailwind.config.js
│
├── README.md                   # This file
└── .gitignore
```

## ⚙️ Tech Stack

- **Frontend:** React, TailwindCSS, React Router, Lucide Icons, Hot Toast, Firebase
- **Backend:** Node.js, Express, Axios
- **AI Service:** Mistral AI (via REST API)
- **Database & Auth:** Firebase Firestore, Auth
- **Bundler:** React Scripts (CRA)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup
- Mistral AI API key

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd genUI
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MISTRAL_API_KEY=your_mistral_api_key_here
PORT=5000
```

Start the backend server:

```bash
node server.js
```

The backend will run on `http://localhost:5000`

#### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory with your Firebase configuration:

```env
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

Start the frontend development server:

```bash
npm run dev
# or
npm start
```

The frontend will run on `http://localhost:3000`

## 🧪 Test Credentials

For testing purposes, you can use the following credentials:

**Email:** `testuser@gmail.com`  
**Password:** `TESTUSER`

> **Note:** Make sure this test user is created in your Firebase Authentication console, or create a new account using the signup functionality.

## 🔧 Environment Variables

### Backend (.env)

```env
MISTRAL_API_KEY=your_mistral_api_key_here
PORT=5000
```

### Frontend (.env)

```env
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

## 📖 Usage

1. **Authentication:** Sign up or log in using email/password, Google, or GitHub
2. **Dashboard:** View and manage your UI projects
3. **Create Project:** Start a new UI project with HTML, CSS, and JavaScript
4. **Code Editor:** Write code with syntax highlighting and live preview
5. **AI Features:** 
   - Generate learning content based on your project
   - Get AI-generated code suggestions
6. **Preview:** See your UI in real-time as you code
7. **Save & Export:** Save your projects and copy code for external use

## 🤖 AI Integration

GenUI integrates with Mistral AI to provide:

- **Learning Chapter Generation:** AI creates educational content based on your project description
- **Code Generation:** AI generates HTML, CSS, and JavaScript code based on prompts
- **Smart Suggestions:** Context-aware code recommendations

## 🔒 Authentication Methods

- **Email/Password:** Traditional signup and login
- **Google OAuth:** Sign in with Google account
- **GitHub OAuth:** Sign in with GitHub account

## 📱 Responsive Design

GenUI is built with TailwindCSS and is fully responsive, providing an optimal experience across:

- Desktop computers
- Tablets
- Mobile devices

## 🛠️ Development

### Available Scripts

#### Frontend

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

#### Backend

- `node server.js` - Start the Express server
- `npm run dev` - Start with nodemon (if configured)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Configuration:** Ensure all environment variables are correctly set
2. **CORS Issues:** Make sure the backend server is running and accessible
3. **AI Integration:** Verify your Mistral API key is valid and has sufficient credits
4. **Build Errors:** Clear node_modules and reinstall dependencies

### Support

For issues and questions:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy the `build` folder to your preferred hosting service
3. Set environment variables in your hosting platform

### Backend Deployment (Heroku/Railway)

1. Set up your deployment platform
2. Configure environment variables
3. Deploy the backend directory

---

**Happy Coding! 🎉**
