import { GlobalContext } from 'context/GlobalContext';
import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, user } = useContext(GlobalContext);

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/dang-nhap" />
        )
      }
    />
  );
};

export default PrivateRoute;
