import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
} from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import UserStore, { useAuthListener } from '../zustand/UserStore';
import {useNavigation} from '@react-navigation/native';

const AddUser = ({route}) => {
  const navigation = useNavigation()

  const user = UserStore(state => state.user);
  const setUser = UserStore(state => state.setUser)
  console.log(user);
  const db = getFirestore();

  const {uid, phoneNumber} = route.params

  const [gender, setGender] = useState('');
  const [isMaleActive, setIsMaleActive] = useState(false);
  const [isFemaleActive, setIsFemaleActive] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [name, setName] = useState('');

  const handleGenderActive = gender => {
    if (gender === 'male') {
      setIsMaleActive(true);
      setIsFemaleActive(false);
      setGender('male');
    } else {
      setIsMaleActive(false);
      setIsFemaleActive(true);
      setGender('female');
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !gender) {
      Alert.alert('Missing Info', 'Please enter name and select gender');
      return;
    }

    try {
      await setDoc(doc(db, 'users', uid), {
        name,
        gender,
        phone: phoneNumber,
        dob: date.toISOString(),
        createdBy: uid,
        createdAt: new Date().toISOString(),
      });
      Alert.alert('Success', 'User added successfully!');
      setName('');
      setGender('');
      setIsMaleActive(false);
      setIsFemaleActive(false);
      setDate(new Date());
      navigation.goBack()
    } catch (error) {
      console.error('Error adding user:', error);
      Alert.alert('Error', 'Something went wrong while adding user.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled">
          <View style={{flex: 1, paddingTop: 50}}>
            <View style={styles.selectGenderContainer}>
              <Text style={{fontWeight: 'bold'}}>Select a gender</Text>
              <View style={styles.selectGenderAvatarsContainer}>
                <Pressable
                  style={[
                    styles.selectGenderAvatarsItem,
                    isMaleActive && styles.activeGenderAvatarsItem,
                  ]}
                  onPress={() => handleGenderActive('male')}>
                  <Image
                    source={require('../assets/male.png')}
                    style={{width: 50, height: 50}}
                  />
                  <Text
                    style={[
                      {fontSize: 12, fontWeight: 'bold'},
                      isMaleActive && {color: '#ff406c'},
                    ]}>
                    Male
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.selectGenderAvatarsItem,
                    isFemaleActive && styles.activeGenderAvatarsItem,
                  ]}
                  onPress={() => handleGenderActive('female')}>
                  <Image
                    source={require('../assets/female.png')}
                    style={{width: 50, height: 50}}
                  />
                  <Text
                    style={[
                      {fontSize: 12, fontWeight: 'bold'},
                      isFemaleActive && {color: '#ff406c'},
                    ]}>
                    Female
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.dobContainer}>
              <Text style={{fontWeight: 'bold'}}>Date of Birth</Text>
              <Pressable
                onPress={() => setShowDatePicker(!showDatePicker)}
                style={styles.datePicker}>
                <Ionicons
                  name="calendar-clear-outline"
                  size={20}
                  color="#000"
                />
                <Text style={{fontSize: 12, color: '#444'}}>
                  {date.toDateString() === new Date().toDateString()
                    ? 'Pick a date'
                    : date.toDateString().slice(4)}
                </Text>
              </Pressable>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
                maximumDate={new Date()}
              />
            )}

            <View style={styles.dobContainer}>
              <Text style={{fontWeight: 'bold'}}>Name</Text>
              <TextInput
                style={styles.textInputBox}
                placeholder="Enter your name"
                placeholderTextColor={'#999'}
                value={name}
                onChangeText={setName}
              />
            </View>

            <Pressable style={styles.submitButton} onPress={handleSubmit}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>Add User</Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AddUser;

const styles = StyleSheet.create({
  selectGenderContainer: {
    width: '100%',
    padding: 20,
    gap: 10,
  },
  selectGenderAvatarsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 20,
  },
  selectGenderAvatarsItem: {
    backgroundColor: 'white',
    width: '35%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 10,
    height: 100,
    gap: 10,
  },
  activeGenderAvatarsItem: {
    borderColor: '#ff406c',
  },
  dobContainer: {
    width: '100%',
    padding: 20,
    gap: 10,
  },
  datePicker: {
    height: 50,
    flexDirection: 'row',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    gap: 10,
  },
  textInputBox: {
    width: '100%',
    color: '#999',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 2,
    padding: 10,
    minHeight: 45,
  },
  submitButton: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#ff406c',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 5,
  },
});
