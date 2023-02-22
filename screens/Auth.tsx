import {useState, useEffect} from 'react';
import {Alert, Keyboard, StatusBar, TouchableOpacity} from 'react-native';

import auth from '@react-native-firebase/auth';

import Font from 'react-native-vector-icons/AntDesign';

import {BoldText, Text, TextInput, View} from '../components/Themed';
import Colors from '../theme/Colors';
import useColorScheme from '../hooks/useColorScheme';

import validateEmail from '../utils/validateEmail';
import Container from '../components/Container';
import {authStyles} from '../theme';

export default function Login() {
  const colorScheme = useColorScheme();
  const [register, setRegister] = useState(false);
  const [creds, setCreds] = useState<{
    email: string;
    password: string;
    error: string | null;
  }>({
    email: '',
    password: '',
    error: null,
  });
  const [sent, setSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [forgot, setForgot] = useState<boolean>(false);

  const [emailValidate, setEmailValidate] = useState<boolean>(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (creds.email.length > 5) {
      setEmailValidate(validateEmail(creds.email));
    } else {
      setEmailValidate(false);
    }
  }, [creds.email]);

  async function authorize() {
    if (creds.email === '' || (!forgot && creds.password === '')) {
      setCreds({
        ...creds,
        error: 'Email and password are mandatory.',
      });
      return;
    }

    setLoading(true);
    if (forgot) {
      // send password change request
      await auth()
        .sendPasswordResetEmail(creds.email)
        .then(() => setSent(true))
        .catch((err: any) => Alert.alert(err));
    } else {
      if (!register) {
        // login with email pass
        await auth()
          .signInWithEmailAndPassword(creds.email, creds.password)
          .catch((error: any) => {
            if (error.code === 'auth/user-not-found') {
              setCreds({
                ...creds,
                error: 'User not found with this email.',
              });
            } else {
              setCreds({
                ...creds,
                password: '',
                error: 'Incorrect credentials, try again.',
              });
            }
          });
      } else {
        // register with email pass
        await auth()
          .createUserWithEmailAndPassword(creds.email, creds.password)
          .catch((error: any) => {
            setCreds({
              ...creds,
              error: error.code,
            });
          });
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    setTimeout(() => {
      setSent(false);
      setCreds({password: '', email: '', error: null});
      setForgot(false);
    }, 5000);
  }, [sent]);

  return (
    <Container centered>
      <StatusBar
        backgroundColor={Colors[colorScheme].background}
        barStyle="dark-content"
      />
      {forgot && (
        <View style={authStyles.back}>
          <TouchableOpacity onPress={() => setForgot(false)}>
            <Font name="left" color={Colors[colorScheme].tint} size={20} />
          </TouchableOpacity>
        </View>
      )}
      <BoldText style={authStyles.welcome}>
        {forgot
          ? 'Forgot Password'
          : register
          ? 'Create account'
          : 'Welcome Back'}
      </BoldText>
      {sent ? (
        <Text style={authStyles.title}>
          If your account is registered with us, you will recieve a email to
          reset password shortly...
        </Text>
      ) : (
        <>
          <Text style={authStyles.title}>
            {forgot
              ? 'Enter email linked with your account to recieve link to change password'
              : register
              ? ' Create your account with new credentials'
              : 'Log into your account with your credentials'}
          </Text>

          <TextInput
            placeholder="email address"
            value={creds.email}
            onChangeText={text =>
              setCreds({...creds, email: text, error: null})
            }
            icon="mail"
            validate={true}
            validated={emailValidate}
            textContentType="emailAddress"
          />
          {!forgot && (
            <TextInput
              placeholder="password"
              secureTextEntry={true}
              value={creds.password}
              onChangeText={text =>
                setCreds({...creds, password: text, error: null})
              }
              icon="lock"
              validate={false}
              textContentType="password"
            />
          )}
          {creds.error && <Text style={authStyles.error}>{creds.error}</Text>}
        </>
      )}
      <View
        style={{
          ...authStyles.forgot,
          display: forgot ? 'none' : 'flex',
        }}>
        <View style={authStyles.row}>
          <TouchableOpacity>
            <Font
              name="checksquare"
              color={Colors[colorScheme].tint}
              size={20}
              style={{marginRight: 10}}
            />
          </TouchableOpacity>
          <Text>Remember me</Text>
        </View>
        <TouchableOpacity
          onPress={() => setForgot(true)}
          style={{display: register ? 'none' : 'flex'}}>
          <Text style={{color: Colors[colorScheme].tint}}>Forgot password</Text>
        </TouchableOpacity>
      </View>
      {!isKeyboardVisible && (
        <View
          style={{
            width: '100%',
            position: 'absolute',
            bottom: 0,
            marginBottom: 20,
          }}>
          {!sent && (
            <TouchableOpacity
              onPress={authorize}
              style={{
                ...authStyles.btn,
                backgroundColor: emailValidate
                  ? Colors[colorScheme].tint
                  : Colors[colorScheme].tabIconDefault,
              }}
              disabled={!emailValidate || loading}>
              <Text style={{color: 'white'}}>
                {loading ? 'Loading...' : 'Verify credentials'}
              </Text>
            </TouchableOpacity>
          )}
          {!forgot && (
            <TouchableOpacity
              onPress={() => {
                setForgot(false);
                setRegister(!register);
              }}
              style={authStyles.btn}>
              <Text style={{color: Colors[colorScheme].tint}}>
                {register ? 'Log into your account' : 'Create a new account'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Container>
  );
}
