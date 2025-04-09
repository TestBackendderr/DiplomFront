// src/components/Banner.jsx
import React from 'react';
import './styles/banner.scss';

const Banner = () => {
  return (
    <div className="banner">
      <h1>Добро пожаловать в нашу кондитерскую!</h1>
      <p>Почувствуйте вкус наших сладких изделий</p>
      <button>Смотреть меню</button>
    </div>
  );
};

export default Banner;
