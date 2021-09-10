// Lib
import EncryptedStorage from 'react-native-encrypted-storage';
// Constants
import { STORAGE_NAMESPACE } from '../constants';
// Types
import { ThemeName, SettingArgs } from './types';
import Device, { DeviceJson } from '../Components/Devices/Device';

class StorageHandler {
  namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
    this.initializeDevices();
  }

  private async initializeDevices(): Promise<void> {
    try {
      await this.getDevices();
    } catch (_) {
      try {
        await this.setDevices([]);
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }
  }

  async setTheme(name: ThemeName) {
    await EncryptedStorage.setItem(`${this.namespace}:theme`, name);
  }

  async getValue(name: string) {
    const value = await EncryptedStorage.getItem(`${this.namespace}:${name}`);
    if (!value) {
      throw new Error(`Failed to get '${name}' from storage`);
    }
    return value;
  }

  async setValue(args: SettingArgs) {
    await EncryptedStorage.setItem(
      `${this.namespace}:${args.name}`,
      args.value.toString(),
    );
  }

  async clear() {
    await EncryptedStorage.clear();
  }

  // Devices
  async getDevices(): Promise<Device[]> {
    const data = await EncryptedStorage.getItem(`${this.namespace}:devices}`);
    if (!data) {
      throw new Error('Failed to read devices from storage');
    }
    return JSON.parse(data).map((d: DeviceJson) => new Device(d));
  }

  async setDevices(devices: Device[]): Promise<void> {
    const jsonData = JSON.stringify(devices.map(d => d.toJSON()));
    await EncryptedStorage.setItem(`${this.namespace}:devices}`, jsonData);
  }

  async addDevice(newDevice: Device): Promise<void> {
    const currentData = await this.getDevices();
    if (currentData.find(device => device.id === newDevice.id)) {
      throw new Error('Device with same id already exists');
    }
    const updatedData = currentData.concat(newDevice);
    await this.setDevices(updatedData);
  }

  async removeDevice(device: Device): Promise<void> {
    const currentData = await this.getDevices();
    if (!currentData.find(d => d.id === device.id)) {
      throw new Error('Device with given id doesnt exist');
    }
    const updatedData = currentData.filter(d => d.id !== device.id);
    await this.setDevices(updatedData);
  }

  async updateDevice(device: Device): Promise<void> {
    const currentData = await this.getDevices();
    const filtered = currentData.filter(d => d.id !== device.id);
    const updated = filtered.concat(device);
    await this.setDevices(updated);
  }
}

const storage = new StorageHandler(STORAGE_NAMESPACE);

export default storage;
