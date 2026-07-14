# SyncSphere

A full-stack fitness tracking and social platform. Record GPS activities (running, cycling, walking) on a live map, share them to a social feed, follow other athletes, and join clubs.

> ⚠️ **Project status:** work-in-progress / learning project. Several features are partially implemented and there are a number of known bugs (see [Known Issues](#known-issues)). This README documents the app as it is intended to work.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Known Issues](#known-issues)
- [Roadmap](#roadmap)

---

## Features

- **Authentication** — email/password signup & login with JWT stored in an httpOnly cookie.
- **Activity tracking** — live GPS tracking using the browser Geolocation API, drawn on a Leaflet/OpenStreetMap map with a start/pause/resume/finish workflow, a timer, and distance calculation (Haversine).
- **Social feed** — posts (activities) from athletes you follow, with likes ("Kudos") and comments.
- **Follow system** — follow/unfollow athletes and get suggested users.
- **Clubs** — search, create, join, leave, and invite users to clubs.
- **Notifications** — in-app notifications for new followers, kudos, comments, and club invites.
- **Profiles** — user profiles with follower/following counts and stats.
- **Image uploads** — profile and club images via Cloudinary.

---

## Tech Stack

**Frontend**
- React 18 + Vite
- React Router v6
- TanStack Query (React Query) for server state
- Leaflet for maps
- Tailwind CSS (+ some hand-written CSS)
- react-hot-toast, lucide-react / react-icons

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) + `bcryptjs` for auth
- Cloudinary for media storage
- `cookie-parser`

---

## Architecture

```
Browser (React SPA, Vite dev server :3000)
        │   /api/*  (proxied in dev → :5000)
        ▼
Express API (:5000)
        │
        ▼
MongoDB (Mongoose)      Cloudinary (images)
```

In development the Vite dev server proxies all `/api` requests to the Express server (see `frontend/vite.config.js`). In production the Express server serves the built frontend from `frontend/dist` and handles the API under `/api`.

---

## Project Structure

```
SyncSphere/
├── backend/
│   ├── controllers/        # Route handlers (auth, user, post, club, notification)
│   ├── db/                 # MongoDB connection
│   ├── lib/utils/          # JWT token helper
│   ├── middleware/         # protectRoute (auth guard)
│   ├── models/             # Mongoose schemas (user, post, club, notification)
│   ├── routes/             # Express routers
│   └── server.js           # App entry point
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (+ common/)
│   │   ├── hooks/           # useFollow, useGeoLocation, storeCoordinates
│   │   ├── pages/           # auth, home, clubs, activity, userprofile
│   │   ├── img/             # image assets
│   │   ├── App.jsx          # routes
│   │   └── main.jsx         # React entry
│   └── vite.config.js
├── package.json            # backend + root scripts
└── README.md
```

---

## Prerequisites

- **Node.js** 18+ and npm
- A **MongoDB** database (local or MongoDB Atlas)
- A **Cloudinary** account (for image uploads)

---

## Environment Variables

Create a `.env` file in the project root (it is gitignored). The backend reads:

| Variable                 | Description                                        |
| ------------------------ | -------------------------------------------------- |
| `MONGO_URI`              | MongoDB connection string                          |
| `PORT`                   | Backend port (defaults to `5000`)                  |
| `JWT_SECRET`             | Secret used to sign JWTs                            |
| `NODE_ENV`               | `development` or `production`                       |
| `CLOUDINARY_CLOUD_NAME`  | Cloudinary cloud name                              |
| `CLOUDINARY_API_KEY`     | Cloudinary API key                                 |
| `CLOUDINARY_API_SECRET`  | Cloudinary API secret                              |
| `GOOGLE_CLIENT_ID`       | (reserved for planned Google OAuth)                |
| `GOOGLE_CLIENT_SECRET`   | (reserved for planned Google OAuth)                |

Example `.env`:

```env
MONGO_URI=mongodb://localhost:27017/syncsphere
PORT=5000
JWT_SECRET=replace-with-a-long-random-string
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

> Activity **route snapshots** are generated on the client directly from
> OpenStreetMap tiles — no map API key or token is required.

---

## Getting Started

```bash
# 1. Clone
git clone <repo-url>
cd SyncSphere

# 2. Install backend (root) dependencies
npm install

# 3. Install frontend dependencies
npm install --prefix frontend

# 4. Create your .env (see above)

# 5. Run the backend (terminal 1)  → http://localhost:5000
npm run dev

# 6. Run the frontend (terminal 2) → http://localhost:3000
npm run dev --prefix frontend
```

Open **http://localhost:3000**. API calls to `/api/*` are proxied to the backend automatically.

### Production build

```bash
npm run build     # installs deps and builds the frontend into frontend/dist
npm start         # serves the API + built frontend from Express
```

---

## Available Scripts

**Root (`package.json`)**

| Script          | Description                                          |
| --------------- | ---------------------------------------------------- |
| `npm run dev`   | Start the backend with nodemon (`NODE_ENV=development`) |
| `npm start`     | Start the backend in production mode                 |
| `npm run build` | Install all deps and build the frontend              |

**Frontend (`frontend/package.json`)**

| Script            | Description                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start the Vite dev server (:3000) |
| `npm run build`   | Build for production            |
| `npm run preview` | Preview the production build    |
| `npm run lint`    | Run ESLint                      |

---

## API Reference

All routes are prefixed with `/api`. Routes marked 🔒 require authentication (a valid `jwt` cookie).

### Auth — `/api/auth`
| Method | Path       | Description                    |
| ------ | ---------- | ------------------------------ |
| POST   | `/signup`  | Create an account             |
| POST   | `/login`   | Log in                        |
| POST   | `/logout`  | Log out (clears cookie)       |
| GET    | `/me` 🔒   | Get the current user          |

### Users — `/api/user`
| Method | Path            | Description               |
| ------ | --------------- | ------------------------- |
| GET    | `/profile/:id` 🔒 | Get a user profile      |
| GET    | `/suggested` 🔒 | Suggested users to follow |
| POST   | `/follow/:id` 🔒 | Follow / unfollow a user  |
| POST   | `/update` 🔒    | Update the current user   |

### Posts / Activities — `/api/post`
| Method | Path             | Description                       |
| ------ | ---------------- | --------------------------------- |
| GET    | `/following` 🔒  | Feed of followed users' posts     |
| GET    | `/myactivities` 🔒 | Current user's posts            |
| GET    | `/user/:username` 🔒 | A user's posts                |
| POST   | `/create` 🔒     | Create a post                     |
| POST   | `/like/:id` 🔒   | Like / unlike a post              |
| POST   | `/comment/:id` 🔒 | Comment on a post                |
| DELETE | `/:id` 🔒        | Delete a post                     |

### Clubs — `/api/clubs`
| Method | Path                     | Description             |
| ------ | ------------------------ | ----------------------- |
| GET    | `/` 🔒                   | Search clubs (query params) |
| GET    | `/:id` 🔒                | Get a club              |
| GET    | `/myclubs/:id` 🔒        | Clubs a user belongs to |
| POST   | `/new` 🔒                | Create a club           |
| POST   | `/join/:id` 🔒           | Join a club             |
| POST   | `/leave/:id` 🔒          | Leave a club            |
| POST   | `/invite/:userId/:clubId` 🔒 | Invite a user       |
| POST   | `/edit/:id` 🔒           | Edit a club             |
| DELETE | `/:id` 🔒                | Delete a club           |

### Notifications — `/api/notifications`
| Method | Path   | Description                          |
| ------ | ------ | ------------------------------------ |
| GET    | `/` 🔒 | Get notifications (marks them read)  |

---

## Data Models

- **User** — `firstname`, `lastname`, `email` (unique), `password` (hashed), `gender`, `bio`, `weight`, `profileImg`, `followers[]`, `following[]`, `activities[]`, `clubs[]`
- **Post** — `user`, `title`, `text`, `img`, `route`, `sport` (Cycling/Running/Walking), `time`, `distance`, `likes[]`, `comments[]`
- **Club** — `name`, `location`, `website`, `sport`, `club_type`, `description`, `logo`, `coverImg`, `members[]`, `admins[]`, `club_posts[]`, `vanity_url`, `invion`
- **Notification** — `to`, `icon`, `title`, `text`, `actionable_link`, `display_date`, `category` (follow/kudos/comment/club_invite), `read`

---

## Known Issues

This is an active learning project and has known bugs across the stack (creating posts, image uploads, and some route handlers do not currently work end-to-end). See the project's issue notes for a detailed list. Notable areas:

- Cloudinary is not configured on the server, so image uploads fail.
- `POST /api/post/create` cannot satisfy the Post model's required fields, so post creation fails.
- Several post/notification handlers read the wrong request param or an undefined user object.
- The frontend styling is being reworked for a cleaner, more consistent look.

---

## Roadmap

- [ ] Fix backend post/notification/activity bugs
- [ ] Wire up the activity "Save" form to actually create a post
- [ ] Google OAuth login
- [ ] Automated test suite (backend + frontend)
- [ ] Frontend UI/UX overhaul
- [ ] Real notifications UI
- [ ] Club detail & event functionality

---

*Built as a personal project to explore the MERN stack, geolocation, and map rendering.*
