import { useState } from "react";
import { Search, Send, Star, UserRound } from "lucide-react";
import api from "../services/api.js";

function Students() {
  const [skill, setSkill] = useState("");
  const [students, setStudents] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingToId, setSendingToId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const searchStudents = async (event) => {
    event.preventDefault();

    const searchSkill = skill.trim();

    if (!searchSkill) {
      setError("Enter a skill to search.");
      setStudents([]);
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setSearched(true);

    try {
      const response = await api.get(
        `/users/search?skill=${encodeURIComponent(searchSkill)}`
      );

      setStudents(response.data.students || []);
    } catch (err) {
      setStudents([]);
      setError(
        err.response?.data?.message || "Could not search students."
      );
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (student) => {
    const searchSkill = skill.trim();
    const receiverId = student?._id;

    setError("");
    setMessage("");

    if (!receiverId) {
      setError("This student's ID is missing. Search again and try once more.");
      return;
    }

    if (!searchSkill) {
      setError("Please search for a skill before sending a request.");
      return;
    }

    setSendingToId(receiverId);

    try {
      await api.post("/requests", {
        receiverId: receiverId,
        skill: searchSkill,
        message: `Hi ${student.name}, I would like to learn ${searchSkill} from you.`,
        preferredMode: "online"
      });

      setMessage(`Learning request sent to ${student.name}.`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not send the request."
      );
    } finally {
      setSendingToId("");
    }
  };

  return (
    <main className="page-container">
      <section className="page-heading">
        <p className="eyebrow">Find students</p>
        <h1>Learn from another student.</h1>
        <p>Search by a skill that another student can teach.</p>
      </section>

      <form className="search-panel" onSubmit={searchStudents}>
        <input
          type="text"
          value={skill}
          onChange={(event) => setSkill(event.target.value)}
          placeholder="Example: HTML5, CSS, React.js"
        />

        <button type="submit" disabled={loading}>
          <Search size={18} />
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="form-error page-message">{error}</p>}
      {message && <p className="form-success page-message">{message}</p>}

      {searched && !loading && students.length === 0 && !error && (
        <section className="empty-state">
          <UserRound size={42} />
          <h2>No students found</h2>
          <p>
            Try another skill, or ask another student to add this skill to
            their profile.
          </p>
        </section>
      )}

      <section className="student-grid">
        {students.map((student) => (
          <article className="student-card" key={student._id}>
            <div className="student-card-top">
              <div className="student-avatar">
                <UserRound size={28} />
              </div>

              <div>
                <h2>{student.name}</h2>

                <p className="rating">
                  <Star size={16} />
                  {student.totalReviews > 0
                    ? `${student.rating} (${student.totalReviews})`
                    : "New member"}
                </p>
              </div>
            </div>

            <p className="student-bio">
              {student.bio || "This student has not added a bio yet."}
            </p>

            <div className="skill-section">
              <span>Can teach</span>

              <div className="skill-tags">
                {(student.skillsToTeach || []).map((item) => (
                  <span className="skill-tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="request-button"
              onClick={() => sendRequest(student)}
              disabled={sendingToId === student._id}
            >
              <Send size={17} />
              {sendingToId === student._id
                ? "Sending..."
                : "Request to learn"}
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Students;