import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../components/BusinessOwner/BusinessOwnerPages/Dashboard';
import Workers from '../components/BusinessOwner/BusinessOwnerPages/Workers';
import AddWorkersForm from '../components/BusinessOwner/BusinessOwnerPages/AddWorkersForm';
import BusinessOwnerMiddleware from '../middlewares/businessOwnerThunk';
import BusinessOwnerDashBoardLayout from '../pages/businessOwnerPages/CompanyLayout';
import { useSelector } from 'react-redux';

const BusinessOwnerRoutes = () => {
const isAuthenticated = useSelector((state: any) => state.businessOwner.isAuthenticated);
  return (
    <Routes>
      

      <Route element={<BusinessOwnerDashBoardLayout />}>
        <Route  path="dashboard" element={ <BusinessOwnerMiddleware> <Dashboard /></BusinessOwnerMiddleware>   } />
        <Route path="/business-owner/workers" element={<Workers />} />
        <Route path="/business-owner/addworkers" element={<AddWorkersForm />} />
        
      </Route>
    </Routes>
  );
};

export default BusinessOwnerRoutes;
