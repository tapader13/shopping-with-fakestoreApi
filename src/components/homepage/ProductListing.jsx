import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import AuthCheck from '../authcheck/AuthCheck';
import './productlisting.css';
export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);

        // Fetch categories
        const categoriesResponse = await fetch(
          'https://fakestoreapi.com/products/categories'
        );
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load products. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on category and search query
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, products]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

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

  return (
    <AuthCheck>
      <div className='product-listing'>
        <div className='product-header'>
          <h1 className='product-title'>Products</h1>

          <div className='filter-container'>
            <div className='search-container'>
              <svg
                className='search-icon'
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='11' cy='11' r='8'></circle>
                <line x1='21' y1='21' x2='16.65' y2='16.65'></line>
              </svg>
              <input
                type='search'
                placeholder='Search products...'
                className='search-input'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className='category-select'
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value='all'>All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        {loading ? (
          <div className='product-grid'>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className='product-card skeleton'>
                <div className='product-image skeleton-image'></div>
                <div className='product-content'>
                  <div className='skeleton-title'></div>
                  <div className='skeleton-title short'></div>
                  <div className='skeleton-price'></div>
                  <div className='skeleton-button'></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className='no-products'>
            <h2>No products found</h2>
            <p>Try changing your search or filter criteria</p>
            <button
              className='clear-filters-btn'
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className='product-grid'>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>
    </AuthCheck>
  );
}

function ProductCard({ product, onAddToCart }) {
  return (
    <div className='product-card'>
      <Link to={`/products/${product.id}`} className='product-link'>
        <div className='product-image'>
          <img
            src={product.image || '/placeholder.svg'}
            alt={product.title}
            className='product-img'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
        <div className='product-content'>
          <h3 className='product-name'>{product.title}</h3>
          <div className='product-meta'>
            <span className='product-price'>${product.price.toFixed(2)}</span>
            <span className='product-category'>{product.category}</span>
          </div>
        </div>
      </Link>
      <button
        className='add-to-cart-button'
        onClick={(e) => {
          e.preventDefault();
          onAddToCart(product);
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}
