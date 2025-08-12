import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const ProductCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    stock: '',
    isFeatured: true // Default to true for all products
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { state } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? checked 
        : type === 'number' 
          ? value === '' 
            ? '' 
            : parseFloat(value)
          : value
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.description || !formData.image) {
      setError('Please fill in all required fields');
      return;
    }

    // Convert empty strings to 0 for price and stock
    const submissionData = {
      ...formData,
      price: formData.price === '' ? 0 : parseFloat(formData.price),
      stock: formData.stock === '' ? 0 : parseInt(formData.stock)
    };

    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/products`,
        submissionData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state.userInfo?.token}`,
          },
          timeout: 10000 // 10 second timeout
        }
      );
      
      // Redirect to admin products list with success state
      navigate('/admin', { 
        state: { 
          success: `Product "${data.name}" created successfully!`,
          scrollToTop: true
        } 
      });
    } catch (err) {
      console.error('Create product error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to create product. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Create New Product</h2>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>

          {error && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={submitHandler}>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Product Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Price <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    Image URL <span className="text-danger">*</span>
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="img-thumbnail" 
                        style={{ maxHeight: '150px' }}
                        onError={(e) => {
                          e.target.src = '/images/placeholder-product.png';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="stock" className="form-label">
                    Stock Quantity <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="stock"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-check form-switch mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    disabled // Disabled since all products are featured
                  />
                  <label className="form-check-label" htmlFor="isFeatured">
                    Featured Product
                  </label>
                  <small className="text-muted d-block">
                    (All products are automatically featured)
                  </small>
                </div>
              </div>

              <div className="col-12">
                <div className="d-flex gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : 'Create Product'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/admin')}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <style>{`
  /* Product Create Container */
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
  h2 {
    color: #22c9be;
    font-weight: 700;
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

  /* Alert Styles */
  .alert-danger {
    background-color: rgba(220, 53, 69, 0.1);
    border-color: rgba(220, 53, 69, 0.2);
    color: #dc3545;
    border-radius: 8px;
    padding: 1rem 1.5rem;
    margin-bottom: 1.5rem;
    animation: shake 0.5s ease-in-out;
    border-left: 4px solid #dc3545;
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

  .text-danger {
    color: #ff6b6b !important;
  }

  .form-control {
    padding: 0.75rem 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    transition: all 0.3s ease;
    background-color: #fafafa;
  }

  .form-control:focus {
    border-color: #22c9be;
    box-shadow: 0 0 0 3px rgba(34, 201, 190, 0.2);
    background-color: white;
  }

  .input-group-text {
    background-color: #f1f1f1;
    color: #555;
    font-weight: 500;
  }

  /* Image Preview */
  .img-thumbnail {
    border-radius: 8px !important;
    border: 1px solid rgba(0, 0, 0, 0.05) !important;
    transition: all 0.3s ease;
    max-height: 150px;
    object-fit: contain;
  }

  /* Switch Styles */
  .form-switch .form-check-input {
    width: 3em;
    height: 1.5em;
    background-color: #e0e0e0;
    border-color: #e0e0e0;
    cursor: not-allowed;
  }

  .form-switch .form-check-input:checked {
    background-color: #22c9be;
    border-color: #22c9be;
  }

  .form-switch .form-check-input:focus {
    box-shadow: 0 0 0 0.25rem rgba(34, 201, 190, 0.25);
  }

  .text-muted {
    font-size: 0.85rem;
    color: #999 !important;
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

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .container.my-5 {
      padding: 1rem;
    }
    
    .card-body {
      padding: 1.5rem;
    }
    
    .d-flex.justify-content-between {
      flex-direction: column;
      gap: 1rem;
    }
    
    h2 {
      font-size: 1.75rem;
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

export default ProductCreate;