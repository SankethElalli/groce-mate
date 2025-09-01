import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonRadioGroup,
  IonRadio,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCheckbox,
  IonToast,
  IonSpinner
} from '@ionic/react';
import {
  locationOutline,
  callOutline,
  mailOutline,
  cardOutline,
  cashOutline,
  timeOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import { useCart } from '../contexts/CartContext';
import './Checkout.css';

interface DeliveryAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

const Checkout: React.FC = () => {
  const history = useHistory();
  const { items, getTotalPrice, clearCart } = useCart();
  
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [orderNotes, setOrderNotes] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Calculate totals
  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;
  
  // Handle form input changes
  const handleAddressChange = (field: keyof DeliveryAddress, value: string) => {
    setDeliveryAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Validate form
  const validateForm = (): boolean => {
    if (!deliveryAddress.fullName.trim()) {
      showError('Full name is required');
      return false;
    }
    if (!deliveryAddress.phone.trim() || deliveryAddress.phone.length < 10) {
      showError('Valid phone number is required');
      return false;
    }
    if (!deliveryAddress.addressLine1.trim()) {
      showError('Address is required');
      return false;
    }
    if (!deliveryAddress.city.trim()) {
      showError('City is required');
      return false;
    }
    if (!deliveryAddress.pincode.trim() || deliveryAddress.pincode.length !== 6) {
      showError('Valid pincode is required');
      return false;
    }
    return true;
  };
  
  // Show error message
  const showError = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };
  
  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order object with proper structure
      const order = {
        _id: `order_${Date.now()}`,
        orderNumber: `ORD${Date.now()}`,
        items: items.map(item => ({
          _id: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        deliveryAddress: {
          fullName: deliveryAddress.fullName,
          phone: deliveryAddress.phone,
          email: deliveryAddress.email,
          addressLine1: deliveryAddress.addressLine1,
          addressLine2: deliveryAddress.addressLine2,
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          pincode: deliveryAddress.pincode
        },
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
        orderNotes: orderNotes,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        status: 'Processing',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      console.log('Saving order:', order); // Debug log
      
      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.unshift(order); // Add new order at the beginning
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      console.log('Orders saved to localStorage:', existingOrders); // Debug log
      
      // Clear cart
      clearCart();
      
      // Show success and redirect
      setToastMessage('Order placed successfully!');
      setShowToast(true);
      
      setTimeout(() => {
        history.push('/orders');
      }, 1500);
      
    } catch (error) {
      console.error('Error placing order:', error);
      showError('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (items.length === 0) {
    return (
      <IonPage className="checkout-page">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/cart" />
            </IonButtons>
            <IonTitle>Checkout</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="checkout-content">
          <div className="checkout-empty">
            <IonIcon icon={checkmarkCircleOutline} />
            <h3>No items to checkout</h3>
            <p>Your cart is empty</p>
            <IonButton routerLink="/menu" fill="outline">
              Continue Shopping
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }
  
  return (
    <IonPage className="checkout-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/cart" />
          </IonButtons>
          <IonTitle>Checkout</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="checkout-content">
        <div className="checkout-container">
          
          {/* Order Summary */}
          <IonCard className="order-summary-card">
            <IonCardHeader>
              <IonCardTitle>Order Summary</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="simple-order-summary">
                <div className="simple-order-items">
                  {items.map((item, index) => (
                    <div key={index} className="simple-order-item">
                      <div className="simple-item-details">
                        <span className="simple-item-name">{item.name}</span>
                        <span className="simple-item-quantity">x{item.quantity}</span>
                      </div>
                      <span className="simple-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="simple-order-totals">
                  <div className="simple-total-row">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="simple-total-row">
                    <span>Delivery Fee:</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>
                  {deliveryFee === 0 && (
                    <div className="simple-free-delivery-note">Free delivery on orders above ₹500</div>
                  )}
                  <div className="simple-total-row final-total">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
          
          {/* Delivery Address */}
          <IonCard className="delivery-address-card">
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={locationOutline} />
                Delivery Address
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="simple-address-form">
                <div className="simple-form-field">
                  <label className="simple-form-label required" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    className="simple-form-input"
                    type="text"
                    value={deliveryAddress.fullName}
                    onChange={e => handleAddressChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="simple-form-row">
                  <div className="simple-form-field">
                    <label className="simple-form-label required" htmlFor="phone">
                      Phone
                    </label>
                    <input
                      id="phone"
                      className="simple-form-input"
                      type="tel"
                      value={deliveryAddress.phone}
                      onChange={e => handleAddressChange('phone', e.target.value)}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      required
                    />
                  </div>
                  <div className="simple-form-field">
                    <label className="simple-form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      className="simple-form-input"
                      type="email"
                      value={deliveryAddress.email}
                      onChange={e => handleAddressChange('email', e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="simple-form-field">
                  <label className="simple-form-label required" htmlFor="address1">
                    Street Address
                  </label>
                  <input
                    id="address1"
                    className="simple-form-input"
                    type="text"
                    value={deliveryAddress.addressLine1}
                    onChange={e => handleAddressChange('addressLine1', e.target.value)}
                    placeholder="House no, Building, Street name"
                    required
                  />
                </div>

                <div className="simple-form-field">
                  <label className="simple-form-label" htmlFor="address2">
                    Area & Landmark
                  </label>
                  <input
                    id="address2"
                    className="simple-form-input"
                    type="text"
                    value={deliveryAddress.addressLine2}
                    onChange={e => handleAddressChange('addressLine2', e.target.value)}
                    placeholder="Area, Landmark (Optional)"
                  />
                </div>

                <div className="simple-form-row">
                  <div className="simple-form-field">
                    <label className="simple-form-label required" htmlFor="city">
                      City
                    </label>
                    <input
                      id="city"
                      className="simple-form-input"
                      type="text"
                      value={deliveryAddress.city}
                      onChange={e => handleAddressChange('city', e.target.value)}
                      placeholder="Your city"
                      required
                    />
                  </div>
                  <div className="simple-form-field">
                    <label className="simple-form-label" htmlFor="state">
                      State
                    </label>
                    <input
                      id="state"
                      className="simple-form-input"
                      type="text"
                      value={deliveryAddress.state}
                      onChange={e => handleAddressChange('state', e.target.value)}
                      placeholder="Your state"
                    />
                  </div>
                  <div className="simple-form-field">
                    <label className="simple-form-label required" htmlFor="pincode">
                      PIN Code
                    </label>
                    <input
                      id="pincode"
                      className="simple-form-input"
                      type="number"
                      value={deliveryAddress.pincode}
                      onChange={e => handleAddressChange('pincode', e.target.value)}
                      placeholder="6-digit PIN"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
          
          {/* Payment Method */}
          <IonCard className="payment-method-card">
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={cardOutline} />
                Payment Method
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonRadioGroup value={paymentMethod} onIonChange={e => setPaymentMethod(e.detail.value)}>
                <IonItem>
                  <IonIcon icon={cashOutline} slot="start" />
                  <IonLabel>
                    <h3>Cash on Delivery</h3>
                    <p>Pay when your order arrives</p>
                  </IonLabel>
                  <IonRadio slot="end" value="cod" />
                </IonItem>
                <IonItem>
                  <IonIcon icon={cardOutline} slot="start" />
                  <IonLabel>
                    <h3>Online Payment</h3>
                    <p>Pay now with card/UPI (Coming Soon)</p>
                  </IonLabel>
                  <IonRadio slot="end" value="online" disabled />
                </IonItem>
              </IonRadioGroup>
            </IonCardContent>
          </IonCard>
          
          {/* Order Notes */}
          <IonCard className="order-notes-card">
            <IonCardHeader>
              <IonCardTitle>Order Notes (Optional)</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="simple-notes-form">
                <label className="simple-notes-label" htmlFor="orderNotes">
                  Special Instructions
                </label>
                <textarea
                  id="orderNotes"
                  className="simple-notes-textarea"
                  value={orderNotes}
                  onChange={e => setOrderNotes(e.target.value)}
                  placeholder="Any special instructions for delivery (e.g., gate code, specific time, etc.)"
                  rows={4}
                  maxLength={200}
                />
                <div className="simple-character-count">
                  {orderNotes.length}/200 characters
                </div>
              </div>
            </IonCardContent>
          </IonCard>
          
          {/* Place Order Button */}
          <div className="place-order-section">
            <IonButton
              expand="block"
              size="large"
              onClick={handlePlaceOrder}
              disabled={isLoading}
              className="place-order-btn"
            >
              {isLoading ? (
                <>
                  <IonSpinner name="crescent" />
                  <span className="ion-margin-start">Placing Order...</span>
                </>
              ) : (
                <>
                  <IonIcon icon={checkmarkCircleOutline} slot="start" />
                  Place Order - ₹{total.toFixed(2)}
                </>
              )}
            </IonButton>
          </div>
          
        </div>
        
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default Checkout;
