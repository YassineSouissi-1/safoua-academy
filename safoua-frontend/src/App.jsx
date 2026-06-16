/**
 * App.jsx — Safoua Academy
 * ─────────────────────────
 * Only responsibilities: routing + page transition.
 * All large components (Home, Navbar, CursorSparks) are now
 * in their own files under src/components/.
 *
 * FIX: was ~1000 lines; now ~60 lines.
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { isLoggedIn }     from './utils/auth';

// ── Layout ─────────────────────────────────────────────────────────
import Navbar         from './components/Navbar';
import Footer         from './components/Footer';
import CursorSparks   from './components/CursorSparks';
import Chatbot        from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';

// ── Pages ──────────────────────────────────────────────────────────
import Home       from './components/Home';
import Courses    from './components/Courses';
import Login      from './components/Login';
import Register   from './components/Register';
import Dashboard  from './components/Dashboard';
import CourseDetail from './components/CourseDetail';
import Dictionary from './components/Dictionary';
import NotFound   from './components/NotFound';

// ── Course views ───────────────────────────────────────────────────
import AlphabetArabe        from './components/courses/AlphabetArabe';
import Tajwid               from './components/courses/Tajwid';
import Memorisation         from './components/courses/Memorisation';
import Grammaire            from './components/courses/Grammaire';
import Fiqh                 from './components/courses/Fiqh';
import Sira                 from './components/courses/Sira';
import Calligraphy          from './components/courses/Calligraphy';
import BecomeMuslim         from './components/courses/BecomeMuslim';
import ArabeModerneStandard from './components/courses/ArabeModerneStandard';

/* ── Page fade transition ──────────────────────────────────────── */
function PageTransition({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Inner app (needs Router context for useLocation) ─────────── */
function AppInner() {
  const location = useLocation();
  const loggedIn = isLoggedIn();

  return (
    <div style={{ minHeight: '100vh', background: '#080b0f', display: 'flex', flexDirection: 'column' }}>
      <CursorSparks />
      <Navbar />
      <main style={{ flex: 1 }}>
        <PageTransition>
          <Routes location={location} key={location.pathname}>
            {/* Public */}
            <Route path="/"         element={<Home />} />
            <Route path="/courses"  element={<Courses />} />

            {/* Auth — redirect if already logged in */}
            <Route path="/login"    element={loggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/register" element={loggedIn ? <Navigate to="/dashboard" replace /> : <Register />} />

            {/* Protected */}
            <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dictionary"     element={<ProtectedRoute><Dictionary /></ProtectedRoute>} />

            {/* Course views — specific routes MUST come before the generic :id catch-all */}
            <Route path="/course-view/1" element={<ProtectedRoute><AlphabetArabe /></ProtectedRoute>} />
            <Route path="/course-view/2" element={<ProtectedRoute><Tajwid /></ProtectedRoute>} />
            <Route path="/course-view/3" element={<ProtectedRoute><Memorisation /></ProtectedRoute>} />
            <Route path="/course-view/4" element={<ProtectedRoute><Grammaire /></ProtectedRoute>} />
            <Route path="/course-view/5" element={<ProtectedRoute><Fiqh /></ProtectedRoute>} />
            <Route path="/course-view/6" element={<ProtectedRoute><Sira /></ProtectedRoute>} />
            <Route path="/course-view/7" element={<ProtectedRoute><Calligraphy /></ProtectedRoute>} />
            <Route path="/course-view/8" element={<ProtectedRoute><BecomeMuslim /></ProtectedRoute>} />
            <Route path="/course-view/9" element={<ProtectedRoute><ArabeModerneStandard /></ProtectedRoute>} />

            {/* Generic fallback for any other course ID */}
            <Route path="/course-view/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default function App() {
  return <Router><AppInner /></Router>;
}