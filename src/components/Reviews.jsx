import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import { FaStar, FaTrash } from "react-icons/fa";
import AlertModal from "./AlertModal";
import ConfirmModal from "./ConfirmModal";
import "../styles/reviews.scss";

// Мок-данные для отзывов
const mockReviews = [
  {
    id: 1,
    user_id: 1,
    user_name: "Anna Kowalska",
    rating: 5,
    comment: "Fantastyczne torty! Zamówiłam tort urodzinowy dla córki i był absolutnie przepyszny. Wszyscy goście byli zachwyceni. Polecam z całego serca!",
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 2,
    user_id: 2,
    user_name: "Piotr Nowak",
    rating: 5,
    comment: "Najlepsza cukiernia w mieście! Tort weselny był idealny - piękny wygląd i wyśmienity smak. Profesjonalna obsługa i terminowa dostawa.",
    createdAt: new Date('2024-01-20').toISOString()
  },
  {
    id: 3,
    user_id: 3,
    user_name: "Maria Wiśniewska",
    rating: 4,
    comment: "Bardzo dobrej jakości produkty. Tort był smaczny, choć trochę drogi. Ogólnie polecam, szczególnie na specjalne okazje.",
    createdAt: new Date('2024-02-01').toISOString()
  },
  {
    id: 4,
    user_id: 4,
    user_name: "Jan Zieliński",
    rating: 5,
    comment: "Zamówiłem tort na rocznicę ślubu. Był nie tylko piękny, ale też przepyszny. Żona była zachwycona! Dziękuję za wspaniałą pracę.",
    createdAt: new Date('2024-02-10').toISOString()
  },
  {
    id: 5,
    user_id: 5,
    user_name: "Katarzyna Szymańska",
    rating: 5,
    comment: "Tort dla dziecka był wykonany perfekcyjnie. Wszystkie szczegóły zgodne z zamówieniem. Dziecko było w siódmym niebie! Na pewno zamówię jeszcze.",
    createdAt: new Date('2024-02-15').toISOString()
  },
  {
    id: 6,
    user_id: 6,
    user_name: "Tomasz Wójcik",
    rating: 4,
    comment: "Dobra jakość, szybka realizacja. Tort był smaczny, choć oczekiwałem trochę więcej dekoracji. Mimo wszystko polecam.",
    createdAt: new Date('2024-02-20').toISOString()
  },
  {
    id: 7,
    user_id: 7,
    user_name: "Agnieszka Król",
    rating: 5,
    comment: "Profesjonalna obsługa od początku do końca. Tort świąteczny był idealny - piękny i smaczny. Cała rodzina była zachwycona!",
    createdAt: new Date('2024-03-01').toISOString()
  },
  {
    id: 8,
    user_id: 8,
    user_name: "Marcin Dąbrowski",
    rating: 3,
    comment: "Tort był w porządku, ale nie zachwycił. Smak dobry, ale wygląd mógłby być lepszy. Cena adekwatna do jakości.",
    createdAt: new Date('2024-03-05').toISOString()
  },
  {
    id: 9,
    user_id: 9,
    user_name: "Ewa Lewandowska",
    rating: 5,
    comment: "Najlepszy tort, jaki kiedykolwiek jadłam! Zamówiłam tort domowy i był absolutnie przepyszny. Na pewno wrócę po więcej!",
    createdAt: new Date('2024-03-10').toISOString()
  },
  {
    id: 10,
    user_id: 10,
    user_name: "Paweł Kozłowski",
    rating: 4,
    comment: "Dobra cukiernia z szerokim wyborem. Tort był smaczny, choć dostawa mogłaby być szybsza. Ogólnie polecam.",
    createdAt: new Date('2024-03-15').toISOString()
  },
  {
    id: 11,
    user_id: 11,
    user_name: "Magdalena Jankowska",
    rating: 5,
    comment: "Tort weselny był absolutnie idealny! Wszystko zgodne z oczekiwaniami - piękny wygląd, wyśmienity smak. Goście nie mogli przestać chwalić!",
    createdAt: new Date('2024-03-20').toISOString()
  },
  {
    id: 12,
    user_id: 12,
    user_name: "Krzysztof Mazur",
    rating: 4,
    comment: "Zamówiłem tort na urodziny. Był bardzo dobry, choć trochę za słodki dla mojego gustu. Mimo wszystko polecam.",
    createdAt: new Date('2024-03-25').toISOString()
  },
  {
    id: 13,
    user_id: 13,
    user_name: "Joanna Kwiatkowska",
    rating: 5,
    comment: "Fantastyczna obsługa i wspaniałe produkty! Tort dla dziecka był wykonany z najwyższą starannością. Na pewno zamówię jeszcze!",
    createdAt: new Date('2024-04-01').toISOString()
  },
  {
    id: 14,
    user_id: 14,
    user_name: "Robert Krawczyk",
    rating: 3,
    comment: "Tort był w porządku, ale nie spełnił moich oczekiwań. Smak dobry, ale wygląd mógłby być bardziej imponujący.",
    createdAt: new Date('2024-04-05').toISOString()
  },
  {
    id: 15,
    user_id: 15,
    user_name: "Aleksandra Nowak",
    rating: 5,
    comment: "Najlepsza cukiernia! Tort świąteczny był absolutnie przepyszny. Wszyscy goście byli zachwyceni. Polecam z całego serca!",
    createdAt: new Date('2024-04-10').toISOString()
  },
  {
    id: 16,
    user_id: 16,
    user_name: "Michał Piotrowski",
    rating: 4,
    comment: "Dobra jakość produktów. Tort był smaczny i ładnie wykonany. Jedynym minusem była dłuższa niż oczekiwana dostawa.",
    createdAt: new Date('2024-04-15').toISOString()
  },
  {
    id: 17,
    user_id: 17,
    user_name: "Natalia Górski",
    rating: 5,
    comment: "Tort urodzinowy był idealny! Piękny wygląd, wyśmienity smak. Profesjonalna obsługa i terminowa realizacja. Polecam!",
    createdAt: new Date('2024-04-20').toISOString()
  },
  {
    id: 18,
    user_id: 18,
    user_name: "Łukasz Rutkowski",
    rating: 4,
    comment: "Zamówiłem tort na rocznicę. Był bardzo dobry, choć oczekiwałem trochę więcej dekoracji. Mimo wszystko polecam.",
    createdAt: new Date('2024-04-25').toISOString()
  },
  {
    id: 19,
    user_id: 19,
    user_name: "Karolina Pawlak",
    rating: 5,
    comment: "Fantastyczne torty! Zamówiłam tort domowy i był absolutnie przepyszny. Cała rodzina była zachwycona. Na pewno wrócę!",
    createdAt: new Date('2024-05-01').toISOString()
  },
  {
    id: 20,
    user_id: 20,
    user_name: "Adam Michalski",
    rating: 5,
    comment: "Najlepszy tort, jaki kiedykolwiek zamówiłem! Profesjonalna obsługa, piękny wygląd i wyśmienity smak. Polecam z całego serca!",
    createdAt: new Date('2024-05-05').toISOString()
  },
  {
    id: 21,
    user_id: 21,
    user_name: "Monika Zając",
    rating: 4,
    comment: "Dobra cukiernia z szerokim wyborem produktów. Tort był smaczny i ładnie wykonany. Ogólnie polecam na specjalne okazje.",
    createdAt: new Date('2024-05-10').toISOString()
  },
  {
    id: 22,
    user_id: 22,
    user_name: "Jakub Król",
    rating: 5,
    comment: "Tort weselny był wykonany perfekcyjnie! Wszystkie szczegóły zgodne z zamówieniem. Goście nie mogli przestać chwalić. Dziękuję!",
    createdAt: new Date('2024-05-15').toISOString()
  },
  {
    id: 23,
    user_id: 23,
    user_name: "Sylwia Wojciechowska",
    rating: 3,
    comment: "Tort był w porządku, ale nie zachwycił. Smak dobry, ale wygląd mógłby być lepszy. Cena adekwatna do jakości.",
    createdAt: new Date('2024-05-20').toISOString()
  },
  {
    id: 24,
    user_id: 24,
    user_name: "Bartosz Sikora",
    rating: 5,
    comment: "Profesjonalna obsługa i wspaniałe produkty! Tort dla dziecka był idealny - piękny i smaczny. Na pewno zamówię jeszcze!",
    createdAt: new Date('2024-05-25').toISOString()
  },
  {
    id: 25,
    user_id: 25,
    user_name: "Weronika Baran",
    rating: 4,
    comment: "Zamówiłam tort na urodziny. Był bardzo dobry, choć trochę za słodki dla mojego gustu. Mimo wszystko polecam.",
    createdAt: new Date('2024-06-01').toISOString()
  }
];

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { userName, userId, userRole } = useUser();
  const [alert, setAlert] = useState({ show: false, message: "", type: "info" });
  const [confirm, setConfirm] = useState({ show: false, message: "", onConfirm: null });

  useEffect(() => {
    fetchReviews();
  }, []);

  // Используем мок-данные вместо реального API
  const fetchReviews = () => {
    // Имитация загрузки
    setTimeout(() => {
      setReviews(mockReviews);
      setLoading(false);
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!userId) {
      setAlert({ show: true, message: "Proszę zalogować się, aby dodać opinię", type: "warning" });
      return;
    }

    // Добавляем новый отзыв в мок-данные (только локально)
    const newReview = {
      id: reviews.length + 1,
      user_id: userId,
      user_name: userName || "Użytkownik",
      rating: rating,
      comment: comment,
      createdAt: new Date().toISOString()
    };

    setReviews([newReview, ...reviews]);
    setAlert({ show: true, message: "Opinia została dodana! (tylko lokalnie - dane mock)", type: "success" });
    setComment("");
    setRating(5);
    setShowForm(false);
  };

  const handleDeleteClick = (reviewId) => {
    setConfirm({
      show: true,
      message: "Czy na pewno chcesz usunąć tę opinię?",
      onConfirm: () => deleteReview(reviewId)
    });
  };

  const deleteReview = (reviewId) => {
    // Удаляем отзыв из мок-данных (только локально)
    setReviews(reviews.filter(review => review.id !== reviewId));
    setAlert({ show: true, message: "Opinia została usunięta! (tylko lokalnie - dane mock)", type: "success" });
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
                        onClick={() => handleDeleteClick(review.id)}
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
      <AlertModal
        message={alert.message}
        type={alert.type}
        show={alert.show}
        onClose={() => setAlert({ show: false, message: "", type: "info" })}
      />
      <ConfirmModal
        message={confirm.message}
        show={confirm.show}
        onConfirm={() => {
          if (confirm.onConfirm) confirm.onConfirm();
          setConfirm({ show: false, message: "", onConfirm: null });
        }}
        onCancel={() => setConfirm({ show: false, message: "", onConfirm: null })}
      />
    </div>
  );
};

export default Reviews;

