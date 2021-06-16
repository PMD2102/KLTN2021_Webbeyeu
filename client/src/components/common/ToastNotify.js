import { createStandaloneToast } from "@chakra-ui/react";

const toast = createStandaloneToast();

const ToastNotify = ({ title, description, status }) =>
  toast({
    title,
    description,
    status,
    duration: 3000,
    position: "top-right",
    isClosable: true,
  });

export default ToastNotify;
