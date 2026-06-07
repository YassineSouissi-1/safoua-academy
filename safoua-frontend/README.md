# Safoua Academy — Frontend

React 18 + Vite + Tailwind CSS + Framer Motion.

## Setup

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

## Run

```bash
# Development
npm run dev        # → http://localhost:5173

# Production build
npm run build
npm run preview
```

## Pages & Routes

| Route | Component | Auth |
|-------|-----------|------|
| `/` | Home | Public |
| `/courses` | Courses | Public |
| `/dictionary` | Dictionary | Protected |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/dashboard` | Dashboard | Protected |
| `/course-view/1–8` | Course pages | Protected |

## Key Features
- Cursor spark effects & page transitions (Framer Motion)
- AI chatbot (opens via floating button or Dashboard card)
- Student progress tracking with XP badges
- Teacher session management (create / edit / delete)
- Arabic dictionary with text-to-speech
- Quran recitation with multiple reciters
