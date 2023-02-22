import React from 'react';
import {ButtonProps, ColorValue, TouchableOpacity} from 'react-native';
import {Text} from './Themed';

import Colors from '../theme/Colors';
import {styles} from '../theme';

import useColorScheme from '../hooks/useColorScheme';

interface iButtonProps {
  primary?: boolean;
  color?: ColorValue;
  textColor?: ColorValue;
}

export default function Button(props: ButtonProps & iButtonProps) {
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        backgroundColor: props.primary
          ? Colors[colorScheme].tint
          : props.color || Colors[colorScheme].tabIconDefault,
      }}
      onPress={props.onPress}>
      <Text style={{color: props.textColor || 'white'}}>{props.title}</Text>
    </TouchableOpacity>
  );
}
