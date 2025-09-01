import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage, IonIcon, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonBadge, IonText, IonRefresher, IonRefresherContent, IonButton, IonModal, IonList, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader } from '@ionic/react';
import { bagCheckOutline, timeOutline, chevronForwardOutline, cartOutline, closeOutline, locationOutline, cardOutline, callOutline, chatboxEllipsesOutline } from 'ionicons/icons';
import OrderDetailsModal from './OrderDetailsModal';
import './Orders.css';
import './OrdersMobile.css';

// Extended Order interface
interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

interface Order {
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

const Orders: React.FC = () => {
  const history = useHistory();
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Debug effect to track modal state changes
  useEffect(() => {
    console.log('Modal state changed:', { isModalOpen, selectedOrder });
  }, [isModalOpen, selectedOrder]);

  // Sample order data - replace with actual API data later
  const orders: Order[] = [
    {
      id: "ORD001",
      date: "2024-03-15T14:30:00",
      total: "₹350",
      status: "Delivered",
      items: [
        { name: "Apple", quantity: 2, price: "₹80" },
        { name: "Milk", quantity: 1, price: "₹50" },
        { name: "Eggs", quantity: 12, price: "₹120" },
        { name: "Bread", quantity: 1, price: "₹100" }
      ],
      deliveryAddress: "123 Main Street, Apartment 4B, Mumbai, 400001",
      paymentMethod: "Credit Card (ending 4242)",
      phoneNumber: "+91 9876543210",
      estimatedDelivery: "Delivered on March 15, 2024 at 6:30 PM",
      orderNotes: "Please leave at the doorstep"
    },
    {
      id: "ORD002",
      date: "2024-03-14T10:15:00",
      total: "₹220",
      status: "Processing",
      items: [
        { name: "Bread", quantity: 1, price: "₹30" },
        { name: "Tomato", quantity: 2, price: "₹50" },
        { name: "Spinach", quantity: 1, price: "₹40" },
        { name: "Rice", quantity: 1, price: "₹100" }
      ],
      deliveryAddress: "456 Park Avenue, Delhi, 110001",
      paymentMethod: "Cash on Delivery",
      phoneNumber: "+91 8765432109",
      estimatedDelivery: "Expected on March 16, 2024 between 2-4 PM"
    },
    {
      id: "ORD003",
      date: "2024-03-10T09:45:00",
      total: "₹580",
      status: "Cancelled",
      items: [
        { name: "Chicken", quantity: 1, price: "₹280" },
        { name: "Onions", quantity: 3, price: "₹60" },
        { name: "Pasta", quantity: 2, price: "₹240" }
      ],
      deliveryAddress: "789 Village Road, Bangalore, 560001",
      paymentMethod: "UPI",
      phoneNumber: "+91 7654321098"
    }
  ];

  // Handle opening the modal with order details
  const handleViewDetails = (order: Order) => {
    console.log('View details clicked for order:', order);
    
    // Prevent multiple rapid clicks
    if (isModalOpen) {
      console.log('Modal already open, ignoring click');
      return;
    }
    
    // Add a small delay to ensure proper state management
    setTimeout(() => {
      setSelectedOrder(order);
      setIsModalOpen(true);
      console.log('Modal state updated - isOpen:', true, 'selectedOrder:', order);
    }, 50);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    console.log('Closing modal - simple handler');
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Handle refresh when pulled down
  const handleRefresh = (event: CustomEvent) => {
    // In a real app, you would fetch new data here
    console.log('Refreshing orders...');
    
    // Simulate refresh delay
    setTimeout(() => {
      event.detail.complete();
    }, 1000);
  };

  // Format date to readable format
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get count of items in an order
  const getItemCount = (items: OrderItem[]): number => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Get status color class
  const getStatusClass = (status: string): string => {
    return `status-${status.toLowerCase()}`;
  };

  return (
    <IonPage className="orders-page">
      <IonHeader style={{
        position: 'relative',
        zIndex: 100,
        background: 'var(--ion-background-color)'
      }}>
        <IonToolbar style={{
          position: 'relative',
          zIndex: 101,
          background: 'var(--ion-background-color)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          {/* CUSTOM BACK BUTTON - GUARANTEED VISIBLE */}
          <div 
            onClick={() => history.goBack()}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              backgroundColor: 'rgba(56, 128, 255, 0.1)',
              border: '2px solid #3880ff',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: '#3880ff'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(56, 128, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(56, 128, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(0.95)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <IonIcon 
              icon={chevronForwardOutline} 
              style={{
                fontSize: '20px',
                color: '#3880ff',
                transform: 'rotate(180deg)'
              }}
            />
          </div>
          <IonTitle style={{ 
            paddingLeft: '60px',
            fontSize: '1.1rem',
            fontWeight: '600',
            textAlign: 'left'
          }}>My Orders</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="orders-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        
        <div className="orders-container">
          {orders.length === 0 ? (
            <div className="no-orders">
              <IonIcon icon={cartOutline} />
              <h3>No Orders Yet</h3>
              <p>Your order history will appear here</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-id-container">
                      <div className="order-id">
                        <IonIcon icon={bagCheckOutline} />
                        <span>{order.id}</span>
                      </div>
                      <div className={`order-status ${getStatusClass(order.status)}`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="order-date">
                      <IonIcon icon={timeOutline} />
                      <span>{formatDate(order.date)}</span>
                    </div>
                  </div>

                  <div className="order-summary">
                    <div className="order-items-summary">
                      <IonBadge color="light">{getItemCount(order.items)} items</IonBadge>
                      <IonText color="medium" className="order-items-preview">
                        {order.items.slice(0, 2).map(item => item.name).join(', ')}
                        {order.items.length > 2 && '...'}
                      </IonText>
                    </div>
                    <div className="order-total">
                      <strong>{order.total}</strong>
                    </div>
                  </div>

                  <button 
                    className="order-details-btn" 
                    onClick={() => handleViewDetails(order)}
                    aria-label={`View details for order ${order.id}`}
                    type="button"
                  >
                    View Details
                    <IonIcon icon={chevronForwardOutline} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </IonContent>
      
      {/* Professional Modal Design - Always rendered, controlled by isOpen */}
      <IonModal 
        isOpen={isModalOpen} 
        onDidDismiss={handleCloseModal}
        backdropDismiss={true}
        className="order-details-modal"
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Order Details</IonTitle>
            <IonButtons slot="end">
              <IonButton 
                onClick={handleCloseModal}
                fill="clear"
                aria-label="Close order details"
              >
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {selectedOrder ? (
            <>
              {/* Order Header */}
              <IonCard className="order-header-card">
                <IonCardContent>
                  <div className="order-header-content">
                    <div className="order-id-section">
                      <h2>#{selectedOrder.id}</h2>
                      <IonBadge 
                        color={
                          selectedOrder.status.toLowerCase() === 'delivered' ? 'success' :
                          selectedOrder.status.toLowerCase() === 'processing' ? 'warning' :
                          selectedOrder.status.toLowerCase() === 'cancelled' ? 'danger' : 'medium'
                        }
                        className="status-badge"
                      >
                        {selectedOrder.status}
                      </IonBadge>
                    </div>
                    <div className="order-date-section">
                      <IonIcon icon={timeOutline} />
                      <span>{new Date(selectedOrder.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>

              {/* Items Section */}
              <IonCard className="items-card">
                <IonCardHeader>
                  <h3 className="section-title">Order Items</h3>
                </IonCardHeader>
                <IonCardContent>
                  <IonGrid className="items-grid">
                    <IonRow className="items-header">
                      <IonCol size="6">Item</IonCol>
                      <IonCol size="2">Qty</IonCol>
                      <IonCol size="4" className="text-right">Price</IonCol>
                    </IonRow>
                    {selectedOrder.items.map((item, index) => (
                      <IonRow key={index} className="item-row">
                        <IonCol size="6" className="item-name">{item.name}</IonCol>
                        <IonCol size="2" className="item-qty">{item.quantity}</IonCol>
                        <IonCol size="4" className="text-right item-price">{item.price}</IonCol>
                      </IonRow>
                    ))}
                    <IonRow className="total-row">
                      <IonCol size="8" className="total-label"><strong>Total Amount</strong></IonCol>
                      <IonCol size="4" className="text-right total-price"><strong>{selectedOrder.total}</strong></IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>

              {/* Delivery & Payment Info */}
              {(selectedOrder.deliveryAddress || selectedOrder.paymentMethod || selectedOrder.phoneNumber) && (
                <IonCard className="details-card">
                  <IonCardHeader>
                    <h3 className="section-title">Delivery & Payment</h3>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonList className="details-list">
                      {selectedOrder.deliveryAddress && (
                        <IonItem lines="none" className="detail-item">
                          <IonIcon icon={locationOutline} slot="start" color="primary" />
                          <IonLabel className="ion-text-wrap">
                            <h4>Delivery Address</h4>
                            <p>{selectedOrder.deliveryAddress}</p>
                          </IonLabel>
                        </IonItem>
                      )}
                      
                      {selectedOrder.paymentMethod && (
                        <IonItem lines="none" className="detail-item">
                          <IonIcon icon={cardOutline} slot="start" color="primary" />
                          <IonLabel>
                            <h4>Payment Method</h4>
                            <p>{selectedOrder.paymentMethod}</p>
                          </IonLabel>
                        </IonItem>
                      )}
                      
                      {selectedOrder.phoneNumber && (
                        <IonItem lines="none" className="detail-item">
                          <IonIcon icon={callOutline} slot="start" color="primary" />
                          <IonLabel>
                            <h4>Contact Number</h4>
                            <p>{selectedOrder.phoneNumber}</p>
                          </IonLabel>
                        </IonItem>
                      )}
                    </IonList>
                  </IonCardContent>
                </IonCard>
              )}

              {/* Order Notes */}
              {selectedOrder.orderNotes && (
                <IonCard className="notes-card">
                  <IonCardHeader>
                    <h3 className="section-title">
                      <IonIcon icon={chatboxEllipsesOutline} />
                      Order Notes
                    </h3>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="notes-content">
                      <p>{selectedOrder.orderNotes}</p>
                    </div>
                  </IonCardContent>
                </IonCard>
              )}

              {/* Help Section */}
              <div className="help-section">
                <IonButton expand="block" fill="outline" color="primary">
                  Need Help with this Order?
                </IonButton>
              </div>
            </>
          ) : (
            <div className="no-order-selected">
              <p>No order selected</p>
            </div>
          )}
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Orders;
