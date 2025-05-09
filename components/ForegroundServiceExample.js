import React from 'react';
import { View, Text, Button, StyleSheet, NativeModules, Alert, Platform } from 'react-native';

const { ServiceStarter } = NativeModules;

const ForegroundServiceExample = () => {
  const startForegroundService = () => {
    if (Platform.OS === 'android') {
      try {
        ServiceStarter.startService();
        Alert.alert('Service Started', 'Foreground service has started.');
      } catch (error) {
        console.error('Error starting service:', error);
        Alert.alert('Error', 'Could not start service.');
      }
    } else {
      Alert.alert('Unsupported', 'Foreground service is only supported on Android.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MyntraClone Background Service</Text>
      <Button title="Start Foreground Service" onPress={startForegroundService} />
    </View>
  );
};

export default ForegroundServiceExample;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
});
