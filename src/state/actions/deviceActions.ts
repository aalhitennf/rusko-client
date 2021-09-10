// Lib
import { CancelTokenSource, Method } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
// Utils
import storage from '../storage';
// Types
import { ADD_DEVICE, REMOVE_DEVICE, UPDATE_DEVICE } from '../types';
import { AppDataStoreType } from '../store';
import Device from '../../Components/Devices/Device';
import { getDeviceIdentifier } from '../../utils/helpers';
import { requestHandler } from '../../utils/requestHandler';

export const addDevice = createAsyncThunk<void, Device, AppDataStoreType>(
  ADD_DEVICE,
  async (device, store) => {
    await storage.addDevice(device);
    store.dispatch({
      type: ADD_DEVICE,
      device: device,
    });
  },
);

interface RemoveDeviceArgs {
  device: Device;
  cancelToken: CancelTokenSource;
}

export const removeDevice = createAsyncThunk<
  void,
  RemoveDeviceArgs,
  AppDataStoreType
>(REMOVE_DEVICE, async ({ device, cancelToken }, store) => {
  try {
    const request = {
      path: '/api/unpair',
      method: 'POST' as Method,
      cancelToken: cancelToken,
      device: device,
      data: await getDeviceIdentifier(),
    };

    const response = await requestHandler(request);

    if (response !== 'OK') {
      throw new Error('');
    }
  } catch (_error) {
    store.dispatch({
      type: 'ADD_MESSAGE',
      value: 'Failed to unpair with server.',
    });
  }

  await storage.removeDevice(device);

  store.dispatch({
    type: REMOVE_DEVICE,
    device: device,
  });
});

export const updateDevice = createAsyncThunk<void, Device, AppDataStoreType>(
  UPDATE_DEVICE,
  async (device, store) => {
    await storage.updateDevice(device);
    store.dispatch({
      type: UPDATE_DEVICE,
      device: device,
    });
  },
);
