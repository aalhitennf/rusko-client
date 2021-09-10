// Lib
import axios, { CancelTokenSource } from 'axios';
import React, { Dispatch, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-native';
// Components
import { ButtonField, InputField } from '../GlobalSettings/Fields';
import FullscreenLoader from '../FullscreenLoader';
import SettingsContainer from '../GlobalSettings/Container';
// State
import { themeSelector } from '../../state/selector';
// Types
import Device from '../Devices/Device';

import { MessageAction } from '../../state/types';
import { removeDevice, updateDevice } from '../../state/actions/deviceActions';

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
});

const DeviceSettings: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [port, setPort] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [cancelTokenSource, setCancelTokenSource] =
    useState<CancelTokenSource | null>(null);

  const history = useHistory();
  const { state: device } = useLocation<Device>();
  const asyncDispatch = useDispatch();
  const theme = useSelector(themeSelector);
  const messageDispatch = useDispatch<Dispatch<MessageAction>>();

  useEffect(() => {
    setAddress(device.address);
    setPort(device.port);
    setPassword(device.password);
    setLoading(false);

    return () => {
      if (cancelTokenSource) {
        cancelTokenSource.cancel();
      }
    };
  }, []);

  const onSave = async () => {
    setLoading(true);
    try {
      device.address = address;
      device.port = port;
      device.password = password;
      asyncDispatch(updateDevice(device));
      messageDispatch({
        type: 'ADD_MESSAGE',
        value: 'Saved',
      });
    } catch (error) {
      messageDispatch({
        type: 'ADD_MESSAGE',
        value: (error as Error).message,
      });
    }
    setLoading(false);
  };

  const validateRemove = async () => {
    try {
      Alert.alert(
        'Remove device',
        `Are you sure you want to remove device "${device.name} ${device.address}"`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => await handleRemove(),
            style: 'destructive',
          },
        ],
      );
    } catch (error) {
      messageDispatch({
        type: 'ADD_MESSAGE',
        value: (error as Error).message,
      });
    }
  };

  const handleRemove = async () => {
    try {
      const cancelToken = axios.CancelToken.source();
      setCancelTokenSource(cancelToken);
      asyncDispatch(removeDevice({ device, cancelToken }));

      // Timeout just to be sure everything is removed
      // react native sometimes throws warnings when removing
      // and redirecting
      setTimeout(() => {
        history.push('/devices');
      }, 500);
    } catch (e) {}
  };

  if (loading) {
    return <FullscreenLoader text="Loading" />;
  }

  return (
    <View>
      <SettingsContainer text="Address">
        <InputField
          defaultValue={address}
          value={address}
          onChange={setAddress}
        />
      </SettingsContainer>
      <SettingsContainer text="Port">
        <InputField defaultValue={port} value={port} onChange={setPort} />
      </SettingsContainer>
      <SettingsContainer text="Password">
        <InputField
          defaultValue={password}
          value={password}
          onChange={setPassword}
          secure={true}
        />
      </SettingsContainer>
      <ButtonField
        text="Save"
        onPress={async () => await onSave()}
        color={theme.colors.buttonNormal}
        disabled={loading}
      />
      <View style={styles.container} />
      <ButtonField
        text="Remove"
        onPress={async () => await validateRemove()}
        color={theme.colors.buttonCancel}
      />
    </View>
  );
};

export default DeviceSettings;
