import { useEffect, useState } from 'react';
import { getAllReviews, deleteReview, Review } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchReviews = async () => {
            if (!token) return;
            try {
                const data = await getAllReviews(token);
                setReviews(data);
            } catch (err) {
                console.error('Failed to fetch reviews', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [user, token, navigate]);

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
        </div>
    );
}
