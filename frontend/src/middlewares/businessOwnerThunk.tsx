// import React, { ReactNode } from 'react';
// import { Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { RootState } from '../redux/store/store'; 

// interface BusinessOwnerMiddlewareProps {
//   children: ReactNode; 
// }

// const BusinessOwnerMiddleware: React.FC<BusinessOwnerMiddlewareProps> = ({ children }) => {
//   const isAuthenticated =useSelector((state: RootState) => state.businessOwner.isAuthenticated);
//   const userRole = useSelector((state: RootState) => state.businessOwner.role);


//   if (!isAuthenticated || userRole !== 'business-owner') {
//     return <Navigate to="/" />;
//   }

//   return <>{children}</>; 
// };

// export default BusinessOwnerMiddleware;
