import React, { useEffect, useState } from 'react';
import './MovieList.css';
import MovieCard from '../MovieCard/MovieCard';
// use async function in useEffect to get movie data



const MovieList = () => {
    // useState for movies
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // fetch movie data from the api
        
        async function fetchMovie() {
            const apiKey = import.meta.env.VITE_API_KEY;
            let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`; 

            const response = await fetch(url);
            const data = await response.json();
            console.log('data is: ', data);

            setMovies(data.results);
        }
        fetchMovie();

        // get data.___ and store in movies array
        // setMovies(data.[whatever we wanna store]);
        // stopped @ 1:12:42 of vid

    }, []);

    // filter movies based on search term
    const filteredMovies = movies.filter((movie) =>
      movie.original_title.toLowerCase().includes(searchTerm.toLowerCase())
    );


  return (
    <>
      <div className='searchContainer'>
        <input type='text' placeholder='search' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>

      <div className = 'movie-list'>
      {filteredMovies.map((movie) => (
            <MovieCard 
                key={movie.id}
                img={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                title={movie.original_title}
                rating={movie.vote_average}
            />
        ))}
      </div>
    </>
  );
};

export default MovieList
