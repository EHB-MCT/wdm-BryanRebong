# KaraoKey – Interactive Web Karaoke Platform

KaraoKey is a full-stack web application that allows users to experience an interactive karaoke booth directly in the browser. Users can select a genre, browse songs through an arcade-style carousel, sing along to music videos, complete challenges, and see their performance reflected in leaderboards and analytics dashboards.

The project focuses on **user interaction, session tracking, analytics, and admin controls**, and is fully containerized using Docker.

---

# Technologies Used

## Frontend

- **Vue 3** – Reactive frontend framework
- **Vite** – Fast development and build tool
- **Vue Router** – Client-side routing
- **Chart.js** – Data visualization for analytics charts
- **LocalStorage API** – Client-side persistence
- **CSS / Flexbox / Grid** – Layout and responsive design

## Backend

- **Node.js**
- **Express.js**
- **PostgreSQL** – Relational database
- **pg** – PostgreSQL client
- **UUID** – Unique user identifier generation

## DevOps

- **Docker** – Application containerization
- **Docker Compose** – Multi-container orchestration

---

# Features

## User Features

- **Username Creation**
  - Users enter a username before starting a session
  - Each user is assigned a unique identifier

- **Genre Selection**
  - Multiple music genres available
  - Genre selections are tracked for analytics

- **Song Carousel**
  - Arcade-style infinite carousel
  - Album artwork with song and artist information
  - Visual emphasis on the selected song

- **Now Playing Experience**
  - Countdown before playback
  - Audio and music video start simultaneously
  - Fullscreen video background
  - Live microphone input detection

- **Challenges System**
  - Random challenges appear during songs
  - Completed challenges contribute to the session score

- **Session Tracking**
  - Session duration is recorded
  - Total score calculated per session

- **Leaderboards**
  - Longest sessions
  - Highest total score
  - Most challenges completed
  - Data persists across multiple users

---

## Admin Features

- **Admin Login**
  - Password-protected admin access
  - Password stored securely using environment variables

- **Admin Dashboard**
  - Access to analytics charts
  - Structured admin navigation
  - Logout functionality with route protection

- **Analytics & Charts**
  - Most played songs
  - Most played genres
  - Total session minutes by hour of day
  - Charts update dynamically based on user activity

---

## Technical Features

- **Global Theming**
  - Unified blue gradient background across all pages
  - Consistent button styling throughout the application

- **State Management**
  - Centralized composables for session, username, and analytics
  - Single source of truth for scoring and challenge completion

- **Persistent Data**
  - Leaderboards and analytics stored in LocalStorage
  - Database-backed user persistence using PostgreSQL

- **Responsive UI**
  - Optimized for desktop usage
  - Flexible layouts using modern CSS

# Sources

The following sources were consulted during the development of the KaraoKey project.  
They were used for **documentation reference, best practices, and implementation guidance**.

---

## Docker & Containerization

https://docs.docker.com/

- `docker-compose.yml`
  - Multi-container setup for frontend, backend, and database
  - Service orchestration and port mapping

- `karaoke-frontend/Dockerfile`
  - Frontend container configuration
  - Node image selection and build steps

- `karaoke-api/Dockerfile`
  - Backend container setup
  - Environment configuration for Express API

---

## Backend – Node.js & Express

https://nodejs.org/en/docs  
https://expressjs.com/

- `karaoke-api/src/index.js`
  - Express server setup
  - Middleware configuration
  - API route registration

- `karaoke-api/src/routes/`
  - REST endpoints for user creation and session handling

- `karaoke-api/src/db/`
  - Database connection logic
  - PostgreSQL client usage

---

## Database – PostgreSQL

https://www.postgresql.org/docs/  
https://node-postgres.com/

- PostgreSQL schema design
- UUID generation for users
- SQL queries for inserting and retrieving users and sessions

Referenced in:
- `karaoke-api/src/index.js`
- Database initialization scripts

---

## Frontend – Vue 3 & Vite

https://vuejs.org/guide/introduction.html  
https://vitejs.dev/guide/

- Vue Composition API
- Reactive state management using `ref` and `computed`
- Component-based architecture

Used in:
- `karaoke-frontend/src/pages/*.vue`
- `karaoke-frontend/src/components/*.vue`
- `karaoke-frontend/src/composables/*.js`

---

## Vue Router

https://router.vuejs.org/

- Client-side routing
- Route parameters for genre and song selection
- Navigation guards for admin pages

Used in:
- `karaoke-frontend/src/router/index.js`

---

## Chart.js – Data Visualization

https://www.chartjs.org/docs/latest/

- Bar charts for analytics dashboards
- Dataset configuration and styling
- Axis and tooltip customization

Used in:
- Admin analytics / charts pages
- Visualization of:
  - Most played songs
  - Most played genres
  - Total session minutes by hour

---

## Browser APIs

### LocalStorage

https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

- Persistent storage for:
  - Leaderboards
  - Analytics data
  - Session history
  - Username persistence

Used in:
- `karaoke-frontend/src/composables/useSession.js`
- `karaoke-frontend/src/composables/useUsername.js`
- Analytics tracking utilities

---

### Media & Audio APIs

https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement  
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video

- Audio playback control
- Video background playback
- Synchronization of audio and video after countdown

Used in:
- `karaoke-frontend/src/pages/NowPlaying.vue`

---

## Environment Variables

https://vitejs.dev/guide/env-and-mode.html

- Secure handling of admin password
- Usage of `import.meta.env`

Used in:
- `AdminLogin.vue`
- `.env` configuration file

---

## AI Assistance

### ChatGPT

https://chatgpt.com/share/69595a48-328c-800f-aa49-1c3da601fc11

- Debugging assistance
- Architectural guidance
- Refactoring suggestions
- Feature ideation and problem solving

Used across:
- Frontend
- Backend
- Docker configuration
- Documentation

---

### OpenCode

See file "OPENCODEPROMPTS.md"

- Prompt-based feature implementation
- Iterative UI and logic refinement
- Rapid prototyping and debugging

Used for:
- Carousel system
- Leaderboards
- Analytics charts
- Styling consistency
- Bug fixing

Documentation:
- AI-assisted development prompts logged separately

---

# Author

Bryan Rebong - 3BaMCT – 2025–2026
