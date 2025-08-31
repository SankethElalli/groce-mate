import { IonContent, IonPage, IonIcon, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/react';
import { bagCheckOutline, timeOutline, chevronForwardOutline } from 'ionicons/icons';
import './Orders.css';
import './OrdersMobile.css';

const Orders: React.FC = () => {
  // Sample order data - replace with actual API data later
  const orders = [
    {
      id: "ORD001",
      date: "2024-03-15",
      total: "₹350",
      status: "Delivered",
      items: [
        { name: "Apple", quantity: 2, price: "₹80" },
        { name: "Milk", quantity: 1, price: "₹50" }
      ]
    },
    {
      id: "ORD002",
      date: "2024-03-14",
      total: "₹220",
      status: "Processing",
      items: [
        { name: "Bread", quantity: 1, price: "₹30" },
        { name: "Tomato", quantity: 2, price: "₹50" }
      ]
    }
  ];

  return (
    <IonPage className="orders-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="" />
          </IonButtons>
          <IonTitle>My Orders</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="orders-content">
        <div className="orders-container">
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-id">
                    <IonIcon icon={bagCheckOutline} />
                    <span>{order.id}</span>
                  </div>
                  <div className="order-date">
                    <IonIcon icon={timeOutline} />
                    <span>{order.date}</span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-name">{item.name} × {item.quantity}</span>
                      <span className="item-price">{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <strong>{order.total}</strong>
                  </div>
                  <div className={`order-status status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </div>
                  <button className="order-details-btn">
                    View Details
                    <IonIcon icon={chevronForwardOutline} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Orders;
