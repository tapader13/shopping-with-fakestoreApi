import { createBrowserRouter, RouterProvider } from 'react-router';
import './App.css';
import Home from './components/home/Home';
import HomePage from './components/homepage/HomePage';
import LoginPage from './components/login/Login';
import ProductDetailPage from './components/productdetails/ProductDetailsPage';
import CartPage from './components/cart/Cart';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/products/:id',
        element: <ProductDetailPage />,
      },
      {
        path: '/cart',
        element: <CartPage />,
      },
    ],
  },

  {
    path: 'about',
    element: <div>About</div>,
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
