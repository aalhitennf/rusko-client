// Types
import { Theme } from '../theme';
import Device from '../Components/Devices/Device';

// State

export type AppDataState = {
  messages: Message[];
  theme: Theme;
  devices: Device[];
  settings: Settings;
};

export type AppDataAction =
  | MessageAction
  | ThemeAction
  | DeviceAction
  | SettingAction;

// Messages

export type Message = {
  id: string;
  text: string;
  // eslint-disable-next-line no-undef
  timer: NodeJS.Timeout;
};

export type MessageAction = {
  type: string;
  value: string;
};

// Theme

export type ThemeName = 'light' | 'dark';

export type ThemeAction = {
  type: string;
  value: ThemeName;
};

// Settings

export type Settings = {
  commandShowOnlyAliases: boolean;
  deviceListShowUnconnectable: boolean;
  inputSensitivity: number;
  theme: ThemeName;
};

export type SettingsKey = keyof Settings;

export type SettingArgs = {
  name: SettingsKey;
  value: boolean | string | number;
};

export type SettingAction = {
  type: string;
  args: SettingArgs;
};

// Devices

export type DeviceAction = {
  type: string;
  device: Device; // ? TBD
};

// Dispatch
export type DispatchType = (args: AppDataAction) => AppDataAction;

// Message
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE';
// Theme
export const SET_THEME = 'SET_THEME';
export const SET_SETTING = 'SET_SETTING';
// Device
export const SET_DEVICES = 'SET_DEVICES';
export const ADD_DEVICE = 'ADD_DEVICE';
export const REMOVE_DEVICE = 'REMOVE_DEVICE';
export const UPDATE_DEVICE = 'UPDATE_DEVICE';
// General
export const INITIALIZE_STATE = 'INITIALIZE_STATE';
export const CLEAR_STORAGE = 'CLEAR_STORAGE';
