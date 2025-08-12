import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

const UserProfile = () => {
  const { state, updateUserProfile } = useContext(AppContext);
  const { userInfo } = state;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [userInfo]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    if (!validateForm()) {
      setMessage({ text: 'Please fix the errors in the form', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      
      const updateData = {
        name: formData.name,
        email: formData.email,
        ...(formData.password && { password: formData.password })
      };

      await updateUserProfile(updateData);
      
      setMessage({ 
        text: 'Profile updated successfully!', 
        type: 'success' 
      });
      setFormData(prev => ({ 
        ...prev, 
        password: '', 
        confirmPassword: '' 
      }));
    } catch (error) {
      console.error('Update error:', error);
      setMessage({ 
        text: error.message || 'Failed to update profile', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title mb-4">User Profile</h2>
              
              {message.text && (
                <div className={`alert alert-${message.type}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name && 'is-invalid'}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email && 'is-invalid'}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    New Password
                    <small className="text-muted ms-2">(leave blank to keep current)</small>
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.password && 'is-invalid'}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword && 'is-invalid'}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  )}
                </div>

                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span 
                          className="spinner-border spinner-border-sm me-2" 
                          role="status" 
                          aria-hidden="true"
                        ></span>
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <style>{`
  /* === Profile Container === */
  .container.my-5 {
    padding: 3rem 1rem;
    animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* === Card Styles === */
  .card.shadow {
    border: none;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(34, 201, 190, 0.15);
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    border: 1px solid rgba(34, 201, 190, 0.1);
  }

  .card.shadow:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(34, 201, 190, 0.2);
  }

  .card-body {
    padding: 2.5rem;
  }

  /* === Header Styles === */
  .card-title {
    color: #22c9be;
    font-weight: 700;
    font-size: 1.8rem;
    position: relative;
    padding-bottom: 1rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  .card-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #22c9be, #1aa89f);
    border-radius: 3px;
  }

  /* === Alert Messages === */
  .alert {
    border-radius: 8px;
    padding: 1rem 1.5rem;
    margin-bottom: 2rem;
    border-left: 4px solid;
    animation: slideDown 0.4s ease-out;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .alert-success {
    background-color: rgba(34, 201, 190, 0.1);
    border-color: #1aa89f;
    color: #1aa89f;
  }

  .alert-error {
    background-color: rgba(220, 53, 69, 0.1);
    border-color: #dc3545;
    color: #dc3545;
    animation: gentleShake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97);
  }

  @keyframes gentleShake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
    40%, 60% { transform: translate3d(3px, 0, 0); }
  }

  /* === Form Styles === */
  .form-label {
    font-weight: 500;
    color: #555;
    margin-bottom: 0.5rem;
    display: block;
    transition: all 0.3s ease;
  }

  .form-control {
    padding: 0.75rem 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    transition: all 0.3s ease;
    background-color: #fafafa;
    font-size: 1rem;
  }

  .form-control:focus {
    border-color: #22c9be;
    box-shadow: 0 0 0 3px rgba(34, 201, 190, 0.2);
    background-color: white;
  }

  .form-control.is-invalid {
    border-color: #ff6b6b;
    background-color: #fff9f9;
  }

  .form-control.is-invalid:focus {
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
  }

  .invalid-feedback {
    color: #ff6b6b;
    font-size: 0.85rem;
    margin-top: 0.25rem;
    animation: fadeIn 0.3s ease-out;
  }

  .text-muted {
    color: #999 !important;
    font-size: 0.85rem;
  }

  /* === Button Styles === */
  .btn-primary {
    background: linear-gradient(135deg, #22c9be 0%, #1aa89f 100%);
    border: none;
    padding: 0.75rem;
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 4px 12px rgba(34, 201, 190, 0.2);
    position: relative;
    overflow: hidden;
  }

  .btn-primary:hover:not(:disabled) {
    background: linear-gradient(135deg, #1aa89f 0%, #22c9be 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(34, 201, 190, 0.3);
  }

  .btn-primary:disabled {
    background: #bdbdbd;
    cursor: not-allowed;
    opacity: 0.8;
  }

  .btn-primary::after {
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

  .btn-primary:focus:not(:active)::after {
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

  /* === Spinner === */
  .spinner-border {
    width: 1rem;
    height: 1rem;
    border-width: 0.15em;
    vertical-align: middle;
    color: white;
  }

  /* === Responsive Adjustments === */
  @media (max-width: 768px) {
    .container.my-5 {
      padding: 2rem 1rem;
    }
    
    .card-body {
      padding: 1.5rem;
    }
    
    .card-title {
      font-size: 1.6rem;
      margin-bottom: 1.5rem;
    }
  }

  @media (max-width: 576px) {
    .card-body {
      padding: 1.25rem;
    }
    
    .card-title {
      font-size: 1.5rem;
    }
    
    .form-control {
      padding: 0.65rem 0.9rem;
    }
  }

  /* === Accessibility Focus === */
  button:focus-visible,
  input:focus-visible {
    outline: 2px solid #1aa89f;
    outline-offset: 2px;
  }
`}</style>
    </div>
  );
};

export default UserProfile;