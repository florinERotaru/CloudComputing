import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AliceCarousel from 'react-alice-carousel';
import './styles/slides.css';

import 'react-alice-carousel/lib/alice-carousel.css';

const Main = () => {
  const [movies, setMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const items = movies.map((movie, index) => (
    <div key={index} className="slideContainer" onClick={() => setCurrentSlide(index)}>
      <div className={index === currentSlide ? 'focusedThumbnail' : 'shadowedThumbnail'}>
        <img src={movie.thumbnail} alt={movie.title} />
        <p>{movie.title}</p>
      </div>
      {index === currentSlide && (
        <div className="slideInfo">
          <p><strong>Genres:</strong> {movie.genres.join(', ')}</p>
          <p>Actors: {movie.cast.join(', ')}</p>
          <p>Year: {movie.year}</p>
          <p>Plot: {movie.extract}</p>
        </div>
      )}
    </div>
  ));
  
  const onSlideChanged = (e) => {
    console.debug(`onSlideChange => Item's position before a change: ${e.item}. Event:`, e);
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
      </div>
      <div className="slider">
        <AliceCarousel
          mouseTracking
          items={items}
          responsive={responsive}
          disableDotsControls={true}
          onSlideChanged={onSlideChanged}
        />
      </div>
    </div>
  );
};

export default Main;
