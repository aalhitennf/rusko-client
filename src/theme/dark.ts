// Lib
import { StyleSheet, TextStyle } from 'react-native';

export const theme = {
  name: 'dark',
  colors: {
    bg: '#000',
    fg: '#FFF',
    barBg: '#000',
    highlight: 'orange',
    fgMessage: '#FFD800',
    textPrimary: '#FFF',
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
      shadowColor: '#fff',
      shadowOffset: {
        width: 0,
        height: 0,
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
      color: '#FFF',
    },
  }),
};

export default theme;
