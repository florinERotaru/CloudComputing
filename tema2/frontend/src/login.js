import React, { useState } from 'react';
import axios from 'axios';
import { Link, Route, Routes } from 'react-router-dom'; // Import Link from react-router-dom
import './styles/login.css'; // Import CSS file for styling (create if not exists)
import loginImage from './models/thumbnail.png'; // Import your image file (adjust the path as needed)
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async () => {
    try {
      if ((username == '') || (password == '')) {
        setPrompt('Invalid input');
        return;
      }
      const response = await axios.post('http://localhost:5000/login', { username, password });
      setPrompt(response.data)
      navigate('/main')
      console.log("hellosss")
      
    } catch (error) {
      setPrompt(error.response.data)
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <p className = "text" >Movie-Critiq.</p>
        <img src={loginImage} alt="Login" className="login-image" />
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <div className="register-link">
          <p>Don't have an account? <Link to="/register">Register</Link></p> {/* Link to registration page */}
        {prompt && <p >{prompt}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
