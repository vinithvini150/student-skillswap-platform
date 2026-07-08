import { Bell, Moon, Save, Sun } from "lucide-react";
import { useState } from "react";

function Settings({ theme, onThemeChange }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem("skillswap-notifications") !== "off";
  });

  const [message, setMessage] = useState("");

  const handleNotificationChange = () => {
    const newValue = !notificationsEnabled;

    setNotificationsEnabled(newValue);
    localStorage.setItem(
      "skillswap-notifications",
      newValue ? "on" : "off"
    );
  };

  const saveSettings = () => {
    setMessage("Settings saved successfully.");

    window.setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const isDark = theme === "dark";

  return (
    <main className="page-container">
      <section className="page-heading">
        <p className="eyebrow">Settings</p>
        <h1>Personalize your experience.</h1>
        <p>Manage appearance and notification preferences.</p>
      </section>

      <section className="settings-card">
        {message && <p className="form-success">{message}</p>}

        <div className="settings-row">
          <div>
            <h2>Appearance</h2>
            <p>Choose between bright mode and dark mode.</p>
          </div>

          <button
            type="button"
            className="settings-theme-button"
            onClick={onThemeChange}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            {isDark ? "Use bright theme" : "Use dark theme"}
          </button>
        </div>

        <div className="settings-row">
          <div>
            <h2>Notifications</h2>
            <p>Enable notification updates inside the application.</p>
          </div>

          <label className="switch-control">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={handleNotificationChange}
            />
            <span className="switch-slider" />
            <span className="switch-label">
              <Bell size={16} />
              {notificationsEnabled ? "Enabled" : "Disabled"}
            </span>
          </label>
        </div>

        <button
          type="button"
          className="save-button"
          onClick={saveSettings}
        >
          <Save size={18} />
          Save settings
        </button>
      </section>
    </main>
  );
}

export default Settings;
