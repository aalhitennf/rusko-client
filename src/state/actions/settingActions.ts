// Lib
import { createAsyncThunk } from '@reduxjs/toolkit';
// Utils
import storage from '../storage';
// Types
import { ThemeName, SET_THEME, SET_SETTING, SettingArgs } from '../types';
import { AppDispatchType } from '../store';

export const setTheme = createAsyncThunk<
  void,
  ThemeName,
  {
    dispatch: AppDispatchType;
  }
>(SET_THEME, async (name: ThemeName, store) => {
  await storage.setTheme(name);
  store.dispatch({
    type: SET_SETTING,
    args: {
      name: 'theme',
      value: name,
    },
  });
  store.dispatch({
    type: SET_THEME,
    value: name,
  });
});

export const setSetting = createAsyncThunk<
  void,
  SettingArgs,
  {
    dispatch: AppDispatchType;
  }
>(SET_SETTING, async (args: SettingArgs, store) => {
  await storage.setValue(args);
  store.dispatch({
    type: SET_SETTING,
    args: args,
  });
});
