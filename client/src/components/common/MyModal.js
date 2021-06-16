import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import React from 'react';

const MyModal = ({
  isOpenModal,
  setCloseModal,
  title,
  isCloseIcon = false,
  closeOnOverlayClick = true,
  scrollBehavior,
  size = 'md',
  children,
  isCentered = true,
}) => {
  return (
    <Modal
      isOpen={isOpenModal}
      onClose={() => setCloseModal(false)}
      isCentered={isCentered}
      closeOnOverlayClick={closeOnOverlayClick}
      size={size}
      scrollBehavior={scrollBehavior}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        {!isCloseIcon && <ModalCloseButton />}
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MyModal;
