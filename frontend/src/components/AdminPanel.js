import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const AdminPanel = () => {
  const { state } = useContext(AppContext);
  const { userInfo } = state;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/admin/login', { replace: true });
      return;
    }

    const controller = new AbortController();
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Updated API endpoint - removed '/admin' from path
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/products`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
            signal: controller.signal,
            timeout: 8000
          }
        );

        // Handle both array and object responses
        const productsData = Array.isArray(data) ? data : 
                          (data?.products ? data.products : []);
        
        setProducts(productsData.map(p => ({ ...p, isFeatured: true })));
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error('Fetch error:', err);
          const errorMessage = err.response?.status === 404 
            ? 'Products API endpoint not found. Please check backend configuration.'
            : err.response?.data?.message || err.message || 'Failed to load products';
          setError(errorMessage);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [userInfo, navigate]);

  const handleDelete = async (id) => {
    try {
      if (!window.confirm('Delete this product permanently?')) return;
      
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/products/${id}`,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
          timeout: 8000
        }
      );
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert(`Error: ${err.response?.data?.message || 'Failed to delete product'}`);
    }
  };

  if (!userInfo || !userInfo.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          <h3>Error Loading Products</h3>
          <p>{error}</p>
          <div className="d-flex gap-3 mt-3">
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => setError(null)}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5 py-5">
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <h2 className="mb-0">Product Management</h2>
        <div className="d-flex flex-wrap gap-2">
          <Link 
            to="/admin/products/create" 
            className="btn btn-primary"
          >
            Create Product
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="alert alert-info">
          <div className="d-flex justify-content-between align-items-center">
            <span>No products found</span>
            <Link to="/admin/products/create" className="btn btn-sm btn-info">
              Create First Product
            </Link>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th className="text-end">Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="rounded"
                        style={{width: '60px', height: '60px', objectFit: 'cover'}}
                        onError={(e) => {
                          e.target.src = '/images/placeholder-product.png';
                        }}
                      />
                      <div>
                        <strong>{product.name}</strong>
                        <div className="text-muted small">ID: {product._id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-end">${product.price.toFixed(2)}</td>
                  <td>
                    <span className={product.stock <= 0 ? 'text-danger fw-bold' : ''}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-success">Featured</span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex gap-2 justify-content-end">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
  /* Admin Panel Styles */
  .container.my-4 {
    padding: 2rem;
    max-width: 1400px;
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Header Styles */
  .d-flex.justify-content-between.mb-4 {
    margin-bottom: 2rem !important;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(34, 201, 190, 0.2);
  }

  h2.mb-0 {
    color: #22c9be;
    font-weight: 700;
    letter-spacing: 0.5px;
    position: relative;
    padding-bottom: 0.5rem;
  }

  h2.mb-0::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #22c9be, #1aa89f);
    border-radius: 3px;
  }

  /* Button Styles */
  .btn-primary {
    background: linear-gradient(135deg, #22c9be 0%, #1aa89f 100%);
    border: none;
    padding: 0.5rem 1.25rem;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 2px 8px rgba(34, 201, 190, 0.2);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 201, 190, 0.3);
  }

  .btn-outline-primary {
    color: #22c9be;
    border-color: #22c9be;
    transition: all 0.3s ease;
  }

  .btn-outline-primary:hover {
    background-color: rgba(34, 201, 190, 0.1);
  }

  .btn-outline-danger {
    transition: all 0.3s ease;
  }

  .btn-outline-danger:hover {
    background-color: rgba(220, 53, 69, 0.1);
  }

  /* Table Styles */
  .table-responsive {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    animation: slideUp 0.6s ease-out;
  }

  @keyframes slideUp {
    from { 
      opacity: 0; 
      transform: translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }

  .table {
    margin-bottom: 0;
  }

  .table-light {
    background-color: #f8f9fa;
  }

  .table thead th {
    border-bottom-width: 1px;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
    color: #495057;
    padding: 1rem 1.5rem;
  }

  .table tbody td {
    padding: 1.25rem 1.5rem;
    vertical-align: middle;
    transition: background-color 0.2s ease;
  }

  .table tbody tr {
    transition: all 0.2s ease;
  }

  .table tbody tr:hover td {
    background-color: rgba(34, 201, 190, 0.05);
  }

  /* Status Badge */
  .badge.bg-success {
    background-color: rgba(34, 201, 190, 0.15) !important;
    color: #1aa89f;
    font-weight: 500;
    padding: 0.35rem 0.6rem;
    border-radius: 50px;
  }

  /* Alert Styles */
  .alert {
    border-radius: 8px;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    animation: fadeIn 0.4s ease-out;
  }

  .alert-danger {
    background-color: rgba(220, 53, 69, 0.1);
    border-color: rgba(220, 53, 69, 0.2);
    color: #dc3545;
  }

  .alert-info {
    background-color: rgba(34, 201, 190, 0.1);
    border-color: rgba(34, 201, 190, 0.2);
    color: #1aa89f;
  }

  /* Loading Spinner */
  .spinner-border.text-primary {
    color: #22c9be !important;
    width: 3rem !important;
    height: 3rem !important;
    border-width: 0.25rem;
    animation: spinner-grow 0.75s linear infinite;
  }

  /* Image Styles */
  img.rounded {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  img.rounded:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .container.my-4 {
      padding: 1rem;
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
    
    .table tbody td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
    }
    
    .table tbody td::before {
      content: attr(data-label);
      font-weight: 600;
      margin-right: 1rem;
      color: #495057;
      font-size: 0.8rem;
    }
    
    .table tbody td.text-end {
      justify-content: flex-end;
    }
  }

  /* Focus States for Accessibility */
  button:focus-visible,
  a:focus-visible,
  .btn:focus-visible {
    outline: 2px solid #1aa89f;
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(34, 201, 190, 0.3);
  }
`}</style>
    </div>
  );
};

export default AdminPanel;