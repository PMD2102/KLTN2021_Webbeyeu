import { Button, Icon, Text } from '@chakra-ui/react';
import { GlobalContext } from 'context/GlobalContext';
import jwtDecode from 'jwt-decode';
import React, { useContext } from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

import { FaFacebookF } from 'react-icons/fa';
import http from 'utils/http';

const FacebookSignIn = () => {
  const { setCurrentUser } = useContext(GlobalContext);

  const responseFacebook = response => {
    const { name, email, userID } = response;
    if (name && email && userID) {
      http
        .post('/users/sign-in/facebook', {
          name,
          email,
          userID,
        })
        .then(res => {
          const { token } = res.data;
          localStorage.setItem('token', token);
          const decoded = jwtDecode(token);
          setCurrentUser(decoded);
        })
        .catch(err => console.error(err));
    }
  };

  return (
    <FacebookLogin
      appId="310097323900530"
      autoLoad={false}
      fields="name,email,picture"
      // onClick={componentClicked}
      callback={responseFacebook}
      render={renderProps => (
        <Button
          bg="blue.700"
          color="white"
          my="0.5em"
          w="100%"
          _hover={{ bg: 'blue.600' }}
          onClick={renderProps.onClick}
        >
          <Icon as={FaFacebookF} w="1.5em" h="1.5em" />
          <Text>Facebook</Text>
        </Button>
      )}
    />
  );
};

export default FacebookSignIn;
