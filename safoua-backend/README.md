# Safoua Academy — Backend

Express.js + Node.js + MongoDB REST API.

## Setup

```bash
npm install
```

Create a `.env` file (copy from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/SafouaDB
CLIENT_URL=http://localhost:5173
TEACHER_CODE=safoua-teacher-2025
ANTHROPIC_API_KEY=sk-ant-...     # optional — enables real AI chatbot
```

## Run

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/register` | Create account (student or teacher) |
| POST | `/api/login` | Login, returns user object |
| GET | `/api/user/:email` | Get user progress & points |
| POST | `/api/update-progress` | Mark a lesson as complete |
| GET | `/api/sessions` | List all live sessions |
| POST | `/api/sessions` | Create a session (teacher) |
| PUT | `/api/sessions/:id` | Edit a session (teacher) |
| DELETE | `/api/sessions/:id` | Delete a session (teacher) |
| POST | `/api/sessions/:id/book` | Book a spot (student) |
| POST | `/api/sessions/:id/cancel` | Cancel booking (student) |
| GET | `/api/dictionary/translate` | Translate word to Arabic |
| POST | `/api/chat` | AI chatbot (rate-limited 30/min) |
| GET | `/api/pronunciations` | List all surahs |
| GET | `/api/pronunciations/:n` | Get surah verses |
