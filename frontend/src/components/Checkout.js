import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const Checkout = () => {
  const { state, saveShippingAddress, savePaymentMethod, clearCart } =
    useContext(AppContext);
  const { cartItems } = state.cart;
  const { userInfo } = state;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address: state.cart.shippingAddress.address || '',
    city: state.cart.shippingAddress.city || '',
    postalCode: state.cart.shippingAddress.postalCode || '',
    country: state.cart.shippingAddress.country || '',
    paymentMethod: state.cart.paymentMethod || 'PayPal'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({
    address: false,
    city: false,
    postalCode: false,
    country: false
  });

  // Calculate prices
  const [prices, setPrices] = useState({
    itemsPrice: 0,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 0
  });

  useEffect(() => {
    const itemsPrice = cartItems.reduce(
      (acc, item) => acc + (item.price * item.qty), 0
    );
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((itemsPrice * 0.15).toFixed(2));
    const totalPrice = Number((
      itemsPrice + shippingPrice + taxPrice
    ).toFixed(2));

    setPrices({
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    });
  }, [cartItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const validateField = (name, value) => {
    if (!value) return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    return '';
  };

  const getFieldError = (name) => {
    if (!touched[name]) return '';
    return validateField(name, formData[name]);
  };

  const isFormValid = () => {
    return (
      formData.address &&
      formData.city &&
      formData.postalCode &&
      formData.country &&
      formData.paymentMethod &&
      cartItems.length > 0
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Save shipping info to context
      saveShippingAddress({
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country
      });
      savePaymentMethod(formData.paymentMethod);

      // Prepare order items
      const orderItems = cartItems.map(item => ({
        product: item._id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.image
      }));

      // Create order
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders`,
        {
          orderItems,
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country
          },
          paymentMethod: formData.paymentMethod,
          ...prices
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      clearCart();
      navigate(`/order/${data._id}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Order failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          Your cart is empty. <Link to="/">Go back to shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2>Checkout</h2>
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title">Shipping</h4>
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={submitHandler}>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input
                    type="text"
                    className={`form-control ${getFieldError('address') && 'is-invalid'}`}
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {getFieldError('address') && (
                    <div className="invalid-feedback">{getFieldError('address')}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="city" className="form-label">City</label>
                  <input
                    type="text"
                    className={`form-control ${getFieldError('city') && 'is-invalid'}`}
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {getFieldError('city') && (
                    <div className="invalid-feedback">{getFieldError('city')}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="postalCode" className="form-label">Postal Code</label>
                  <input
                    type="text"
                    className={`form-control ${getFieldError('postalCode') && 'is-invalid'}`}
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {getFieldError('postalCode') && (
                    <div className="invalid-feedback">{getFieldError('postalCode')}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="country" className="form-label">Country</label>
                  <input
                    type="text"
                    className={`form-control ${getFieldError('country') && 'is-invalid'}`}
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {getFieldError('country') && (
                    <div className="invalid-feedback">{getFieldError('country')}</div>
                  )}
                </div>

                <div className="mb-3">
                  <h4 className="card-title">Payment Method</h4>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="paypal"
                      value="PayPal"
                      checked={formData.paymentMethod === 'PayPal'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="paypal">
                      PayPal
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="stripe"
                      value="Stripe"
                      checked={formData.paymentMethod === 'Stripe'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="stripe">
                      Stripe
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !isFormValid()}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <ul className="list-group list-group-flush mb-3">
                {cartItems.map((item) => (
                  <li
                    key={item._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      {item.name} x {item.qty}
                    </div>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </li>
                ))}
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div>Items Price</div>
                  <span>${prices.itemsPrice.toFixed(2)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div>Shipping</div>
                  <span>${prices.shippingPrice.toFixed(2)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div>Tax</div>
                  <span>${prices.taxPrice.toFixed(2)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center fw-bold">
                  <div>Total</div>
                  <span>${prices.totalPrice.toFixed(2)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <style>{`
  /* Checkout Container */
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

  /* Card Styles */
  .card {
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    margin-bottom: 1.5rem;
  }

  .card:hover {
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
  }

  .card-body {
    padding: 2rem;
  }

  .card-title {
    color: #22c9be;
    font-weight: 600;
    margin-bottom: 1.5rem;
    position: relative;
  }

  .card-title::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #22c9be, #1aa89f);
    border-radius: 2px;
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
  }

  .form-control:focus {
    border-color: #22c9be;
    box-shadow: 0 0 0 3px rgba(34, 201, 190, 0.2);
    background-color: white;
  }

  .is-invalid {
    border-color: #ff6b6b;
    background-color: #fff9f9;
  }

  .is-invalid:focus {
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
  }

  .invalid-feedback {
    color: #ff6b6b;
    font-size: 0.85rem;
    margin-top: 0.25rem;
    animation: fadeIn 0.3s ease-out;
  }

  /* Radio Buttons */
  .form-check {
    margin-bottom: 0.75rem;
  }

  .form-check-input {
    width: 1.1em;
    height: 1.1em;
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
    width: 100%;
    margin-top: 1rem;
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

  /* Spinner */
  .spinner-border {
    width: 1rem;
    height: 1rem;
    border-width: 0.15em;
    color: white;
  }

  /* Alert Styles */
  .alert {
    border-radius: 8px;
    padding: 1rem 1.5rem;
    margin-bottom: 1.5rem;
    animation: fadeIn 0.4s ease-out;
  }

  .alert-danger {
    background-color: rgba(220, 53, 69, 0.1);
    border-color: rgba(220, 53, 69, 0.2);
    color: #dc3545;
  }

  .alert-warning {
    background-color: rgba(255, 193, 7, 0.1);
    border-color: rgba(255, 193, 7, 0.2);
    color: #ffc107;
  }

  .alert a {
    color: inherit;
    font-weight: 500;
    text-decoration: underline;
    transition: color 0.2s ease;
  }

  .alert-warning a:hover {
    color: #ffab00;
  }

  /* Order Summary */
  .list-group-item {
    padding: 1rem 1.25rem;
    border-color: rgba(0, 0, 0, 0.05);
  }

  .list-group-item:last-child {
    border-bottom: none;
  }

  .fw-bold {
    color: #333;
    font-size: 1.1rem;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .container.my-4 {
      padding: 1rem;
    }
    
    .card-body {
      padding: 1.5rem;
    }
    
    .row {
      flex-direction: column-reverse;
    }
    
    .col-md-4 {
      margin-bottom: 2rem;
    }
  }

  /* Focus States */
  button:focus-visible,
  input:focus-visible,
  .form-check-input:focus-visible {
    outline: 2px solid #1aa89f;
    outline-offset: 2px;
  }
`}</style>
    </div>
  );
};

export default Checkout;