import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// PrivateRoute component kept for future use if needed
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const NavBar = () => {
  const { cart } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">ShopApp</Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">Products</Link>
        <Link to="/cart" className="nav-link">
          Cart ({cartItemCount})
        </Link>
        {isAuthenticated ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button onClick={logout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}>Logout</button>
          </div>
        ) : (
          <Link to="/login" className="nav-link">Login</Link>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            } />
            <Route path="/checkout" element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
