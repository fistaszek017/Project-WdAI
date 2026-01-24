import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
    const { cart, removeFromCart, clearCart, totalPrice } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        alert('Proceeding to checkout...');
        clearCart();
        navigate('/');
    };

    if (cart.length === 0) {
        return (
            <div className="dashboard-container">
                <h1>Your Cart</h1>
                <p>Your cart is empty.</p>
                <button onClick={() => navigate('/')} className="primary-btn" style={{ maxWidth: '200px' }}>
                    Browse Products
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h1>Your Cart</h1>
            <div className="cart-list">
                {cart.map((item, index) => (
                    <div key={`${item.id}-${item.size || 'nosize'}-${index}`} className="cart-item">
                        <img src={item.image} alt={item.title} className="cart-item-image" />
                        <div className="cart-item-info">
                            <h3>{item.title}</h3>
                            {item.size && <span className="category-tag" style={{ fontSize: '0.8rem', padding: '0.1rem 0.5rem', marginBottom: '0.2rem' }}>Size: {item.size}</span>}
                            <p>${item.price} x {item.quantity}</p>
                        </div>
                        <div className="cart-item-total">
                            ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <button
                            className="remove-btn"
                            onClick={() => removeFromCart(item.id, item.size)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <h2>Total: ${totalPrice.toFixed(2)}</h2>
                <div className="cart-actions">
                    <button className="secondary-btn" onClick={clearCart}>Clear Cart</button>
                    <button className="primary-btn" onClick={handleCheckout}>Checkout</button>
                </div>
            </div>
        </div>
    );
}
