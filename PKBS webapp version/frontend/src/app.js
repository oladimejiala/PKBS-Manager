import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Import your pages
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Factory from './pages/Factory';
import Logistics from './pages/Logistics';
import Sales from './pages/Sales';
import Sourcing from './pages/Sourcing';
import Login from './pages/Login';
// import NotFound from './pages/NotFound';

const App = () => {
  const user = useSelector(state => state.auth.user);

  // Simple auth guard
  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="/factory"
          element={
            <PrivateRoute>
              <Factory />
            </PrivateRoute>
          }
        />
        <Route
          path="/logistics"
          element={
            <PrivateRoute>
              <Logistics />
            </PrivateRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <PrivateRoute>
              <Sales />
            </PrivateRoute>
          }
        />
        <Route
          path="/sourcing"
          element={
            <PrivateRoute>
              <Sourcing />
            </PrivateRoute>
          }
        />
        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
