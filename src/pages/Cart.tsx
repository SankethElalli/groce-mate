import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle } from '@ionic/react';
import './Cart.css';

const Cart: React.FC = () => {
  // Example empty cart UI
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="" />
          </IonButtons>
          <IonTitle>Your Cart</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="cart-content">
        <div className="cart-container">
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
