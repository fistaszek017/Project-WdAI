import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, Product } from '../api';

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (err) {
                console.error('Failed to fetch products', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div>Loading products...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Our Products</h1>
                <input
                    type="text"
                    placeholder="Search products..."
                    className="search-bar"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </header>

            <div className="products-grid">
                {filteredProducts.map(product => (
                    <div
                        key={product.id}
                        className="product-card"
                        onClick={() => navigate(`/product/${product.id}`)}
                    >
                        <img src={product.image} alt={product.title} className="product-image" />
                        <div className="product-info">
                            <h3>{product.title}</h3>
                            <div className="product-price">${product.price}</div>
                            <div className="category-tag">{product.category}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
