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
      // url is based on currently active tab
      let url = `https://api.themoviedb.org/3/${activeTab === 'search' ? 'search/movie' : 'discover/movie'}?api_key=${apiKey}&page=${pageNum}`;

      // add search term to url if on search
      if (activeTab === 'search' && searchTerm) {
        url += `&query=${searchTerm}`;
      }

      // add sort option to url if now playing & sorting
      if (sortOption && activeTab === 'nowPlaying') {
        url += `&sort_by=${sortOption}`;
      }

      // add genre if conditions match
      if (selectedGenre && activeTab === 'nowPlaying') {
        url += `&with_genres=${selectedGenre}`;
      }

      // fetching
      const response = await fetch(url);
      const data = await response.json();
      console.log('Fetched data:', data);

      // if 1st page, movies is fetched data
      if (pageNum === 1) {
        setMovies(data.results);
      } else {
        // else append to existing
        setMovies((prevMovies) => [...prevMovies, ...data.results]);
      }
    }
    fetchMovie();
  }, [pageNum, sortOption, selectedGenre, activeTab, searchTerm]);

  // load movies incrementing by page num
  const loadMoreMovies = () => {
    setPageNum((prevPageNum) => prevPageNum + 1);
  };

  // fetch genre useEffect
  useEffect(() => {
    const fetchGenres = async () => {
      const apiKey = import.meta.env.VITE_API_KEY;
      const url = `https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setGenres(data.genres); // set genre to fetched data
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  // get genre name based on IDs
  const getGenreNames = (genreIds) => {
    return genreIds.map(id => genres.find(genre => genre.id === id)?.name).join(', ');
  };


  return (
    <>
    <div className='subheader'>
      <NavBar activeTab={activeTab} onTabChange={(tab) => {
        if (tab !== activeTab) {
          setActiveTab(tab);
          setPageNum(1);
          setMovies([]);
        }
      }} />
      {/* search only visible if active tab is search */}
      {activeTab === 'search' && (
        <div className='searchContainer'>
          <input
            type='text'
            placeholder='Search'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // update search term
          />
          <button onClick={() => {
            if (searchTerm.trim() !== '') {
              searchMovies(); // search if search input isn't empty
            }
          }}>Search</button>
        </div>
      )}
      {/* dropdown for sorting & filtering by genre */}
      {/* only shows if active tab is now playing */}
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
      </div>
      {/* list of movies fetched from the API displaying */}
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
      {/* load more only showing if active tab is now playing */}
      {activeTab === 'nowPlaying' && (
        <div className="loadMoreContainer">
          <button className='loadMoreButton' onClick={loadMoreMovies}>Load More</button>
        </div>
      )}
      {/* modal to show the selected movie */}
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
          <h4><span className='bold'>Release Date: </span>{selectedMovie.release_date}</h4>
          <h4><span className='bold'>Genres: </span>{getGenreNames(selectedMovie.genre_ids)}</h4>
          <h4><span className='bold'>Overview: </span>{selectedMovie.overview}</h4>
        </Modal>
      )}
      
    </>
  );
};

export default MovieList;
