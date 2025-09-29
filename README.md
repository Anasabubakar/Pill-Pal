# Pill Pal - Medication Reminder App

Pill Pal is a modern, AI-powered web application designed to help users manage their medication schedules, track their adherence, and gain insights into their habits.

## Features

- **Secure Authentication**: Users can sign up and log in securely using their email and password. The system includes email verification for added security.
- **Medication Management**: Easily add, edit, and delete medications. Users can specify dosage, schedules (times per day), and frequency (daily, weekly).
- **Image Uploads**: Users can upload images for each medication for easy visual identification, powered by Firebase Storage.
- **Daily Dashboard**: A clean, intuitive dashboard that displays the user's medication schedule for the current day.
- **Adherence Tracking**: Users can mark their medications as "taken" directly from the dashboard, creating a log of their adherence history.
- **Medication Logs**: A dedicated page to view and export the entire history of medication adherence in CSV format.
- **AI-Powered Insights**: An integrated AI tool (Pill Pal AI) allows users to ask natural language questions about their medication history and receive personalized insights and summaries.
- **Responsive Design**: A fully responsive interface that works seamlessly on both desktop and mobile devices.
- **Light & Dark Mode**: Switch between light and dark themes to suit your preference.

## Tech Stack

This project is built with a modern, robust, and scalable tech stack:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend-as-a-Service (BaaS)**: [Firebase](https://firebase.google.com/)
  - **Authentication**: Firebase Auth
  - **Database**: Firestore (for real-time data persistence)
  - **Storage**: Firebase Storage (for image uploads)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) (for the AI Adherence Tool)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A [Firebase](https://firebase.google.com/) project.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of the project and add your Firebase project configuration. You can get this from your Firebase project settings.

    ```
    # Firebase Config
    NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
    NEXT_PUBLIC_FIREBASE_APP_ID="1:..."
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
