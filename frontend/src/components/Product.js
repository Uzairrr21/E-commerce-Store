import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';

const Product = ({ product }) => {
  const { state, addToCart } = useContext(AppContext);
  const { userInfo } = state;
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartError, setCartError] = useState(null);

  const countInStock = product?.countInStock ?? product?.stock ?? 0;
  const fallbackImage = '/images/product-placeholder.jpg';

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      setCartError(null);

      if (countInStock <= 0) {
        throw new Error('This product is currently out of stock');
      }

      if (qty > countInStock) {
        throw new Error(`Only ${countInStock} item(s) available`);
      }

      const cartProduct = {
        ...product,
        _id: product._id,
        name: product.name || 'Unnamed Product',
        image: product.image || fallbackImage,
        price: product.price || 0,
        countInStock: countInStock,
        stock: countInStock
      };

      await addToCart(cartProduct, qty);
    } catch (err) {
      setCartError(err.message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10) || 1;
    setQty(Math.max(1, Math.min(countInStock, value)));
  };

  return (
    <Card className="h-100 shadow-sm product-card">
      <div className="text-center p-3" style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
        <Card.Img
          variant="top"
          src={imgError ? fallbackImage : (product.image || fallbackImage)}
          style={{
            maxHeight: '100%',
            width: 'auto',
            objectFit: 'contain',
            mixBlendMode: imgError ? 'luminosity' : 'normal'
          }}
          onError={() => setImgError(true)}
          alt={product.name || 'Product image'}
          loading="lazy"
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-2 fs-6">
          {product.name || 'Unnamed Product'}
        </Card.Title>

        <Card.Text className="text-muted small mb-2" style={{ flexGrow: 1 }}>
          {product.description
            ? (product.description.length > 100
              ? `${product.description.substring(0, 100)}...`
              : product.description)
            : 'No description available'}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 text-primary">
            ${(product.price || 0).toFixed(2)}
            {countInStock <= 10 && countInStock > 0 && (
              <span className="text-danger small ms-2">
                (Only {countInStock} left!)
              </span>
            )}
          </h5>

          <Badge bg={countInStock > 0 ? 'success' : 'secondary'} pill>
            {countInStock > 0 ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>

        {cartError && (
          <Alert variant="danger" className="py-1 mb-2">
            {cartError}
          </Alert>
        )}

        {userInfo && countInStock > 0 && (
          <div className="mt-auto">
            <div className="input-group mb-2">
              <input
                type="number"
                min="1"
                max={countInStock}
                value={qty}
                onChange={handleQuantityChange}
                className="form-control"
                aria-label="Quantity"
                disabled={isAddingToCart}
              />
              <Button
                variant="primary"
                onClick={handleAddToCart}
                disabled={isAddingToCart || countInStock <= 0}
              >
                {isAddingToCart ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Adding...
                  </>
                ) : (
                  'Add to Cart'
                )}
              </Button>
            </div>
            <style>{`
  /* === Product Card Container === */
  .product-card {
    border: none;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    background: white;
    position: relative;
  }

  .product-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 25px rgba(34, 201, 190, 0.15);
    border: 1px solid rgba(34, 201, 190, 0.1);
  }

  /* === Image Container === */
  .product-card .text-center {
    background-color: #f8f9fa;
    position: relative;
    overflow: hidden;
    transition: background-color 0.3s ease;
  }

  .product-card:hover .text-center {
    background-color: #f1f9f9;
  }

  .card-img-top {
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .product-card:hover .card-img-top {
    transform: scale(1.05);
  }

  /* === Card Body === */
  .card-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
  }

  /* === Title Styles === */
  .card-title {
    color: #1a3a4a;
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
    transition: color 0.3s ease;
  }

  .product-card:hover .card-title {
    color: #22c9be;
  }

  /* === Description === */
  .text-muted {
    color: #6b7280 !important;
    font-size: 0.85rem;
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  /* === Price & Stock === */
  .text-primary {
    color: #22c9be !important;
    font-weight: 700;
    font-size: 1.25rem;
  }

  .text-danger {
    color: #ff6b6b !important;
    font-size: 0.8rem;
  }

  .badge {
    font-weight: 500;
    font-size: 0.75rem;
    padding: 0.35rem 0.65rem;
  }

  .bg-success {
    background-color: rgba(34, 201, 190, 0.15) !important;
    color: #1aa89f !important;
  }

  .bg-secondary {
    background-color: rgba(108, 117, 125, 0.15) !important;
    color: #6c757d !important;
  }

  /* === Alert === */
  .alert-danger {
    background-color: rgba(220, 53, 69, 0.08);
    border-color: rgba(220, 53, 69, 0.1);
    color: #dc3545;
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* === Quantity Input === */
  .input-group {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    overflow: hidden;
  }

  .form-control {
    border: 1px solid #e0e0e0;
    border-right: none;
    font-size: 0.9rem;
    text-align: center;
    background-color: #fafafa;
    transition: all 0.3s ease;
  }

  .form-control:focus {
    border-color: #22c9be;
    box-shadow: none;
    background-color: white;
  }

  /* === Add to Cart Button === */
  .btn-primary {
    background: linear-gradient(135deg, #22c9be 0%, #1aa89f 100%);
    border: none;
    padding: 0.5rem 1rem;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 2px 8px rgba(34, 201, 190, 0.2);
    position: relative;
    overflow: hidden;
  }

  .btn-primary:hover:not(:disabled) {
    background: linear-gradient(135deg, #1aa89f 0%, #22c9be 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 201, 190, 0.3);
  }

  .btn-primary:disabled {
    background: #bdbdbd;
    cursor: not-allowed;
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
    0% { transform: scale(0, 0); opacity: 0.5; }
    100% { transform: scale(20, 20); opacity: 0; }
  }

  /* === Edit Button === */
  .btn-outline-secondary {
    border-color: #22c9be;
    color: #22c9be;
    font-size: 0.85rem;
    padding: 0.25rem 0.75rem;
    transition: all 0.3s ease;
  }

  .btn-outline-secondary:hover {
    background-color: rgba(34, 201, 190, 0.1);
    color: #1aa89f;
    border-color: #1aa89f;
  }

  /* === Spinner === */
  .spinner-border {
    width: 1rem;
    height: 1rem;
    border-width: 0.15em;
    vertical-align: middle;
  }

  /* === Responsive Adjustments === */
  @media (max-width: 768px) {
    .card-title {
      font-size: 1rem;
    }
    
    .text-primary {
      font-size: 1.1rem;
    }
    
    .btn-primary {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
    }
  }

  /* === Focus States === */
  button:focus-visible,
  input:focus-visible {
    outline: 2px solid #1aa89f;
    outline-offset: 2px;
  }
`}</style>
          </div>
        )}

        {userInfo?.isAdmin && (
          <Link
            to={`/admin/products/${product._id}/edit`}
            className="btn btn-outline-secondary btn-sm mt-2"
          >
            Edit Product
          </Link>
        )}
      </Card.Body>
    </Card>
    
  );
};

export default Product;
