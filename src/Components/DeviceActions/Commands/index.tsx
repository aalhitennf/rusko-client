// Lib
import axios, { CancelTokenSource, Method } from 'axios';
import React, { Dispatch, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FlatList, StyleSheet, View } from 'react-native';
import { useLocation } from 'react-router-native';
// Components
import ItemSeparator from './ItemSeparator';
import CommandListItem from './CommandListItem';
import FullscreenLoader from '../../FullscreenLoader';
// Utils
import { requestHandler } from '../../../utils/requestHandler';
import { parseCommands } from '../../../utils/helpers';
// Types
import { Command } from '../../../types';
import Device from '../../Devices/Device';
import { MessageAction } from '../../../state/types';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
});

const CommandList: React.FC = () => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [cancelTokenSource, setCancelTokenSource] =
    useState<CancelTokenSource | null>(null);

  const { state: device } = useLocation<Device>();
  const messageDispatch = useDispatch<Dispatch<MessageAction>>();

  const fetchCommands = async () => {
    setLoading(true);
    setLoadingMessage('Fetching commands');
    try {
      const source = axios.CancelToken.source();
      setCancelTokenSource(source);
      const request = {
        path: '/api/commands',
        method: 'GET' as Method,
        cancelToken: source,
        device: device,
      };
      const response = await requestHandler(request);
      const parsedCommands = parseCommands(response);
      setCommands(parsedCommands);
    } catch (error) {
      messageDispatch({
        type: 'ADD_MESSAGE',
        value: (error as Error).message,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCommands();

    return () => {
      if (cancelTokenSource) {
        cancelTokenSource.cancel();
      }
    };
  }, []);

  const sendCommand = async (alias: string) => {
    try {
      const source = axios.CancelToken.source();
      setCancelTokenSource(source);
      const request = {
        path: '/api/run',
        method: 'POST' as Method,
        cancelToken: source,
        data: alias,
        device: device,
      };
      await requestHandler(request);
    } catch (error) {
      messageDispatch({
        type: 'ADD_MESSAGE',
        value: (error as Error).message,
      });
    }
  };

  if (loading) {
    return <FullscreenLoader text={loadingMessage} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={commands}
        ItemSeparatorComponent={ItemSeparator}
        ListFooterComponent={ItemSeparator}
        ListHeaderComponent={ItemSeparator}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <CommandListItem
            command={item}
            index={index}
            fetchFn={async () => await sendCommand(item.alias)}
          />
        )}
        refreshing={loading}
        onRefresh={async () => await fetchCommands()}
      />
    </View>
  );
};

export default CommandList;
