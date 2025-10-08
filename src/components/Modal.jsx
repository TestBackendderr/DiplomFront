import React from 'react';
import '../styles/modal.scss';

const Modal = ({ product, closeModal }) => {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={closeModal}>X</button>
        <div className="modal-body">
          <h2>{product.name}</h2>
          {product.image_url ? (
            <img src={`http://localhost:5000${product.image_url}`} alt={product.name} />
          ) : (
            <p>Brak obrazu</p>
          )}
          <p><strong>Opis:</strong></p>
          <p>{product.opis}</p>
          <p><strong>Cena:</strong> {product.price} zł</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
