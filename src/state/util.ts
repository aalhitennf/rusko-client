// Types
import { AppDataState } from './types';
// Theme
import { themes } from '../theme';
import storage from './storage';

export const createInitialState = async (): Promise<AppDataState> => {
  return {
    messages: [],
    theme: (await storage.getTheme()) === 'light' ? themes.light : themes.dark,
  };
};

export const initialState: AppDataState = {
  messages: [],
  theme: themes.dark,
};
