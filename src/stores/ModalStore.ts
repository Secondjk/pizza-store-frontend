import { Store, Event, createStore, createEvent } from 'effector';
import React from 'react';
import { noop } from 'utils/misc';

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export type ModalFC = React.FC<ModalProps>;

export type Modal =
  'AuthModal'
  | 'unset';

type ModalStoreData = {
  modal: Modal
  onCloseFn: () => void
};

interface ModalStore extends Store<ModalStoreData> {
  setModal: Event<Modal>
  setOnClickFn: Event<ModalProps['onClose']>
}

export const ModalStore = (() => {
  const store = createStore<ModalStoreData>({
    modal: 'unset',
    onCloseFn: noop
  }) as ModalStore;

  store.setModal = createEvent<Modal>();
  store.on(store.setModal, (s, p) => ({
    ...s,
    modal: p,
    onCloseFn: () => store.setModal('unset')
  }));

  store.setOnClickFn = createEvent<ModalProps['onClose']>();
  store.on(store.setOnClickFn, (s, p) => ({ ...s, onCloseFn: p }));

  return store;
})();

export const setModal = ModalStore.setModal;