import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AliceCarousel from 'react-alice-carousel';
import './styles/slides.css';

import 'react-alice-carousel/lib/alice-carousel.css';

const Main = () => {
  const [movies, setMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const carousel = useRef(null); // Add this line to create the carousel ref

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/movies');
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = () => {
    const trimmedSearchInput = searchInput.trim().toUpperCase();
    const foundIndex = movies.findIndex(movie =>
      movie.title.toUpperCase().includes(trimmedSearchInput)
    );

    if (foundIndex !== -1) {
      if (foundIndex < currentSlide || foundIndex >= currentSlide + 4) {
        const scrollDistance = foundIndex - currentSlide;
        carousel.current.slideTo(currentSlide + scrollDistance); // Access the carousel using the ref
        setCurrentSlide(foundIndex);
      } else {
        setCurrentSlide(foundIndex);
      }
    } else {
      console.log('Movie not found');
    }
  };

  const items = movies.map((movie, index) => (
    <div
      key={index}
      className={index === currentSlide ? 'slideContainer focusedThumbnail' : 'slideContainer shadowedThumbnail'}
      onClick={() => handleSlideClick(index)}
    >
      <div>
        <img src={movie.thumbnail} alt={movie.title} />
        <p>{movie.title}</p>
      </div>
      {index === currentSlide && (
        <div className="slideInfo">
          <p><strong>Genres:</strong> {movie.genres.join(', ')}</p>
          <p><strong>Cast:</strong>: {movie.cast.join(', ')}</p>
          <p><strong>Year:</strong>: {movie.year}</p>
          <p><strong>Plot:</strong>: {movie.extract}</p>
        </div>
      )}
    </div>
  ));

  const handleSlideClick = (index) => {
    setCurrentSlide(index);
    if (carousel.current) {
      carousel.current.slideTo(index);
    }
  };
  
  const onSlideChanged = (e) => {
    setCurrentSlide(e.item);
    console.log(movies[e.item].title);
  };

  const responsive = {
    0: { items: 1 },
    568: { items: 1 },
    1024: { items: 4 }
  };

  return (
    <div>
      <div align='center'>
        <h2 className="text">Featured Movies</h2>
        <input 
          className='searchBar'
          onChange={event => setSearchInput(event.target.value)}
          value={searchInput}
          placeholder="Enter The Title Of Movie"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="slider">
        <AliceCarousel
          mouseTracking
          items={items}
          responsive={responsive}
          disableDotsControls={true}
          onSlideChanged={onSlideChanged}
          ref={carousel} // Assign the ref to the AliceCarousel component
        />
      </div>
    </div>
  );
};

export default Main;
