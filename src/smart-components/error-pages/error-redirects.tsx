import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';

export const UnauthorizedRedirect: React.ComponentType = () => {
  const location = useLocation();
  return (
    <Redirect
      to={{
        pathname: '/403',
        state: {
          from: location
        }
      }}
    />
  );
};
