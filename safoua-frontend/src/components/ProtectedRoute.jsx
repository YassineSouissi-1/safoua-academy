import { Navigate, useLocation } from "react-router-dom";

/**
 * Wraps any route that requires login.
 * Unauthenticated users are sent to /login.
 * After login they are redirected back to where they came from.
 */
export default function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("username");
  const location   = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}