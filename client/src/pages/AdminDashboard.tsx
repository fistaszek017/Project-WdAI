import { useEffect, useState } from 'react';
import { getAllReviews, deleteReview, Review, getAllOrders, updateOrderStatus } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            if (!token) return;
            try {
                const [reviewsData, ordersData] = await Promise.all([
                    getAllReviews(token),
                    getAllOrders(token)
                ]);
                setReviews(reviewsData);
                setOrders(ordersData);
            } catch (err) {
                console.error('Failed to fetch data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, token, navigate]);

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        if (!token) return;
        try {
            await updateOrderStatus(token, orderId, newStatus);
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            console.error(err);
            alert("Failed to update order status");
        }
    };

    const handleDelete = async (id: number) => {
        if (!token) return;
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            await deleteReview(token, id);
            setReviews(reviews.filter(r => r.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete review");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="dashboard-container">
            <h1>Admin Dashboard</h1>
            <div className="admin-section">
                <h2>Manage Reviews</h2>
                <div style={{ background: 'var(--card-bg)', padding: '1rem', borderRadius: '8px' }}>
                    {reviews.length === 0 ? (
                        <p>No reviews in the system.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                    <th style={{ padding: '0.5rem' }}>ID</th>
                                    <th style={{ padding: '0.5rem' }}>User</th>
                                    <th style={{ padding: '0.5rem' }}>Product ID</th>
                                    <th style={{ padding: '0.5rem' }}>Rating</th>
                                    <th style={{ padding: '0.5rem' }}>Comment</th>
                                    <th style={{ padding: '0.5rem' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map(review => (
                                    <tr key={review.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '0.5rem' }}>{review.id}</td>
                                        <td style={{ padding: '0.5rem' }}>{review.User?.email}</td>
                                        <td style={{ padding: '0.5rem' }}>{review.productId}</td>
                                        <td style={{ padding: '0.5rem' }}>{review.rating} / 5</td>
                                        <td style={{ padding: '0.5rem' }}>{review.comment}</td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <button
                                                onClick={() => handleDelete(review.id)}
                                                style={{ background: 'var(--error-color)', color: 'white', border: 'none', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <div className="admin-section" style={{ marginTop: '2rem' }}>
                <h2>Manage Orders</h2>
                <div style={{ background: 'var(--card-bg)', padding: '1rem', borderRadius: '8px' }}>
                    {orders.length === 0 ? (
                        <p>No orders in the system.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                    <th style={{ padding: '0.5rem' }}>ID</th>
                                    <th style={{ padding: '0.5rem' }}>User</th>
                                    <th style={{ padding: '0.5rem' }}>Date</th>
                                    <th style={{ padding: '0.5rem' }}>Total</th>
                                    <th style={{ padding: '0.5rem' }}>Status</th>
                                    <th style={{ padding: '0.5rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '0.5rem' }}>{order.id}</td>
                                        <td style={{ padding: '0.5rem' }}>{order.User?.email}</td>
                                        <td style={{ padding: '0.5rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '0.5rem' }}>${order.totalPrice.toFixed(2)}</td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem',
                                                background: order.status === 'pending' ? '#ffd70033' : '#4caf5033',
                                                color: order.status === 'pending' ? '#ffc107' : '#4caf50'
                                            }}>
                                                {order.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                style={{ padding: '0.25rem', borderRadius: '4px' }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
