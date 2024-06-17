import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header';
import React from 'react';
import "./components/MovieCard/MovieCard";
import MovieCard from './components/MovieCard/MovieCard';

const App = () => {
  return (
    <div>
      <Header title = 'Flixster'/>
      <div className='app'>
        <MovieCard img='' title='title' rating='rating'/>
      </div>
    </div>
  );
};

export default App;
