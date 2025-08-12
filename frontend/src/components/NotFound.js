import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h1 className="display-4 text-danger">404</h1>
              <h2 className="mb-4">Page Not Found</h2>
              <p className="lead">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <Link to="/" className="btn btn-primary">
                <i className="bi bi-house-door me-2"></i>
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <style>{`
  /* 404 Page Container */
  .container.my-5 {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 2rem;
    animation: fadeIn 0.6s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Card Styles */
  .card.shadow-sm {
    border: none;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(34, 201, 190, 0.15);
    border: 1px solid rgba(34, 201, 190, 0.1);
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .card.shadow-sm:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(34, 201, 190, 0.2);
  }

  .card-body {
    padding: 3rem 2rem;
  }

  /* Typography */
  .display-4 {
    font-size: 5rem;
    font-weight: 700;
    color: #ff6b6b;
    margin-bottom: 1rem;
    text-shadow: 0 3px 6px rgba(255, 107, 107, 0.2);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  h2 {
    color: #22c9be;
    font-weight: 600;
    margin-bottom: 1.5rem;
    position: relative;
    display: inline-block;
  }

  h2::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #22c9be, #1aa89f);
    border-radius: 3px;
  }

  .lead {
    color: #666;
    font-size: 1.25rem;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  /* Button Styles */
  .btn-primary {
    background: linear-gradient(135deg, #22c9be 0%, #1aa89f 100%);
    border: none;
    padding: 0.75rem 1.75rem;
    font-weight: 500;
    border-radius: 50px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 4px 15px rgba(34, 201, 190, 0.3);
    display: inline-flex;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(34, 201, 190, 0.4);
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

  .bi-house-door {
    transition: transform 0.3s ease;
  }

  .btn-primary:hover .bi-house-door {
    transform: translateX(-3px);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .container.my-5 {
      padding: 1.5rem;
      min-height: 70vh;
    }
    
    .display-4 {
      font-size: 4rem;
    }
    
    .card-body {
      padding: 2rem 1.5rem;
    }
    
    .lead {
      font-size: 1.1rem;
    }
  }

  /* Focus States */
  .btn-primary:focus-visible {
    outline: 2px solid #1aa89f;
    outline-offset: 2px;
  }
`}</style>
    </div>
  );
};

export default NotFound;