import React from 'react';
import {
  IonModal,
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
  IonText
} from '@ionic/react';
import { closeOutline, locationOutline, callOutline, timeOutline, cardOutline } from 'ionicons/icons';
import './OrderDetailsModal.css';

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

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetails | null;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  order 
}) => {
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

  // If order is null, don't render the modal at all
  if (!order) {
    return null;
  }

  return (
    <IonModal 
      isOpen={isOpen} 
      onDidDismiss={onClose}
      className="order-details-modal"
      backdropDismiss={true}
      showBackdrop={true}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Order Details</IonTitle>
          <IonButtons slot="end">
            <IonButton 
              onClick={onClose}
              fill="clear"
            >
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
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
    </IonModal>
  );
};

export default OrderDetailsModal;
