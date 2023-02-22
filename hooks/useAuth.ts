// import React, {useEffect} from 'react';
// import {onAuthStateChanged, User} from 'firebase/auth';
// import {app} from '../firebase';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import {
//   initializeAuth,
//   getReactNativePersistence,
// } from 'firebase/auth/react-native';

// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

// export function useAuth() {
//   const [user, setUser] = React.useState<User>();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, user => {
//       if (user) {
//         setUser(user);
//       } else {
//         setUser(undefined);
//       }
//     });
//     return unsubscribe;
//   }, []);

//   return user;
// }
