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
  IonMenuButton
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle, homeOutline, cartOutline, storefrontOutline } from 'ionicons/icons';

import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import SideMenu from './components/SideMenu';

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

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <SideMenu />
    {/* Main Content */}
    <div className="ion-page" id="main-content">
      <IonHeader>
        <IonToolbar className="app-toolbar">
          <IonTitle className="app-title">GroceMate</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton />
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
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/">
              <IonIcon aria-hidden="true" icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="menu" href="/menu">
              <IonIcon aria-hidden="true" icon={storefrontOutline} />
              <IonLabel>Products</IonLabel>
            </IonTabButton>
            <IonTabButton tab="cart" href="/cart">
              <IonIcon aria-hidden="true" icon={cartOutline} />
              <IonLabel>Cart</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </div>
  </IonApp>
);


export default App;
