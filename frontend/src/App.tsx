import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SuperAdminRoutes from './routes/SuperAdminRoute';
import BusinessOwnerRoutes from './routes/BusinessOwnerRoute';
import LocalRoute from './routes/LocalRoute';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import HrMangerRoutes from './routes/HrManegerRoute';




export default function App() {
  const isBusinessOwnerAuthenticated = useSelector((state: RootState) => state.businessOwner.isAuthenticated);
  const isSuperAdminAuthenticated = useSelector((state: RootState) => state.superAdmin.isAuthenticated);

  return (
    <Router>
      <Toaster />
      <Routes>
      <Route path='/*'  element={ isSuperAdminAuthenticated ? <Navigate to='/super-admin/dashboard' /> : isBusinessOwnerAuthenticated  ? <Navigate to='/business-owner/dashboard' />  : <LocalRoute />} />
        <Route path="/business-owner/*" element={isBusinessOwnerAuthenticated ? <BusinessOwnerRoutes /> : <Navigate to={"/login"} />} />
        <Route path="/super-admin/*" element={ isSuperAdminAuthenticated ? <SuperAdminRoutes /> :  <Navigate to={"/superadmin-login"} />} />
        <Route path="/hr-manager/*" element={ <HrMangerRoutes />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
