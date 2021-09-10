// Lib
import React from 'react';
import { FlatList, View } from 'react-native';
import { useHistory, useLocation } from 'react-router-native';
// Components
import ItemSeparator from './Commands/ItemSeparator';
import ActionListItem from './ActionsListItem';
// Types
import Device from '../Devices/Device';

const commands = [
  { text: 'Run commands', path: 'commands' },
  { text: 'Send input', path: 'input' },
  { text: 'Files', path: 'upload' },
];

const ActionList: React.FC = () => {
  const history = useHistory();
  const { state: device } = useLocation<Device>();

  const showAction = (path: string) => {
    history.push({
      pathname: `/devices/${device.id}/${path}`,
      state: device,
    });
  };

  return (
    <View>
      <FlatList
        data={commands}
        ItemSeparatorComponent={ItemSeparator}
        ListFooterComponent={ItemSeparator}
        ListHeaderComponent={ItemSeparator}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <ActionListItem
            text={item.text}
            onPress={() => showAction(item.path)}
          />
        )}
      />
    </View>
  );
};

export default ActionList;
