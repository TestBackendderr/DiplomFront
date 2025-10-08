import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../UserContext";
import { FaStar, FaTrash } from "react-icons/fa";
import "../styles/reviews.scss";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { userName, userId, userRole } = useUser();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/reviews");
      setReviews(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Błąd ładowania opinii:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      alert("Proszę zalogować się, aby dodać opinię");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/reviews",
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Opinia została dodana!");
      setComment("");
      setRating(5);
      setShowForm(false);
      fetchReviews();
    } catch (error) {
      console.error("Błąd podczas dodawania opinii:", error);
      alert("Błąd: " + (error.response?.data?.message || "Nie udało się dodać opinii"));
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę opinię?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Opinia została usunięta!");
      fetchReviews();
    } catch (error) {
      console.error("Błąd podczas usuwania opinii:", error);
      alert("Nie udało się usunąć opinii");
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? "star filled" : "star"}
        size={20}
      />
    ));
  };

  if (loading) return <p className="loading-text">Ładowanie opinii...</p>;

  return (
    <div className="reviews-section">
      <div className="reviews-container">
        <h2>Opinie Klientów 💬</h2>
        
        {userName && (
          <button 
            className="add-review-btn" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Anuluj" : "Dodaj swoją opinię"}
          </button>
        )}

        {showForm && (
          <form className="review-form" onSubmit={handleSubmit}>
            <div className="rating-select">
              <label>Ocena:</label>
              <div className="stars-select">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={star <= rating ? "star-btn filled" : "star-btn"}
                    size={30}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            
            <textarea
              placeholder="Twoja opinia..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows="4"
            />
            
            <button type="submit">Opublikuj opinię</button>
          </form>
        )}

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p className="no-reviews">Brak opinii. Bądź pierwszy!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-user">
                    <div className="user-avatar">
                      {review.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4>{review.user_name}</h4>
                      <p className="review-date">
                        {new Date(review.createdAt).toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="review-actions">
                    <div className="review-rating">{renderStars(review.rating)}</div>
                    {userRole === 'admin' && (
                      <button
                        className="delete-review-btn"
                        onClick={() => deleteReview(review.id)}
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                  </div>
                </div>
                
                <p className="review-comment">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;

