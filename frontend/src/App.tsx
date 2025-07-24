import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoginPage from './pages/login';
import OnboardingPage from './pages/OnboardingPage';
import SourceConfigPage from './pages/SourceConfigPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //  Hardcoded role for now
  const [role, setRole] = useState<"admin" | "viewer">("admin"); // switch to "viewer" to test

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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1>Admin Portal</h1>
        <div>
          <strong>Role:</strong> {role.toUpperCase()}&nbsp;
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Pages with role-aware UI */}
      <OnboardingPage role={role} />
      <SourceConfigPage role={role} />
    </div>
  );
};

export default App;
