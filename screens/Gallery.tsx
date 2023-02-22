import {useEffect, useState} from 'react';
import {
  StatusBar,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';

import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import {BoldText, View} from '../components/Themed';
import Colors from '../theme/Colors';
import Container from '../components/Container';
import Loader from '../components/Loader';
import useColorScheme from '../hooks/useColorScheme';

import {styles} from '../theme';
import Layout from '../theme/Layout';

export default function TabTwoScreen() {
  const [posts, setPosts] = useState<
    Array<FirebaseFirestoreTypes.DocumentData>
  >([]);
  const colorScheme = useColorScheme();
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  // const [camera, setCamera] = useState<CameraProps | null>(null);
  const [toEdit, setToEdit] = useState<{id?: string; date?: Date} | null>(null);
  const [progress, setProgress] = useState(0);

  const {currentUser} = auth();

  const postsCollection = firestore().collection(`${currentUser?.uid}`);

  const saveImage = async (result: ImagePickerResponse) => {
    if (!result.didCancel) {
      setImage(result.assets[0].uri);
      setUploading(true);
      await uploadPhoto();
      setUploading(false);
    }
  };

  const pickImage = async (id?: string, date?: Date) => {
    // No permissions request is necessary for launching the image library

    setToEdit({id: id, date: date});

    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 1,
      maxWidth: Layout.window.width - 20,
      maxHeight: Layout.window.width - 20,
    });

    saveImage(result);
  };

  const takePicture = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 1,
      maxWidth: Layout.window.width - 20,
      maxHeight: Layout.window.width - 20,
    });

    saveImage(result);
  };

  const savePostData = async (url: string, id?: string | null) => {
    if (id) {
      await postsCollection
        .doc(id)
        .set({
          path: url,
        })
        .then(() => {
          setSaving(false);
          setToEdit(null);
          setImage(null);
        })
        .catch((error: any) => Alert.alert(error));
    } else {
      await postsCollection
        .add({
          path: url,
          date: Date.now(),
        })
        .then(() => {
          setSaving(false);
          setImage(null);
        })
        .catch(err => Alert.alert(err));
    }
  };

  async function uploadPhoto() {
    if (image && currentUser) {
      // upload it to firestore
      // const res = await fetch(image);
      // const blob = await res.blob();
      const storageRef = storage().ref(
        `${currentUser?.uid}/${Math.random().toString(36)}.jpg`,
      );

      setUploading(true);
      // const task = uploadBytesResumable(storageRef, blob);
      const task = storageRef.putFile(image);

      task.on(
        'state_changed',
        taskSnapshot => {
          const p =
            (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
          setProgress(p);
        },
        error => console.log(error),
        () => {
          setUploading(false);
          setSaving(true);
          storageRef.getDownloadURL().then(url => {
            savePostData(url, toEdit?.id);
          });
        },
      );
    }
  }

  useEffect(() => {
    const subscriber = firestore()
      .collection(`${currentUser?.uid}`)
      .onSnapshot(snapshot => {
        snapshot.docs.forEach(doc => {
          setPosts(prev => {
            const i = prev.findIndex(post => post.id === doc.id);
            if (i >= 0) {
              let newP = [...prev];
              newP[i] = {
                ...prev[i],
                path: doc.data().path,
              };
              return newP;
            }
            const addedPost = {id: doc.id, ...doc.data()};
            return [addedPost, ...prev];
          });
        });
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  return (
    <Container>
      <StatusBar
        backgroundColor={Colors[colorScheme].background}
        barStyle="dark-content"
      />
      {(uploading || saving) && <Loader progress={progress} />}
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'flex-start',
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 5,
            marginBottom: 20,
          }}>
          <BoldText>Gallery</BoldText>
          <TouchableOpacity onPress={takePicture}>
            <Icon name="camerao" size={25} color={Colors[colorScheme].text} />
          </TouchableOpacity>
        </View>

        {image && (
          <Image
            source={{uri: image}}
            style={{
              width: Dimensions.get('screen').width - 25,
              height: Dimensions.get('screen').width,
              marginBottom: 10,
            }}
          />
        )}

        {/* Render Image Grid */}

        <View style={{flex: 1, width: '100%'}}>
          <FlatList
            data={posts}
            extraData={posts}
            renderItem={({item}) => (
              <TouchableOpacity
                style={{
                  width: (Dimensions.get('screen').width - 30) / 3,
                  margin: 1,
                  flexDirection: 'column',
                }}
                activeOpacity={0.7}
                onLongPress={() => pickImage(item.id, item.date)}>
                <Image
                  style={{
                    opacity: item.id === toEdit?.id ? 0.7 : 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: (Dimensions.get('screen').width - 40) / 3,
                  }}
                  source={{uri: item.path}}
                />
              </TouchableOpacity>
            )}
            //Setting the number of column
            numColumns={3}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          ...styles.uploadBtn,
          backgroundColor:
            saving || uploading
              ? Colors[colorScheme].tabIconDefault
              : Colors[colorScheme].tint,
        }}
        onPress={() => (image ? uploadPhoto() : pickImage())}>
        {!image ? (
          <Icon name="picture" size={20} color="white" />
        ) : saving || uploading ? (
          <ActivityIndicator size={'small'} color="white" />
        ) : (
          <Icon name="upload" size={20} color="white" />
        )}
      </TouchableOpacity>
    </Container>
  );
}
