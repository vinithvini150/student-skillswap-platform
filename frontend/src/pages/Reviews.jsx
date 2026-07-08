import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import api from "../services/api.js";

function Reviews() {
  const [sentRequests, setSentRequests] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCompletedRequests = async () => {
      try {
        const response = await api.get("/requests/my-requests");

        const completed = (response.data.sentRequests || []).filter(
          (request) => request.status === "completed"
        );

        setSentRequests(completed);
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load completed requests."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCompletedRequests();
  }, []);

  const submitReview = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!selectedRequestId) {
      setError("Select a completed request first.");
      return;
    }

    try {
      await api.post("/reviews", {
        requestId: selectedRequestId,
        rating: Number(rating),
        comment
      });

      setMessage("Review submitted successfully.");
      setComment("");
      setRating(5);
      setSelectedRequestId("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not submit your review."
      );
    }
  };

  if (loading) {
    return (
      <main className="page-container">
        <p className="loading-text">Loading reviews...</p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section className="page-heading">
        <p className="eyebrow">Reviews</p>
        <h1>Rate your learning experience.</h1>
        <p>Reviews become available after a skill request is completed.</p>
      </section>

      {error && <p className="form-error page-message">{error}</p>}
      {message && <p className="form-success page-message">{message}</p>}

      {sentRequests.length === 0 ? (
        <section className="empty-state">
          <Star size={42} />
          <h2>No completed sessions yet</h2>
          <p>
            When one of your accepted learning requests is marked completed,
            you can rate the student here.
          </p>
        </section>
      ) : (
        <form className="review-form" onSubmit={submitReview}>
          <label>
            Completed learning request
            <select
              value={selectedRequestId}
              onChange={(event) => setSelectedRequestId(event.target.value)}
              required
            >
              <option value="">Choose a request</option>

              {sentRequests.map((request) => (
                <option key={request._id} value={request._id}>
                  {request.skill} with {request.receiver?.name || "Student"}
                </option>
              ))}
            </select>
          </label>

          <label>
            Rating
            <select
              value={rating}
              onChange={(event) => setRating(event.target.value)}
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Very good</option>
              <option value="3">3 - Good</option>
              <option value="2">2 - Needs improvement</option>
              <option value="1">1 - Poor</option>
            </select>
          </label>

          <label>
            Comment
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Write your learning experience..."
              maxLength="500"
              rows="5"
            />
          </label>

          <button type="submit" className="save-button">
            <Star size={18} />
            Submit review
          </button>
        </form>
      )}
    </main>
  );
}

export default Reviews;