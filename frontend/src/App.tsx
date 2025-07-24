import React from 'react';
import OnboardingPage from './pages/OnboardingPage';
import SourceConfigPage from './pages/SourceConfigPage';

function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Admin Portal</h1>
      {/* Toggle views manually */}
      <OnboardingPage />
      <SourceConfigPage />
    </div>
  );
}

export default App;
