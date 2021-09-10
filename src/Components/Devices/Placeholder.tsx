// Lib
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
// State
import { themeSelector } from '../../state/selector';

const Placeholder: React.FC = () => {
  const theme = useSelector(themeSelector);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: 50,
      justifyContent: 'center',
    },
    text: {
      color: theme.colors.fg,
      fontWeight: '200',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>No devices</Text>
    </View>
  );
};

export default Placeholder;
