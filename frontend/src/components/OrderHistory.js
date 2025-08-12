import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const OrderHistory = () => {
  const { state, getMyOrders } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [getMyOrders]);

  useEffect(() => {
    if (state.userInfo) {
      fetchOrders();
    }
  }, [state.userInfo, fetchOrders]);

  const handleImageError = (e) => {
    e.target.src = '/images/placeholder-product.png';
  };

  const handleRetry = () => {
    fetchOrders();
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleRetry}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Your Order History</h2>
      {orders.length === 0 ? (
        <div className="alert alert-info">
          You haven't placed any orders yet. <Link to="/">Start shopping!</Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      {order.orderItems[0]?.image && (
                        <img
                          src={order.orderItems[0].image}
                          alt={order.orderItems[0].name}
                          className="img-thumbnail me-3"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          onError={handleImageError}
                        />
                      )}
                      <div>
                        <div className="fw-bold">#{order._id.substring(18, 24)}</div>
                        <small>{order.orderItems.length} items</small>
                      </div>
                    </div>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${order.isPaid ? 'bg-success' : 'bg-warning'}`}>
                      {order.isPaid ? 'Completed' : 'Processing'}
                    </span>
                  </td>
                  <td>
                    <Link 
                      to={`/order/${order._id}`} 
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <style>{`
  /* Order History Container */
  .container.my-5 {
    padding: 2rem;
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Header Styles */
  h2.mb-4 {
    color: #22c9be;
    font-weight: 700;
    position: relative;
    padding-bottom: 0.5rem;
  }

  h2.mb-4::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #22c9be, #1aa89f);
    border-radius: 3px;
  }

  /* Loading State */
  .text-center.my-5 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 300px;
  }

  .spinner-border.text-primary {
    width: 3rem;
    height: 3rem;
    border-width: 0.25em;
    color: #22c9be !important;
    animation: spinner-grow 1s linear infinite;
  }

  @keyframes spinner-grow {
    0% { transform: scale(0.8); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(0.8); opacity: 0.5; }
  }

  .text-center.my-5 p {
    color: #666;
    margin-top: 1rem;
    font-size: 1.1rem;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { opacity: 0.8; }
    50% { opacity: 1; }
    100% { opacity: 0.8; }
  }

  /* Error State */
  .alert-danger {
    background-color: rgba(220, 53, 69, 0.1);
    border-color: rgba(220, 53, 69, 0.2);
    color: #dc3545;
    border-radius: 8px;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    animation: shake 0.5s ease-in-out;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-5px); }
    40%, 80% { transform: translateX(5px); }
  }

  .btn-primary {
    background: linear-gradient(135deg, #22c9be 0%, #1aa89f 100%);
    border: none;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    border-radius: 50px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 4px 12px rgba(34, 201, 190, 0.2);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(34, 201, 190, 0.3);
  }

  /* Empty State */
  .alert-info {
    background-color: rgba(34, 201, 190, 0.1);
    border-color: rgba(34, 201, 190, 0.2);
    color: #1aa89f;
    border-radius: 8px;
    padding: 1.25rem;
    animation: fadeIn 0.6s ease-out;
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

  /* Table Styles */
  .table-responsive {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
    animation: slideUp 0.6s ease-out;
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .table {
    margin-bottom: 0;
  }

  .table-dark {
    background: linear-gradient(135deg, #22c9be 0%, #1aa89f 100%);
    color: white;
  }

  .table-dark th {
    border: none;
    padding: 1rem 1.5rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.85rem;
  }

  .table-hover tbody tr {
    transition: all 0.3s ease;
  }

  .table-hover tbody tr:hover {
    background-color: rgba(34, 201, 190, 0.05);
    transform: translateX(5px);
  }

  .table-striped>tbody>tr:nth-child(odd)>* {
    background-color: rgba(34, 201, 190, 0.02);
  }

  .table td {
    padding: 1.25rem 1.5rem;
    vertical-align: middle;
    border-color: rgba(0, 0, 0, 0.05);
  }

  /* Image Styles */
  .img-thumbnail {
    border-radius: 8px !important;
    border: 1px solid rgba(0, 0, 0, 0.05) !important;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .img-thumbnail:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* Badge Styles */
  .badge {
    padding: 0.5rem 0.75rem;
    font-weight: 500;
    border-radius: 50px;
    font-size: 0.8rem;
    transition: all 0.3s ease;
  }

  .bg-success {
    background-color: rgba(34, 201, 190, 0.15) !important;
    color: #1aa89f;
  }

  .bg-warning {
    background-color: rgba(255, 193, 7, 0.15) !important;
    color: #ffc107;
  }

  /* Button Styles */
  .btn-outline-primary {
    color: #22c9be;
    border-color: #22c9be;
    transition: all 0.3s ease;
    border-radius: 50px;
    padding: 0.375rem 0.75rem;
  }

  .btn-outline-primary:hover {
    background-color: rgba(34, 201, 190, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(34, 201, 190, 0.1);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .container.my-5 {
      padding: 1rem;
    }
    
    .table-responsive {
      overflow-x: auto;
    }
    
    .table thead {
      display: none;
    }
    
    .table tbody tr {
      display: block;
      margin-bottom: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .table td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
    }
    
    .table td::before {
      content: attr(data-label);
      font-weight: 600;
      margin-right: 1rem;
      color: #495057;
      font-size: 0.8rem;
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

export default OrderHistory;