import {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import UserStore from '../zustand/UserStore';
import {getFirestore, getDoc, collection} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import useWishlistStore from '../zustand/WishlistStore';

export default function OtpVerification() {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  
  const inputRefs = useRef([]);
  const setUser = UserStore(state => state.setUser);
  const navigation = useNavigation();
  const route = useRoute();
  const {confirmation, phoneNumber} = route.params;
  const {loadWishlist} = useWishlistStore();

  const db = getFirestore();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const confirmCode = async (otp) => {
    if (!confirmation) {
      setError(true);
      setMessage('OTP expired or cancelled. Please try logging in again.');
      return;
    }

    setLoading(true);
    try {
      const result = await confirmation.confirm(otp);
      await new Promise(resolve => {
        const unsubscribe = auth().onAuthStateChanged(user => {
          if (user) {
            unsubscribe(); 
            resolve(); 
          }
        });
      });
      setMessage('Phone authentication successful!');
     
      const userRef = db.collection('users').doc(result.user.uid);
      const userSnap = await userRef.get();
      
      if (userSnap.exists) {
        loadWishlist();
        navigation.goBack();               
      } else {
        navigation.navigate('adduser', {
          uid: result.user.uid,
          phoneNumber: result.user.phoneNumber,
        });
      }
      
    } catch (error) {
      console.error('Invalid code:', error);
      setError(true);
      setMessage('Invalid OTP. Try again.');
    }
    setLoading(false);
  };

  const handleDigitChange = (text, index) => {
    // Only allow single digit input
    const newDigits = [...digits];
    newDigits[index] = text.replace(/[^0-9]/g, '').slice(0, 1);
    setDigits(newDigits);

    // If a digit was entered, move to next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If last digit was entered, submit
    if (text && index === 5) {
      const otp = newDigits.join('');
      Keyboard.dismiss();
      confirmCode(otp);
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace to move to previous input
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicon name="arrow-back-sharp" size={24} onPress={handleCancel} />
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Enter OTP</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>Verify with OTP</Text>
          <Text style={styles.subtitle}>Sent via SMS to {phoneNumber}</Text>

          <View style={styles.otpContainer}>
            {digits.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputRefs.current[index] = ref)}
                value={digit}
                onChangeText={(text) => handleDigitChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                style={[styles.otpInput, error && styles.inputError]}
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
              />
            ))}
          </View>

          {error && <Text style={styles.message}>{message}</Text>}

          {loading && (
            <ActivityIndicator size="large" color="blue" style={styles.loader} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    marginVertical: 50,
    gap: 20,
    alignItems: 'center',
  },
  body: {
    paddingHorizontal: 30,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 18,
  },
  message: {
    fontSize: 12,
    color: 'red',
    marginTop: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  loader: {
    marginTop: 20,
  },
});