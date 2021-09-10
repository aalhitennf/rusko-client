// Lib
import Aes from 'react-native-aes-crypto';

const toHex = (str: string) => {
  var result = '';
  for (var i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
};

export const encryptPayload = async (data: string, key: string) => {
  if (data.length === 0) {
    throw new Error('Nothing to encrypt: data length zero');
  }
  if (key.length !== 16) {
    throw new Error('Aes key must be 16 characters');
  }
  const iv = genIv();
  const base64 = await Aes.encrypt(data, toHex(key), toHex(iv));
  return iv.concat(base64);
};

export const decryptPayload = async (
  data: string,
  key: string,
): Promise<string> => {
  if (data.length < 40) {
    throw new Error('Invalid data: too short');
  }
  if (key.length !== 16) {
    throw new Error('Aes key must be 16 characters');
  }
  const parts = [data.slice(0, 16), data.slice(16)];
  return await Aes.decrypt(parts[1], toHex(key), toHex(parts[0]));
};

const genIv = () => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
