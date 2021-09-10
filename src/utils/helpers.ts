// Lib
import JWT from 'expo-jwt';
import DeviceInfo from 'react-native-device-info';
// Types
import { Command } from '../types';

export const parseCommands = (data: unknown): Command[] => {
  if (!(data && typeof data === 'string')) {
    throw new Error('Parse error: Invalid data');
  }
  return data
    .split('\n')
    .map(l => l.split('::'))
    .filter(p => p.length === 2)
    .map(p => Object.create({ alias: p[0], command: p[1] }));
};

// Expires in 5 seconds
export const createJWT = async (password: string): Promise<string> => {
  return JWT.encode(
    {
      exp: Math.round(new Date().getTime() / 1000 + 5000),
      dev: await getDeviceIdentifier(),
    },
    password,
  );
};

export const getDeviceIdentifier = async (): Promise<string> => {
  let name = await DeviceInfo.getDeviceName();
  name = name.replace(new RegExp(' ', 'g'), '_');
  return DeviceInfo.getUniqueId() + ':' + name;
};
