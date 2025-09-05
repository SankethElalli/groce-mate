import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonText,
  IonBackButton,
  useIonViewDidEnter
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { closeOutline, locationOutline, callOutline, timeOutline, cardOutline } from 'ionicons/icons';
import './OrderDetails.css';
import '../theme/PageThemeForce.css';

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

interface OrderDetails {
  id: string;
  date: string;
  total: string;
  status: string;
  items: OrderItem[];
  deliveryAddress?: string;
  paymentMethod?: string;
  phoneNumber?: string;
  estimatedDelivery?: string;
  orderNotes?: string;
}

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const history = useHistory();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  
  // Force page to apply correct theme on view enter
  useIonViewDidEnter(() => {
    // Trigger a re-render to apply current theme
    document.querySelector('.order-details-page')?.classList.add('theme-applied');
    setTimeout(() => {
      document.querySelector('.order-details-page')?.classList.remove('theme-applied');
    }, 10);
  });
  
  // Helper function to get status color
  const getStatusColor = (status: string): string => {
    switch(status.toLowerCase()) {
      case 'delivered': return 'success';
      case 'processing': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'medium';
    }
  };

  // Format date helper
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Fetch order details on component mount
  useEffect(() => {
    const fetchOrderDetails = () => {
      try {
        // Get orders from localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        // Find the order with matching ID
        const matchedOrder = orders.find((o: any) => o.orderNumber === orderId || o._id === orderId);
        
        if (matchedOrder) {
          setOrder({
            id: matchedOrder.orderNumber,
            date: matchedOrder.createdAt,
            total: `₹${matchedOrder.total.toFixed(2)}`,
            status: matchedOrder.status,
            items: matchedOrder.items.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              price: `₹${item.price.toFixed(2)}`
            })),
            deliveryAddress: matchedOrder.deliveryAddress ? 
              `${matchedOrder.deliveryAddress.addressLine1}, ${matchedOrder.deliveryAddress.addressLine2 ? matchedOrder.deliveryAddress.addressLine2 + ', ' : ''}${matchedOrder.deliveryAddress.city}, ${matchedOrder.deliveryAddress.state} ${matchedOrder.deliveryAddress.pincode}` : 
              undefined,
            paymentMethod: matchedOrder.paymentMethod,
            phoneNumber: matchedOrder.deliveryAddress?.phone,
            estimatedDelivery: matchedOrder.estimatedDelivery,
            orderNotes: matchedOrder.orderNotes
          });
        } else {
          console.error('Order not found');
          history.push('/orders');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [orderId, history]);

  const handleGoBack = () => {
    history.push('/orders');
  };
  
  // If order is still loading, show a loading message
  if (!order) {
    return (
      <IonPage className="order-details-page ion-page-force-theme">
        <IonHeader>
          <IonToolbar className="themed-toolbar">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/orders" />
            </IonButtons>
            <IonTitle>Order Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" color="background">
          <div className="loading-container">
            <p>Loading order details...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage className="order-details-page ion-page-force-theme">
      <IonHeader>
        <IonToolbar className="themed-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/orders" />
          </IonButtons>
          <IonTitle>Order Details</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleGoBack}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding" color="background">
        <div className="order-details-container">
          {/* Order ID and Status */}
          <div className="order-details-header">
            <div className="order-details-id">
              <h2>#{order.id}</h2>
              <IonBadge color={getStatusColor(order.status)} className="order-details-status">
                {order.status}
              </IonBadge>
            </div>
            <div className="order-details-date">
              <IonIcon icon={timeOutline} />
              <span>{formatDate(order.date)}</span>
            </div>
          </div>

          {/* Items List */}
          <div className="order-details-section">
            <h3 className="section-title">Order Items</h3>
            <div className="order-details-items">
              <IonGrid className="items-grid">
                <IonRow className="item-header">
                  <IonCol size="6">Item</IonCol>
                  <IonCol size="2">Qty</IonCol>
                  <IonCol size="4" className="price-col">Price</IonCol>
                </IonRow>
                {order.items.map((item, index) => (
                  <IonRow key={index} className="item-row">
                    <IonCol size="6">{item.name}</IonCol>
                    <IonCol size="2">{item.quantity}</IonCol>
                    <IonCol size="4" className="price-col">{item.price}</IonCol>
                  </IonRow>
                ))}
                <IonRow className="total-row">
                  <IonCol size="6" offset="2"><strong>Total</strong></IonCol>
                  <IonCol size="4" className="price-col"><strong>{order.total}</strong></IonCol>
                </IonRow>
              </IonGrid>
            </div>
          </div>

          {/* Delivery Details */}
          {order.deliveryAddress && (
            <div className="order-details-section">
              <h3 className="section-title">Delivery Details</h3>
              <IonList lines="none" className="details-list">
                <IonItem>
                  <IonIcon icon={locationOutline} slot="start" color="primary" />
                  <IonLabel className="ion-text-wrap">
                    <IonText color="medium">Address</IonText>
                    <p>{order.deliveryAddress}</p>
                  </IonLabel>
                </IonItem>
                {order.phoneNumber && (
                  <IonItem>
                    <IonIcon icon={callOutline} slot="start" color="primary" />
                    <IonLabel>
                      <IonText color="medium">Phone</IonText>
                      <p>{order.phoneNumber}</p>
                    </IonLabel>
                  </IonItem>
                )}
                {order.estimatedDelivery && (
                  <IonItem>
                    <IonIcon icon={timeOutline} slot="start" color="primary" />
                    <IonLabel>
                      <IonText color="medium">Estimated Delivery</IonText>
                      <p>{order.estimatedDelivery}</p>
                    </IonLabel>
                  </IonItem>
                )}
              </IonList>
            </div>
          )}

          {/* Payment Details */}
          {order.paymentMethod && (
            <div className="order-details-section">
              <h3 className="section-title">Payment Details</h3>
              <IonList lines="none" className="details-list">
                <IonItem>
                  <IonIcon icon={cardOutline} slot="start" color="primary" />
                  <IonLabel>
                    <IonText color="medium">Payment Method</IonText>
                    <p>{order.paymentMethod}</p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </div>
          )}

          {/* Order Notes */}
          {order.orderNotes && (
            <div className="order-details-section">
              <h3 className="section-title">Notes</h3>
              <div className="order-notes">
                <p>{order.orderNotes}</p>
              </div>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OrderDetailsPage;
