// src/components/Onas.jsx
import React, { useState } from 'react';
import Novinki from './Novinki';
import '../styles/onas.scss';

const Onas = () => {
  const [showNovinki, setShowNovinki] = useState(false);

  const toggleNovinki = () => {
    setShowNovinki(prev => !prev);
  };

  return (
    <section className="onas-section">
      <div className="onas-container">
        <button className="novinki-button" onClick={toggleNovinki}>
          {showNovinki ? 'Ukryj Nowości' : 'Pokaż Nowości'}
        </button>

        {showNovinki && (
          <div className="novinki-wrapper">
            <Novinki />
          </div>
        )}
      </div>
    </section>
  );
};

export default Onas;
