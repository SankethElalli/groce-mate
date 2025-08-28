import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent as IonMenuContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel
} from '@ionic/react';
import { personOutline, logInOutline, receiptOutline } from 'ionicons/icons';

const SideMenu: React.FC = () => (
  <IonMenu side="end" contentId="main-content">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Menu</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonMenuContent className="ion-padding">
      <IonList>
        <IonItem button routerLink="/login">
          <IonIcon slot="start" icon={logInOutline} />
          <IonLabel>Login</IonLabel>
        </IonItem>
        <IonItem button routerLink="/profile">
          <IonIcon slot="start" icon={personOutline} />
          <IonLabel>Profile</IonLabel>
        </IonItem>
        <IonItem button routerLink="/orders">
          <IonIcon slot="start" icon={receiptOutline} />
          <IonLabel>Orders</IonLabel>
        </IonItem>
      </IonList>
    </IonMenuContent>
  </IonMenu>
);

export default SideMenu;
