// Lib
import axios, { CancelTokenSource, Method } from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-native';
// Components
import DeviceStatus from '../Icons/DeviceStatus';
// State
import { themeSelector } from '../../state/selector';
// Utils
import { requestHandler } from '../../utils/requestHandler';
// Types
import Device from './Device';

type ServerStatus = {
  ok: boolean;
};

interface Props {
  device: Device;
  showUnconnectable: boolean;
}

const DeviceListItem: React.FC<Props> = props => {
  const [loading, setLoading] = useState<boolean>(true);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [cancelTokenSource, setCancelTokenSource] =
    useState<CancelTokenSource | null>(null);

  const history = useHistory();
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
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontWeight: theme.fonts.weightPrimary,
      marginHorizontal: 0,
      alignSelf: 'center',
      color: theme.colors.textPrimary,
    },
    iconContainer: {
      flex: 1,
      alignItems: 'flex-end',
      marginTop: 4,
      marginHorizontal: 5,
    },
  });

  useEffect(() => {
    getStatus();

    return () => {
      if (cancelTokenSource) {
        cancelTokenSource.cancel();
      }
    };
  }, []);

  const getStatus = async () => {
    setLoading(true);
    try {
      const source = axios.CancelToken.source();
      setCancelTokenSource(source);
      const request = {
        path: '/api/status',
        method: 'GET' as Method,
        cancelToken: source,
        device: props.device,
      };
      const response = await requestHandler(request);
      setServerStatus(JSON.parse(response.toString()));
      setLoading(false);
    } catch (_e) {}
    setLoading(false);
  };

  // eslint-disable-next-line no-undef
  const encryptionStatus = (): JSX.Element | 0 => {
    if (loading) {
      return DeviceStatus('Unknown');
    }
    return !serverStatus || !serverStatus.ok
      ? DeviceStatus('Failed')
      : DeviceStatus('Ok');
  };

  const showSettings = () => {
    history.push({
      pathname: `/devices/${props.device.id}`,
      state: props.device,
    });
  };

  const showActions = () => {
    history.push({
      pathname: `/devices/${props.device.id}/actions`,
      state: props.device,
    });
  };

  if (!serverStatus && !props.showUnconnectable) {
    return null;
  }

  return (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={showActions}
        onLongPress={showSettings}
        style={styles.touchable}>
        <View style={styles.textContainer}>
          <View style={styles.iconContainer}>{encryptionStatus()}</View>
          <View>
            <Text style={styles.text}>{props.device.name}</Text>
          </View>
          <View style={styles.touchable} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default DeviceListItem;
