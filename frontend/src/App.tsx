import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SuperAdminRoutes from './authentication/SuperAdminRoute';
import BusinessOwnerRoutes from './authentication/BusinessOwnerRoute';
import LocalRoute from './authentication/LocalRoute';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';




export default function App() {
  const isBusinessOwnerAuthenticated = useSelector((state: RootState) => state.businessOwner.isAuthenticated);
  const isSuperAdminAuthenticated = useSelector((state: RootState) => state.superAdmin.isAuthenticated);

  console.log("isAuthenticated -byusinessOwner :->", isBusinessOwnerAuthenticated);
  console.log("isAuthenticated -superAdmin:->", isSuperAdminAuthenticated);
  return (
    <Router>
      <Toaster />
      <Routes>
      <Route path='/*'  element={ isSuperAdminAuthenticated ? <Navigate to='/super-admin/dashboard' /> : isBusinessOwnerAuthenticated  ? <Navigate to='/business-owner/dashboard' />  : <LocalRoute />} />
        <Route path="/business-owner/*" element={isBusinessOwnerAuthenticated ? <BusinessOwnerRoutes /> : <Navigate to={"/login"} />} />
        <Route path="/super-admin/*" element={ isSuperAdminAuthenticated ? <SuperAdminRoutes /> :  <Navigate to={"/superadmin-login"} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
