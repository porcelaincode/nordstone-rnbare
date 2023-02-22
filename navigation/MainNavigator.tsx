import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// screens
import Notification from '../screens/Notification';
import Gallery from '../screens/Gallery';
import LiveText from '../screens/LiveText';
import Calculator from '../screens/Calculator';

import Font from 'react-native-vector-icons/AntDesign';

import {Screen} from './types';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../theme/Colors';

const AppStack = createBottomTabNavigator();

const MainNavigator = () => {
  const colorScheme = useColorScheme();

  return (
    <AppStack.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <AppStack.Screen
        name={Screen.Notification}
        component={Notification}
        options={{
          title: 'Notification',
          tabBarIcon: ({color}) => (
            <TabBarIcon name="notification" color={color} />
          ),
        }}
      />
      <AppStack.Screen
        name={Screen.Gallery}
        component={Gallery}
        options={{
          title: 'Gallery',
          tabBarIcon: ({color}) => <TabBarIcon name="picture" color={color} />,
        }}
      />
      <AppStack.Screen
        name={Screen.LiveText}
        component={LiveText}
        options={{
          title: 'Live Text',
          tabBarIcon: ({color}) => <TabBarIcon name="edit" color={color} />,
        }}
      />
      <AppStack.Screen
        name={Screen.Calculator}
        component={Calculator}
        options={{
          title: 'Calculator',
          tabBarIcon: ({color}) => <TabBarIcon name="plus" color={color} />,
        }}
      />
    </AppStack.Navigator>
  );
};

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Font>['name'];
  color: string;
}) {
  return <Font size={25} style={{marginBottom: -3}} {...props} />;
}

export default MainNavigator;
