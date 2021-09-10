// Lib
import React, { createRef, Dispatch, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  NativeSyntheticEvent,
} from 'react-native';
import { useLocation } from 'react-router-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  GestureEvent,
  GestureHandlerRootView,
  LongPressGestureHandler,
  LongPressGestureHandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  PanGestureHandlerStateChangeEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
// State
import { settingsSelector } from '../../../state/selector';
// Utils
import { encryptPayload } from '../../../utils/aes';
// Types
import Device from '../../Devices/Device';
import { MessageAction } from '../../../state/types';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    paddingBottom: 10,
    color: 'grey',
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  hiddenInput: {
    display: 'none',
  },
});

// * Data sent to server must be string in format: "datatype,contenttype,data,data"
// *
// * Data types
// * 0 = Numeric content data
// * 1 = String content data
// * 9 = Handshake
// *
// * Mouse presses and movement isn't that sensitive data that
// * it needs to be encrypted, and would probably create lag
// * in the movement so we don't.
// TODO Test movement with encryption
// * Keyboard input could be maybe username or password so
// * we do encrypt that.
// *
// * Content types
// * 0 = Connection created, data = none = "0,0"
// * 1 = Mouse movement, data = direction as string "x,y"
//* Examples:
// * "0,1,5,0" moves mouse cursor 5 pixels to right
// * "0,1,-5,-5" moves mouse cursor 5 pixels to right and up
// * 2 = Click left button, data = none = "0,0"
// * 3 = Click right button , data = none = "0,0"
// * 4 = Scroll, data = x and y directions separated with comma as string "up|down,left,right"
// * Examples "0,4,1,0" scrolls down, "4,0,-1" scrolls left
// * 5 = Hold mouse down = data = 0 relases the press, 1 toggles it on = "1|0,0"
// * Examples "0,5,1,0" sets mouse button 1 state to being pressed down
// * Examples "0,5,0,0" releases the press
// * 6 = Keyboard input = data = "encrypted char,0" i.e. "1,6,M5YSRvLyDXzDfmgen3Yaxf+gQ3g7vCe6IdALRQ==,0"

const InputHandler: React.FC = () => {
  const { state: device } = useLocation<Device>();
  const settings = useSelector(settingsSelector);
  const messageDispatch = useDispatch<Dispatch<MessageAction>>();

  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);
  const [prevX, setPrevX] = useState<number>(0);
  const [prevY, setPrevY] = useState<number>(0);

  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false);

  const singleTapRef = createRef<TapGestureHandler>();
  const doubleTapRef = createRef<TapGestureHandler>();
  const longPressRef = createRef<LongPressGestureHandler>();

  useEffect(() => {
    device.openWebSocketConnection(messageDispatch);
    return () => {
      device.closeWebSocketConnection();
    };
  }, []);

  const onSingleTap = (e: TapGestureHandlerStateChangeEvent) => {
    if (
      e.nativeEvent.state === State.ACTIVE &&
      e.nativeEvent.numberOfPointers === 1
    ) {
      device.sendWebSocket('0,2,0,0');
    }
  };

  const onDoubleTap = (e: TapGestureHandlerStateChangeEvent) => {
    if (
      e.nativeEvent.state === State.ACTIVE &&
      e.nativeEvent.numberOfPointers === 1
    ) {
      device.sendWebSocket('0,3,0,0');
    }
  };

  const onPanEvent = (e: GestureEvent<PanGestureHandlerEventPayload>) => {
    // Normal drag
    if (
      e.nativeEvent.state === State.ACTIVE &&
      e.nativeEvent.numberOfPointers === 1
    ) {
      setX(Math.floor((e.nativeEvent.x - prevX) * settings.inputSensitivity));
      setY(Math.floor((e.nativeEvent.y - prevY) * settings.inputSensitivity));
      device.sendWebSocket(`0,1,${x},${y}`);
      setPrevX(e.nativeEvent.x);
      setPrevY(e.nativeEvent.y);
    }

    // Double touch drag
    // TODO Doesn't really work like it should
    if (
      e.nativeEvent.state === State.ACTIVE &&
      e.nativeEvent.numberOfPointers === 2
    ) {
      const dirX =
        Math.abs(e.nativeEvent.translationX) > 10
          ? e.nativeEvent.translationX < 0
            ? -1
            : 1
          : 0;
      const dirY =
        Math.abs(e.nativeEvent.translationY) > 100
          ? e.nativeEvent.translationY < 0
            ? -1
            : 1
          : 0;
      device.sendWebSocket(`0,4,${dirX},${dirY}`);
    }
  };

  const onPanStateChange = (e: PanGestureHandlerStateChangeEvent) => {
    if (
      e.nativeEvent.state === State.BEGAN &&
      e.nativeEvent.numberOfPointers === 1
    ) {
      setPrevX(e.nativeEvent.x);
      setPrevY(e.nativeEvent.y);
    }
  };

  const onLongPress = (e: LongPressGestureHandlerStateChangeEvent) => {
    if (
      e.nativeEvent.state === State.ACTIVE &&
      e.nativeEvent.numberOfPointers === 1
    ) {
      setMouseDown(!mouseDown);
      mouseDown
        ? device.sendWebSocket('0,5,1,0')
        : device.sendWebSocket('0,5,0,0');
    }

    // ? Couldn't figure out more intuitive way to open keyboard
    if (
      e.nativeEvent.state === State.ACTIVE &&
      e.nativeEvent.numberOfPointers >= 2
    ) {
      setKeyboardOpen(!keyboardOpen);
    }
  };

  // TODO Encrypt data
  const handleKeyboardEvent = async (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    e.preventDefault();
    const encrypted = await encryptPayload(e.nativeEvent.key, device.password);
    device.sendWebSocket(`1,6,${encrypted},0`);
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <PanGestureHandler
        onGestureEvent={onPanEvent}
        onHandlerStateChange={onPanStateChange}
        maxPointers={2}
        avgTouches
        waitFor={singleTapRef}>
        <TapGestureHandler
          ref={singleTapRef}
          onHandlerStateChange={onSingleTap}
          waitFor={doubleTapRef}>
          <TapGestureHandler
            ref={doubleTapRef}
            onHandlerStateChange={onDoubleTap}
            numberOfTaps={2}
            waitFor={longPressRef}>
            <LongPressGestureHandler
              ref={longPressRef}
              onHandlerStateChange={onLongPress}
              minDurationMs={800}>
              <View style={styles.container}>
                <Text style={styles.text}>Tap to click</Text>
                <Text style={styles.text}>Swipe to move cursor</Text>
                <Text style={styles.text}>Double tap to right click</Text>
                <Text style={styles.text}>
                  Long press to toggle left mouse press
                </Text>
                <Text style={styles.text}>
                  Long press with two fingers to toggle keyboard
                </Text>
                {keyboardOpen && (
                  <TextInput
                    onKeyPress={handleKeyboardEvent}
                    multiline={true}
                    style={styles.hiddenInput}
                    autoFocus={true}
                  />
                )}
              </View>
            </LongPressGestureHandler>
          </TapGestureHandler>
        </TapGestureHandler>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default InputHandler;
