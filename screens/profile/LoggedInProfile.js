import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React from 'react';
import UserStore from '../../zustand/UserStore';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";

const ProfileIcon = ({name, activeStyle}) => {
  return (
    <View style={styles.profileIconContainer}>
      <View style={[styles.profileIcon, activeStyle]}>
        <Text style={styles.profileIconText}>
          {name.slice(0, 1).toUpperCase()}
        </Text>
      </View>
      <Text style={[{fontSize: 12}, activeStyle ? {fontWeight: 'bold'} : {}]}>
        {name}
      </Text>
    </View>
  );
};

const LoggedInProfile = () => {
  const {width, height} = useWindowDimensions();
  const user = UserStore(state => state.user);
  const navigation = useNavigation()

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={{flexGrow: 1, padding: 5}}>
        <View>
          <Text style={{fontWeight: 'bold', paddingHorizontal: 15}}>
            Shopping for {`${user.name}`}
          </Text>
          <ScrollView
            horizontal
            contentContainerStyle={[styles.profilesBar, {minWidth: width}]}>
            <ProfileIcon name={user.name} activeStyle={styles.activeProfile} />
            <ProfileIcon name={user.name} />
          </ScrollView>
        </View>
        <View style={styles.chipsContainer}>
          <View style={styles.chipHolder}>
            <View style={styles.chip}>
              <Feather name="box" style={styles.lightColor} size={20} />
              <Text style={{width: '60%', fontWeight: 'bold'}}>Orders</Text>
              <Feather
                name="chevron-right"
                style={styles.lightColor}
                size={20}
              />
            </View>
            <View style={styles.chip}>
              <Feather name="heart" style={styles.lightColor} size={20} />
              <Text style={{width: '60%', fontWeight: 'bold'}}>Wishlist</Text>
              <Feather
                name="chevron-right"
                style={styles.lightColor}
                size={20}
              />
            </View>
          </View>
          <View style={styles.chipHolder}>
            <Pressable style={styles.chip} onPress={() => navigation.navigate('Bag')}>
              <Feather name="shopping-cart" style={styles.lightColor} size={20} />
              <Text style={{width: '60%', fontWeight: 'bold'}}>Cart</Text>
              <Feather
                name="chevron-right"
                style={styles.lightColor}
                size={20}
              />
            </Pressable>
            <View style={styles.chip}>
              <Feather name="headphones" style={styles.lightColor} size={20} />
              <Text style={{width: '60%', fontWeight: 'bold'}}>Help</Text>
              <Feather
                name="chevron-right"
                style={styles.lightColor}
                size={20}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoggedInProfile;

const styles = StyleSheet.create({
  profilesBar: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 20,
    padding: 10,
  },
  profileIconContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileIcon: {
    height: 60,
    width: 60,
    borderRadius: '50%',
    backgroundColor: '#e5f5f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIconText: {
    color: '#19ae90',
    fontSize: 40,
    fontWeight: 200,
  },
  activeProfile: {
    borderColor: '#ff406c',
    borderWidth: 2,
  },
  chipsContainer: {
    height: 135,
    width: '100%',
    padding: 10,
  },
  chipHolder: {
    height: '50%',
    width: '100%',
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    height: '80%',
    width: '48%',
    flexDirection: 'row',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  lightColor: {
    color: '#777',
  },
});
