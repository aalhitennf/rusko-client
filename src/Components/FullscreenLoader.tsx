// Lib
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
// State
import { themeSelector } from '../state/selector';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    paddingBottom: 10,
  },
});

interface Props {
  text: string;
}

const FullscreenLoader: React.FC<Props> = ({ text }) => {
  const theme = useSelector(themeSelector);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <ActivityIndicator size="large" color={theme.colors.highlight} />
    </View>
  );
};

export default FullscreenLoader;
