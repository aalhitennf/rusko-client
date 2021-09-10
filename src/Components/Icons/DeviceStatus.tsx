// Lib
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  image: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignContent: 'center',
  },
});

const icons: { [key: string]: ImageSourcePropType } = {
  Ok: require('../../../res/DeviceStatus/Ok.png'),
  Failed: require('../../../res/DeviceStatus/Failed.png'),
  Unknown: require('../../../res/DeviceStatus/Unknown.png'),
};

const DeviceStatus = (status: string) =>
  icons[status] && (
    <Image
      style={styles.image}
      source={icons[status]}
      resizeMode="center"
      resizeMethod="resize"
    />
  );

export default DeviceStatus;
