// Lib
import React, { Dispatch } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
// State
import { messageSelector, themeSelector } from '../../state/selector';
// Types
import { MessageAction } from '../../state/types';

const Messages: React.FC = () => {
  const theme = useSelector(themeSelector);
  const messages = useSelector(messageSelector);
  const messageDispatch = useDispatch<Dispatch<MessageAction>>();

  const styles = StyleSheet.create({
    messageContainer: {
      flex: 1,
      marginHorizontal: 10,
      marginVertical: 10,
      position: 'absolute',
      width: Dimensions.get('window').width - 20,
      maxHeight: Dimensions.get('window').height - 20,
      zIndex: 20,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignContent: 'flex-start',
    },
    messageInner: {
      flex: 1,
    },
    message: {
      flex: 1,
      minHeight: 50,
      width: '100%',
      marginVertical: 5,
      borderRadius: theme.shape.borderRadius,
      padding: 10,
      backgroundColor: theme.colors.fgMessage,
      zIndex: 20,
      alignContent: 'center',
      justifyContent: 'center',
      ...theme.shadow.boxSmall,
    },
    messageText: {
      color: theme.colors.textMessage,
      alignSelf: 'center',
      textAlign: 'center',
      zIndex: 20,
    },
  });

  const handlePress = (id: string) => {
    messageDispatch({
      type: 'REMOVE_MESSAGE',
      value: id,
    });
  };

  return (
    <View style={styles.messageContainer}>
      {messages.map(m => (
        <TouchableOpacity
          key={m.id}
          onPress={() => handlePress(m.id)}
          style={styles.message}>
          <View pointerEvents="none">
            <Text style={styles.messageText}>{m.text}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Messages;
