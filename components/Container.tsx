import React from 'react';
import {Platform, SafeAreaView, ViewProps} from 'react-native';

import {View} from './Themed';

import {styles} from '../theme';
import {StatusBar} from 'react-native';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../theme/Colors';

interface iContainerProps {
  centered?: boolean;
}

export default function Container(props: ViewProps & iContainerProps) {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}>
      <StatusBar translucent />
      <View
        style={{
          ...styles.container,
          justifyContent: props.centered ? 'center' : 'flex-start',
        }}>
        {props.children}
      </View>
    </SafeAreaView>
  );
}
