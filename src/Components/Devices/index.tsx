// Lib
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-native';
// Components
import ItemSeparator from '../DeviceActions/Commands/ItemSeparator';
import DeviceListItem from './DeviceListItem';
import RoundButton from '../RoundButton';
import Placeholder from './Placeholder';
// State
import { deviceSelector, settingsSelector } from '../../state/selector';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    margin: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

const DeviceList: React.FC = () => {
  const history = useHistory();
  const devices = useSelector(deviceSelector);
  const settings = useSelector(settingsSelector);

  return (
    <View style={styles.container}>
      <FlatList
        data={devices}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={ItemSeparator}
        ListFooterComponent={ItemSeparator}
        ListEmptyComponent={Placeholder}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <DeviceListItem
            device={item}
            showUnconnectable={settings.deviceListShowUnconnectable}
          />
        )}
      />
      <View style={styles.buttonContainer}>
        <RoundButton onPress={() => history.push('/add')} />
      </View>
    </View>
  );
};

export default DeviceList;
