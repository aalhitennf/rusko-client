// Lib
import uuid from 'react-native-uuid';
// Utils
import { appDataStore } from '../store';
// Types
import { ADD_MESSAGE, REMOVE_MESSAGE, Message, MessageAction } from '../types';
// Constants
import { MESSAGE_TIMEOUT } from '../../constants';

const reducer = (state: Message[] = [], action: MessageAction): Message[] => {
  switch (action.type) {
    case ADD_MESSAGE:
      const _id = uuid.v1().toString();
      const _timer = setTimeout(() => {
        appDataStore.dispatch({
          type: REMOVE_MESSAGE,
          value: _id,
        });
      }, MESSAGE_TIMEOUT);
      const newMessage: Message = {
        id: _id,
        text: action.value,
        timer: _timer,
      };
      return state.concat(newMessage);
    case REMOVE_MESSAGE: {
      const message = state.find(m => m.id === action.value);
      if (!message) {
        return state;
      }
      clearInterval(message.timer);
      return state.filter(m => m.id !== action.value);
    }
    default:
      return state;
  }
};

export default reducer;
