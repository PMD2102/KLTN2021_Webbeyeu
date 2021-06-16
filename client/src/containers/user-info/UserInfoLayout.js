import { HStack } from '@chakra-ui/layout';
import React from 'react';

const UserInfoLayout = ({ children }) => {
  return (
    <HStack maxW="70em" spacing="4" align="flex-start">
      {children}
    </HStack>
  );
};

export default UserInfoLayout;
