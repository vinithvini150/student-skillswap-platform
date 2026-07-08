import { useEffect, useState } from "react";
import { CalendarDays, ExternalLink, Plus, X } from "lucide-react";
import api from "../services/api.js";

function Calendar() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    duration: "60",
    meetingLink: "",
    notes: ""
  });

  const loadSchedules = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/schedules");

      setSchedules(response.data.schedules || []);
    } catch (err) {
      console.error("Calendar error:", err);

      setError(
        err.response?.data?.message ||
          "Could not load calendar. Check that the backend is running."
      );

      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const createSchedule = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setMessage("");

      await api.post("/schedules", formData);

      setMessage("Class scheduled successfully.");
      setShowForm(false);

      setFormData({
        title: "",
        date: "",
        time: "",
        duration: "60",
        meetingLink: "",
        notes: ""
      });

      await loadSchedules();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not create class schedule."
      );
    }
  };

  if (loading) {
    return (
      <main className="page-container">
        <p className="loading-text">Loading calendar...</p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section className="page-heading">
        <p className="eyebrow">Calendar</p>
        <h1>Plan and join classes.</h1>
        <p>Keep track of your scheduled SkillSwap learning sessions.</p>
      </section>

      {error && <p className="form-error page-message">{error}</p>}
      {message && <p className="form-success page-message">{message}</p>}

      <button
        type="button"
        className="save-button"
        onClick={() => setShowForm((current) => !current)}
      >
        {showForm ? <X size={18} /> : <Plus size={18} />}
        {showForm ? "Close form" : "Plan a class"}
      </button>

      {showForm && (
        <form className="schedule-form" onSubmit={createSchedule}>
          <label>
            Class title
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: React basics class"
              required
            />
          </label>

          <label>
            Date
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Time
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Duration in minutes
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="15"
              required
            />
          </label>

          <label className="full-width">
            Zoom or Microsoft Teams link
            <input
              type="url"
              name="meetingLink"
              value={formData.meetingLink}
              onChange={handleChange}
              placeholder="https://zoom.us/j/..."
              required
            />
          </label>

          <label className="full-width">
            Notes
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Topics to cover in this class."
              rows="4"
            />
          </label>

          <button type="submit" className="save-button">
            <CalendarDays size={18} />
            Save class
          </button>
        </form>
      )}

      {schedules.length === 0 ? (
        <section className="empty-state">
          <CalendarDays size={42} />
          <h2>No classes scheduled</h2>
          <p>Your upcoming learning sessions will appear here.</p>
        </section>
      ) : (
        <section className="schedule-list">
          {schedules.map((schedule) => (
            <article className="schedule-card" key={schedule._id}>
              <div>
                <h2>{schedule.title}</h2>
                <p>
                  {schedule.date} at {schedule.time} · {schedule.duration} minutes
                </p>
                {schedule.notes && <p>{schedule.notes}</p>}
              </div>

              {schedule.meetingLink && (
                <a
                  href={schedule.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="table-calendar-link"
                >
                  <ExternalLink size={16} />
                  Join class
                </a>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Calendar;