import {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import img from '../assets/Myntra_Logo.png';
import Ionicon from 'react-native-vector-icons/Ionicons';

export default function Signup({setSignInPopUp, offerBanner}) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const validatePhoneNumber = number => {
    return /^\+\d{1,3}\d{7,15}$/.test(number);
  };

  const signInWithPhoneNumberHandler = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setMessage('Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    try {

      const confirmation = await auth().signInWithPhoneNumber(phoneNumber, true);
      setSignInPopUp(false);
      navigation.navigate('OtpVerification', {confirmation, phoneNumber});
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('Failed to send OTP. Try again.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Modal visible={loading} transparent={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>

      <View style={styles.header}>
        <Image source={img} style={styles.logo} />
        <Ionicon
          name="close-sharp"
          size={24}
          onPress={() => setSignInPopUp(false)}
        />
      </View>

      {offerBanner && (
        <View style={styles.offerBannerContainer}>
          <Image style={styles.offerBanner} />
        </View>
      )}

      <View style={styles.body}>
        <Text style={styles.label}>
          <Text style={{fontWeight: 'bold'}}>Login</Text>{' '}
          <Text style={{fontSize: 14}}> or </Text>{' '}
          <Text style={{fontWeight: 'bold'}}>Signup</Text>
        </Text>
        <TextInput
          placeholder="+1 650-555-3434"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          style={[styles.input, message && styles.errorMessage]}
          autoFocus={true}
        />
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Text style={styles.description}>
          By continuing, you agree that you are above 18 years of age, and you
          agree to Myntra's
          <Text style={styles.linkText}> Terms of Use</Text> and{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>
        <TouchableOpacity
          onPress={signInWithPhoneNumberHandler}
          style={styles.loginButton}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 12}}>
            Login using OTP
          </Text>
        </TouchableOpacity>
        <Text style={styles.description}>
          Having trouble logging in?{' '}
          <Text style={styles.linkText}>Get help</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    paddingVertical: 20,
    borderRadius: 50,
  },
  header: {
    height: '20%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {width: 50, height: 50, resizeMode: 'contain'},
  offerBannerContainer: {
    height: 100,
    width: '100%',
    backgroundColor: '#F1F1F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerBanner: {width: '100%', height: '100%', resizeMode: 'contain'},
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  loginButton: {
    width: '100%',
    height: '15%',
    backgroundColor: '#ff406c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  label: {fontSize: 18, alignItems: 'center'},
  message: {fontSize: 12, color: 'red'},
  body: {width: '100%', flex: 1, paddingHorizontal: 30, rowGap: 20},
  description: {color: '#666666', fontSize: 13},
  linkText: {color: '#ff406c', fontWeight: 'bold'},
  errorMessage: {borderColor: 'red', borderWidth: 1},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
