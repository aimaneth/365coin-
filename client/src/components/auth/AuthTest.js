import React, { useState } from 'react';
import axios from 'axios';

const AuthTest = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/signup', formData);
      setMessage(`User created successfully! Token: ${response.data.token}`);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      setMessage('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      setMessage(`Login successful! Token: ${response.data.token}`);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setMessage('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Auth Test</h2>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {message && <div style={{ color: 'green' }}>{message}</div>}
      
      <form onSubmit={handleSignup} style={{ marginBottom: '20px' }}>
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Sign Up</button>
        <button type="button" onClick={handleLogin}>Login</button>
      </form>
    </div>
  );
};

export default AuthTest; 