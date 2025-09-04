import { IonContent, IonPage, IonButton, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/react';
import { searchOutline, leafOutline, bagOutline, heartOutline, starOutline, trophyOutline, shieldCheckmarkOutline, peopleOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getCategories, getProducts } from '../api/api';
import './Home.css';
import './FeatureMobile.css';
import './ThemeSupport.css';
import rupeeOutline from '../utils/custom-icons';

const Home: React.FC = () => {
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          getCategories(),
          getProducts()
        ]);
        
        if (!categoriesResponse.error) {
          setCategories(categoriesResponse.data?.slice(0, 6) || []);
        }
        
        if (!productsResponse.error) {
          // Filter only featured products
          const featured = productsResponse.data?.filter(
            (product: any) => product.featured === true
          ) || [];
          
          // Show all featured products, or fallback to first 12 if no featured products
          const productsToShow = featured.length > 0 
            ? featured // Show ALL featured products
            : productsResponse.data?.slice(0, 12) || [];
        
          setFeaturedProducts(productsToShow);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // No animation effects - keeping it simple and static

  const handleSearch = () => {
    if (searchTerm.trim()) {
      history.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    history.push(`/products?category=${categoryId}`);
  };

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      'vegetables': 'leaf-outline',
      'fruits': 'nutrition-outline',
      'dairy': 'water-outline',
      'meat': 'restaurant-outline',
      'bakery': 'cafe-outline',
      'beverages': 'wine-outline',
      'snacks': 'fast-food-outline',
      'frozen': 'snow-outline',
      'pharmacy': 'medical-outline',
      'household': 'home-outline'
    };
    
    const lowerName = categoryName.toLowerCase();
    return iconMap[lowerName] || 'storefront-outline';
  };

  // Function to determine which side (left or right) the category comes from
  const getCategoryPosition = (index: number) => {
    // Alternate between left and right or use random if preferred
    // Using alternating pattern for predictable design
    return index % 2 === 0 ? 'from-left' : 'from-right';
  };

  return (
    <IonPage>
      <IonContent fullscreen className="home-content">
        {/* Hero Section */}
        <div className="home-bg">
          <video 
            className="home-video" 
            autoPlay 
            muted 
            loop 
            playsInline
            onError={(e) => console.error('Video failed to load:', e)}
            onLoadStart={() => console.log('Video loading started')}
            onCanPlay={() => console.log('Video can play')}
          >
            <source src="/prod.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="home-overlay"></div>
          <div className="home-center">
            <h1 className="home-title">Fresh Groceries Delivered</h1>
            <p className="home-subtitle">Quality products at your doorstep</p>
            <div className="home-search-container">
              <div className="search-wrapper">
                <input
                  className="home-search"
                  type="text"
                  placeholder="Search for fresh groceries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="section categories-section">
          <div className="container">
            <h2 className="section-title">Shop by Category</h2>
            <div className="categories-grid">
              {loading ? (
                <div className="loading-placeholder">Loading categories...</div>
              ) : categories.length > 0 ? (
                categories.map((category, index) => (
                  <div 
                    key={category._id} 
                    className={`category-card ${getCategoryPosition(index)}`}
                    onClick={() => handleCategoryClick(category._id)}
                  >
                    <div className="category-content">
                      <h3>{category.name}</h3>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-categories-message">No categories available</div>
              )}
            </div>
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="section featured-section">
          <div className="container">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Hand-picked fresh items just for you</p>
            
            <div className="featured-products-horizontal-container">
              {loading ? (
                <div className="loading-placeholder">Loading featured products...</div>
              ) : featuredProducts.length > 0 ? (
                <div className="featured-products-horizontal-scroll">
                  {featuredProducts.map((product, index) => {
                    // Create different badge types for variety
                    const badgeTypes = ['Featured', 'Hot', 'New', 'Sale'];
                    const badgeClasses = ['badge-featured', 'badge-hot', 'badge-new', 'badge-sale'];
                    const currentBadge = badgeTypes[index % badgeTypes.length];
                    const currentBadgeClass = badgeClasses[index % badgeClasses.length];
                    
                    return (
                      <div className="featured-product-card" key={product._id}>
                        <div className="featured-product-image">
                          <img src={product.image} alt={product.name} />
                          <div className={`product-badge ${currentBadgeClass}`}>
                            <span className="badge-text">{currentBadge}</span>
                          </div>
                        </div>
                        <div className="featured-product-info">
                          <h3 className="featured-product-name">{product.name}</h3>
                          <p className="featured-product-category">{product.category?.name}</p>
                          <div className="featured-product-price">₹{product.price}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-products-message">No featured products available.</div>
              )}
            </div>
            
            <div className="section-cta">
              <IonButton 
                expand="block" 
                fill="outline" 
                className="view-all-btn"
                routerLink="/menu"
              >
                View All Products
              </IonButton>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="section features-section">
          <div className="container">
            <h2 className="section-title">Why Choose GroceMate?</h2>
            
            <IonGrid className="features-grid">
              <IonRow>
                <IonCol size="12" sizeMd="6" sizeLg="3">
                  <div className="feature-card">
                    <IonIcon icon={leafOutline} className="feature-icon" />
                    <h3>Fresh Quality</h3>
                    <p>Hand-picked fresh produce delivered daily to ensure the highest quality</p>
                  </div>
                </IonCol>
                <IonCol size="12" sizeMd="6" sizeLg="3">
                  <div className="feature-card">
                    <IonIcon icon={rupeeOutline} className="feature-icon" />
                    <h3>Best Prices</h3>
                    <p>Competitive pricing with regular discounts and offers for our customers</p>
                  </div>
                </IonCol>
                <IonCol size="12" sizeMd="6" sizeLg="3">
                  <div className="feature-card">
                    <IonIcon icon={shieldCheckmarkOutline} className="feature-icon" />
                    <h3>Safe Delivery</h3>
                    <p>Contactless delivery with proper hygiene and safety measures</p>
                  </div>
                </IonCol>
                <IonCol size="12" sizeMd="6" sizeLg="3">
                  <div className="feature-card">
                    <IonIcon icon={peopleOutline} className="feature-icon" />
                    <h3>24/7 Support</h3>
                    <p>Round-the-clock customer support to help you with any queries</p>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </div>

        {/* About Us Section */}
        <div className="section about-section">
          <div className="container">
            <IonGrid>
              <IonRow className="ion-align-items-center">
                <IonCol size="12" sizeLg="6">
                  <div className="about-content">
                    <h2 className="section-title">About GroceMate</h2>
                    <p className="about-text">
                      We're passionate about bringing fresh, quality groceries right to your doorstep. 
                      Founded with a mission to make grocery shopping convenient and accessible for everyone, 
                      GroceMate connects you with the finest local suppliers and farmers.
                    </p>
                    <p className="about-text">
                      Our commitment to quality, freshness, and customer satisfaction drives everything we do. 
                      From farm-fresh vegetables to premium pantry staples, we ensure every product meets 
                      our high standards before it reaches your home.
                    </p>
                  </div>
                </IonCol>
                <IonCol size="12" sizeLg="6">
                  <div className="about-image">
                    <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=400&fit=crop&crop=center" alt="About GroceMate" />
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </div>

        {/* CTA Section */}
        <div className="section cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Start Shopping Today!</h2>
              <p>Join thousands of satisfied customers who trust GroceMate for their daily needs</p>
              <IonButton 
                expand="block" 
                size="large" 
                className="cta-btn"
                routerLink="/menu"
              >
                Shop Now
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
