import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import AuthCheck from '../authcheck/AuthCheck';
import './productdetails.css';
export default function ProductDetailPage() {
  const params = useParams();
  const router = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Get addToCart function from localStorage
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setMessage({
      type: 'success',
      text: `${product.title} has been added to your cart.`,
    });

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://fakestoreapi.com/products/${params.id}`
        );
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setMessage({ type: 'error', text: 'Failed to load product details.' });
        router('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <div className='loading-container'>
        <div className='loading-spinner'></div>
      </div>
    );
  }

  if (!product) {
    return <div className='error-message'>Product not found</div>;
  }

  return (
    <AuthCheck>
      <div className='product-detail-container'>
        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
        <div className='product-detail-grid'>
          <div className='product-image-container'>
            <div className='product-image'>
              <img
                src={product.image || '/placeholder.svg'}
                alt={product.title}
                className='product-img'
                sizes='(max-width: 768px) 100vw, 50vw'
              />
            </div>
          </div>
          <div className='product-info'>
            <h1 className='product-title'>{product.title}</h1>
            <div className='product-meta'>
              <div className='product-category'>{product.category}</div>
              <div className='product-rating'>
                <span className='star'>★</span>
                <span>{product.rating.rate}</span>
                <span className='review-count'>
                  ({product.rating.count} reviews)
                </span>
              </div>
            </div>
            <div className='product-price'>${product.price.toFixed(2)}</div>
            <p className='product-description'>{product.description}</p>
            <button onClick={handleAddToCart} className='add-to-cart-btn'>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}
