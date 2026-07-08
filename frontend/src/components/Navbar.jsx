import {
  Bell,
  BookOpen,
  CalendarDays,
  CircleHelp,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  UserRound
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar({ onLogout, theme, onThemeChange }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isDark = theme === "dark";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/dashboard" className="brand">
        <BookOpen size={22} />
        <span>SkillSwap</span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/dashboard">Dashboard</NavLink>

        <NavLink to="/students">
          <Search size={17} />
          Find students
        </NavLink>

        <NavLink to="/requests">Requests</NavLink>

        <NavLink to="/calendar">
          <CalendarDays size={17} />
          Calendar
        </NavLink>

        <NavLink to="/notifications">
          <Bell size={17} />
          Notifications
        </NavLink>

        <NavLink to="/help">
          <CircleHelp size={17} />
          Help
        </NavLink>
      </nav>

      <div className="nav-user">
        <button
          type="button"
          className="theme-toggle"
          onClick={onThemeChange}
          title={isDark ? "Switch to bright theme" : "Switch to dark theme"}
          aria-label={isDark ? "Switch to bright theme" : "Switch to dark theme"}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Link
          to="/settings"
          className="icon-button"
          title="Settings"
          aria-label="Settings"
        >
          <Settings size={18} />
        </Link>

        <Link to="/profile" className="profile-link">
          <UserRound size={18} />
          <span>{user.name || "Student"}</span>
        </Link>

        <button
          type="button"
          className="icon-button"
          onClick={handleLogout}
          title="Log out"
          aria-label="Log out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;