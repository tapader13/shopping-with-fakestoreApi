import { useState, useEffect } from 'react';
import './cart.css';
import AuthCheck from '../authcheck/AuthCheck';
import { Link } from 'react-router';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, mounted]);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0 && newQuantity <= 10) {
      setCart(
        cart.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    setShowConfirmation(true);
    setCart([]);

    setTimeout(() => {
      setShowConfirmation(false);
    }, 4000);
  };

  return (
    <AuthCheck>
      <div className='cart-container'>
        <h1 className='cart-title'>Your Cart</h1>

        {cart.length === 0 && !showConfirmation ? (
          <div className='empty-cart'>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any products to your cart yet.</p>
            <Link to='/' className='continue-shopping-btn'>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className='cart-grid'>
            <div className='cart-items'>
              {cart.map((item) => (
                <div key={item.id} className='cart-item'>
                  <div className='item-image'>
                    <img
                      src={item.image || '/placeholder.svg'}
                      alt={item.title}
                      className='product-img'
                      sizes='(max-width: 640px) 100vw, 128px'
                    />
                  </div>
                  <div className='item-details'>
                    <div className='item-header'>
                      <h3 className='item-title'>{item.title}</h3>
                      <button
                        className='remove-btn'
                        onClick={() => removeFromCart(item.id)}
                        aria-label='Remove item'
                      >
                        ✕
                      </button>
                    </div>
                    <p className='item-price'>${item.price.toFixed(2)}</p>
                    <div className='quantity-controls'>
                      <button
                        className='quantity-btn'
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type='number'
                        min='1'
                        max='10'
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            Number.parseInt(e.target.value) || 1
                          )
                        }
                        className='quantity-input'
                      />
                      <button
                        className='quantity-btn'
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= 10}
                      >
                        +
                      </button>
                      <div className='item-total'>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className='order-summary'>
                <h2>Order Summary</h2>
                <div className='summary-row'>
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className='summary-row'>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className='summary-divider'></div>
                <div className='summary-row total'>
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <button className='checkout-btn' onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            )}
          </div>
        )}

        {showConfirmation && (
          <div className='confirmation-dialog'>
            <div className='confirmation-content'>
              <h2>Order placed successfully!</h2>
              <p>Thank you for your order. Your items will be shipped soon.</p>
              <button onClick={() => setShowConfirmation(false)}>OK</button>
            </div>
          </div>
        )}
      </div>
    </AuthCheck>
  );
}
