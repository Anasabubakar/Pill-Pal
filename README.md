# Pill Pal - Medication Reminder App

Pill Pal is a modern, AI-powered web application designed to help users manage their medication schedules, track their adherence, and gain insights into their habits. It features a clean, responsive interface that works seamlessly on any device, complete with both light and dark modes.

## Features

- **Onboarding Experience**: A welcoming onboarding page for first-time users that introduces the app's core features.
- **Secure Authentication**: Users can sign up and log in securely using their email and password. The system includes robust email verification and a password reset flow.
- **Medication Management**: Easily add, edit, and deactivate medications. Users can specify dosage, schedules (times per day), and frequency (e.g., daily).
- **Daily Dashboard**: A clean, intuitive dashboard that displays the user's medication schedule for the current day.
- **Adherence Tracking**: Users can mark their medications as "taken" directly from the dashboard, creating a log of their adherence history.
- **Medication Logs**: A dedicated page to view the entire history of medication adherence. This data can be exported to a CSV file for personal records or to share with a healthcare provider.
- **AI-Powered Insights**: An integrated AI tool (Pill Pal AI) allows users to ask natural language questions about their medication history and receive personalized insights and summaries in a conversational chat interface.
- **Responsive Design**: A fully responsive interface that works seamlessly on both desktop and mobile devices.
- **Light & Dark Mode**: Automatically adapts to the user's system theme and allows for manual switching.

## Tech Stack

This project is built with a modern, robust, and scalable tech stack:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend-as-a-Service (BaaS)**: [Firebase](https://firebase.google.com/)
  - **Authentication**: Firebase Auth (Email/Password)
  - **Database**: Firestore (for real-time data persistence)
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
    # No environment variables are needed for local development.
    # The configuration is handled in src/lib/firebase.ts
    ```
    
    > **Note**: For a production deployment, it is recommended to move the Firebase configuration from the source code into environment variables for better security and flexibility.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
