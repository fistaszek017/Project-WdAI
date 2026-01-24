import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import { CartProvider, useCart } from './context/CartContext';
import './index.css';

// PrivateRoute component kept for future use if needed
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const NavBar = () => {
  const { cart } = useCart();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">ShopApp</Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">Products</Link>
        <Link to="/cart" className="nav-link">
          Cart ({cartItemCount})
        </Link>
        <Link to="/login" className="nav-link">Login</Link>
      </div>
    </nav>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
