import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UserStore, { useAuthListener } from '../../zustand/UserStore'
import Profile from './Profile'
import Ionicons from'react-native-vector-icons/Ionicons'
import LoggedInProfile from './LoggedInProfile'

const Index = ({navigation}) => {
    useAuthListener()
    const user = UserStore((state) => state.user)
    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <>
            <SafeAreaView style={styles.androidSafeArea}>
                <View style={styles.profileHeader}>
                    <Ionicons name='arrow-back-sharp' onPress={handleBack} size={24} />
                    <Text style={{ fontWeight: "bold", color: "gray" }}>Profile</Text>
                </View>
                {user ? <LoggedInProfile /> : <Profile />}
            </SafeAreaView>

        </>
    )
}

export default Index

const styles = StyleSheet.create({
    androidSafeArea: {
        flex: 1,
        backgroundColor: "white",
        width: "100%"
    },
    profileHeader: {
        height: "7%",
        backgroundColor: "white",
        flexDirection: "row",
        padding: 15,
        gap: 15,
        alignItems: "center"
    },
})