/**
 * App.jsx — Safoua Academy
 * Adds ThemeProvider so every child can call useTheme().
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { isLoggedIn }     from './utils/auth';
import { ThemeProvider, useTheme } from './context/ThemeContext';

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
import QuranReader from './components/QuranReader';

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

/* ── Reset scroll on route change ─────────────────────────────── */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

/* ── Page fade transition ─────────────────────────────────────── */
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

/* ── Inner app (needs Router + Theme context) ─────────────────── */
function AppInner() {
  const location = useLocation();
  const loggedIn = isLoggedIn();
  const { C }    = useTheme();          // ← live palette

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', transition: 'background 0.3s' }}>
      <ScrollToTop />
      <CursorSparks />
      <Navbar />
      <main style={{ flex: 1 }}>
        <PageTransition>
          <Routes location={location} key={location.pathname}>
            {/* Public */}
            <Route path="/"         element={<Home />} />
            <Route path="/courses"  element={<Courses />} />

            {/* Auth */}
            <Route path="/login"    element={loggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/register" element={loggedIn ? <Navigate to="/dashboard" replace /> : <Register />} />

            {/* Protected */}
            <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dictionary" element={<ProtectedRoute><Dictionary /></ProtectedRoute>} />
            <Route path="/quran"      element={<ProtectedRoute><QuranReader /></ProtectedRoute>} />

            {/* Course views */}
            <Route path="/course-view/1" element={<ProtectedRoute><AlphabetArabe /></ProtectedRoute>} />
            <Route path="/course-view/2" element={<ProtectedRoute><Tajwid /></ProtectedRoute>} />
            <Route path="/course-view/3" element={<ProtectedRoute><Memorisation /></ProtectedRoute>} />
            <Route path="/course-view/4" element={<ProtectedRoute><Grammaire /></ProtectedRoute>} />
            <Route path="/course-view/5" element={<ProtectedRoute><Fiqh /></ProtectedRoute>} />
            <Route path="/course-view/6" element={<ProtectedRoute><Sira /></ProtectedRoute>} />
            <Route path="/course-view/7" element={<ProtectedRoute><Calligraphy /></ProtectedRoute>} />
            <Route path="/course-view/8" element={<ProtectedRoute><BecomeMuslim /></ProtectedRoute>} />
            <Route path="/course-view/9" element={<ProtectedRoute><ArabeModerneStandard /></ProtectedRoute>} />
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

/* ── Root export — ThemeProvider wraps everything ─────────────── */
export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppInner />
      </Router>
    </ThemeProvider>
  );
}