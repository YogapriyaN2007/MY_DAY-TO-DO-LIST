# ☁️ MyDay · To-Do List

<p align="center">
  <b>A premium, animated productivity app built with React + Vite + Supabase.</b><br/>
  Manage your daily tasks, schedule events, track wins, and switch themes — all in a beautiful Bento-box UI.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-EE4B96?logo=framer&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Supabase-2E8B57?logo=supabase&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-A7F3D0?style=flat-square" />
</p>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Supabase Setup](#supabase-setup)
  - [Connecting to Supabase](#connecting-to-supabase)
  - [Running Locally](#running-locally)
  - [Production Build](#production-build)
- [App Overview](#-app-overview)
- [Authors](#-authors)
- [License](#-license)

---

## 🌿 About the Project

**MyDay** is a feature-rich, aesthetically elevated to-do list application designed for people who want productivity tools that feel as good as they work. It features a **Bento-box grid layout**, smooth **Framer Motion animations**, a **splash screen**, **theme engine**, **calendar with event reminders**, and a **Memory Lane** to celebrate completed wins.

All data is now persisted to **Supabase** — a powerful backend for real-time data.

---

## ✨ Features

| Feature | Description |
|---|---|
| ➕ **Add Tasks** | Quickly add tasks with category, priority, and due-date |
| ✅ **Complete & Archive** | Completed tasks move to Memory Lane (win log) |
| ✏️ **Edit Tasks** | Inline editing of task text and metadata |
| 🗑️ **Delete Tasks** | Remove tasks with a single click |
| 🔍 **Search & Filter** | Filter by status (All / Active / Completed) and priority |
| 🗓️ **Calendar Widget** | Add scheduled events with reminder offsets |
| 🔔 **Notifications** | Browser push notifications + in-app toast reminders |
| 🏆 **Memory Lane** | Archive panel of all completed tasks |
| 🎨 **Theme Engine** | Multiple built-in color themes with live CSS variable switching |
| 💫 **Splash Screen** | Animated intro screen on load |
| 🎉 **Celebration Toast** | Micro-animation toast when a task is completed |
| 💾 **Supabase Persistence** | Tasks, events, theme, and wins all auto-saved to Supabase |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite 8](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) + Vanilla CSS |
| **Animations** | [Framer Motion 12](https://www.framer.com/motion/) |
| **Backend** | [Supabase](https://supabase.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Utilities** | [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge) |
| **Linting** | ESLint 9 with React Hooks plugin |

---

## 📁 Project Structure

```
todolist/
├── public/
│   ├── favicon.svg          # Custom mint-green cloud favicon
│   └── icons.svg            # App icon assets
│
├── src/
│   ├── components/
│   │   ├── CalendarWidget.jsx     # Calendar UI + event scheduling
│   │   ├── FilterRow.jsx          # Search bar + filter/priority tabs
│   │   ├── Header.jsx             # App title header
│   │   ├── MemoryLane.jsx         # Completed tasks archive panel
│   │   ├── NotificationToast.jsx  # In-app reminder toast overlay
│   │   ├── ParticleExplosion.jsx  # Micro-animation on task complete
│   │   ├── QuickInput.jsx         # Task creation form
│   │   ├── SplashScreen.jsx       # Animated intro splash screen
│   │   ├── TaskCard.jsx           # Individual task card (edit/delete/toggle)
│   │   └── ThemePicker.jsx        # Theme switcher + CUTE_THEMES config
│   │
│   ├── supabaseClient.js          # Supabase client configuration
│   ├── App.jsx              # Root component — state, layout, logic
│   ├── App.css              # Component-level styles
│   ├── index.css            # Global styles, CSS variables, design tokens
│   └── main.jsx             # React app entry point
│
├── index.html               # HTML shell with favicon + meta tags
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint rules
└── LICENSE                  # MIT License
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- **Node.js** `v18.0.0` or higher → [Download here](https://nodejs.org/)
- **npm** `v9+` (comes with Node.js)
- **Git** → [Download here](https://git-scm.com/)

Verify your versions:
```bash
node -v
npm -v
git --version
```

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/YogapriyaN2007/MY_DAY-TO-DO-LIST.git
```

**2. Navigate into the project directory**

```bash
cd MY_DAY-TO-DO-LIST
```

**3. Install all dependencies**

```bash
npm install
```

> This installs React, Vite, Tailwind CSS, Framer Motion, Lucide React, Supabase, and all dev tools automatically.

---

### Supabase Setup

**1. Create a Supabase Account**

Go to [supabase.com](https://supabase.com/) and sign up for a free account.

**2. Create a New Project**

- Click "New project"
- Choose your organization
- Enter a project name (e.g., "myday-todolist")
- Select a database password
- Choose a region closest to you
- Click "Create new project"

**3. Wait for Setup**

Supabase will take a few minutes to set up your project. Once ready, you'll see your project dashboard.

**4. Get Your Project URL and API Key**

In your project dashboard:

- Go to Settings → API
- Copy the "Project URL"
- Copy the "anon public" key (this is safe for client-side use)

---

### Connecting to Supabase

**1. Create Environment Variables**

Create a `.env` file in the root of your project (same level as `package.json`):

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the values from your Supabase project.

**2. Supabase Client Configuration**

The `src/supabaseClient.js` file is already configured to use these environment variables:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

**3. Database Tables**

You'll need to create the following tables in your Supabase database (via the SQL Editor in your dashboard):

- `tasks` table for storing tasks
- `events` table for calendar events
- `themes` table for user theme preferences

Example SQL for tasks table:

```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium',
  category TEXT,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Repeat for `events` and `themes` tables as needed.

---

### Running Locally

Start the development server with hot-reload:

```bash
npm run dev
```

Then open your browser and visit:

```
http://localhost:5173
```

---

### Production Build

To create an optimized production bundle:

```bash
npm run build
```

The output will be in the `dist/` folder. To preview the production build locally:

```bash
npm run preview
```

---

### Linting

Check for code issues with ESLint:

```bash
npm run lint
```

---

## 🖼️ App Overview

The app uses a **12-column Bento grid** layout with three main panels:

| Panel | Contents |
|---|---|
| **Left** | Add Task form + Focus filters (search, status, priority) |
| **Center** | Your active task list with edit/delete/complete actions |
| **Right (Top)** | Memory Lane — completed task win archive |
| **Right (Bottom)** | Calendar Widget — events, dates, reminder scheduling |

The **Theme Picker** sits at the top and lets you switch between multiple curated color palettes. All settings persist across sessions via Supabase.

---

## 👩‍💻 Authors

**Yogapriya N**  
GitHub: [@YogapriyaN2007](https://github.com/YogapriyaN2007)

**Darshan V**  
GitHub: [@DarshanV](https://github.com/DarshanV)  <!-- Replace with actual GitHub if known -->

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for full details.

```
MIT License

Copyright (c) 2026 Yogapriya N and Darshan V

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<p align="center">Made with 💚 and lots of ☁️ vibes</p>
