import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoginPage from './pages/login';
import OnboardingPage from './pages/OnboardingPage';
import SourceConfigPage from './pages/SourceConfigPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //  Hardcoded role for now
  const [role] = useState<"admin" | "viewer">("admin"); // switch to "viewer" to test

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 className="display-5 fw-bold text-primary" style={{ fontFamily: 'Poppins, Montserrat, Segoe UI, Arial, sans-serif', letterSpacing: '1px', margin: 0 }}>
          Admin Portal
        </h1>
        <div>
          <span className="fw-semibold text-info" style={{ fontSize: '1.15rem', letterSpacing: '1px' }}>
            Role: {role.toUpperCase()}
          </span>
          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm ms-2" style={{ fontWeight: 600, letterSpacing: '0.5px' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Pages with role-aware UI */}
      <OnboardingPage role={role} />
      <SourceConfigPage role={role} />
    </div>
  );
};

export default App;
