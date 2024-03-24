const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const loginService = express();
const usersFilePath = 'D:\\UNI 3.0 IASI\\cloud\\tema2\\backend\\registered-users.json'

loginService.use(express.json());
// Login route
loginService.post('/login', (req, res) => {
  console.log(req.body)
  user = ''
  const { username, password } = req.body;
  fileContents = fs.readFileSync(usersFilePath, 'utf8')
  try {
    if (fileContents.trim() === '') {
      users = ''
    } else{
      users = JSON.parse(fileContents); // Read users from JSON file
      user = users.find(user => user.username === username);
    }

  } catch (error) {
    console.error('Error parsing users data:', error);
    return res.status(500).send('Internal server error');
  }
  // Find user by username
  if (!user || user == '') {
    return res.status(401).send('Invalid username or password');
  }

  // Compare hashed passwords
  bcrypt.compare(password.toString(), user.password.toString(), (err, result) => {
    if (err || !result) {
      return res.status(401).send('Invalid username or password');
    }
    res.send('Login successful');
  });
});

// Register route
loginService.post('/register', (req, res) => {
  const { username, password } = req.body;
  let users;

  try {
    // Read the contents of the JSON file
    const fileContents = fs.readFileSync(usersFilePath, 'utf8');
    if (!username || !password || username.length <2 || password.toString().length<2) {
      return res.status(400).send('Invalid username or password');
    }
    // Check if the file is empty
    if (fileContents.trim() === '') {
      console.log('The JSON file is empty.');
      users = []
    } else {
      // Parse the JSON data
      users = JSON.parse(fileContents);
      // Check if username is taken
      if (users.find(user => user.username === username)) {
        return res.status(400).send('Username is already taken');
      }
    }
  } catch (error) {
    console.error('Error reading/parsing users data:', error);
    console.log("aici1")
    return res.status(500).send('Internal server error');
  }
  // Hash password
  bcrypt.hash(password.toString(), 10, (err, hashedPassword) => {
    if (err) {
      console.log("aici1")
      console.log(err)
      return res.status(500).send('Internal server error ');
    }

    // Add new user to users array
    const newUser = { username, password: hashedPassword };
    users.push(newUser);

    // Write updated users array to JSON file
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.send('Registration successful');
  });
});

module.exports = loginService;
