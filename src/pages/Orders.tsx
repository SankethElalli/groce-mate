import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage, IonIcon, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonBadge, IonText, IonRefresher, IonRefresherContent, IonButton, IonModal, IonList, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, IonSpinner } from '@ionic/react';
import { bagCheckOutline, timeOutline, chevronForwardOutline, cartOutline, closeOutline, locationOutline, cardOutline, callOutline, chatboxEllipsesOutline } from 'ionicons/icons';
import './Orders.css';
import './OrdersMobile.css';

// Order interfaces
interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  status: string;
  items: OrderItem[];
  deliveryAddress?: string;
  paymentMethod?: string;
  phoneNumber?: string;
  estimatedDelivery?: string;
  orderNotes?: string;
}

// Remove the temporary getUserOrders function and replace with localStorage fetch
const getUserOrders = async () => {
  try {
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return {
      success: true,
      data: orders,
      message: orders.length === 0 ? 'No orders found' : 'Orders loaded successfully'
    };
  } catch (error) {
    console.error('Error reading orders from localStorage:', error);
    return {
      success: false,
      data: [],
      message: 'Failed to load orders'
    };
  }
};

const Orders: React.FC = () => {
  const history = useHistory();
  
  // State management
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch orders from API/localStorage
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Remove token check since we're using localStorage
      // const token = localStorage.getItem('token');
      // if (!token) {
      //   history.push('/login');
      //   return;
      // }

      const response = await getUserOrders();
      
      if (response.success) {
        // Map the order data to match our interface
        const mappedOrders = response.data.map((order: any) => ({
          _id: order.orderNumber || order._id || `order_${Date.now()}`,
          orderNumber: order.orderNumber,
          createdAt: order.createdAt,
          total: order.total,
          status: order.status,
          items: order.items.map((item: any) => ({
            _id: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image
          })),
          deliveryAddress: order.deliveryAddress ? 
            `${order.deliveryAddress.addressLine1}, ${order.deliveryAddress.addressLine2 ? order.deliveryAddress.addressLine2 + ', ' : ''}${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.pincode}` : 
            undefined,
          paymentMethod: order.paymentMethod,
          phoneNumber: order.deliveryAddress?.phone,
          estimatedDelivery: order.estimatedDelivery,
          orderNotes: order.orderNotes
        }));
        
        setOrders(mappedOrders || []);
      } else {
        setError(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle opening the modal with order details
  const handleViewDetails = (order: Order) => {
    if (isModalOpen) return;
    
    setTimeout(() => {
      setSelectedOrder(order);
      setIsModalOpen(true);
    }, 50);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Handle refresh when pulled down
  const handleRefresh = async (event: CustomEvent) => {
    await fetchOrders();
    event.detail.complete();
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

  // Get status color for badge
  const getStatusColor = (status: string): string => {
    switch(status.toLowerCase()) {
      case 'delivered': return 'success';
      case 'processing': return 'warning';
      case 'cancelled': return 'danger';
      case 'shipped': return 'primary';
      default: return 'medium';
    }
  };

  return (
    <IonPage className="orders-page">
      <IonHeader className="orders-header-wrapper">
        <IonToolbar className="orders-toolbar">
          <div className="custom-back-button" onClick={() => history.goBack()}>
            <IonIcon 
              icon={chevronForwardOutline} 
              className="back-button-icon"
            />
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="orders-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        
        <div className="orders-header">
          <h1 className="orders-title">Orders</h1>
        </div>
        
        <div className="orders-container">
          {loading ? (
            <div className="orders-loading">
              <IonSpinner name="crescent" />
              <p>Loading your orders...</p>
            </div>
          ) : error ? (
            <div className="orders-error">
              <IonIcon icon={cartOutline} />
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
              <IonButton fill="outline" onClick={fetchOrders}>
                Try Again
              </IonButton>
            </div>
          ) : orders.length === 0 ? (
            <div className="no-orders">
              <IonIcon icon={cartOutline} />
              <h3>No Orders Yet</h3>
              <p>Your order history will appear here</p>
              <IonButton routerLink="/menu" fill="outline">
                Start Shopping
              </IonButton>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-id-container">
                      <div className="order-id">
                        <IonIcon icon={bagCheckOutline} />
                        <span>#{order.orderNumber}</span>
                      </div>
                      <div className={`order-status ${getStatusClass(order.status)}`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="order-date">
                      <IonIcon icon={timeOutline} />
                      <span>{formatDate(order.createdAt)}</span>
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
                      <strong>₹{order.total.toFixed(2)}</strong>
                    </div>
                  </div>

                  <button 
                    className="order-details-btn" 
                    onClick={() => handleViewDetails(order)}
                    aria-label={`View details for order ${order.orderNumber}`}
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
      
      {/* Order Details Modal */}
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
                      <h2>#{selectedOrder.orderNumber}</h2>
                      <IonBadge 
                        color={getStatusColor(selectedOrder.status)}
                        className="status-badge"
                      >
                        {selectedOrder.status}
                      </IonBadge>
                    </div>
                    <div className="order-date-section">
                      <IonIcon icon={timeOutline} />
                      <span>{new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { 
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
                    {selectedOrder.items.map((item: OrderItem, index: number) => (
                      <IonRow key={index} className="item-row">
                        <IonCol size="6" className="item-name">{item.name}</IonCol>
                        <IonCol size="2" className="item-qty">{item.quantity}</IonCol>
                        <IonCol size="4" className="text-right item-price">₹{(item.price * item.quantity).toFixed(2)}</IonCol>
                      </IonRow>
                    ))}
                    <IonRow className="total-row">
                      <IonCol size="8" className="total-label"><strong>Total Amount</strong></IonCol>
                      <IonCol size="4" className="text-right total-price"><strong>₹{selectedOrder.total.toFixed(2)}</strong></IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>
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
