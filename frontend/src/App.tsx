import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SuperAdminRoutes from './authentication/SuperAdminRoute';
import BusinessOwnerRoutes from './authentication/BusinessOwnerRoute';
import LocalRoute from './authentication/LocalRoute';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import DashboardLayout from './pages/businessOwnerPages/DashboardLayout';



export default function App() {
  const isAuthenticated = useSelector((state: RootState) => state.businessOwner.isAuthenticated);
  console.log("isAuthenticated:->", isAuthenticated);
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path='/*' element={isAuthenticated? <Navigate to={'/business-owner/dashboard'}/>:<LocalRoute />} />
        <Route path="/business-owner/*" element={isAuthenticated ? <BusinessOwnerRoutes /> : <Navigate to={"/login"} />} />
        <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
        <Route path="/samplepage" element={<DashboardLayout />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
