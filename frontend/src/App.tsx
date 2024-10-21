import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SuperAdminRoutes from './authentication/SuperAdminRoute';
import BusinessOwnerRoutes from './authentication/BusinessOwnerRoute';
import LocalRoute from './authentication/LocalRoute';

export default function App() {

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path='/*' element={<LocalRoute />} />
        <Route path="/business-owner/*" element={<BusinessOwnerRoutes />} />
        <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
