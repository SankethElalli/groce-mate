import { IonContent, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value.trim()) {
      const searchTerm = event.currentTarget.value.trim();
      history.push(`/menu?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="home-content">
        <div className="home-bg">
          <video autoPlay loop muted playsInline className="home-video">
            <source src="resources/prod.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="home-overlay" />
          <div className="home-center">
            <h1 className="home-title">Your minimalist grocery companion</h1>
            <div className="home-search-container">
              <input
                className="home-search"
                type="text"
                placeholder="Search for groceries..."
                onKeyPress={handleSearch}
              />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
