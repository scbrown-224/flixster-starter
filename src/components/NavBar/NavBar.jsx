// NavigationBar.jsx
import React from 'react';
import './NavBar.css';

const NavBar = ({ activeTab, onTabChange }) => {
  return (
    <div className="nav-bar">
      <button 
        className={`nav-button ${activeTab === 'nowPlaying' ? 'active' : ''}`}
        onClick={() => onTabChange('nowPlaying')}
      >
        Now Playing
      </button>
      <button 
        className={`nav-button ${activeTab === 'search' ? 'active' : ''}`}
        onClick={() => onTabChange('search')}
      >
        Search
      </button>
    </div>
  );
};

export default NavBar;

