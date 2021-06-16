import { ROLE } from 'constants/keys';
import { GlobalContext } from 'context/GlobalContext';
import React, { useContext, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, user } = useContext(GlobalContext);

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated && user?.role === ROLE.ADMIN ? (
          <Component {...props} />
        ) : (
          <Redirect to="/dang-nhap" />
        )
      }
    />
  );
};

export default PrivateRoute;
