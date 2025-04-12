import React from 'react';
import { Outlet } from 'react-router';
import Header from '../Header';
import './home.css';
const Home = () => {
  return (
    <div className='home-container'>
      <Header />
      <div className='home-content'>
        <Outlet />
      </div>
      <footer className='footer'>
        © {new Date().getFullYear()} Shopping Website
      </footer>
    </div>
  );
};

export default Home;
