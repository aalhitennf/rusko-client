// Lib
import axios, { CancelTokenSource, Method } from 'axios';
import React, { Dispatch, useEffect, useState } from 'react';
import { Button, TextInput, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-native';
import uuid from 'react-native-uuid';
import DeviceInfo from 'react-native-device-info';
// State
import { themeSelector } from '../../state/selector';
// Utils
import { requestHandler } from '../../utils/requestHandler';
// Types
import Device from '../Devices/Device';
import { MessageAction } from '../../state/types';
import { addDevice } from '../../state/actions/deviceActions';

const AddDevice: React.FC = () => {
  const [name, setName] = useState<string>('Desktop');
  const [address, setAddress] = useState<string>('');
  const [port, setPort] = useState<string>('6551');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [cancelToken, setCancelToken] = useState<CancelTokenSource | null>(
    null,
  );

  const asyncDispatch = useDispatch();
  const theme = useSelector(themeSelector);
  const messageDispatch = useDispatch<Dispatch<MessageAction>>();
  const history = useHistory();

  useEffect(() => {
    return () => {
      if (cancelToken) {
        cancelToken.cancel();
      }
    };
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.bg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    marginContainer: {
      alignItems: 'center',
      width: '80%',
      margin: 10,
    },
    horizontalContainer: {
      flexDirection: 'row',
    },
    inputContainer: {
      width: '80%',
    },
    header: {
      fontSize: 24,
    },
    text: {
      alignSelf: 'center',
      color: theme.colors.fg,
    },
    separator: {
      width: 50,
    },
  });

  const validateArgs = () => {
    if (
      name.length < 1 ||
      address.length < 7 ||
      isNaN(parseInt(port, 10)) ||
      password.length < 2
    ) {
      throw new Error('Failet to validate args');
    }
  };

  const pair = async (): Promise<boolean> => {
    validateArgs();
    const newDevice = new Device({
      id: uuid.v4().toString(),
      name,
      address,
      port,
      password,
    });
    const data =
      DeviceInfo.getUniqueId() + ':' + (await DeviceInfo.getDeviceName());
    const source = axios.CancelToken.source();
    setCancelToken(source);
    const request = {
      path: '/pair',
      method: 'POST' as Method,
      cancelToken: source,
      data: data,
      device: newDevice,
    };
    const response = await requestHandler(request);
    if (response !== 'OK') {
      messageDispatch({
        type: 'ADD_MESSAGE',
        value: String(response),
      });
      return false;
    }
    asyncDispatch(addDevice(newDevice));
    return true;
  };

  const handlePairButton = async (): Promise<void> => {
    setLoading(true);
    try {
      if (await pair()) {
        history.push('/devices');
      }
    } catch (error) {
      setLoading(false);
      messageDispatch({
        type: 'ADD_MESSAGE',
        value: (error as Error).message,
      });
    }
    setLoading(false);
  };

  const handleCancel = () => {
    if (cancelToken) {
      cancelToken.cancel();
    }
    setLoading(false);
    history.push('/devices');
  };

  return (
    <View style={styles.container}>
      <View style={styles.marginContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.text}>Device name</Text>
          <TextInput
            style={theme.textInput.style}
            value={name}
            onChangeText={(newText: string) => setName(newText)}
          />
          <Text style={styles.text}>Address</Text>
          <TextInput
            style={theme.textInput.style}
            value={address}
            onChangeText={(newText: string) => setAddress(newText)}
          />
          <Text style={styles.text}>Port</Text>
          <TextInput
            style={theme.textInput.style}
            value={port}
            onChangeText={(newText: string) => setPort(newText)}
          />
          <Text style={styles.text}>Password</Text>
          <TextInput
            style={theme.textInput.style}
            value={password}
            secureTextEntry={true}
            onChangeText={(newText: string) => setPassword(newText)}
          />
        </View>
        <View style={styles.horizontalContainer}>
          <Button
            title="Cancel"
            color={theme.colors.buttonCancel}
            onPress={handleCancel}
          />
          <View style={styles.separator} />
          <Button
            title="Pair device"
            color={theme.colors.buttonNormal}
            disabled={loading}
            onPress={async () => await handlePairButton()}
          />
        </View>
      </View>
    </View>
  );
};

export default AddDevice;
