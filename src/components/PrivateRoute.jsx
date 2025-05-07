import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/localStorage';

const PrivateRoute = ({ children, requiredUserType }) => {
  const user = getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredUserType && user.userType !== requiredUserType) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;