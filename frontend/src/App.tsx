import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import SuperAdminRoutes from './routes/SuperAdminRoute';
import BusinessOwnerRoutes from './routes/BusinessOwnerRoute';
import LocalRoute from './routes/LocalRoute';
import MangerRoutes from './routes/ManagerRoute';
import EmployeeRoute from './routes/employeeRoute';
import 'react-toastify/dist/ReactToastify.css'; 


export default function App() {
  return (
    <Router>
      <ToastContainer />
      <Toaster />
      <Routes>
        <Route path='/*'  element={  <LocalRoute />} />
        <Route path="/business-owner/*" element={ <BusinessOwnerRoutes /> } />
        <Route path="/super-admin/*" element={<SuperAdminRoutes /> } />
        <Route path="/manager/*" element={ <MangerRoutes />} />
        <Route path="/employee/*" element={ <EmployeeRoute />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
