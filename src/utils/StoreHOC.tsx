import React from 'react';
import { Modal, ModalProps, ModalStore } from 'stores/ModalStore';
import { useStore } from 'effector-react';

export const ModalHOC = (name: Modal, Component: React.FC<ModalProps>) => {
  const store = useStore(ModalStore);

  return (
    <Component isOpen={store.modal === name} onClose={store.onCloseFn} />
  );
};