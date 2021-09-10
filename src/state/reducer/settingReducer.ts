// Types
import { SET_SETTING, SettingAction, Settings, ThemeName } from '../types';
// Constants
import { SENSITIVITY_DEFAULT } from '../../constants';

export const initialSettings = {
  commandShowOnlyAliases: true,
  deviceListShowUnconnectable: true,
  inputSensitivity: SENSITIVITY_DEFAULT,
  theme: 'light' as ThemeName,
};

const reducer = (
  state: Settings = initialSettings,
  action: SettingAction,
): Settings => {
  switch (action.type) {
    case SET_SETTING:
      return {
        ...state,
        [action.args.name]: action.args.value,
      };
    default:
      return state;
  }
};

export default reducer;
