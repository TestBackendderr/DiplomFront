import React from 'react';
import '../styles/confirmModal.scss';

const ConfirmModal = ({ message, onConfirm, onCancel, show = false }) => {
  if (!show) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">⚠️</div>
        <div className="confirm-message">{message}</div>
        <div className="confirm-buttons">
          <button className="confirm-btn-cancel" onClick={onCancel}>
            Anuluj
          </button>
          <button className="confirm-btn-ok" onClick={onConfirm}>
            Potwierdź
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

