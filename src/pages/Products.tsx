import { IonContent, IonPage } from '@ionic/react';
import './Product.css';

const Products: React.FC = () => {
  // Placeholder for products, replace with backend data later
  const products = [
    { id: 1, name: "Apple", price: "₹40/kg", image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "Milk", price: "₹50/ltr", image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80" },
    { id: 3, name: "Bread", price: "₹30/pack", image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80" },
    { id: 4, name: "Tomato", price: "₹25/kg", image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80" },
  ];

  return (
    <IonPage>
      <IonContent fullscreen className="products-content">
        <div className="products-header">
          <h1 className="products-title">Products</h1>
          <input
            className="home-search"
            type="text"
            placeholder="Search groceries..."
            style={{ marginTop: "1rem", marginBottom: "1.5rem" }}
          />
        </div>
        <div className="products-list">
          {products.map(product => (
            <div className="product-card" key={product.id}>
              <img className="product-image" src={product.image} alt={product.name} />
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-price">{product.price}</div>
              </div>
              <button className="product-add-btn">Add</button>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Products;
