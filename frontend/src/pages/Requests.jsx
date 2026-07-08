import { useEffect, useState } from "react";
import { Check, Clock3, Send, X } from "lucide-react";
import api from "../services/api.js";

function Requests() {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/requests/my-requests");

      setReceivedRequests(response.data.receivedRequests || []);
      setSentRequests(response.data.sentRequests || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateStatus = async (requestId, status) => {
    setMessage("");
    setError("");

    try {
      await api.patch(`/requests/${requestId}/status`, { status });

      setMessage(`Request ${status} successfully.`);
      await loadRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update request.");
    }
  };

  const cancelRequest = async (requestId) => {
    setMessage("");
    setError("");

    try {
      await api.patch(`/requests/${requestId}/cancel`);

      setMessage("Request cancelled successfully.");
      await loadRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Could not cancel request.");
    }
  };

  const statusClass = (status) => {
    return `status-badge status-${status}`;
  };

  if (loading) {
    return (
      <main className="page-container">
        <p className="loading-text">Loading requests...</p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section className="page-heading">
        <p className="eyebrow">Requests</p>
        <h1>Manage your skill exchanges.</h1>
        <p>Accept requests from students or track your learning requests.</p>
      </section>

      {error && <p className="form-error page-message">{error}</p>}
      {message && <p className="form-success page-message">{message}</p>}

      <section className="requests-section">
        <div className="section-title">
          <h2>Requests received</h2>
          <span>{receivedRequests.length}</span>
        </div>

        {receivedRequests.length === 0 ? (
          <p className="empty-inline">No received requests yet.</p>
        ) : (
          <div className="request-list">
            {receivedRequests.map((request) => (
              <article className="request-card" key={request._id}>
                <div className="request-main">
                  <div className="request-icon">
                    <Send size={20} />
                  </div>

                  <div>
                    <h3>{request.sender?.name || "Student"}</h3>
                    <p>
                      Wants to learn <strong>{request.skill}</strong>
                    </p>

                    {request.message && (
                      <p className="request-message">“{request.message}”</p>
                    )}

                    <small>
                      Preferred mode: {request.preferredMode || "online"}
                    </small>
                  </div>
                </div>

                <div className="request-actions">
                  <span className={statusClass(request.status)}>
                    {request.status}
                  </span>

                  {request.status === "pending" && (
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="accept-button"
                        onClick={() => updateStatus(request._id, "accepted")}
                      >
                        <Check size={16} />
                        Accept
                      </button>

                      <button
                        type="button"
                        className="reject-button"
                        onClick={() => updateStatus(request._id, "rejected")}
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </div>
                  )}

                  {request.status === "accepted" && (
                    <button
                      type="button"
                      className="accept-button"
                      onClick={() => updateStatus(request._id, "completed")}
                    >
                      <Check size={16} />
                      Mark completed
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="requests-section">
        <div className="section-title">
          <h2>Requests sent</h2>
          <span>{sentRequests.length}</span>
        </div>

        {sentRequests.length === 0 ? (
          <p className="empty-inline">No learning requests sent yet.</p>
        ) : (
          <div className="request-list">
            {sentRequests.map((request) => (
              <article className="request-card" key={request._id}>
                <div className="request-main">
                  <div className="request-icon">
                    <Clock3 size={20} />
                  </div>

                  <div>
                    <h3>{request.receiver?.name || "Student"}</h3>
                    <p>
                      You requested to learn <strong>{request.skill}</strong>
                    </p>

                    {request.message && (
                      <p className="request-message">“{request.message}”</p>
                    )}

                    <small>
                      Preferred mode: {request.preferredMode || "online"}
                    </small>
                  </div>
                </div>

                <div className="request-actions">
                  <span className={statusClass(request.status)}>
                    {request.status}
                  </span>

                  {request.status === "pending" && (
                    <button
                      type="button"
                      className="reject-button"
                      onClick={() => cancelRequest(request._id)}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Requests;