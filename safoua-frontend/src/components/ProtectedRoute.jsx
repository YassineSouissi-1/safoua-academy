import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

/**
 * ProtectedRoute — JWT version
 * ─────────────────────────────
 * Instead of just checking if "username" exists in localStorage
 * (which anyone can fake), we now verify the JWT token is present
 * AND not expired.
 *
 * The token expiry is checked client-side (fast, no network call).
 * The server will do a full cryptographic verification on every API call.
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();

  // isLoggedIn() checks: token exists + not expired
  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optional: role-based protection
  // Example: <ProtectedRoute requiredRole="teacher"><TeacherDashboard /></ProtectedRoute>
  if (requiredRole) {
    const { getUser } = require("../utils/auth");
    const user = getUser();
    if (!user || user.role !== requiredRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}