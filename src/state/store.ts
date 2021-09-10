// Lib
import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
// Utils
import { DispatchType, AppDataAction, AppDataState } from './types';
// Reducers
import messageReducer from './reducer/messageReducer';
import themeReducer from './reducer/themeReducer';
import deviceReducer from './reducer/deviceReducer';
import settingReducer from './reducer/settingReducer';

const reducer = combineReducers({
  messages: messageReducer,
  theme: themeReducer,
  devices: deviceReducer,
  settings: settingReducer,
});

export const appDataStore: Store<AppDataState, AppDataAction> & {
  dispatch: DispatchType;
} = createStore(reducer, applyMiddleware(thunk));

export type RootState = typeof reducer;
export type AppDispatchType = typeof appDataStore.dispatch;
export type AppDataStoreType = typeof appDataStore;
