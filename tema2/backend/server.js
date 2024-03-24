const express = require('express');
const movieService = require('./movies-service');
const loginService = require('./login-service');
const reviewService = require('./review-service')
const cors = require('cors')
const serverApp = express();
const port = 5000;

serverApp.use(cors())
serverApp.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
  }));
serverApp.use('/api', movieService);
serverApp.use(loginService);
serverApp.use(reviewService)

serverApp.listen(port, () => {
    console.log(`Express server running on port ${port}`);
});
