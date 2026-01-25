import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, Product, getReviews, addReview, deleteReview, Review } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const SIZES = ['S', 'M', 'L', 'XL'];

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user, token } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [showSizeError, setShowSizeError] = useState(false);


    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewError, setReviewError] = useState('');

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const [productData, reviewsData] = await Promise.all([
                    getProduct(id),
                    getReviews(id)
                ]);
                setProduct(productData);
                setReviews(reviewsData);
            } catch (err) {
                console.error('Failed to fetch data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const isClothing = product?.category.toLowerCase().includes('clothing');

    const handleAddToCart = () => {
        if (product) {
            if (isClothing && !selectedSize) {
                setShowSizeError(true);
                return;
            }
            addToCart(product, selectedSize || undefined);
            setShowSizeError(false);
        }
    };

    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !id) return;
        setReviewError('');

        try {
            const newReview = await addReview(token, id, rating, comment);
            setReviews([newReview, ...reviews]);
            setComment('');
            setRating(5);
        } catch (err: any) {
            setReviewError(err.response?.data?.error || 'Failed to add review');
        }
    };

    const handleDeleteReview = async (reviewId: number) => {
        if (!token) return;
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            await deleteReview(token, reviewId);
            setReviews(reviews.filter(r => r.id !== reviewId));
        } catch (err) {
            console.error(err);
            alert("Failed to delete review");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    const userHasReviewed = user && reviews.some(r => r.userId === user.id);

    return (
        <div className="dashboard-container">
            <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                &larr; Back to Products
            </button>

            <div className="product-details-container">
                <img src={product.image} alt={product.title} className="details-image" />

                <div className="details-info">
                    <span className="category-tag">{product.category}</span>
                    <h1>{product.title}</h1>
                    <div className="rating">
                        ★ {product.rating.rate} ({product.rating.count} global ratings)
                    </div>
                    <p className="product-description">{product.description}</p>

                    {isClothing && (
                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Select Size:</p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {SIZES.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => {
                                            setSelectedSize(size);
                                            setShowSizeError(false);
                                        }}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            border: `1px solid ${selectedSize === size ? 'var(--primary)' : 'var(--border)'}`,
                                            background: selectedSize === size ? 'var(--primary)' : 'transparent',
                                            color: selectedSize === size ? 'white' : 'var(--text-main)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {showSizeError && <p style={{ color: 'var(--error-color)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Please select a size.</p>}
                        </div>
                    )}

                    <div className="product-price" style={{ fontSize: '2rem', margin: '2rem 0' }}>
                        ${product.price}
                    </div>
                    <button className="primary-btn" onClick={handleAddToCart}>
                        Add to Cart
                    </button>
                </div>
            </div>

            <div className="reviews-section" style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                <h2>Customer Reviews</h2>

                {user ? (
                    !userHasReviewed ? (
                        <form onSubmit={handleAddReview} style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                            <h3>Write a Review</h3>
                            {reviewError && <p className="error-msg">{reviewError}</p>}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Rating</label>
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    style={{ padding: '0.5rem', borderRadius: '4px', background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                                >
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="3">3 - Good</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="1">1 - Poor</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Comment</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                    rows={4}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'var(--bg-test)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                                />
                            </div>
                            <button type="submit" className="primary-btn">Submit Review</button>
                        </form>
                    ) : (
                        <p style={{ margin: '1rem 0', color: 'var(--success-color)' }}>You have already reviewed this product.</p>
                    )
                ) : (
                    <p style={{ margin: '1rem 0' }}>Please log in to write a review.</p>
                )}

                <div className="reviews-list">
                    {reviews.length === 0 ? (
                        <p>No reviews yet.</p>
                    ) : (
                        reviews.map(review => (
                            <div key={review.id} style={{ borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <strong>{review.User?.email || 'Anonymous'}</strong>
                                        <span style={{ marginLeft: '1rem', color: '#ffc107' }}>{'★'.repeat(review.rating)}</span>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p style={{ marginTop: '0.5rem' }}>{review.comment}</p>
                                {user && (user.id === review.userId || user.role === 'admin') && (
                                    <button
                                        onClick={() => handleDeleteReview(review.id)}
                                        style={{ background: 'transparent', border: 'none', color: 'var(--error-color)', cursor: 'pointer', fontSize: '0.8rem', marginTop: '0.5rem' }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
