import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, Product } from '../api';
import { useCart } from '../context/CartContext';

const SIZES = ['S', 'M', 'L', 'XL'];

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [showSizeError, setShowSizeError] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            try {
                const data = await getProduct(id);
                setProduct(data);
            } catch (err) {
                console.error('Failed to fetch product', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
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

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

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
                        ★ {product.rating.rate} ({product.rating.count} reviews)
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
        </div>
    );
}
