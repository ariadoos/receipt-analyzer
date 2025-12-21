# Expense Analyzer [WIP]

An Expense Analyzer web application built with React and Firebase Firestore, featuring real-time data synchronization. The app allows users to track and analyze expenses with instant updates powered by Firestore’s real-time listeners. The motive of this pet project is to learn firestore, accessibility, react performance and possible way of image analysis in web.

## 🔗 Live Demo

- [Expense Analyzer](https://receipt-analyzer-501d3.web.app/)

## 📁 Project Structure

```
├── src / # React Frontend using Vite, TailwindV4, Shadcn, React Hook Form
└── firebase.json # Firebase configuration
```

## 🚀 Tech Stack

- **Frontend:**

  - [React](https://react.dev)
  - [Vite](https://vitejs.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/)
  - [React Hook Form](https://react-hook-form.com/)
  - [Typescript](https://www.typescriptlang.org/)

- **Backend:**

  - [Firestore](https://console.firebase.google.com/)
  - Firebase Emulators for local development

- **CI/CD:**
  - GitHub Actions

## 🧪 Local Development

### Start the Entire Stack

```bash
firebase emulators:start
```

This will:

- Serve the built version of the frontend
- Start local emulators for Firestore, Auth, etc.

### For Hot Module Reload (HMR) in Frontend and Functions

If you want to work on the frontend/functions with HMR enabled:

1. Run the frontend dev server:

```bash
npm run dev
```

2. Access the frontend via the dev server URL instead of the emulator one.

### 🔧 Firebase Configuration

Firebase is configured using environment variables. Since this is a Vite project, all environment variables must be prefixed with `VITE_` and save to local .env for local development.

```ts
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
```

## 🛠 Scripts

### Frontend

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start frontend dev server with HMR |
| `npm run build` | Build the frontend for production  |

## ✅ Deployment

### To deploy your project to Firebase:

Deployment is automated via github action on push to main. OR run the either of the following commands.

```bash
firebase deploy
# OR
npm run deploy
```

**NOTE:** This command will build functions and frontend, you do not need to build them yourself.

## 📦 Requirements

- Node.js v22 (LTS recommended)
- Firebase CLI
- Local .env is mentioned above

