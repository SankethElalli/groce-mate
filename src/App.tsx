import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent as IonMenuContent,
  IonButtons,
  IonMenuButton,
  IonBadge
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle, homeOutline, cartOutline, storefrontOutline } from 'ionicons/icons';

import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import SideMenu from './components/SideMenu';
import { CartProvider, useCart } from './contexts/CartContext';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import './App.css';
import './pages/EmergencyFix.css';
import './pages/ProfessionalAppFix.css';
import './pages/ThemeSupport.css';
import './pages/IconFix.css';
import './pages/TabBarFix.css';

// Add custom style for focus management
const style = document.createElement('style');
style.textContent = `
  [inert] * {
    opacity: 0.5;
    pointer-events: none;
    user-select: none;
  }

  /* Ensure menu items are properly focusable */
  ion-item[button]:focus {
    outline: 2px solid var(--ion-color-primary);
    outline-offset: -2px;
  }
`;
document.head.appendChild(style);

import { isPlatform } from '@ionic/react';

setupIonicReact({
  // Add these accessibility-focused config options
  animated: true,
  mode: 'md',
  innerHTMLTemplatesEnabled: false,
  tabButtonLayout: 'label-hide'
  // Removed a11yStatusMessageEnabled as it's not a valid config option
});

const TabBar: React.FC = () => {
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <IonTabBar slot="bottom" className="tab-bar-custom">
      <IonTabButton tab="home" href="/" className="tab-button-custom">
        <IonIcon aria-hidden="true" icon={homeOutline} className="nav-icon" style={{visibility: 'visible', opacity: 1, display: 'block'}} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
      <IonTabButton tab="menu" href="/menu" className="tab-button-custom">
        <IonIcon aria-hidden="true" icon={storefrontOutline} className="nav-icon" style={{visibility: 'visible', opacity: 1, display: 'block'}} />
        <IonLabel>Products</IonLabel>
      </IonTabButton>
      <IonTabButton tab="cart" href="/cart" className="tab-button-custom">
        <IonIcon aria-hidden="true" icon={cartOutline} className="nav-icon" style={{visibility: 'visible', opacity: 1, display: 'block'}} />
        <IonLabel>Cart</IonLabel>
        {itemCount > 0 && (
          <IonBadge className="cart-badge-circular">{itemCount}</IonBadge>
        )}
      </IonTabButton>
    </IonTabBar>
  );
};

const App: React.FC = () => (
  <CartProvider>
    <IonApp>
      <SideMenu />
      {/* Main Content */}
      <div 
        className="ion-page" 
        id="main-content" 
        role="main"
        aria-live="polite"
      >
        <IonHeader>
          <IonToolbar className="app-toolbar">
            <IonTitle className="app-title">GroceMate</IonTitle>
            <IonButtons slot="end">
              <IonMenuButton 
                aria-label="Menu"
                onClick={() => {
                  // When menu is activated, make main content inert
                  const mainContent = document.getElementById('main-content');
                  if (mainContent) {
                    mainContent.setAttribute('inert', '');
                  }
                }}
              />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/" component={Home} />
              <Route exact path="/menu" component={Products} />
              <Route exact path="/cart" component={Cart} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/admin" component={AdminDashboard} />
              <Route exact path="/orders" component={Orders} />
              <Route exact path="/profile" component={Profile} />
            </IonRouterOutlet>
            <TabBar />
          </IonTabs>
        </IonReactRouter>
      </div>
    </IonApp>
  </CartProvider>
);

export default App;

