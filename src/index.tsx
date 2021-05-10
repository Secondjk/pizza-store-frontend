import React from 'react';
import ReactDOM from 'react-dom';
import { App } from 'App';
import { RouteProvider } from 'router';

import 'assets/global.css';

ReactDOM.render(
  <RouteProvider>
    <App />
  </RouteProvider>,
  document.getElementById('root')
);