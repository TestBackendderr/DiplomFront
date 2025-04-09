import React from 'react';
import '../styles/modal.scss'; // Подключаем стили для модального окна

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
            <p>No image available</p>
          )}
          <p><strong>Описание:</strong></p>
          <p>{product.opis}</p> {/* Отображаем описание из базы данных */}
          <p><strong>Цена:</strong> {product.price} zl.</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
