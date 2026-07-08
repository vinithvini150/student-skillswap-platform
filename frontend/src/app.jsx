import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";

import Calendar from "./pages/Calendar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Downloads from "./pages/Downloads.jsx";
import Help from "./pages/Help.jsx";
import Login from "./pages/login.jsx";
import ManageRequests from "./pages/ManageRequests.jsx";
import Notifications from "./pages/Notifications.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import Requests from "./pages/Requests.jsx";
import Reviews from "./pages/Reviews.jsx";
import Settings from "./pages/Settings.jsx";
import Students from "./pages/Students.jsx";

function ProtectedLayout({ onLogout, children, theme, onThemeChange }) {
  return (
    <>
      <Navbar
        onLogout={onLogout}
        theme={theme}
        onThemeChange={onThemeChange}
      />
      {children}
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem("token"));
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("skillswap-theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("skillswap-theme", theme);
  }, [theme]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  };

  const protectedPage = (page) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    return (
      <ProtectedLayout
        onLogout={logout}
        theme={theme}
        onThemeChange={toggleTheme}
      >
        {page}
      </ProtectedLayout>
    );
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={() => setIsLoggedIn(true)} />
          )
        }
      />

      <Route
        path="/register"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Register onLogin={() => setIsLoggedIn(true)} />
          )
        }
      />

      {/* Protected routes */}
      <Route path="/dashboard" element={protectedPage(<Dashboard />)} />
      <Route path="/profile" element={protectedPage(<Profile />)} />
      <Route path="/students" element={protectedPage(<Students />)} />
      <Route path="/requests" element={protectedPage(<Requests />)} />

      <Route
        path="/manage-requests"
        element={protectedPage(<ManageRequests />)}
      />

      <Route path="/reviews" element={protectedPage(<Reviews />)} />
      <Route path="/calendar" element={protectedPage(<Calendar />)} />

      <Route
        path="/notifications"
        element={protectedPage(<Notifications />)}
      />

      <Route path="/help" element={protectedPage(<Help />)} />

      <Route
        path="/settings"
        element={protectedPage(
          <Settings theme={theme} onThemeChange={toggleTheme} />
        )}
      />

      {/* Download page — protected, so users see your Navbar */}
      <Route path="/downloads" element={protectedPage(<Downloads />)} />

      {/* Keep this last */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;