import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [paypalError, setPaypalError] = useState(false);
  const { state } = useContext(AppContext);
  const { userInfo } = state;
  const navigate = useNavigate();

  const successPaymentHandler = useCallback(async (paymentResult) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/orders/${id}/pay`,
        paymentResult,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setOrder(data);
      alert('Payment was successfully processed!');
    } catch (err) {
      alert(err.response?.data?.message || 'Payment processing failed. Please try again.');
    }
  }, [id, userInfo.token]);

  const handleManualPayment = () => {
    if (window.confirm('Are you sure you want to mark this payment as completed?')) {
      successPaymentHandler({
        id: 'manual_payment_' + Date.now(),
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: userInfo.email,
        payer: {
          name: {
            given_name: userInfo.name.split(' ')[0],
            surname: userInfo.name.split(' ')[1] || ''
          }
        }
      });
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      navigate('/login');
    } else {
      fetchOrder();
    }
  }, [id, userInfo, navigate]);

  useEffect(() => {
    if (!order || order.isPaid) return;

    // Only attempt to load PayPal if we have a valid client ID
    if (!process.env.REACT_APP_PAYPAL_CLIENT_ID || 
        !process.env.REACT_APP_PAYPAL_CLIENT_ID.startsWith('A')) {
      setPaypalError(true);
      return;
    }

    const loadPayPalSDK = () => {
      if (window.paypal) {
        setSdkReady(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}&currency=USD`;
      script.async = true;
      
      script.onload = () => {
        console.log('PayPal SDK loaded successfully');
        setSdkReady(true);
        setPaypalError(false);
      };
      
      script.onerror = () => {
        console.error('Failed to load PayPal SDK');
        setSdkReady(false);
        setPaypalError(true);
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    loadPayPalSDK();
  }, [order]);

  useEffect(() => {
    if (!sdkReady || !window.paypal || !order || order.isPaid) return;

    const button = window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'paypal',
        height: 40
      },
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: order.totalPrice.toFixed(2),
              currency_code: 'USD'
            }
          }]
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then(details => {
          successPaymentHandler({
            id: details.id,
            status: details.status,
            update_time: details.update_time,
            email_address: details.payer.email_address,
            payer: details.payer
          });
        });
      },
      onError: (err) => {
        console.error('PayPal error:', err);
        setPaypalError(true);
      }
    });

    if (button.isEligible()) {
      button.render('#paypal-button-container');
    } else {
      setPaypalError(true);
    }

    return () => {
      if (button.close) {
        button.close();
      }
    };
  }, [sdkReady, order, successPaymentHandler]);

  if (loading) return (
    <div className="text-center my-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Loading order details...</p>
    </div>
  );

  if (error) return (
    <div className="container my-5">
      <div className="alert alert-danger">
        {error}
        <button 
          className="btn btn-outline-danger mt-2"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="container my-5">
      <h2 className="mb-4">Order #{order?._id}</h2>
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title">Shipping</h4>
              <p>
                <strong>Address:</strong> {order?.shippingAddress?.address}, {order?.shippingAddress?.city}{' '}
                {order?.shippingAddress?.postalCode}, {order?.shippingAddress?.country}
              </p>
            </div>
          </div>
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title">Payment Method</h4>
              <p>
                <strong>Method:</strong> {order?.paymentMethod}
              </p>
              {order?.isPaid ? (
                <div className="alert alert-success">
                  Paid on {new Date(order.paidAt).toLocaleDateString()}
                </div>
              ) : (
                <div className="alert alert-warning">Payment Pending</div>
              )}
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Order Items</h4>
              {order?.orderItems?.map((item) => (
                <div key={item._id} className="d-flex justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '15px' }}
                      onError={(e) => {
                        e.target.src = '/images/placeholder-product.png';
                      }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <div>
                    {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Order Summary</h4>
              <div className="d-flex justify-content-between mb-2">
                <span>Items:</span>
                <span>${order?.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>${order?.shippingPrice?.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>${order?.taxPrice?.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>${order?.totalPrice?.toFixed(2)}</span>
              </div>
              {!order?.isPaid && (
                <div className="mt-3">
                  {!paypalError ? (
                    <div id="paypal-button-container"></div>
                  ) : (
                    <div className="alert alert-warning">
                      <p>Payment processor unavailable</p>
                      <button 
                        className="btn btn-primary w-100 mt-2"
                        onClick={handleManualPayment}
                      >
                        Mark Payment as Completed
                      </button>
                      <p className="small text-muted mt-2">
                        For testing purposes only
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
  /* Order Confirmation Container */
  .container.my-5 {
    max-width: 1200px;
    padding: 0 20px;
    animation: fadeIn 0.6s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Order Title */
  h2.mb-4 {
    color: #22c9be;
    font-weight: 700;
    font-size: 1.8rem;
    position: relative;
    padding-bottom: 10px;
    margin-bottom: 2rem;
  }

  h2.mb-4::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #22c9be, #1aa89f);
    position: absolute;
    bottom: 0;
    left: 0;
    border-radius: 3px;
  }

  /* Cards */
  .card {
    border: none;
    border-radius: 12px;
    box-shadow: 0 5px 20px rgba(34, 201, 190, 0.1);
    transition: all 0.3s ease;
    margin-bottom: 1.5rem;
    overflow: hidden;
  }

  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(34, 201, 190, 0.15);
  }

  .card-title {
    color: #22c9be;
    font-weight: 600;
    margin-bottom: 1.5rem;
    position: relative;
  }

  .card-title::after {
    content: '';
    display: block;
    width: 40px;
    height: 2px;
    background: #e0e0e0;
    position: absolute;
    bottom: -8px;
    left: 0;
  }

  /* Order Items */
  .d-flex.justify-content-between.mb-3 {
    padding: 1rem;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .d-flex.justify-content-between.mb-3:hover {
    background-color: #f5f5f5;
    transform: translateX(5px);
  }

  /* Alerts */
  .alert {
    border-radius: 8px;
    border-left: 4px solid;
    padding: 1rem;
  }

  .alert-success {
    background-color: #e8f5e9;
    border-left-color: #4caf50;
    color: #2e7d32;
  }

  .alert-warning {
    background-color: #fff8e1;
    border-left-color: #ffc107;
    color: #ff8f00;
  }

  .alert-danger {
    background-color: #ffebee;
    border-left-color: #f44336;
    color: #d32f2f;
  }

  /* Buttons */
  .btn {
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .btn-primary {
    background: linear-gradient(135deg, #22c9be 0%, #1aa89f 100%);
    border: none;
  }

  .btn-primary:hover {
    background: linear-gradient(135deg, #1aa89f 0%, #22c9be 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 201, 190, 0.3);
  }

  .btn-outline-danger {
    border-color: #f44336;
    color: #f44336;
  }

  .btn-outline-danger:hover {
    background-color: #f44336;
    color: white;
  }

  /* PayPal Button Container */
  #paypal-button-container {
    margin-top: 1rem;
    min-height: 50px;
    transition: all 0.3s ease;
  }

  /* Loading Spinner */
  .spinner-border.text-primary {
    width: 3rem;
    height: 3rem;
    border-width: 0.25em;
    border-color: #22c9be transparent #22c9be transparent;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .row {
      flex-direction: column-reverse;
    }
    
    .col-md-4 {
      margin-bottom: 2rem;
    }

    h2.mb-4 {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 576px) {
    .container.my-5 {
      padding: 0 15px;
    }

    .card-title {
      font-size: 1.2rem;
    }
  }
`}</style>
    </div>
  );
};

export default OrderConfirmation;