import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import Auth from '../screens/Auth';

import {Screen} from './types';

const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <AuthStack.Screen name={Screen.Auth} component={Auth} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
