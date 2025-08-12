import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Header = () => {
  const { state, logout } = useContext(AppContext);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // Debug user info
  useEffect(() => {
    console.log('Current user info:', userInfo);
  }, [userInfo]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="header-main">
          <Link to="/" className="header-logo">
            <h1>ShopEasy</h1>
          </Link>
          
          <div className="header-actions">
            <Link to="/cart" className="cart-link">
              <i className="bi bi-cart-fill"></i> Cart
              {state.cart.cartItems.length > 0 && (
                <span className="cart-badge">
                  {state.cart.cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>
            
            {userInfo ? (
              <div className="user-dropdown-container">
                <button
                  className="user-dropdown-toggle"
                  onClick={() => setShowDropdown(!showDropdown)}
                  aria-expanded={showDropdown}
                >
                  <i className="bi bi-person-fill user-icon"></i>
                  {userInfo.name}
                  <i className={`bi bi-chevron-${showDropdown ? 'up' : 'down'} dropdown-chevron`}></i>
                </button>
                
                {showDropdown && (
                  <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <i className="bi bi-person-circle me-2"></i> Profile
                    </Link>
                    <Link 
                      to="/order-history" 
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <i className="bi bi-receipt me-2"></i> My Orders
                    </Link>
                    
                    {userInfo.isAdmin && (
                      <Link 
                        to="/admin" 
                        className="dropdown-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        <i className="bi bi-speedometer2 me-2"></i> Admin Panel
                      </Link>
                    )}
                    
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item logout-item"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-link">
                <i className="bi bi-box-arrow-in-right me-1"></i> Login
              </Link>
            )}
          </div>
        </div>
      </div>

      <style>{`
        /* Base Styles */
        .header-container {
          background: linear-gradient(135deg, #22c9be 0%, #1aa89f 100%);
          color: white;
          padding: 1rem 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }

        .header-container:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .header-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Logo Styles */
        .header-logo {
          color: white;
          text-decoration: none;
          font-size: 1.5rem;
          font-weight: 700;
          transition: transform 0.3s ease;
        }

        .header-logo:hover {
          transform: scale(1.03);
        }

        .header-logo h1 {
          margin: 0;
          background: linear-gradient(to right, white, #e6f7f6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Header Actions */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        /* Cart Link */
        .cart-link {
          color: white;
          text-decoration: none;
          display: flex;
          align-items: center;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: all 0.3s ease;
          position: relative;
        }

        .cart-link:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .cart-badge {
          background-color: #ff6b6b;
          color: white;
          border-radius: 50%;
          padding: 0.2rem 0.5rem;
          font-size: 0.75rem;
          margin-left: 0.5rem;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        /* Login Link */
        .login-link {
          color: white;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .login-link:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        /* User Dropdown */
        .user-dropdown-container {
          position: relative;
        }

        .user-dropdown-toggle {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
        }

        .user-dropdown-toggle:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }

        .user-icon {
          margin-right: 0.5rem;
        }

        .dropdown-chevron {
          margin-left: 0.5rem;
          transition: transform 0.3s ease;
        }

        /* Dropdown Menu */
        .dropdown-menu {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 0.5rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          min-width: 200px;
          overflow: hidden;
          transform-origin: top right;
          animation: fadeIn 0.2s ease-out forwards;
          z-index: 1000;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          color: #333;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .dropdown-item:hover {
          background-color: #f0f0f0;
          color: #22c9be;
          padding-left: 1.25rem;
        }

        .dropdown-divider {
          height: 1px;
          background-color: #e0e0e0;
          margin: 0.25rem 0;
        }

        .logout-item {
          color: #ff6b6b;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
        }

        .logout-item:hover {
          color: #ff3b3b;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .header-content {
            padding: 0 1rem;
          }
          
          .header-actions {
            gap: 1rem;
          }
          
          .header-logo h1 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;