// Lib
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
// Components
import ItemSeparator from '../DeviceActions/Commands/ItemSeparator';
// State
import { themeSelector } from '../../state/selector';

interface Props {
  text: string;
}

const SettingsContainer: React.FC<Props> = props => {
  const theme = useSelector(themeSelector);

  const styles = StyleSheet.create({
    container: {
      alignContent: 'center',
    },
    marginContainer: {
      margin: 15,
      marginTop: 20,
    },
    headerText: {
      textAlign: 'center',
      fontWeight: theme.fonts.weightBold,
      color: theme.colors.fg,
      padding: 5,
      borderRadius: 20,
      width: '50%',
      alignSelf: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <ItemSeparator />
        <Text style={styles.headerText}>{props.text}</Text>
        <ItemSeparator />
      </View>
      <View style={styles.marginContainer}>{props.children}</View>
    </View>
  );
};

export default SettingsContainer;
