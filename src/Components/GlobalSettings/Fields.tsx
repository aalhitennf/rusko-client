// Lib
import React from 'react';
import {
  Button,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
// State
import { themeSelector } from '../../state/selector';

interface InputFieldProps {
  onChange: (value: string) => void;
  value: string;
  defaultValue: string;
  secure?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  onChange,
  value,
  defaultValue,
  secure,
}) => {
  const theme = useSelector(themeSelector);

  return (
    <TextInput
      defaultValue={defaultValue}
      value={value}
      style={theme.textInput.style}
      secureTextEntry={secure}
      onChangeText={onChange}
    />
  );
};

interface ButtonFieldProps {
  text: string;
  color?: string;
  onPress: () => void;
  disabled?: boolean;
}

export const ButtonField: React.FC<ButtonFieldProps> = ({
  text,
  color,
  onPress,
  disabled,
}) => {
  const theme = useSelector(themeSelector);

  const styles = StyleSheet.create({
    buttonContainer: {
      width: '100%',
    },
  });

  return (
    <View style={styles.buttonContainer}>
      <Button
        onPress={onPress}
        title={text}
        color={color ? color : theme.colors.buttonNormal}
        disabled={disabled}
      />
    </View>
  );
};

interface SwitchFieldProps {
  text: string;
  value: boolean;
  handleChange: (value: boolean) => void;
}

export const SwitchField: React.FC<SwitchFieldProps> = ({
  text,
  value,
  handleChange,
}) => {
  const theme = useSelector(themeSelector);

  const styles = StyleSheet.create({
    text: {
      textAlign: 'center',
      fontWeight: theme.fonts.weightPrimary,
      color: theme.colors.fg,
    },
    switchContainer: {
      alignContent: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
  });

  return (
    <View style={styles.switchContainer}>
      <Text style={styles.text}>{text}</Text>
      <Switch
        value={value}
        onValueChange={switchValue => handleChange(switchValue)}
      />
    </View>
  );
};

interface SliderFieldProps {
  text: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onValueChange: (value: number) => void;
}

export const SliderField: React.FC<SliderFieldProps> = ({
  text,
  min,
  max,
  step,
  value,
  onValueChange,
}) => {
  const theme = useSelector(themeSelector);

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    text: {
      textAlign: 'center',
      fontWeight: theme.fonts.weightPrimary,
      color: theme.colors.fg,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <MultiSlider
        values={[value]}
        onValuesChangeFinish={values =>
          onValueChange(Math.round(values[0] * 10) / 10)
        }
        min={min}
        max={max}
        step={step}
      />
    </View>
  );
};
