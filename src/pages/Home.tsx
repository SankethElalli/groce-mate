import { IonContent, IonPage } from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className="home-content">
        <div className="home-bg">
          <video autoPlay loop muted playsInline>
            <source src="resources/prod.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="home-overlay" />
          <div className="home-center">
            <h1 className="home-title">Your minimalist grocery companion</h1>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
