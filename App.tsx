// Lib
import React from 'react';
import { NativeRouter } from 'react-router-native';
import { Provider } from 'react-redux';
// Components
import Main from './src/Main';
// State
import { appDataStore } from './src/state/store';

const App: React.FC = () => {
  return (
    <Provider store={appDataStore}>
      <NativeRouter>
        <Main />
      </NativeRouter>
    </Provider>
  );
};

export default App;
