// Lib
import dark from './dark';
import light from './light';

export type Theme = typeof dark | typeof light;

export const themes = {
  dark,
  light,
};

export default dark;
