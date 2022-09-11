import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';

import * as registerServiceWorker from './registerServiceWorker';

// @mui
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { store, persistor } from './redux/store';
// contexts
import { SettingsProvider } from './contexts/SettingsContext';
//
import App from './App';

// ----------------------------------------------------------------------

ReactDOM.render(
  <HelmetProvider>
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </PersistGate>
    </ReduxProvider>
  </HelmetProvider>,
  document.getElementById('root')
);

registerServiceWorker.register();