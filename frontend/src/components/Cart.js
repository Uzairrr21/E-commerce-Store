// src/components/Cart.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Cart = () => {
  const { state, removeFromCart } = useContext(AppContext);
  const { cartItems } = state.cart;
  const { userInfo } = state;
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!userInfo) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="container my-4">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="alert alert-info">
          Your cart is empty. <Link to="/">Go Back</Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            {cartItems.map((item) => (
              <div key={item._id} className="card mb-3">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src={item.image}
                      className="img-fluid rounded-start"
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text">${item.price.toFixed(2)}</p>
                      <div className="d-flex align-items-center">
                        <p className="card-text mb-0 me-3">Qty: {item.qty}</p>
                        <button
                          className="btn btn-danger"
                          onClick={() => removeFromCart(item._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Order Summary</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Subtotal
                    <span>
                      $
                      {cartItems
                        .reduce((acc, item) => acc + item.price * item.qty, 0)
                        .toFixed(2)}
                    </span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Shipping
                    <span>$0.00</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center fw-bold">
                    Total
                    <span>
                      $
                      {cartItems
                        .reduce((acc, item) => acc + item.price * item.qty, 0)
                        .toFixed(2)}
                    </span>
                  </li>
                </ul>
                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
  /* Cart Container */
  .container.my-4 {
    padding: 2rem;
    animation: fadeIn 0.4s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Header */
  h2 {
    color: #22c9be;
    font-weight: 700;
    margin-bottom: 2rem;
    position: relative;
    padding-bottom: 0.5rem;
  }

  h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #22c9be, #1aa89f);
    border-radius: 3px;
  }

  /* Empty Cart Alert */
  .alert-info {
    background-color: rgba(34, 201, 190, 0.1);
    border-color: rgba(34, 201, 190, 0.2);
    color: #1aa89f;
    border-radius: 8px;
    padding: 1.25rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .alert-info a {
    color: #1aa89f;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
    position: relative;
  }

  .alert-info a:hover {
    color: #22c9be;
  }

  .alert-info a::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: #22c9be;
    transition: width 0.3s ease;
  }

  .alert-info a:hover::after {
    width: 100%;
  }

  /* Cart Items */
  .card.mb-3 {
    border: none;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .card.mb-3:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }

  .img-fluid.rounded-start {
    height: 100%;
    width: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .img-fluid.rounded-start:hover {
    transform: scale(1.02);
  }

  .card-body {
    padding: 1.5rem;
  }

  .card-title {
    color: #333;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .card-text {
    color: #666;
    margin-bottom: 1rem;
  }

  /* Remove Button */
  .btn-danger {
    background-color: #ff6b6b;
    border: none;
    padding: 0.5rem 1.25rem;
    font-weight: 500;
    transition: all 0.3s ease;
    border-radius: 6px;
  }

  .btn-danger:hover {
    background-color: #ff5252;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(255, 107, 107, 0.3);
  }

  /* Order Summary */
  .card {
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  }

  .card-title {
    color: #22c9be;
    font-weight: 600;
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
  }

  .list-group-item {
    padding: 1rem 1.5rem;
    border-color: rgba(0, 0, 0, 0.05);
  }

  .list-group-item:last-child {
    border-bottom: none;
  }

  .fw-bold {
    color: #333;
    font-size: 1.1rem;
  }

  /* Checkout Button */
  .btn-primary {
    background: linear-gradient(135deg, #22c9be 0%, #1aa89f 100%);
    border: none;
    padding: 0.75rem;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(34, 201, 190, 0.2);
    letter-spacing: 0.5px;
  }

  .btn-primary:hover:not(:disabled) {
    background: linear-gradient(135deg, #1aa89f 0%, #22c9be 100%);
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(34, 201, 190, 0.3);
  }

  .btn-primary:disabled {
    background: #bdbdbd;
    cursor: not-allowed;
    opacity: 0.7;
    transform: none !important;
    box-shadow: none !important;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .container.my-4 {
      padding: 1rem;
    }
    
    .row.g-0 {
      flex-direction: column;
    }
    
    .col-md-4 {
      width: 100%;
      height: 200px;
    }
    
    .img-fluid.rounded-start {
      border-radius: 12px 12px 0 0 !important;
    }
  }

  /* Focus States */
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid #1aa89f;
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(34, 201, 190, 0.3);
  }
`}</style>
    </div>
  );
};

export default Cart;
