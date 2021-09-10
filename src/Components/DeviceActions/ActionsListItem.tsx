// Lib
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
// State
import { themeSelector } from '../../state/selector';

interface Props {
  text: string;
  onPress: () => void;
}

const DeviceListItem: React.FC<Props> = props => {
  const theme = useSelector(themeSelector);

  const styles = StyleSheet.create({
    item: {
      height: 80,
    },
    touchable: {
      flex: 1,
    },
    textContainer: {
      flex: 1,
      alignSelf: 'center',
      justifyContent: 'center',
    },
    text: {
      fontWeight: theme.fonts.weightPrimary,
      color: theme.colors.fg,
    },
  });

  return (
    <View style={styles.item}>
      <TouchableOpacity onPress={props.onPress} style={styles.touchable}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{props.text}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default DeviceListItem;
