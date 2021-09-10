// Types
import { AppDataState } from './types';

export const themeSelector = (state: AppDataState) => state.theme;
export const messageSelector = (state: AppDataState) => state.messages;
export const settingsSelector = (state: AppDataState) => state.settings;
export const deviceSelector = (state: AppDataState) => state.devices;
