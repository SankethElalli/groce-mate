import { useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { login as apiLogin, register as apiRegister } from '../api/api';
import { useHistory } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        // @ts-ignore
        const name = (e.target as any).elements[0].value;
        // @ts-ignore
        const email = (e.target as any).elements[isRegister ? 1 : 0].value;
        // @ts-ignore
        const password = (e.target as any).elements[isRegister ? 2 : 1].value;
        const res = await apiRegister(name, email, password);
        if (res.token) {
          localStorage.setItem('token', res.token); // Save token for authenticated requests
          if (res.user?.role === 'admin') {
            history.push('/admin');
          } else {
            history.push('/');
          }
        } else {
          setError(res.message || 'Registration failed');
        }
      } else {
        // @ts-ignore
        const email = (e.target as any).elements[0].value;
        // @ts-ignore
        const password = (e.target as any).elements[1].value;
        const res = await apiLogin(email, password);
        if (res.token) {
          localStorage.setItem('token', res.token); // Save token for authenticated requests
          if (res.user?.role === 'admin') {
            history.push('/admin');
          } else {
            history.push('/');
          }
        } else {
          setError(res.message || 'Login failed');
        }
      }
    } catch (err) {
      setError('Something went wrong');
    }
    setLoading(false);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-content">
        <div className="login-center">
          <h1 className="login-title">{isRegister ? 'Register' : 'Login'}</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            {isRegister && (
              <input
                className="login-input"
                type="text"
                placeholder="Full Name"
                required
              />
            )}
            <input
              className="login-input"
              type="email"
              placeholder="Email"
              required
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              required
            />
            {isRegister && (
              <input
                className="login-input"
                type="password"
                placeholder="Confirm Password"
                required
              />
            )}
            <button className="login-btn" type="submit" disabled={loading}>
              {isRegister ? 'Register' : 'Login'}
            </button>
          </form>
          {error && <div className="login-error">{error}</div>}
          {loading && <div className="login-loading">Loading...</div>}
          <div className="login-toggle">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => setIsRegister(false)} className="login-link">
                  Login
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button type="button" onClick={() => setIsRegister(true)} className="login-link">
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
