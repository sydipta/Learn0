# Learn0

**Learn0** is a campus-based peer-to-peer learning platform where students can post topics they want to learn or teach. Interested students can connect, share contact details, and meet in person to complete a learning session.

Currently limited to **IIT (ISM) Dhanbad** — only `@iitism.ac.in` email addresses can sign up. The platform is designed with future cross-campus learning in mind, where students will be able to browse posts from their own campus by default and opt in to connect with students from other campuses.

---

## Features

- **Institutional sign-up** — only `@iitism.ac.in` email addresses are accepted
- **Email OTP verification** — accounts must be verified before logging in
- **Learning & Teaching posts** — create posts tagged as *Want to Learn* or *Can Teach*, with a subject, description, and tags
- **Feed with search and filters** — browse active posts, filter by type, and search by subject, description, or tag
- **Connection requests** — send a request to the post author; they can accept or reject it
- **Session scheduling** — once a connection is accepted, either party can schedule an in-person session
- **Session status** — mark a session as *Completed* or *Did Not Happen*
- **Reviews** — after a session is completed, both participants can leave a 1–5 star rating and comment
- **Notifications** — real-time-style notifications for connection requests, acceptances/rejections, session scheduling, reminders, and completions
- **User profiles** — view lessons taught, lessons learned, accepted connections, and average rating
- **Password reset** — reset via OTP while logged in, or use the forgot-password flow if locked out
- **Settings** — update academic profile (program, branch, year) and change password

---

## Tech Stack

### Client
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| Tailwind CSS v4 | Styling |
| React Router v7 | Client-side routing |
| TanStack React Query | Server state and data fetching |
| Axios | HTTP client |
| Lucide React | Icons |

### Server
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express 5 | Web framework |
| TypeScript | Type safety |
| Prisma | ORM |
| PostgreSQL | Primary database |
| Redis (ioredis) | OTP and session token storage |
| JSON Web Tokens | Authentication |
| bcrypt | Password hashing |
| Zod | Request validation |
| Resend | Transactional email (OTP delivery) |
| Nodemailer | Email utility layer |

---

## Project Structure

```
learn0/
├── client/                        # React frontend
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── api/                   # Axios API functions (auth, posts, connections, etc.)
│   │   ├── assets/                # Images and SVGs
│   │   ├── components/            # Reusable UI components
│   │   │   └── profile/           # Profile-specific components
│   │   ├── pages/                 # Page-level components (Feed, Login, Signup, etc.)
│   │   ├── types/                 # Shared TypeScript interfaces
│   │   ├── App.tsx                # Route definitions
│   │   └── main.tsx               # App entry point
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
└── server/                        # Express backend
    ├── prisma/
    │   ├── schema.prisma          # Database models
    │   └── migrations/            # Prisma migration history
    ├── src/
    │   ├── db/
    │   │   ├── prisma.ts          # Prisma client instance
    │   │   └── redis.ts           # Redis client instance
    │   ├── middlewares/
    │   │   └── auth.middleware.ts # JWT authentication middleware
    │   ├── modules/               # Feature modules (auth, post, connection, etc.)
    │   │   └── <module>/
    │   │       ├── <module>.controller.ts
    │   │       ├── <module>.router.ts
    │   │       ├── <module>.schema.ts
    │   │       └── <module>.service.ts
    │   ├── utils/
    │   │   └── mailer.ts          # Resend email utility
    │   ├── app.ts                 # Express app setup and route mounting
    │   └── server.ts              # Server entry point
    └── package.json
```

---

## How to Run Locally

### Prerequisites

- Node.js v22+ (developed on v22.17.0)
- PostgreSQL running locally
- Redis running locally

### 1. Clone the repository

```bash
git clone https://github.com/sydipta/Learn0.git
cd Learn0
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_connection_string
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=Your Name <you@yourdomain.com>
CLIENT_URL=http://localhost:5173
PORT=3000
```

See [Environment Variables](#environment-variables) for details on each variable.

Run Prisma migrations to set up the database:

```bash
npx prisma migrate dev
```

Start the dev server:

```bash
npm run dev
```

### 3. Set up the client

```bash
cd ../client
npm install
```

Create a `.env.local` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string, e.g. `postgresql://user:password@localhost:5432/learn0` |
| `JWT_SECRET` | Yes | A long random string used to sign JWTs. Generate one with `openssl rand -hex 32` |
| `REDIS_URL` | Yes | Redis connection string, e.g. `redis://localhost:6379` |
| `RESEND_API_KEY` | Yes | API key from [resend.com](https://resend.com) for sending OTP emails |
| `EMAIL_FROM` | Yes | The sender address shown in OTP emails, e.g. `Learn0 <noreply@yourdomain.com>` |
| `CLIENT_URL` | No | Frontend origin for CORS. Defaults to `http://localhost:5173` |
| `PORT` | No | Port for the server to listen on. Defaults to `3000` |

### Client (`client/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | No | Base URL of the backend API. Defaults to `http://localhost:3000/api` |

> **Never commit `.env` or `.env.local` files.** They are already listed in `.gitignore`.

---

## Database Setup

Learn0 uses **PostgreSQL** via Prisma. All schema changes are managed through Prisma migrations.

### Apply existing migrations

```bash
cd server
npx prisma migrate dev
```

### Explore the database (optional)

```bash
npx prisma studio
```

### Making schema changes

1. Edit `server/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name describe_your_change`
3. Commit both the updated `schema.prisma` and the generated migration file

---

## Local Development Tips

### Bypassing the OTP for testing

Sign-up requires a `@iitism.ac.in` email and a working Resend API key to receive the OTP. For local development, you can temporarily hardcode the OTP verification to always pass:

In `server/src/modules/auth/otp.service.ts`, find the `verifyOtp` function and temporarily replace the bcrypt check with:

```ts
// DEV ONLY — remove before committing
const match = code === '123456';
```

You can then use `123456` as the OTP during local testing.

> **Important:** Never commit this change. Add a comment so you remember to revert it.

---

## How to Contribute

Contributions are welcome! Please follow the steps below.

### 1. Fork the repository

Click **Fork** on GitHub and clone your fork:

```bash
git clone https://github.com/your-username/Learn0.git
cd Learn0
```

### 2. Create a branch

Branch off `main` using the naming convention described below:

```bash
git checkout -b feat/your-feature-name
```

### 3. Make your changes

- Follow the existing module structure on the server (`controller → service → router → schema`)
- Keep components focused and reusable on the client
- Validate all inputs using Zod on the server side

### 4. Run lint and build checks

Before opening a PR, make sure both pass without errors:

```bash
# Client
cd client
npm run lint
npm run build

# Server
cd server
npm run build
```

### 5. Open a Pull Request

Push your branch and open a PR against `main`. Fill in the PR description with what you changed and why.

---

## Branch Naming

| Prefix | Use for |
|---|---|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `chore/` | Dependency updates, config, cleanup |
| `docs/` | Documentation only |

**Examples:**
```
feat/cross-campus-posts
fix/otp-cooldown-bug
chore/update-prisma
docs/improve-readme
```

---

## Pull Request Rules

- All PRs must target the `main` branch
- At least **1 review** is required before merging
- PR title must follow the same prefix format as the branch: `feat: add cross-campus toggle`
- The branch must pass `npm run lint` and `npm run build` on both `client/` and `server/` before requesting a review
- Link any related GitHub issue in the PR description
- Do **not** force-push to `main`
- Do **not** commit `.env` files, `dist/` output, or `node_modules/`

---

## License

This project is licensed under the [MIT License](LICENSE).
