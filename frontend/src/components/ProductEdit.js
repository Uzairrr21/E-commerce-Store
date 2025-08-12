import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const ProductEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    image: '',
    stock: 0,
    isFeatured: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { state } = useContext(AppContext);
  const { userInfo } = state;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/products/${id}`,
          {
            headers: { 
              Authorization: `Bearer ${userInfo?.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        setFormData({
          name: data.name,
          price: data.price,
          description: data.description,
          image: data.image,
          stock: data.stock || data.countInStock || 0,
          isFeatured: data.isFeatured || false
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load product');
        if (err.response?.status === 404) {
          navigate('/admin/products', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.isAdmin) {
      fetchProduct();
    } else {
      navigate('/login', { state: { from: `/admin/products/${id}/edit` }, replace: true });
    }
  }, [id, userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/products/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/products', { replace: true });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  const handleBack = () => {
    navigate('/admin/products', { replace: true });
  };

  if (loading && !formData.name) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
        <button 
          className="btn btn-secondary mt-3"
          onClick={handleBack}
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title mb-4">Edit Product</h2>
          
          {success && (
            <div className="alert alert-success">
              Product updated successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={3}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
                minLength={10}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="image" className="form-label">Image URL</label>
              <input
                type="url"
                className="form-control"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                pattern="https?://.+"
              />
              {formData.image && (
                <div className="mt-2">
                  <img 
                    src={formData.image} 
                    alt="Product preview" 
                    className="img-thumbnail" 
                    style={{ maxHeight: '200px' }}
                    onError={(e) => e.target.src = '/images/placeholder-product.png'}
                  />
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="stock" className="form-label">Stock Quantity</label>
              <input
                type="number"
                className="form-control"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="isFeatured">
                Featured Product
              </label>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleBack}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>{`
  /* Product Edit Container */
  .container.my-5 {
    padding: 2rem;
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Card Styles */
  .card.shadow {
    border: none;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(34, 201, 190, 0.15) !important;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .card.shadow:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(34, 201, 190, 0.25) !important;
  }

  .card-body {
    padding: 2.5rem;
  }

  /* Header Styles */
  .card-title {
    color: #22c9be;
    font-weight: 700;
    position: relative;
    padding-bottom: 0.5rem;
    margin-bottom: 2rem;
  }

  .card-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #22c9be, #1aa89f);
    border-radius: 3px;
  }

  /* Alert Styles */
  .alert {
    border-radius: 8px;
    padding: 1rem 1.5rem;
    margin-bottom: 2rem;
    animation: slideDown 0.4s ease-out;
    border-left: 4px solid;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .alert-success {
    background-color: rgba(34, 201, 190, 0.1);
    border-color: rgba(34, 201, 190, 0.2);
    color: #1aa89f;
    border-left-color: #1aa89f;
  }

  .alert-danger {
    background-color: rgba(220, 53, 69, 0.1);
    border-color: rgba(220, 53, 69, 0.2);
    color: #dc3545;
    border-left-color: #dc3545;
    animation: shake 0.5s ease-in-out;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-5px); }
    40%, 80% { transform: translateX(5px); }
  }

  .bi-exclamation-triangle-fill {
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% { opacity: 0.8; }
    50% { opacity: 1; }
    100% { opacity: 0.8; }
  }

  /* Form Styles */
  .form-label {
    font-weight: 500;
    color: #555;
    margin-bottom: 0.5rem;
    display: block;
  }

  .form-control {
    padding: 0.75rem 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    transition: all 0.3s ease;
    background-color: #fafafa;
    margin-bottom: 1.5rem;
  }

  .form-control:focus {
    border-color: #22c9be;
    box-shadow: 0 0 0 3px rgba(34, 201, 190, 0.2);
    background-color: white;
  }

  /* Image Preview */
  .img-thumbnail {
    border-radius: 8px !important;
    border: 1px solid rgba(0, 0, 0, 0.05) !important;
    transition: all 0.3s ease;
    max-height: 200px;
    object-fit: contain;
  }

  .img-thumbnail:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* Checkbox Styles */
  .form-check {
    margin-bottom: 2rem;
  }

  .form-check-input {
    width: 1.2em;
    height: 1.2em;
    margin-top: 0.15em;
    border: 2px solid #e0e0e0;
    transition: all 0.2s ease;
  }

  .form-check-input:checked {
    background-color: #22c9be;
    border-color: #22c9be;
  }

  .form-check-input:focus {
    box-shadow: 0 0 0 3px rgba(34, 201, 190, 0.2);
  }

  .form-check-label {
    margin-left: 0.5rem;
    color: #555;
    font-weight: 500;
  }

  /* Button Styles */
  .btn-primary {
    background: linear-gradient(135deg, #22c9be 0%, #1aa89f 100%);
    border: none;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 4px 12px rgba(34, 201, 190, 0.2);
    min-width: 150px;
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

  .btn-outline-secondary {
    transition: all 0.3s ease;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    min-width: 100px;
  }

  .btn-outline-secondary:hover {
    background-color: #f1f1f1;
    transform: translateY(-2px);
  }

  /* Spinner */
  .spinner-border {
    width: 1rem;
    height: 1rem;
    border-width: 0.15em;
    vertical-align: middle;
  }

  /* Loading State */
  .text-center.my-5 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 300px;
  }

  .text-primary {
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

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .container.my-5 {
      padding: 1rem;
    }
    
    .card-body {
      padding: 1.5rem;
    }
    
    .d-flex.justify-content-between {
      flex-direction: column-reverse;
      gap: 1rem;
    }
    
    .btn-primary,
    .btn-outline-secondary {
      width: 100%;
    }
  }

  /* Focus States */
  button:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  .form-check-input:focus-visible {
    outline: 2px solid #1aa89f;
    outline-offset: 2px;
  }
`}</style>
    </div>
  );
};

export default ProductEdit;