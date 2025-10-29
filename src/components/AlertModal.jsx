import React, { useEffect } from 'react';
import '../styles/alertModal.scss';

const AlertModal = ({ message, type = 'info', onClose, show = false }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div className={`alert-modal-content alert-${type}`} onClick={(e) => e.stopPropagation()}>
        <div className="alert-icon">{icons[type] || icons.info}</div>
        <div className="alert-message">{message}</div>
        <button className="alert-close-btn" onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default AlertModal;

