// Lib
import { createAsyncThunk } from '@reduxjs/toolkit';
// Utils
import storage from '../storage';
// Types
import {
  INITIALIZE_STATE,
  CLEAR_STORAGE,
  ADD_DEVICE,
  REMOVE_DEVICE,
  SET_THEME,
  SET_SETTING,
  ThemeName,
  AppDataState,
  SettingsKey,
} from '../types';
import { AppDispatchType } from '../store';
import { initialSettings } from '../reducer/settingReducer';

export const initializeDevices = createAsyncThunk<
  void,
  undefined,
  {
    dispatch: AppDispatchType;
    state: AppDataState;
  }
>(INITIALIZE_STATE, async (_, store) => {
  // Restore devices
  const devices = await storage.getDevices();
  devices.forEach(d => {
    store.dispatch({
      type: ADD_DEVICE,
      device: d,
    });
  });
});

export const initializeTheme = createAsyncThunk<
  void,
  undefined,
  {
    dispatch: AppDispatchType;
    state: AppDataState;
  }
>(INITIALIZE_STATE, async (_, store) => {
  let theme = 'dark' as ThemeName;

  try {
    theme = (await storage.getValue('theme')) as ThemeName;
  } catch (_e) {}

  store.dispatch({
    type: SET_THEME,
    value: theme,
  });
});

export const initializeSettings = createAsyncThunk<
  void,
  undefined,
  {
    dispatch: AppDispatchType;
    state: AppDataState;
  }
>(INITIALIZE_STATE, async (_, store) => {
  // Restore settings
  Object.keys(store.getState().settings).forEach(async key => {
    let value = initialSettings[key as SettingsKey];

    try {
      const fromStorage = await storage.getValue(key);
      if (fromStorage === 'true' || fromStorage === 'false') {
        value = fromStorage === 'true' ? true : false;
      } else if (!isNaN(parseInt(fromStorage, 10))) {
        value = parseInt(fromStorage, 10);
      } else {
        value = fromStorage as ThemeName;
      }
    } catch (_e) {}

    store.dispatch({
      type: SET_SETTING,
      args: {
        name: key as SettingsKey,
        value: value,
      },
    });
  });
});

export const resetData = createAsyncThunk<
  void,
  undefined,
  {
    dispatch: AppDispatchType;
    state: AppDataState;
  }
>(CLEAR_STORAGE, async (_, store) => {
  await storage.clear();

  // Devices
  store.getState().devices.forEach(d => {
    store.dispatch({
      type: REMOVE_DEVICE,
      device: d,
    });
  });

  // Settings
  Object.keys(store.getState().settings).forEach(async key => {
    store.dispatch({
      type: SET_SETTING,
      args: {
        name: key as SettingsKey,
        value: initialSettings[key as SettingsKey],
      },
    });
  });

  // Theme
  store.dispatch({
    type: SET_THEME,
    value: 'light' as ThemeName,
  });
});
