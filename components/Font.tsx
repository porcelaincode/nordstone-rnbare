import React from 'react';

import {View} from './Themed';

import useColorScheme from '../hooks/useColorScheme';
import Colors from '../theme/Colors';

interface iLoader {
  progress: number;
}

export default function Loader(props: iLoader) {
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        height: 4,
        marginBottom: 10,
        width: `${props.progress}%`,
        alignSelf: 'flex-start',
        backgroundColor: Colors[colorScheme].tint,
      }}
    />
  );
}
