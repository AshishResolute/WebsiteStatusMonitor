# 🌐 Website Status Monitor

A backend service that continuously monitors website availability and notifies users via email when their sites go down or come back online.

---

## 🚀 Features

- **Automated Monitoring** — Checks all registered URLs every 59 minutes using a cron job
- **Smart Alerting** — Sends email notifications only on status *changes* (Up → Down or Down → Up), preventing spam
- **PDF Reports** — Generates and downloads a PDF of the last 10 status logs for a user
- **JWT Authentication** — Secure token-based auth with 15-minute expiry
- **Per-User URL Management** — Users can add, view, and delete URLs to monitor

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL (via `pg` Pool) |
| Auth | JWT + bcrypt |
| HTTP Checks | Axios (HEAD requests) |
| Scheduler | node-cron |
| Email | Nodemailer + MailTrap SMTP |
| PDF Generation | pdf-lib |

---

## 📁 Project Structure

```
├── server.js          # Entry point
├── main.js            # Express app, routes, error handler
├── auth.js            # Sign-up, login, password update routes
├── user.js            # URL add/get/delete routes
├── statusLog.js       # PDF report generation route
├── nodeCron.js        # Cron job scheduler
├── axiosMethod.js     # Core status check + email logic
├── db.js              # PostgreSQL pool setup
├── verifyToken.js     # JWT middleware
├── mailer.js          # Email template
├── mailTrapSetup.js   # Nodemailer/SMTP transport
└── ErrorClasses.js    # Custom AppError class
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=your_postgres_connection_string
SECRET_KEY=your_jwt_secret
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_password
NODE_ENV=development
PORT=3000
```

---

## 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(100) NOT NULL,
  email    VARCHAR(100),
  password TEXT NOT NULL
);

-- URLs to monitor per user
CREATE TABLE userurls (
  id      SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  url     TEXT NOT NULL
);

-- Status log entries
CREATE TABLE websitestatus (
  id      SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  url     TEXT NOT NULL,
  status  VARCHAR(10) NOT NULL,  -- 'Up' or 'Down'
  time    TIMESTAMP NOT NULL
);
```

---

## 📡 API Endpoints

### Auth — `/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/user/sign-up` | Register a new user | ❌ |
| POST | `/auth/user/login` | Login and receive JWT | ❌ |
| PATCH | `/auth/user/updatePassword` | Update password | ✅ |
| PATCH | `/auth/addEmail` | Add/update email address | ✅ |

### URLs — `/user`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/user/add-url` | Add a URL to monitor | ✅ |
| GET | `/user/geturls` | Get all monitored URLs | ✅ |
| DELETE | `/user/deleteUrl` | Remove a URL | ✅ |

### Reports — `/statsLogs`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/statsLogs/logs` | Download PDF of last 10 status logs | ✅ |

> ✅ Requires `Authorization: Bearer <token>` header

---

## 🔧 Setup & Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/website-status-monitor.git
   cd website-status-monitor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Fill in your values
   ```

4. **Set up the database**
   ```bash
   # Run the SQL schema above against your PostgreSQL instance
   psql -U youruser -d yourdb -f schema.sql
   ```

5. **Start the server**
   ```bash
   node server.js
   ```

The cron job starts automatically and checks all registered URLs every 59 minutes.

---

## 📬 How Email Alerts Work

- When a URL is first added and found **Down** → sends alert immediately
- When a URL transitions **Up → Down** → sends "Down" alert
- When a URL transitions **Down → Up** → sends "Back Up" alert
- If status hasn't changed since the last check → no email sent (spam prevention)

---

## 🔒 Authentication Flow

1. Register via `/auth/user/sign-up`
2. Login via `/auth/user/login` → receive a JWT (15 min expiry)
3. Include token in all protected requests:
   ```
   Authorization: Bearer <your_token>
   ```
