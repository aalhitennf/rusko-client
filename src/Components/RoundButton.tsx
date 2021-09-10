// Lib
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
// State
import { themeSelector } from '../state/selector';

interface Props {
  color?: string;
  text?: string;
  onPress: () => void;
}

const RoundButton: React.FC<Props> = (props: Props) => {
  const theme = useSelector(themeSelector);

  const styles = StyleSheet.create({
    container: {
      zIndex: 1,
    },
    touchable: {
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      width: 60,
      height: 60,
      backgroundColor: '#0094FF',
      borderRadius: 50,
      ...theme.shadow.boxSmall,
    },
    text: {
      fontSize: 28,
      color: theme.colors.bg,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={props.onPress}
        style={
          props.color
            ? { ...styles.touchable, backgroundColor: props.color }
            : styles.touchable
        }>
        <Text style={styles.text}>{props.text ? props.text : '+'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RoundButton;
