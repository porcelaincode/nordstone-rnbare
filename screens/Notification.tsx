import React, {useEffect, useState} from 'react';
import {Platform, StatusBar} from 'react-native';

import Container from '../components/Container';
import Navbar from '../components/Navbar';
import {Text, View} from '../components/Themed';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../theme/Colors';

import auth from '@react-native-firebase/auth';
import notifee, {AndroidImportance} from '@notifee/react-native';

import Button from '../components/Button';

export default function () {
  const colorScheme = useColorScheme();
  const [counter, setCounter] = useState<number>(0);

  async function onDisplayNotification(c: number) {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    // Display a notification
    await notifee.displayNotification({
      id: 'nordstonedemoid',
      title: 'Nordstone Demo App',
      body: `Psttt! This is a local notification. You pressed the button ${c} times.`,
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  useEffect(() => {
    if (counter > 0) {
      onDisplayNotification(counter);
    }
  }, [counter]);

  return (
    <Container centered>
      <StatusBar
        backgroundColor={Colors[colorScheme].background}
        barStyle="dark-content"
      />
      <View style={{position: 'absolute', top: 0, width: '100%'}}>
        <Navbar
          icon="logout"
          onPress={() => auth().signOut()}
          color={Colors[colorScheme].text}
        />
      </View>
      <Button
        title="Fetch Notification"
        onPress={() => setCounter(counter + 1)}
        color="red"
      />
    </Container>
  );
}
