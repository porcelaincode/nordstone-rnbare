import {useEffect, useState} from 'react';

import {Alert, StatusBar} from 'react-native';

import {BoldText, Text, TextInput, View} from '../components/Themed';
import Container from '../components/Container';
import Colors from '../theme/Colors';
import useColorScheme from '../hooks/useColorScheme';

import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

// import {getAuth} from 'firebase/auth';

export default function TabThreeScreen() {
  const colorScheme = useColorScheme();
  const {currentUser} = auth();

  const [text, setText] = useState<string>('');
  const [fetched, setFetched] = useState<string | undefined>();

  function writeUserData(userId: string, text: string) {
    database()
      .ref('/users/' + userId)
      .set({
        text: text,
        date: Date.now(),
      })
      .catch(err => Alert.alert(err));
  }

  useEffect(() => {
    if (currentUser) {
      writeUserData(currentUser?.uid, text);
    }
  }, [text]);

  useEffect(() => {
    const onValueChange = database()
      .ref(`/users/${currentUser?.uid}`)
      .on('value', snapshot => {
        setFetched(snapshot.val().text);
      });

    // Stop listening for updates when no longer required
    return () =>
      database().ref(`/users/${currentUser?.uid}`).off('value', onValueChange);
  }, []);

  return (
    <Container>
      <StatusBar
        backgroundColor={Colors[colorScheme].background}
        barStyle="dark-content"
      />
      <View style={{width: '100%', alignItems: 'flex-start'}}>
        <BoldText>From Firestore:</BoldText>
        <Text
          style={{
            color: fetched
              ? Colors[colorScheme].text
              : Colors[colorScheme].tabIconDefault,
          }}>
          {fetched || 'Text fetched from firestore will be shown here'}
        </Text>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          marginBottom: 20,
        }}>
        <TextInput
          placeholder="Your Text"
          numberOfLines={2}
          value={text}
          onChangeText={text => setText(text)}
          textAlignVertical="top"
          multiline={true}
        />
      </View>
    </Container>
  );
}
