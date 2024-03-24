import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AliceCarousel from 'react-alice-carousel';
import './styles/slides.css';

import { useNavigate, useLocation } from 'react-router-dom';
import 'react-alice-carousel/lib/alice-carousel.css';
import userEvent from '@testing-library/user-event';

const Main = () => {
  const [username, setUsername] = useState('')

  const navigate = useNavigate();

  const location = useLocation();
  

  useEffect(() => {
    if (location.state && location.state.username) {
      setUsername(location.state.username)
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

    const [movies, setMovies] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [selectedMovieReviews, setSelectedMovieReviews] = useState([]);
    const carousel = useRef(null);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const handleReviewSubmit = async () => {
    console.log(username)
    console.log(reviewText)
    console.log(movies[currentSlide].title)
    console.log(rating)
    try {
      const response = await axios.post('http://localhost:5000/reviews', {
        username,
        title: movies[currentSlide].title,
        reviewText,
        rating
      });
      console.log('Review submitted:', response.data);
      // Refresh the reviews for the selected movie
      fetchReviews(movies[currentSlide].title);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };
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

  const fetchReviews = async (title) => {
    try {
      const response = await axios.get(`http://localhost:5000/reviews/${title}`);
      setSelectedMovieReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSearch = () => {
    const trimmedSearchInput = searchInput.trim().toUpperCase();
    const foundIndex = movies.findIndex(movie =>
      movie.title.toUpperCase().includes(trimmedSearchInput)
    );

    if (foundIndex !== -1) {
      if (foundIndex < currentSlide || foundIndex >= currentSlide + 4) {
        const scrollDistance = foundIndex - currentSlide;
        carousel.current.slideTo(currentSlide + scrollDistance);
        setCurrentSlide(foundIndex);
      } else {
        setCurrentSlide(foundIndex);
      }
      fetchReviews(movies[foundIndex].title); // Fetch reviews for the selected movie
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
      {index === currentSlide && selectedMovieReviews.length > 0 && (
        <div className="selectedMovieReviews">
          <h3>Reviews for Selected Movie:</h3>
          <ul>
            {selectedMovieReviews.map((review, index) => (
              <li key={index}>
                <p><strong>{review.username}</strong></p>
                <p><strong>Wrote:</strong> "{review.reviewText}"</p>
                <p><strong>Rating:</strong> {review.rating}/5</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  ));

  const handleSlideClick = (index) => {
    setCurrentSlide(index);
    fetchReviews(movies[index].title); // Fetch reviews for the selected movie
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
  const customPrevButton = <div className="customPrevButton">{'<<<'}</div>;
  const customNextButton = <div className="customNextButton">{'>>>'}</div>;

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
          ref={carousel}
          renderPrevButton={() => customPrevButton}
          renderNextButton={() => customNextButton}
        />
      
      {(
        <div>
          {/* Previous code for displaying movie details */}
          <div className="leaveReview">
            <h3>Leave a Review:</h3>
            <textarea
              value={reviewText}
              onChange={event => setReviewText(event.target.value)}
              placeholder="Write your review here..."
              rows="4"
              cols="50"
            />
            <label>Rating:</label>
            <select value={rating} onChange={event => setRating(event.target.value)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <div>
            <button onClick={handleReviewSubmit}>Submit Review</button>
            </div>
          </div>
        </div>
      )}
      </div>

    </div>
  );
  
};

export default Main;
