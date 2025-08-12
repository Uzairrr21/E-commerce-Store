import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const { register } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register(name, email, password);
      navigate(redirect);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Register</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={submitHandler}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Register
                </button>
              </form>
              <div className="mt-3 text-center">
                Already have an account?{' '}
                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
/* Register Component Styles */
.container.my-5 {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: #f9f9f9;
}

.row.justify-content-center {
  width: 100%;
  max-width: 1200px;
}

.col-md-6 {
  width: 100%;
  max-width: 450px;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(34, 201, 190, 0.15);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(34, 201, 190, 0.1);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(34, 201, 190, 0.2);
}

.card-body {
  padding: 2.5rem;
}

.card-title {
  color: #22c9be;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 700;
  font-size: 1.8rem;
  position: relative;
  letter-spacing: 0.5px;
}

.card-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #22c9be, #1aa89f);
  margin: 0.5rem auto 0;
  border-radius: 3px;
}

.alert-danger {
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
  border: none;
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

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #fafafa;
  margin-bottom: 1rem;
}

.form-control:focus {
  border-color: #22c9be;
  box-shadow: 0 0 0 3px rgba(34, 201, 190, 0.2);
  outline: none;
  background-color: white;
}

.btn-primary {
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
}

.btn-primary:hover {
  background: linear-gradient(135deg, #1aa89f 0%, #22c9be 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 201, 190, 0.3);
}

.btn-primary:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
  opacity: 0.8;
}

.mt-3.text-center {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.9rem;
}

.mt-3.text-center a {
  color: #22c9be;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}

.mt-3.text-center a:hover {
  color: #1aa89f;
}

.mt-3.text-center a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #1aa89f;
  transition: width 0.3s ease;
}

.mt-3.text-center a:hover::after {
  width: 100%;
}

/* Responsive Adjustments */
@media (max-width: 576px) {
  .container.my-5 {
    padding: 1rem;
  }
  
  .card-body {
    padding: 1.5rem;
  }
  
  .card-title {
    font-size: 1.5rem;
  }
  
  .btn-primary {
    padding: 0.65rem;
  }
}

/* Accessibility Focus Styles */
.form-control:focus-visible,
.btn-primary:focus-visible,
.mt-3.text-center a:focus-visible {
  outline: 2px solid #1aa89f;
  outline-offset: 2px;
}
      `}</style>
    </div>
  );
};

export default Register;