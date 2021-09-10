// Lib
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
// Components
import Tab from './Tab';
// State
import { themeSelector } from '../../state/selector';

const Bar: React.FC = () => {
  const theme = useSelector(themeSelector);

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: 70,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.barBg,
    },
  });

  return (
    <View style={styles.container}>
      <Tab text="Devices" to="/devices" />
      <Tab text="Settings" to="/settings" />
    </View>
  );
};

export default Bar;
