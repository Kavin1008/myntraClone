import {launchCamera} from 'react-native-image-picker';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const SearchBar = ({navigation}) => {
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const [isRecording, setIsRecording] = useState(false);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera access',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      console.log('Camera permission denied');
      return;
    }

    const options = {
      mediaType: 'photo',
      cameraType: 'back',
      saveToPhotos: true,
    };
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
      } else {
        console.log('Photo captured: ', response.assets[0]);
      }
    });
  };

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'App needs access to your microphone to record audio',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // iOS handles permissions differently
    }
  };

  const onMicPress = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      console.log('Microphone permission denied');
      return;
    }

    if (isRecording) {
      // STOP recording
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      console.log('Recording stopped:', result);
      setIsRecording(false);
    } else {
      // START recording
      const path = Platform.select({
        ios: 'audio.m4a',
        android: '/sdcard/audio.mp4', // You can change this location
      });

      const result = await audioRecorderPlayer.startRecorder(path);
      audioRecorderPlayer.addRecordBackListener(e => {
        console.log('Recording..', e.currentPosition);
      });
      console.log('Recording started:', result);
      setIsRecording(true);
    }
  };
  return (
    <View style={styles.searchBar}>
      <TouchableOpacity
        style={styles.search}
        onPress={() => navigation.navigate('SearchScreen')}>
        <Ionicons name="search" size={20} color="gray" style={styles.icon} />
        <Text style={styles.searchPlaceholder}>
          Search for brands and products
        </Text>
      </TouchableOpacity>

      <Pressable onPress={openCamera}>
        <Ionicons
          name="camera-outline"
          size={20}
          color="gray"
          style={styles.icon}
        />
      </Pressable>

      <Pressable onPress={onMicPress}>
        <Ionicons
          name={isRecording ? 'stop-circle-outline' : 'mic-outline'}
          size={20}
          color={isRecording ? 'red' : 'gray'}
          style={styles.icon}
        />
      </Pressable>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchBar: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderRadius: 15,
    alignItems: 'center',
  },
  search: {
    flexDirection: 'row',
    width: '70%',
  },
  icon: {marginHorizontal: 10},
  searchPlaceholder: {color: 'gray', fontSize: 12, width: '60%'},
});
