import React, { createContext, useReducer, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

export const AppContext = createContext();

const safeParse = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage`, error);
    return defaultValue;
  }
};

const initialState = {
  userInfo: safeParse('userInfo', null),
  cart: {
    cartItems: safeParse('cartItems', []),
    shippingAddress: safeParse('shippingAddress', {}),
    paymentMethod: localStorage.getItem('paymentMethod') || '',
  },
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'REQUEST_START':
      return { ...state, loading: true, error: null };
    case 'REQUEST_SUCCESS':
      return { ...state, loading: false };
    case 'REQUEST_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'USER_LOGIN':
      return { 
        ...state, 
        userInfo: action.payload,
        error: null
      };
    case 'USER_LOGOUT':
      return {
        ...state,
        userInfo: null,
        cart: { cartItems: [], shippingAddress: {}, paymentMethod: '' },
      };
    case 'ADD_TO_CART':
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      return { ...state, cart: { ...state.cart, cartItems } };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: state.cart.cartItems.filter(
            (item) => item._id !== action.payload
          ),
        },
      };
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    case 'UPDATE_USER_PROFILE':
      return { 
        ...state, 
        userInfo: { ...state.userInfo, ...action.payload },
        error: null
      };
    case 'RESET_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const requestQueue = useRef([]);
  const isProcessing = useRef(false);

  useEffect(() => {
    const syncLocalStorage = () => {
      try {
        if (state.userInfo) {
          localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
        } else {
          localStorage.removeItem('userInfo');
        }
        localStorage.setItem('cartItems', JSON.stringify(state.cart.cartItems));
        localStorage.setItem(
          'shippingAddress',
          JSON.stringify(state.cart.shippingAddress)
        );
        if (state.cart.paymentMethod) {
          localStorage.setItem('paymentMethod', state.cart.paymentMethod);
        } else {
          localStorage.removeItem('paymentMethod');
        }
      } catch (error) {
        console.error('Error syncing with localStorage:', error);
      }
    };
    syncLocalStorage();
  }, [state.userInfo, state.cart]);

  const processQueue = useCallback(() => {
    if (requestQueue.current.length === 0 || isProcessing.current) return;

    isProcessing.current = true;
    const { config, resolve, reject } = requestQueue.current.shift();

    axios(config)
      .then((response) => {
        resolve(response);
        setTimeout(() => {
          isProcessing.current = false;
          processQueue();
        }, 300);
      })
      .catch((error) => {
        reject(error);
        setTimeout(() => {
          isProcessing.current = false;
          processQueue();
        }, 300);
      });
  }, []);

  const throttledAxios = useCallback((config) => {
    return new Promise((resolve, reject) => {
      requestQueue.current.push({ config, resolve, reject });
      processQueue();
    });
  }, [processQueue]);

  // Auth functions
  const login = useCallback(async (email, password) => {
    try {
      dispatch({ type: 'REQUEST_START' });
      const { data } = await throttledAxios({
        method: 'post',
        url: '/api/users/login',
        data: { email, password },
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
        withCredentials: true,
        timeout: 10000,
      });
      
      dispatch({ type: 'USER_LOGIN', payload: data });
      dispatch({ type: 'REQUEST_SUCCESS' });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Login failed. Please try again.';
      dispatch({ type: 'REQUEST_FAIL', payload: errorMessage });
      throw errorMessage;
    }
  }, [throttledAxios]);

  const logout = useCallback(() => {
    dispatch({ type: 'USER_LOGOUT' });
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      dispatch({ type: 'REQUEST_START' });
      const { data } = await throttledAxios({
        method: 'post',
        url: '/api/users',
        data: { name, email, password },
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
        withCredentials: true,
        timeout: 10000,
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      dispatch({ type: 'REQUEST_SUCCESS' });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Registration failed. Please try again.';
      dispatch({ type: 'REQUEST_FAIL', payload: errorMessage });
      throw errorMessage;
    }
  }, [throttledAxios]);

  const updateUserProfile = useCallback(async (userData) => {
    try {
      dispatch({ type: 'REQUEST_START' });
      
      const { data } = await throttledAxios({
        method: 'put',
        url: '/api/users/profile',
        data: userData,
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.userInfo?.token}`,
        },
        withCredentials: true,
        timeout: 10000,
      });

      dispatch({ type: 'UPDATE_USER_PROFILE', payload: data });
      dispatch({ type: 'REQUEST_SUCCESS' });
      return data;
    } catch (error) {
      let errorMessage = 'Profile update failed. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                     error.response.statusText || 
                     errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch({ type: 'REQUEST_FAIL', payload: errorMessage });
      throw errorMessage;
    }
  }, [state.userInfo?.token, throttledAxios]);

  // Cart functions
  const addToCart = useCallback((product, qty) => {
    try {
      const quantity = Number(qty);
      if (quantity <= 0 || quantity > product.countInStock) {
        throw new Error('Invalid quantity');
      }
      
      const item = {
        _id: product._id,
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: quantity,
      };
      
      dispatch({ type: 'ADD_TO_CART', payload: item });
    } catch (error) {
      dispatch({ type: 'REQUEST_FAIL', payload: error.message });
      throw error.message;
    }
  }, []);

  const removeFromCart = useCallback((id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  }, []);

  const saveShippingAddress = useCallback((data) => {
    dispatch({ type: 'SAVE_SHIPPING_ADDRESS', payload: data });
  }, []);

  const savePaymentMethod = useCallback((method) => {
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: method });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CART_CLEAR' });
  }, []);

  // Order functions
  const createOrder = useCallback(async (orderData) => {
    try {
      dispatch({ type: 'REQUEST_START' });
      const { data } = await throttledAxios({
        method: 'post',
        url: '/api/orders',
        data: orderData,
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.userInfo?.token}`,
        },
        withCredentials: true,
        timeout: 10000,
      });
      dispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'REQUEST_SUCCESS' });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Order creation failed. Please try again.';
      dispatch({ type: 'REQUEST_FAIL', payload: errorMessage });
      throw errorMessage;
    }
  }, [state.userInfo?.token, throttledAxios]);

  const getMyOrders = useCallback(async () => {
    try {
      dispatch({ type: 'REQUEST_START' });
      const { data } = await throttledAxios({
        method: 'get',
        url: '/api/orders/myorders',
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
        headers: {
          Authorization: `Bearer ${state.userInfo?.token}`,
        },
        withCredentials: true,
        timeout: 10000,
      });
      dispatch({ type: 'REQUEST_SUCCESS' });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({ type: 'REQUEST_FAIL', payload: errorMessage });
      throw errorMessage;
    }
  }, [state.userInfo?.token, throttledAxios]);

  const resetError = useCallback(() => {
    dispatch({ type: 'RESET_ERROR' });
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        login,
        logout,
        register,
        updateUserProfile,
        addToCart,
        removeFromCart,
        saveShippingAddress,
        savePaymentMethod,
        clearCart,
        createOrder,
        getMyOrders,
        resetError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}