import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './navigation/MainNavigator';
import auth from '@react-native-firebase/auth';

import AuthNavigator from './navigation/AuthNavigator';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer onReady={() => SplashScreen.hide()}>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default App;
