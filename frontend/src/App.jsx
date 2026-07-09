import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PostProvider } from "./context/PostContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Loader from "./components/Loader";

function PublicOnlyRoute({ children }) {
  const { user, checkingSession } = useAuth();
  if (checkingSession) return <Loader label="Checking your session…" />;
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Feed />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <AppRoutes />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#1b1b17",
              color: "#ede7da",
              border: "1px solid #33322c",
              fontFamily: "IBM Plex Mono, ui-monospace, monospace",
              fontSize: "12px",
              borderRadius: "9999px",
              padding: "10px 16px",
            },
            success: { iconTheme: { primary: "#f5a623", secondary: "#121210" } },
            error: { iconTheme: { primary: "#e8491d", secondary: "#121210" } },
          }}
        />
      </PostProvider>
    </AuthProvider>
  );
}
