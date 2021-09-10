// Lib
import React, { Dispatch, useState } from 'react';
import { Alert, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { ButtonField, SwitchField, SliderField } from './Fields';
import FullscreenLoader from '../FullscreenLoader';
import SettingsContainer from './Container';
// State
import { settingsSelector, themeSelector } from '../../state/selector';
import { setSetting, setTheme } from '../../state/actions/settingActions';
// Types
import { MessageAction, SettingsKey } from '../../state/types';
import { resetData } from '../../state/actions/generalActions';
import {
  SENSITIVITY_MAX,
  SENSITIVITY_MIN,
  SENSITIVITY_STEP,
} from '../../constants';

const GlobalSettings: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const asyncDispatch = useDispatch();
  const theme = useSelector(themeSelector);
  const settings = useSelector(settingsSelector);
  const messageDispatch = useDispatch<Dispatch<MessageAction>>();

  const validateRemove = async () => {
    try {
      Alert.alert(
        'Remove all app data from storage?',
        'This will reset settings and remove all paired devices!',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => await removeAllDevices(),
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

  const removeAllDevices = async () => {
    setLoading(true);
    try {
      asyncDispatch(resetData());
      setLoading(false);
    } catch (error) {
      messageDispatch({
        type: 'ADD_MESSAGE',
        value: (error as Error).message,
      });
    }
  };

  const updateSettingsValue = async (
    key: SettingsKey,
    value: boolean | string | number,
  ) => asyncDispatch(setSetting({ name: key, value: value }));

  const handleTheme = (value: boolean) =>
    asyncDispatch(setTheme(value ? 'dark' : 'light'));

  if (loading || !settings) {
    return <FullscreenLoader text="Initializing" />;
  }

  return (
    <View>
      <SettingsContainer text="Theme">
        <SwitchField
          text="Use dark theme"
          value={theme.name === 'dark'}
          handleChange={handleTheme}
        />
      </SettingsContainer>
      <SettingsContainer text="Devices">
        <SwitchField
          text="Show unconnectable devices"
          value={settings.deviceListShowUnconnectable}
          handleChange={value =>
            updateSettingsValue('deviceListShowUnconnectable', value)
          }
        />
      </SettingsContainer>
      <SettingsContainer text="Commands">
        <SwitchField
          text="Show only aliases"
          value={settings.commandShowOnlyAliases}
          handleChange={value =>
            updateSettingsValue('commandShowOnlyAliases', value)
          }
        />
      </SettingsContainer>
      <SettingsContainer text="Input">
        <SliderField
          text="Input sensitivity"
          min={SENSITIVITY_MIN}
          max={SENSITIVITY_MAX}
          value={settings.inputSensitivity}
          step={SENSITIVITY_STEP}
          onValueChange={value =>
            updateSettingsValue('inputSensitivity', value)
          }
        />
      </SettingsContainer>
      <SettingsContainer text="Reset data">
        <ButtonField
          text="Reset"
          color={theme.colors.buttonCancel}
          onPress={validateRemove}
          disabled={loading}
        />
      </SettingsContainer>
    </View>
  );
};

export default GlobalSettings;
