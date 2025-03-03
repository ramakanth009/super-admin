import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Main from './components/Main';

export const AuthContext = createContext(null);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for authentication token on component mount
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;