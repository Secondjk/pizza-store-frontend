import React from 'react';
import { Navbar } from 'components';
import { Main } from 'views/screens/Main';
import { ModalPresenter } from 'views/screens';

export const App = () => {
  return (
    <>
      <ModalPresenter />
      <Navbar />
      <Main />
    </>
  );
};
