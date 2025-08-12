import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    return () => {
      setIsSubmitting(false);
    };
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Enhanced validation
    if (!email.trim()) {
      setError('Please enter your email address');
      setIsSubmitting(false);
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      setIsSubmitting(false);
      return;
    }

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate(redirect || '/');
    } catch (err) {
      // Handle different types of errors
      if (err.response && err.response.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Login failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-row">
        <div className="login-col">
          <div className="login-card">
            <div className="card-body">
              <h2 className="login-title">Sign In</h2>
              
              {error && (
                <div className="login-error">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={submitHandler}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={`form-input ${error?.toLowerCase().includes('email') ? 'is-invalid' : ''}`}
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className={`form-input ${error?.toLowerCase().includes('password') ? 'is-invalid' : ''}`}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                </div>

                <button 
                  type="submit" 
                  className="login-button"
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner" role="status" aria-hidden="true"></span>
                      Signing In...
                    </>
                  ) : 'Sign In'}
                </button>
              </form>

              <div className="login-footer">
                <small>
                  New Customer?{' '}
                  <Link 
                    to={redirect ? `/register?redirect=${redirect}` : '/register'}
                    className="register-link"
                  >
                    Create an account
                  </Link>
                </small>
                <div className="forgot-password">
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
 /* Base Styles */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: #f9f9f9;
}

.login-row {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
}

.login-col {
  width: 100%;
  max-width: 400px;
}

/* Card Styles */
.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(34, 201, 190, 0.15);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(34, 201, 190, 0.1);
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(34, 201, 190, 0.2);
}

.card-body {
  padding: 2.5rem;
}

/* Title Styles */
.login-title {
  color: #22c9be;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 700;
  font-size: 1.8rem;
  position: relative;
  letter-spacing: 0.5px;
}

.login-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #22c9be, #1aa89f);
  margin: 0.5rem auto 0;
  border-radius: 3px;
}

/* Error Message */
.login-error {
  background: #ffebee;
  color: #d32f2f;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  animation: fadeIn 0.3s ease-out;
  border-left: 4px solid #d32f2f;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(-10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #fafafa;
}

.form-input:focus {
  border-color: #22c9be;
  box-shadow: 0 0 0 3px rgba(34, 201, 190, 0.2);
  outline: none;
  background-color: white;
}

.form-input.is-invalid {
  border-color: #ff6b6b;
  background-color: #fff9f9;
}

.form-input.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
}

/* Button Styles */
.login-button {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #22c9be 0%, #1aa89f 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.login-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #1aa89f 0%, #22c9be 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 201, 190, 0.3);
}

.login-button:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
  opacity: 0.8;
}

.login-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

.login-button:focus:not(:active)::after {
  animation: ripple 1s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  100% {
    transform: scale(20, 20);
    opacity: 0;
  }
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Footer Links */
.login-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.9rem;
}

.register-link {
  color: #22c9be;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}

.register-link:hover {
  color: #1aa89f;
}

.register-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #1aa89f;
  transition: width 0.3s ease;
}

.register-link:hover::after {
  width: 100%;
}

.forgot-password {
  margin-top: 0.75rem;
}

.forgot-link {
  color: #666;
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.forgot-link:hover {
  color: #22c9be;
  text-decoration: underline;
}

/* Responsive Adjustments */
@media (max-width: 576px) {
  .login-container {
    padding: 1rem;
    background: #f9f9f9;
  }
  
  .card-body {
    padding: 1.5rem;
  }
  
  .login-title {
    font-size: 1.5rem;
  }
  
  .login-button {
    padding: 0.65rem;
  }
}

/* Accessibility Focus Styles */
.form-input:focus-visible,
.login-button:focus-visible,
.register-link:focus-visible,
.forgot-link:focus-visible {
  outline: 2px solid #1aa89f;
  outline-offset: 2px;
}
      `}</style>
    </div>
  );
};

export default Login;