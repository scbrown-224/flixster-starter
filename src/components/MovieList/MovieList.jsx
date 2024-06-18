import React, { useEffect, useState } from 'react';
import './MovieList.css';
import MovieCard from '../MovieCard/MovieCard';
import Modal from '../Modal/Modal';
import NavBar from '../NavBar/NavBar';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [activeTab, setActiveTab] = useState('nowPlaying');

  useEffect(() => {
    async function fetchMovie() {
      const apiKey = import.meta.env.VITE_API_KEY;
      let url = `https://api.themoviedb.org/3/${activeTab === 'search' ? 'search/movie' : 'discover/movie'}?api_key=${apiKey}&page=${pageNum}`;

      if (activeTab === 'search' && searchTerm) {
        url += `&query=${searchTerm}`;
      }

      if (sortOption && activeTab === 'nowPlaying') {
        url += `&sort_by=${sortOption}`;
      }

      if (selectedGenre && activeTab === 'nowPlaying') {
        url += `&with_genres=${selectedGenre}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      console.log('Fetched data:', data);

      if (pageNum === 1) {
        setMovies(data.results);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...data.results]);
      }
    }
    fetchMovie();
  }, [pageNum, sortOption, selectedGenre, activeTab, searchTerm]);

  const loadMoreMovies = () => {
    setPageNum((prevPageNum) => prevPageNum + 1);
  };

  useEffect(() => {
    const fetchGenres = async () => {
      const apiKey = import.meta.env.VITE_API_KEY;
      const url = `https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  const getGenreNames = (genreIds) => {
    return genreIds.map(id => genres.find(genre => genre.id === id)?.name).join(', ');
  };


  return (
    <>
      <NavBar activeTab={activeTab} onTabChange={(tab) => {
        if (tab !== activeTab) {
          setActiveTab(tab);
          setPageNum(1);
          setMovies([]);
        }
      }} />

      {activeTab === 'search' && (
        <div className='searchContainer'>
          <input
            type='text'
            placeholder='Search'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => {
            if (searchTerm.trim() !== '') {
              searchMovies();
            }
          }}>Search</button>
        </div>
      )}
      {activeTab === 'nowPlaying' && (
        <div className='dropdownContainer'>
          <select value={sortOption} onChange={(e) => {
            setSortOption(e.target.value);
            setPageNum(1);
          }}>
            <option value=''>Sort By</option>
            <option value='popularity.desc'>Popularity Descending</option>
            <option value='release_date.desc'>Release Date Descending</option>
            <option value='vote_average.desc'>Rating Descending</option>
            <option value='original_title.asc'>Alphabetical</option>
          </select>
          <select value={selectedGenre} onChange={(e) => {
            setSelectedGenre(e.target.value);
            setPageNum(1);
          }}>
            <option value=''>All Genres</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
        </div>
      )}
      <div className='movie-list'>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            img={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            title={movie.original_title}
            rating={movie.vote_average}
            onClick={() => setSelectedMovie(movie)}
          />
        ))}
      </div>
      {activeTab === 'nowPlaying' && (
        <div className="loadMoreContainer">
          <button onClick={loadMoreMovies}>Load More</button>
        </div>
      )}
      {selectedMovie && (
        <Modal
          show={selectedMovie !== null}
          onClose={() => setSelectedMovie(null)}
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}`}
            alt={selectedMovie.original_title}
            style={{ width: "100%" }}
          />
          <h2>{selectedMovie.original_title}</h2>
          <h4>Release Date: {selectedMovie.release_date}</h4>
          <h4>Genres: {getGenreNames(selectedMovie.genre_ids)}</h4>
          <h4>Overview: {selectedMovie.overview}</h4>
        </Modal>
      )}
    </>
  );
};

export default MovieList;
