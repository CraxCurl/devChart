<div align="center">
  <br />
  <h1>🚀 devChart</h1>
  <br />
  <p><strong>Your Collaborative Task Manager</strong></p>
  <p>An easy tool for managing your tasks and collaborating with your team. Built for speed, designed for clarity.</p>

  <p align="center">
    <a href="https://dev-chart-five.vercel.app/" target="_blank">
      <img src="https://img.shields.io/badge/LIVE_DEMO-dev--chart--five.vercel.app-white?style=for-the-badge&logo=vercel" alt="Live Demo" />
    </a>
    <img src="https://img.shields.io/badge/NEXT.JS-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/REACT-19-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/MONGODB-ATLAS-green?style=for-the-badge&logo=mongodb" alt="MongoDB" />
    <img src="https://img.shields.io/badge/TAILWIND-CSS-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  </p>
</div>

<br />
<hr />
<br />

## What is devChart?

devChart is a full-stack, Next.js-powered task management platform specifically designed for student clubs and early-career teams. A user securely signs up (via password or passwordless OTP) and instantly gains access to a synchronized, highly aesthetic workspace.

- **Command Center:** View active, in-progress, and completed tasks at a glance with live metrics and recent activity feeds.
- **Interactive Kanban Board:** A highly responsive task board with smooth, dynamic interactions and categorization.
- **Progressive Web App (PWA):** Installable natively on iOS, Android, and Desktop environments for lightning-fast, native-app access.

## Features

- **Modern Authentication:** Secure JWT-based password logins and email-based passwordless OTP.
- **Real-time Metrics:** Dynamic stat cards keeping track of your club's entire productivity pipeline.
- **Soft Deletes & Activity Logs:** Never lose track of who deleted what with built-in trash bins and activity feeds.
- **Extreme UI/UX:** Dark mode by default, glassmorphism, micro-animations, scalable SVG icons, and custom typography for a truly premium feel.

## Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/devchart.git
cd devchart
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
RESEND_API_KEY=your_resend_api_key_for_otp
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
