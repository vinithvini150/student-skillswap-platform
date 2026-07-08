import { useEffect, useState } from "react";
import {
  Check,
  Clock3,
  Eye,
  RotateCcw,
  Send,
  X
} from "lucide-react";
import api from "../services/api.js";

function ManageRequests() {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("received");
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
    setError("");
    setMessage("");

    try {
      await api.patch(`/requests/${requestId}/status`, { status });

      setMessage(`Request ${status} successfully.`);
      await loadRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update request.");
    }
  };

  const cancelRequest = async (requestId) => {
    setError("");
    setMessage("");

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

  const requests =
    activeTab === "received" ? receivedRequests : sentRequests;

  if (loading) {
    return (
      <main className="page-container">
        <p className="loading-text">Loading request management...</p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section className="page-heading">
        <p className="eyebrow">Request Management</p>
        <h1>Manage skill-learning requests.</h1>
        <p>
          Review requests, update their status, and keep your learning
          exchanges organized.
        </p>
      </section>

      {error && <p className="form-error page-message">{error}</p>}
      {message && <p className="form-success page-message">{message}</p>}

      <section className="request-tabs">
        <button
          type="button"
          className={activeTab === "received" ? "active" : ""}
          onClick={() => setActiveTab("received")}
        >
          <Send size={17} />
          Requests received
          <span>{receivedRequests.length}</span>
        </button>

        <button
          type="button"
          className={activeTab === "sent" ? "active" : ""}
          onClick={() => setActiveTab("sent")}
        >
          <Clock3 size={17} />
          Requests sent
          <span>{sentRequests.length}</span>
        </button>
      </section>

      {requests.length === 0 ? (
        <section className="empty-state">
          <Eye size={42} />
          <h2>No requests in this section</h2>
          <p>
            Requests will appear here when another student sends one or when
            you request to learn a skill.
          </p>
        </section>
      ) : (
        <section className="request-table-wrapper">
          <table className="request-table">
            <thead>
              <tr>
                <th>{activeTab === "received" ? "Learner" : "Teacher"}</th>
                <th>Skill</th>
                <th>Preferred mode</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => {
                const person =
                  activeTab === "received"
                    ? request.sender
                    : request.receiver;

                return (
                  <tr key={request._id}>
                    <td>
                      <strong>{person?.name || "Student"}</strong>
                      <small>{person?.email || ""}</small>
                    </td>

                    <td>{request.skill}</td>

                    <td className="capitalize">
                      {request.preferredMode || "online"}
                    </td>

                    <td className="request-table-message">
                      {request.message || "No message"}
                    </td>

                    <td>
                      <span className={statusClass(request.status)}>
                        {request.status}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        {activeTab === "received" &&
                          request.status === "pending" && (
                            <>
                              <button
                                type="button"
                                className="table-accept"
                                onClick={() =>
                                  updateStatus(request._id, "accepted")
                                }
                              >
                                <Check size={15} />
                                Accept
                              </button>

                              <button
                                type="button"
                                className="table-reject"
                                onClick={() =>
                                  updateStatus(request._id, "rejected")
                                }
                              >
                                <X size={15} />
                                Reject
                              </button>
                            </>
                          )}

                        {activeTab === "received" &&
                          request.status === "accepted" && (
                            <button
                              type="button"
                              className="table-complete"
                              onClick={() =>
                                updateStatus(request._id, "completed")
                              }
                            >
                              <Check size={15} />
                              Complete
                            </button>
                          )}

                        {activeTab === "sent" &&
                          request.status === "pending" && (
                            <button
                              type="button"
                              className="table-reject"
                              onClick={() => cancelRequest(request._id)}
                            >
                              <X size={15} />
                              Cancel
                            </button>
                          )}

                        {request.status === "accepted" && (
                          <span className="table-info">
                            <RotateCcw size={14} />
                            Use Calendar to plan or join class
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}

export default ManageRequests;