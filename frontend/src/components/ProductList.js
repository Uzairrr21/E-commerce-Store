import React, { useEffect, useState, useContext } from 'react';
import Product from './Product';
import { AppContext } from '../context/AppContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state } = useContext(AppContext);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/products/featured`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: state.userInfo ? `Bearer ${state.userInfo.token}` : '',
            },
          }
        );
        
        const data = await response.json();
        
        if (isMounted) {
          if (response.ok) {
            // Ensure countInStock exists for each product
            const normalizedProducts = Array.isArray(data) 
              ? data.map(p => ({
                  ...p,
                  countInStock: p.countInStock ?? p.stock ?? 0
                }))
              : [];
            setProducts(normalizedProducts);
          } else {
            setError(data.message || 'Failed to fetch products');
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setProducts([]);
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => { isMounted = false };
  }, [state.userInfo]);

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container my-4">
      <h2 className="mb-4">Featured Products</h2>
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="col-md-4 col-lg-3 mb-4">
              <Product product={product} />
            </div>
          ))
        ) : (
          <div className="col-12">
            <p>No featured products available</p>
          </div>
        )}
      </div>
     <style>{`
  /* Featured Products Heading - Enhanced */
  h2.mb-4 {
    color: transparent;
    font-weight: 800;
    font-size: 2.2rem;
    text-align: center;
    margin: 3rem 0;
    position: relative;
    letter-spacing: 1px;
    background: linear-gradient(90deg, #22c9be, #1aa89f, #22c9be);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    opacity: 0;
    transform: perspective(500px) rotateX(15deg);
    animation: 
      textReveal 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards,
      gradientFlow 8s linear infinite 1.5s;
  }

  h2.mb-4::before,
  h2.mb-4::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    height: 3px;
    border-radius: 3px;
    background: linear-gradient(90deg, transparent, #22c9be, transparent);
    opacity: 0;
    animation: lineReveal 1s ease-out 0.6s forwards;
  }

  h2.mb-4::before {
    width: 120px;
    filter: blur(1px);
    bottom: -8px;
  }

  h2.mb-4::after {
    width: 80px;
    background: linear-gradient(90deg, #1aa89f, #22c9be);
    animation-delay: 0.8s;
  }

  /* Hover Effects */
  h2.mb-4:hover {
    animation-play-state: paused;
    text-shadow: 0 0 15px rgba(34, 201, 190, 0.4);
  }

  h2.mb-4:hover::after {
    width: 100px;
    background: linear-gradient(90deg, #22c9be, #1aa89f);
    transition: all 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
  }

  /* Animations */
  @keyframes textReveal {
    0% {
      opacity: 0;
      transform: perspective(500px) rotateX(15deg) translateY(30px);
    }
    100% {
      opacity: 1;
      transform: perspective(500px) rotateX(0) translateY(0);
    }
  }

  @keyframes lineReveal {
    0% {
      opacity: 0;
      width: 0;
    }
    100% {
      opacity: 1;
      width: 120px;
    }
  }

  @keyframes gradientFlow {
    0% { background-position: 0% center; }
    50% { background-position: 100% center; }
    100% { background-position: 0% center; }
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    h2.mb-4 {
      font-size: 1.8rem;
      margin: 2rem 0;
      animation: 
        textReveal 1s ease-out forwards,
        gradientFlow 10s linear infinite 1.2s;
    }
  }

  @media (max-width: 576px) {
    h2.mb-4 {
      font-size: 1.5rem;
      margin: 1.5rem 0;
    }
    h2.mb-4::before,
    h2.mb-4::after {
      bottom: -3px;
    }
  }
`}</style>
    </div>
  );
};

export default ProductList;