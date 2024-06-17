import React from 'react';
import './MovieCard.css'

const MovieCard = (props) => {

    

  return (
    <>
      <div className='card'>
        <img src = {props.img} alt = {props.title}/>
        <h2>{props.title}</h2>
        <h4>Rating: {props.rating}</h4>
      </div>
    </>
  );
};


export default MovieCard
