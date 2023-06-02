import React, { useState, useEffect } from 'react';
import './Styles.css';
import './Form.css';
import './ProfileStyles.css'
import Registration from './pages/Registration';
import Login from './pages/Login';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './Context/AuthContext.js';
import { useContext } from 'react';
import LoadingScreen from './components/LoadingScreen';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/Login" />;
    }
    return children;
  };

  useEffect(() => {
    // Simulating a delay for demonstration purposes
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  
  return (
    <BrowserRouter>
      {loading ? (
        <LoadingScreen/>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login setLoading={setLoading} />} />
          <Route
            path="registration"
            element={<Registration setLoading={setLoading} />}
          />
           <Route
            path="forgotpassword"
            element={<ForgotPassword setLoading={setLoading} />}
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
