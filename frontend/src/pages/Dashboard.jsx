import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  MessageCircle,
  Search
} from "lucide-react";
import { Link } from "react-router-dom";
import AIReceptionist from "../components/AIReceptionist.jsx";
import api from "../services/api.js";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [stats, setStats] = useState({
    requestCount: 0,
    skillsCount: 0,
    unreadCount: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [profileResponse, requestsResponse, notificationsResponse] =
          await Promise.all([
            api.get("/users/me"),
            api.get("/requests/my-requests"),
            api.get("/notifications")
          ]);

        const profile = profileResponse.data.user;
        const receivedRequests =
          requestsResponse.data.receivedRequests || [];
        const sentRequests = requestsResponse.data.sentRequests || [];

        setStats({
          requestCount: receivedRequests.length + sentRequests.length,
          skillsCount: (profile.skillsToTeach || []).length,
          unreadCount: notificationsResponse.data.unreadCount || 0
        });
      } catch (error) {
        console.error("Could not load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <main className="page-container">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Student SkillSwap</p>
          <h1>Welcome back, {user.name || "Student"}.</h1>
          <p>
            Discover students, exchange skills, and build practical experience
            together.
          </p>

          <Link to="/students" className="primary-link">
            Find students <ArrowRight size={18} />
          </Link>
        </div>

        <BookOpen size={96} className="hero-icon" />
      </section>

      <section className="stats-grid">
        <Link to="/manage-requests" className="stat-card stat-card-link">
          <MessageCircle size={22} />

          <div>
            <span>My learning requests</span>
            <strong>{loading ? "..." : stats.requestCount}</strong>
          </div>

          <ArrowRight className="stat-arrow" size={18} />
        </Link>

        <Link to="/profile" className="stat-card stat-card-link">
          <BookOpen size={22} />

          <div>
            <span>Skills to teach</span>
            <strong>{loading ? "..." : stats.skillsCount}</strong>
          </div>

          <ArrowRight className="stat-arrow" size={18} />
        </Link>

        <Link to="/notifications" className="stat-card stat-card-link">
          <Bell size={22} />

          <div>
            <span>Unread notifications</span>
            <strong>{loading ? "..." : stats.unreadCount}</strong>
          </div>

          <ArrowRight className="stat-arrow" size={18} />
        </Link>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <h2>Complete your profile</h2>
          <p>
            Add your skills to teach and skills you want to learn so other
            students can find you.
          </p>

          <Link to="/profile" className="text-link">
            Update profile <ArrowRight size={16} />
          </Link>
        </article>

        <article className="dashboard-card">
          <h2>Find a learning partner</h2>
          <p>
            Search students by skills such as React, JavaScript, HTML, or CSS.
          </p>

          <Link to="/students" className="text-link">
            Search students <Search size={16} />
          </Link>
        </article>
      </section>

      <AIReceptionist />
    </main>
  );
}

export default Dashboard;