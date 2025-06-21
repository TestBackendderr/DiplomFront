// src/components/Banner.jsx
import React from 'react';
import './styles/banner.scss';

const Banner = () => {
  return (
    <div className="banner">
      <h1>Witamy w naszej cukierni!</h1>
      <p>Poczuj smak naszych słodkich produktów</p>
      <button>Zobacz menu</button>
    </div>
  );
};

export default Banner;
