import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
    id: number;
    title: string;
    quantity: number;
    price: number;
    size?: string;
}

interface Order {
    id: number;
    totalPrice: number;
    status: string;
    createdAt: string;
    OrderItems: OrderItem[];
}

export default function Profile() {
    const { token, logout, user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchOrders();
        }
    }, [token]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div className="dashboard-container">Loading...</div>;

    return (
        <div className="dashboard-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>My Profile</h1>
                <button onClick={handleLogout} className="secondary-btn">Logout</button>
            </div>

            <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <h2>User Details</h2>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
            </div>

            <h2>Order History</h2>
            {orders.length === 0 ? (
                <p>You haven't placed any orders yet.</p>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <p><strong>Order #{order.id}</strong></p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 'bold' }}>${order.totalPrice.toFixed(2)}</p>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        background: order.status === 'pending' ? '#ffd70033' : '#4caf5033',
                                        color: order.status === 'pending' ? '#ffc107' : '#4caf50'
                                    }}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div>
                                {order.OrderItems.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        <span>{item.quantity}x {item.title} {item.size && `(${item.size})`}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
