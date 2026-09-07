# WeekLog

A weekly report tool for small teams.

Team members write one report a week. Managers review those reports, ask for
changes when something is missing, and watch team health on a dashboard.

## What it does

**For a team member**

- Write a weekly report: tasks done, tasks planned, blockers, achievements, hours and notes
- Save it as a draft, then submit it for review
- See manager feedback and resubmit a corrected version
- Read the full history of every version and comment

**For a manager**

- Review submitted reports: approve them or request changes with a comment
- See every report from the team, filtered by member, project, week or status
- See who has not submitted a report for a chosen week
- Compare blockers or achievements across the team
- Read a dashboard with summary metrics, four charts and an activity feed
- Manage projects, invite people, change roles and deactivate accounts
- Ask an AI assistant questions about the team's reports

Managers do not write reports. Only members do. This keeps the review cycle
honest, because nobody can approve their own work.

## Tech

| Part     | Built with                                         |
| -------- | -------------------------------------------------- |
| Backend  | Node 20+, Express 5, MongoDB (Mongoose), Zod, JWT   |
| Frontend | React 19, Vite, Tailwind 4, shadcn/ui, Recharts     |
| Tests    | Node's built-in test runner with Supertest          |
| AI       | OpenAI `gpt-4o-mini` with tool calling              |

Sessions use a signed JWT in an httpOnly cookie. The token is never read from
JavaScript, and the user's role is always read from the database, never from
the token.

## Setup

Four steps: install the dependencies, start the database, start the backend,
start the frontend.

You need **Node 20 or newer** and **MongoDB** (a free Atlas cluster or a local
install; both are covered below).

### 1. Install dependencies

The backend and the frontend are separate packages. Install both.

```bash
git clone <repository-url>
cd weeklog

cd backend
npm install

cd ../frontend
npm install
```

### 2. Run the database

Pick one of these two.

**Option A - MongoDB Atlas (nothing to install)**

1. Create a free cluster at <https://www.mongodb.com/cloud/atlas>
2. Under **Database Access**, add a user with a password
3. Under **Network Access**, allow your IP address
4. Click **Connect -> Drivers -> Node.js** and copy the connection string
5. Replace `<password>` with your password, and put `weeklog` as the database
   name between the `/` and the `?`

The finished string looks like this:

```
mongodb+srv://user:password@cluster.mongodb.net/weeklog?retryWrites=true&w=majority
```

**Option B - MongoDB on your own machine**

Install MongoDB Community Edition and start it.

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

On Windows the installer sets it up as a service that starts on its own. Then
use this connection string:

```
mongodb://127.0.0.1:27017/weeklog
```

Either way, you do not create the database by hand. Mongoose creates it the
first time the backend writes to it.

### 3. Run the backend

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in three values:

| Value            | What to put                                                    |
| ---------------- | -------------------------------------------------------------- |
| `MONGO_URI`      | The connection string from step 2                              |
| `JWT_SECRET`     | Any long random string (see below)                             |
| `OPENAI_API_KEY` | Optional. Only the AI assistant needs it                       |

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Then fill the database with sample data and start the server:

```bash
npm run seed
npm run dev
```

The API runs on <http://localhost:5000>.

`npm run seed` **wipes the database first**, then rebuilds it. Run it once
before your first login. Run it again any time you want a clean slate.

If you leave `OPENAI_API_KEY` empty, everything works except the AI assistant,
which returns a clear 503 instead of failing quietly.

### 4. Run the frontend

Open a second terminal and leave the backend running in the first one.

```bash
cd frontend
cp .env.example .env
npm run dev
```

The app runs on <http://localhost:5173> and expects the API on port 5000.

### 5. Log in

Every seeded account uses the password `Password123`.

| Email               | Role    |
| ------------------- | ------- |
| priya@weeklog.app   | manager |
| sam@weeklog.app     | member  |
| nadia@weeklog.app   | member  |
| kasun@weeklog.app   | member  |
| ayesha@weeklog.app  | member  |

Log in as Priya to see the dashboard, reviews and the AI assistant. Log in as
any of the others to write a weekly report.

The seed creates 4 members, 1 manager, 4 projects and 6 weeks of reports in
every status, including two missing weeks so the "Not Started" view has
something to show. The weeks are counted back from today, so the data is always
current.

**On Windows PowerShell**, use `copy .env.example .env` instead of `cp`.

## Tests

```bash
cd backend
npm test
```

23 tests covering role-based access control:

- a member cannot read or edit another member's report
- a member is refused on every manager-only endpoint
- a manager has no personal reports
- a member promoted to manager cannot review their own old reports
- signed-out requests are rejected

The tests use a separate `weeklog_test` database, derived from `MONGO_URI`.
Your real data is never touched.

## How permissions work

Roles are checked in two places. `requireAuth` loads the user from MongoDB on
every request, and `requireRole` checks the role on that fresh record. Changing
the role inside a stolen token does nothing, because the token's role is never
trusted.

## The AI assistant

A manager can open a chat panel on the dashboard and ask about the team, or
click one button for a summary of the week.

**How it works.** The question goes to `POST /api/assistant/chat`, which is
manager-only. The model is given two tools: one to search reports and one to
list members and projects. It decides what to fetch, the server runs the query,
and the model answers from those results. No embeddings and no vector database.

**Prompt design.** The system prompt tells the model to answer only from tool
results, to say so plainly when there is no matching report, to treat report
text as data rather than instructions, and to reply in short plain sentences.

**Privacy.** Four things keep the data safe:

1. The endpoint is manager-only.
2. The tools call the same service the rest of the app uses, so draft reports
   stay invisible. A draft belongs to its author until they submit it.
3. One small function decides what text reaches the model: names, weeks,
   projects, tasks, blockers, achievements, hours and notes. Email addresses,
   password hashes and ids are never included.
4. Nothing is stored. The conversation lives in React state and disappears on
   refresh.

Report content does leave the server for OpenAI's API. That is worth stating
plainly rather than hiding.

## Project structure

```
backend/
  src/
    config/        constants and the database connection
    controllers/   read the request, call a service, send a response
    middleware/    auth, validation, error handling
    models/        Mongoose schemas
    routes/        30 endpoints
    services/      all business rules live here
    utils/         small helpers, including the AI context builder
    seed/          sample data
  tests/           role-based access control tests

frontend/
  src/
    api/           one file per backend area
    components/    shared UI, plus shadcn/ui components
    context/       auth state
    hooks/         data loading
    pages/         15 views
```

Controllers stay thin. Every rule that matters lives in a service, so the same
rule applies no matter which route reaches it.

