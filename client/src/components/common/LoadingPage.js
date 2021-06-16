import { HStack } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import React from 'react';

const LoadingPage = () => {
  return (
    <HStack
      pos="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      align="center"
      justify="center"
      zIndex="999"
      bg="rgba(0,0,0,0.4)"
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </HStack>
  );
};

export default LoadingPage;
