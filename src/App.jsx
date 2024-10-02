import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Layout from './components/Layout/Layout';
import Invoice from './pages/Invoice';
import Reporting from './pages/Reporting';
import User from './pages/User';
import Integration from './pages/Integration';
import ForgotPassword from './components/Auth/forget';
import Reset from './components/Auth/Reset';
import Profile from './components/Auth/Profile';

const ProtectedRoute = ({ children }) => {
  // Note: useAuth is no longer imported, so this component needs to be updated
  // to use a different method of authentication or removed if no longer needed
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<Reset />} />
        <Route path="/profile" element={<Profile />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders/*" element={<Orders />} />
          <Route path="/inventory/*" element={<Inventory />} />
          <Route path="/invoices/*" element={<Invoice />} />
          <Route path="/reporting/*" element={<Reporting />} />
          <Route path="/users/*" element={<User />} />
          <Route path="/integration/*" element={<Integration />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
