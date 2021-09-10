// Lib
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
// State
import { themeSelector } from '../../../state/selector';

const ItemSeparator: React.FC = () => {
  const theme = useSelector(themeSelector);

  const styles = StyleSheet.create({
    separator: {
      height: 2,
      backgroundColor: theme.colors.separator,
      opacity: 0.3,
    },
  });

  return <View style={styles.separator} />;
};

export default ItemSeparator;
