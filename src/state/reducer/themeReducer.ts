// Utils
import { themes, Theme } from '../../theme';
// Types
import { SET_THEME, ThemeAction } from '../types';

const reducer = (state: Theme = themes.dark, action: ThemeAction): Theme => {
  switch (action.type) {
    case SET_THEME:
      return action.value === 'light' ? themes.light : themes.dark;
    default:
      return state;
  }
};

export default reducer;
