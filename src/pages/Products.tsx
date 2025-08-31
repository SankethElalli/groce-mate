import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProducts } from '../api/api';
import './Product.css';
import './ProductsMobile.css';

const Products: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts();
        if (response.error) {
          setError(response.message);
          setAllProducts([]);
        } else {
          setAllProducts(response.data || []);
          setError(null);
        }
      } catch (err) {
        setError('Failed to fetch products');
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    // Get search term from URL query parameters
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    setSearchTerm(search);
    
    // Initialize with all products if no search term
    if (!search) {
      setFilteredProducts(allProducts);
    } else {
      // Filter products based on search term
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [location.search, allProducts]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;
    setSearchTerm(search);
    
    // Always show all products if search is empty
    if (!search.trim()) {
      setFilteredProducts(allProducts);
      return;
    }
    
    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <IonPage className="products-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="" />
          </IonButtons>
          <h1 className="products-title">Products</h1>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="products-content">
        <div className="products-header">
          <input
            className="home-search"
            type="text"
            placeholder="Search groceries..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginTop: "1rem", marginBottom: "1.5rem" }}
          />
        </div>
        <div className="products-list">
          {loading ? (
            <div className="loading-message">Loading products...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div className="product-card" key={product._id}>
                <img className="product-image" src={product.image} alt={product.name} />
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-price">₹{product.price}</div>
                  <div className="product-category">{product.category?.name}</div>
                </div>
                <button className="product-add-btn">Add</button>
              </div>
            ))
          ) : (
            <div className="no-products">
              <p>No products found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Products;
