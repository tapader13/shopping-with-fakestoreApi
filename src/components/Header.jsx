import { useState, useEffect } from 'react';
import './header.css';
import { Link, useLocation, useNavigate } from 'react-router';

export default function Header() {
  const location = useLocation();
  const router = useNavigate();
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Check login status
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    // Initial check
    checkLoginStatus();

    // Load cart from localStorage
    const loadCart = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
        }
      }
    };

    // Initial load
    loadCart();

    // Set up interval to check for changes
    const interval = setInterval(() => {
      checkLoginStatus();
      loadCart();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router('/login');
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartCount = isMounted ? cartItemCount : 0;

  if (location.pathname === '/login' && !isLoggedIn) {
    return null;
  }

  return (
    <header className='header'>
      <div className='header-container'>
        <Link to='/' className='logo'>
          ShopApp
        </Link>

        {/* Desktop Navigation */}
        {isLoggedIn && (
          <nav className='desktop-nav'>
            <Link
              to='/'
              className={`nav-link ${
                location.pathname === '/' ? 'active' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to='/cart'
              className={`nav-link cart-link ${
                location.pathname === '/cart' ? 'active' : ''
              }`}
            >
              Cart
              {cartCount > 0 && <span className='cart-badge'>{cartCount}</span>}
            </Link>
            <button className='logout-btn' onClick={handleLogout}>
              Logout
            </button>
          </nav>
        )}

        {/* Mobile Navigation */}
        {isLoggedIn && (
          <div className='mobile-nav'>
            <Link to='/cart' className='cart-icon'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='9' cy='21' r='1'></circle>
                <circle cx='20' cy='21' r='1'></circle>
                <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'></path>
              </svg>
              {cartCount > 0 && <span className='cart-badge'>{cartCount}</span>}
            </Link>
            <button
              className='menu-btn'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <line x1='3' y1='12' x2='21' y2='12'></line>
                <line x1='3' y1='6' x2='21' y2='6'></line>
                <line x1='3' y1='18' x2='21' y2='18'></line>
              </svg>
            </button>

            {mobileMenuOpen && (
              <div className='mobile-menu'>
                <div className='mobile-menu-content'>
                  <Link
                    to='/'
                    className='mobile-menu-link'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to='/cart'
                    className='mobile-menu-link'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cart
                  </Link>
                  <button
                    className='mobile-logout-btn'
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
