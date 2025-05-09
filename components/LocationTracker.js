// LocationTracker.tsx
import React from 'react';
import {Button, Platform, Alert, SafeAreaView} from 'react-native';
import BackgroundService from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, request, openSettings, RESULTS} from 'react-native-permissions';

const sleep = (time) =>
  new Promise(resolve => setTimeout(() => resolve(null), time));

const veryIntensiveTask = async (taskDataArguments) => {
    let watchId = null;
  
    watchId = Geolocation.watchPosition(
      position => {
        console.log('Background Location:', position);
        
      },
      error => {
        console.log('Watch error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
  
    while (BackgroundService.isRunning()) {
      await sleep(5000); 
    }
  
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      console.log('Cleared watch ID:', watchId);
    }
  };
  

  const options = {
    taskName: 'LocationTracker',
    taskTitle: 'Location Service',
    taskDesc: 'Tracking location in background...',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourapp://home',
    parameters: {
      delay: 1000,
    },
    foregroundService: true,
  };
  

export default function LocationTracker() {

    const requestPermissions = async () => {
        if (Platform.OS !== 'android') return true;
      
        if (Platform.Version >= 34) {
          await request(PERMISSIONS.ANDROID.FOREGROUND_SERVICE)
          // No need to request FOREGROUND_SERVICE_LOCATION explicitly; it's tied to your service declaration
        }
      
        const fineLocation = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (fineLocation !== RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Location permission is required');
          return false;
        }
      
        const backgroundLocation = await request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
        if (backgroundLocation === RESULTS.GRANTED) return true;
      
        Alert.alert(
          'Background Permission Needed',
          'Please allow background location access from settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() },
          ]
        );
      
        return false;
      };      
    

  const startLocationTracking = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Location permission is required');
      return;
    }

    await BackgroundService.start(veryIntensiveTask, options);
  };

  const stopLocationTracking = async () => {
    await BackgroundService.stop();
  };

  return (
    <SafeAreaView>
      <Button title="Start Tracking" onPress={startLocationTracking} />
      <Button title="Stop Tracking" onPress={stopLocationTracking} />
    </SafeAreaView>
  );
}
