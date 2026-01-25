import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Checkout() {
    const { cart, totalPrice, clearCart } = useCart();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [shipping, setShipping] = useState({
        name: '',
        address: '',
        city: '',
        zip: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShipping({ ...shipping, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:3000/api/orders', {
                items: cart,
                shipping
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Order placed successfully!');
            clearCart();
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to place order.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="dashboard-container">
                <h1>Checkout</h1>
                <p>Your cart is empty.</p>
                <button onClick={() => navigate('/')} className="primary-btn">Go Shopping</button>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h1>Checkout</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="checkout-form">
                    <h2>Shipping Details</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input name="name" required value={shipping.name} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>Address</label>
                            <input name="address" required value={shipping.address} onChange={handleChange} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="input-group">
                                <label>City</label>
                                <input name="city" required value={shipping.city} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label>ZIP / Postal Code</label>
                                <input name="zip" required value={shipping.zip} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="payment-mockup" style={{ marginTop: '2rem' }}>
                            <h2>Payment Method</h2>
                            <div style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input type="radio" name="payment" defaultChecked />
                                    Credit Card (Test - No Charge)
                                </label>
                            </div>
                            <div style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px' }}>
                                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input type="radio" name="payment" />
                                    PayPal (Test - No Charge)
                                </label>
                            </div>
                        </div>

                        {error && <p className="error-msg">{error}</p>}

                        <button type="submit" className="primary-btn" disabled={loading} style={{ marginTop: '2rem', width: '100%' }}>
                            {loading ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
                        </button>
                    </form>
                </div>

                <div className="order-summary" style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '8px', height: 'fit-content' }}>
                    <h2>Order Summary</h2>
                    <div className="cart-list" style={{ marginTop: '1rem' }}>
                        {cart.map((item, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                                <div>
                                    <p style={{ fontWeight: 600 }}>{item.title}</p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        Qty: {item.quantity} {item.size && `| Size: ${item.size}`}
                                    </p>
                                </div>
                                <div>${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
