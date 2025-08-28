import { IonContent, IonPage } from '@ionic/react';
import './Cart.css';

const Cart: React.FC = () => {
  // Example empty cart UI
  return (
    <IonPage>
      <IonContent fullscreen className="cart-content">
        <div className="cart-container">
          <h1 className="cart-title">Your Cart</h1>
          <div className="cart-empty">
            <span className="cart-emoji" role="img" aria-label="empty cart">🛒</span>
            <p>Your cart is empty</p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Cart;
