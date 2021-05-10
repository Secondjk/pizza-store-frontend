import React, { Fragment } from 'react';
import { useStore } from 'effector-react';
import { ModalStore } from 'stores';
import { ModalHOC } from 'utils/StoreHOC';
import { AuthModal } from 'components';
import { Modal } from 'stores/ModalStore';

export const ModalPresenter: React.FC = () => {
  const modalStore = useStore(ModalStore);
  console.log(modalStore.modal);

  const mapModalNameToComponent:
  {[modal in Modal]: React.ReactNode} = {
    AuthModal: ModalHOC('AuthModal', AuthModal),
    unset: Fragment
  };

  return <>
    { mapModalNameToComponent[modalStore.modal] }
  </>;
};