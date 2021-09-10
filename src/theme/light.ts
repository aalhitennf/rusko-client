// Lib
import { StyleSheet, TextStyle } from 'react-native';

export const themeLight = {
  name: 'light',
  colors: {
    bg: '#FFF',
    fg: '#000',
    barBg: '#000',
    highlight: '#0094FF',
    fgMessage: '#FFD800',
    textPrimary: '#000',
    textMessage: '#FFF',
    buttonCancel: '#AD0303',
    buttonNormal: '#3A8DFF',
    separator: 'grey',
  },
  fonts: {
    main: 'Roboto',
    sizePrimary: 14,
    sizeTabBar: 22,
    weightPrimary: '300' as TextStyle['fontWeight'],
    weightBold: '600' as TextStyle['fontWeight'],
  },
  shape: {
    borderRadius: 5,
  },
  shadow: {
    boxSmall: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.32,
      shadowRadius: 5.5,
      elevation: 4,
    },
  },
  textInput: StyleSheet.create({
    style: {
      textAlign: 'center',
      paddingHorizontal: 10,
      height: 40,
      margin: 12,
      borderWidth: 1,
      borderColor: 'lightgrey',
    },
  }),
};
export default themeLight;
