// Lib
import React, { useEffect, useState } from 'react';
import { BackHandler, StatusBar, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch, useHistory } from 'react-router-native';
// Components
import AddDevice from './Components/AddDevice';
import Bar from './Components/Bar';
import CommandList from './Components/DeviceActions/Commands';
import Devices from './Components/Devices';
import DeviceActions from './Components/DeviceActions';
import DeviceSettings from './Components/DeviceSettings';
import FileUpload from './Components/DeviceActions/Upload';
import GlobalSettings from './Components/GlobalSettings';
import Input from './Components/DeviceActions/Input';
import Messages from './Components/Messages';
// State
import { themeSelector } from './state/selector';
import {
  initializeDevices,
  initializeSettings,
  initializeTheme,
} from './state/actions/generalActions';
import FullscreenLoader from './Components/FullscreenLoader';

const Main: React.FC = () => {
  const [initialized, setInitialized] = useState<boolean>(false);

  const asyncDispatch = useDispatch();
  const theme = useSelector(themeSelector);
  const history = useHistory();

  BackHandler.addEventListener('hardwareBackPress', () => {
    history.goBack();
    return true;
  });

  useEffect(() => {
    if (initialized) {
      return;
    }
    asyncDispatch(initializeTheme());
    asyncDispatch(initializeSettings());
    asyncDispatch(initializeDevices());
    setInitialized(true);
  }, []);

  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.colors.bg,
    },
    buttonContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  if (!initialized) {
    return <FullscreenLoader text="Loading settings" />;
  }

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: theme.colors.bg,
      }}>
      <StatusBar backgroundColor={theme.colors.barBg} />
      <Bar />
      <Switch>
        <Route exact path="/devices" component={Devices} />
        <Route exact path="/add" component={AddDevice} />
        <Route exact path="/devices/:id" component={DeviceSettings} />
        <Route exact path="/devices/:id/actions" component={DeviceActions} />
        <Route exact path="/devices/:id/commands" component={CommandList} />
        <Route exact path="/devices/:id/upload" component={FileUpload} />
        <Route exact path="/devices/:id/input" component={Input} />
        <Route exact path="/settings" component={GlobalSettings} />
      </Switch>
      <Redirect to="/devices" />
      <Messages />
    </View>
  );
};

export default Main;
