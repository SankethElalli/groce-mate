import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonToast, IonTitle } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProducts } from '../api/api';
import { useCart } from '../contexts/CartContext';
import './Product.css';
import './ProductsMobile.css';

const Products: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Use cart context
  const { addToCart } = useCart();

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

  // Handle adding product to cart
  const handleAddToCart = (product: any) => {
    addToCart(product);
    setToastMessage(`${product.name} added to cart!`);
    setShowToast(true);
  };

  return (
    <IonPage className="products-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="products-content">
        <div className="products-header">
          <h1 className="products-title">Products</h1>
          <input
            className="home-search products-search"
            type="text"
            placeholder="Search groceries..."
            value={searchTerm}
            onChange={handleSearch}
            aria-label="Search products"
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
                <button 
                  className="product-add-btn" 
                  onClick={() => handleAddToCart(product)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <div className="no-products">
              <p>No products found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
        
        {/* Toast notification for cart additions */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
          color="success"
          buttons={[
            {
              text: 'Dismiss',
              role: 'cancel'
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Products;
