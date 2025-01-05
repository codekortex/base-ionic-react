import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import store from './store';
import { UserService } from './infrastructure/UserService';

defineCustomElements(window);
const container = document.getElementById('root');
const root = createRoot(container!);
const userService = new UserService();
userService.open().catch((err) => {
  console.error('Failed to open db:', err.stack || err);
});

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);