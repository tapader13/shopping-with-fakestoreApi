import { useState, useEffect } from 'react';
import './login.css';
import { useNavigate } from 'react-router';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      router('/');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        // Force a small delay to ensure token is set
        setTimeout(() => {
          router('/');
        }, 100);
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-container'>
      <div className='login-card'>
        <div className='login-header'>
          <h1>Login</h1>
          <p>Enter your credentials to access your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='username'>Username</label>
            <input
              id='username'
              type='text'
              placeholder='johnd'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <p className='hint-text'>Try: johnd (Password: m38rmF$)</p>
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className='error-message'>{error}</div>}
          <button type='submit' className='login-button' disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
