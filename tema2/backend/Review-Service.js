const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const reviewService = express();

reviewService.use(express.json());

const REVIEWS_FILE = 'D:\\UNI 3.0 IASI\\cloud\\tema2\\backend\\reviews.json';

reviewService.get('/reviews/:title', async (req, res) => {
    try {
      console.log('right endpoint')
      const { title } = req.params;
      console.log(title);
      const reviews = loadReviews();
      const movieReviews = reviews.filter(review => review.title.toLowerCase() === title.toLowerCase());
      res.json(movieReviews);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve reviews.' });
    }
  });

reviewService.post('/reviews', async (req, res) => {
  try {
    const { username, title, reviewText, rating } = req.body;
    
    if (!username || !title || !reviewText || !rating) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    
    const newReview = {
      username,
      title,
      reviewText,
      rating
    };

    const reviews = loadReviews()
    reviews.push(newReview);
    saveReviews(reviews);
    res.status(201).json({ message: 'Review added successfully.', review: newReview });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to add review.' });
  }
});

function loadReviews() {
  try {
    const content = fs.readFileSync(REVIEWS_FILE, 'utf8');
    data = JSON.parse(content)
    console.log(data)
    return data;
  } catch (error) {
    // If file doesn't exist or cannot be read, return an empty array
    return [];
  }
}

function saveReviews(reviews) {
//   console.log(reviews)
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
}

module.exports = reviewService;
