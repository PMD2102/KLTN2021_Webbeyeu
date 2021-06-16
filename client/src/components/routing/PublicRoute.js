import { ADMIN_PATH, ROLE } from 'constants/keys';
import { GlobalContext } from 'context/GlobalContext';
import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';

const PublicRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, user } = useContext(GlobalContext);

  return (
    <Route
      {...rest}
      render={props =>
        !isAuthenticated ? (
          <Component {...props} />
        ) : user.role === ROLE.ADMIN ? (
          <Redirect to={ADMIN_PATH} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default PublicRoute;
