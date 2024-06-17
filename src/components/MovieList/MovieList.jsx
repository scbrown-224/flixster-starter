import React, { useEffect, useState } from 'react';
import './MovieList.css';
import MovieCard from '../MovieCard/MovieCard';
// use async function in useEffect to get movie data



const MovieList = () => {
    // useState for movies
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageNum, setPageNum] = useState(1); // State to keep track of current page number

    useEffect(() => {
        // fetch movie data from the api
        
        async function fetchMovie() {
            const apiKey = import.meta.env.VITE_API_KEY;
            let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`; 
            let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${pageNum}`; 

            // fetch(searchUrl)
            //   .then(response => response.json())
            //   .then(response => console.log(response))
            //   .catch(err => console.error(err));

            const response = await fetch(url);
            const data = await response.json();
            console.log('data is: ', data);

            // setMovies(data.results);
            // setMovies((prevMovies) => [...prevMovies, ...data.results]); // Append new movies to existing movies

            if(pageNum === 1) {
              setMovies(data.results);
            } else {
              setMovies((prevMovies) => [...prevMovies, ...data.results]); // Append new movies to existing movies
            }
        }
        fetchMovie();

        // get data.___ and store in movies array
        // setMovies(data.[whatever we wanna store]);
        // stopped @ 1:12:42 of vid


    }, [pageNum]);

    const searchMovies = async () => {
      const apiKey = import.meta.env.VITE_API_KEY;
      let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`; 

      try { // from chatgpt
          const response = await fetch(searchUrl);
          const data = await response.json();
          console.log('Search results:', data);
          setMovies(data.results);
      } catch (error) {
          console.error('Error searching movies:', error);
      }
  };

  const handleSearch = () => {
      if (searchTerm.trim() !== '') {
          searchMovies();
      }
  };

  // miss chat herself
  const loadMoreMovies = () => {
    setPageNum((pageNum) => pageNum + 1); // Increment page number to fetch next page
};


  return (
    <>
      <div className='searchContainer'>
        <input type='text' placeholder='search' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        <button onClick={handleSearch}>search</button>
      </div>

      <div className = 'movie-list'>
      {movies.map((movie) => (
            <MovieCard 
                key={movie.id}
                img={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                title={movie.original_title}
                rating={movie.vote_average}
            />
        ))}
      </div>
      <div className="loadMoreContainer">
        <button onClick={loadMoreMovies}>Load More</button>
      </div>
    </>
  );
};

export default MovieList
