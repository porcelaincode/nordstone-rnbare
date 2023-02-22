import React from 'react';
import {ButtonProps, ColorValue, TouchableOpacity} from 'react-native';
import Font from 'react-native-vector-icons/AntDesign';

import {View, Text} from './Themed';

import {styles} from '../theme';

interface iNav {
  title?: string;
  icon: React.ComponentProps<typeof Font>['name'];
  onPress: ButtonProps['onPress'];
  color: ColorValue | string;
}

export default function Navbar(props: iNav) {
  return (
    <View style={styles.nav}>
      <Text>{props.title}</Text>
      <TouchableOpacity onPress={props.onPress}>
        <Font name={props.icon} size={25} color={props.color} />
      </TouchableOpacity>
    </View>
  );
}
