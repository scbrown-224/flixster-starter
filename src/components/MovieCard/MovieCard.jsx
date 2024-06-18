import React from 'react';
import './MovieCard.css'

const MovieCard = ({img, title, rating, onClick}) => {

  
  return (
    <>
      <div className='card' onClick={onClick}>
        <img src = {img} alt = {title}/>
        <h2>{title}</h2>
        <h4>Rating: {rating}</h4>
      </div>
    </>
  );
};


export default MovieCard
