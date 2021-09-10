// Lib
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
// import Clipboard from '@react-native-clipboard/clipboard';
// Types
import { Command } from '../../../types';
import { settingsSelector, themeSelector } from '../../../state/selector';

interface Props {
  command: Command;
  index: number;
  fetchFn: (index: number) => void;
}

const CommandListItem: React.FC<Props> = ({ command, index, fetchFn }) => {
  const theme = useSelector(themeSelector);
  const settings = useSelector(settingsSelector);

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
      color: theme.colors.fg,
      fontWeight: theme.fonts.weightPrimary,
    },
    textCommand: {
      fontFamily: theme.fonts.main,
      fontStyle: 'italic',
      fontWeight: '100',
      color: 'lightgray',
    },
    textCommandContainer: {
      margin: 0,
      padding: 0,
      flex: 1,
      alignSelf: 'center',
      justifyContent: 'flex-start',
    },
  });

  const parseCommand = (text: string) => {
    if (text.length > 50) {
      return text.substring(0, 50) + '...';
    }
    return text;
  };

  const showFullCommand = () => {
    Alert.alert(
      command.alias,
      command.command,
      [
        {
          text: 'Copy',
          // TODO Find module that supports latest rn
          // onPress: () => Clipboard.setString(command.command),
          style: 'cancel',
        },
        {
          text: 'Close',
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  return (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() => fetchFn(index)}
        style={styles.touchable}
        onLongPress={showFullCommand}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{command.alias}</Text>
        </View>
        {settings.commandShowOnlyAliases ? null : (
          <View style={styles.textCommandContainer}>
            <Text style={styles.textCommand}>
              {parseCommand(command.command)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CommandListItem;
