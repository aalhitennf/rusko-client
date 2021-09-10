// Types
import Device from '../../Components/Devices/Device';
import {
  DeviceAction,
  ADD_DEVICE,
  REMOVE_DEVICE,
  UPDATE_DEVICE,
} from '../types';

const reducer = (state: Device[] = [], action: DeviceAction): Device[] => {
  switch (action.type) {
    case ADD_DEVICE:
      if (state.find(d => d.id === action.device.id)) {
        return state;
      }
      return state.concat(action.device);
    case REMOVE_DEVICE:
      return state.filter(d => d.id !== action.device.id);
    // TODO device list order goes shrimp with filter/concat
    // TODO should replace previous index
    case UPDATE_DEVICE:
      const filtered = state.filter(d => d.id !== action.device.id);
      return filtered.concat(action.device);
    default:
      return state;
  }
};

export default reducer;
