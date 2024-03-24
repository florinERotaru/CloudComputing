import React, { useState } from 'react';
import loginImage from './models/thumbnail.png'; // Import your image file (adjust the path as needed)
import axios from 'axios';

import { useNavigate } from 'react-router-dom'; 
const Register = () => {
  const navigate = useNavigate(); 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [prompt, setPrompt] = useState('');


  const handleRegister = async () => {
  if (password !== repeatPassword || (username == '') || (password == '')) {
    setPrompt('Passwords do not match or input is invalid');
    return;
  }
  try{
    const response = await axios.post('http://localhost:5000/register', { username, password });
    localStorage.setItem('token', response.data.token); // Store token in local storage
    setPrompt(response.data)
    navigate('/main', { state: { username } });
  }catch(error){
    setPrompt(error.response.data)
  }
}

  

  return (
    <div className="login-container">
      <div className="login-form">
        <p className="text">Movie-Critiq.</p>
        <img src={loginImage} alt="Login" className="login-image" />
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <input type="password" placeholder="Repeat Password" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} />
        <button onClick={handleRegister}>Register</button>
        {prompt && <p >{prompt}</p>}
      </div>
    </div>
  );
}
export default Register;
