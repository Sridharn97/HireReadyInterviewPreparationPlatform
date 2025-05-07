import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { BookOpen, User, Lock } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, user } = useAuth();
  const { users } = useData();
  const navigate = useNavigate();
  
  // If already logged in, redirect
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} />;
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Find user
    const matchedUser = users.find(
      u => u.username === username && u.password === password
    );
    
    if (matchedUser) {
      login(matchedUser);
      navigate(matchedUser.role === 'admin' ? '/admin' : '/user');
    } else {
      setErrorMessage('Invalid username or password');
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <BookOpen size={32} />
            <h1>LearnHub</h1>
          </div>
          <p className="login-subtitle">Your learning journey starts here</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="login-error">
              {errorMessage}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username" className="login-label">
              <User size={18} />
              <span>Username</span>
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="login-label">
              <Lock size={18} />
              <span>Password</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <Button type="submit" variant="primary" fullWidth className="login-button">
            Login
          </Button>

          <div className="signup-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;