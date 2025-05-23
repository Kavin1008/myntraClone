import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import UserStore from '../../zustand/UserStore'
import auth from '@react-native-firebase/auth'
import useModalStore from '../../zustand/ModalStore';
import useRouteStore from '../../zustand/RouteStore';
import { useEffect } from 'react';


const ProfileOption = ({ item, onPress, hasBorder }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[
            styles.profileBodyItemsContainer,
            hasBorder && styles.profileBodyItemBorder
        ]}
    >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name={item.icon} style={styles.subTitleColor} size={20} />
            <View style={styles.profileBodyItem}>
                <Text style={styles.title}>{item.title}</Text>
                {item.subTitle && (
                    <Text style={[styles.subTitle, styles.subTitleColor]}>{item.subTitle}</Text>
                )}
            </View>
        </View>
        <Ionicons name="chevron-forward" style={styles.subTitleColor} size={12} />
    </TouchableOpacity>
);

const Profile = ({ navigation }) => {

    const user = UserStore((state) => state.user)
    const setUser = UserStore((state) => state.setUser)
    const { openModal } = useModalStore();  

    const profileBodyItems = [{
        icon: "logo-dropbox",
        title: "Orders",
        subTitle: "Check your order status"
    },
    {
        icon: "help-circle-outline",
        title: "Help Center",
        subTitle: "Help regarding your recent puchases"
    },
    {
        icon: "heart-outline",
        title: "Wishlist",
        subTitle: "Your most loved styles"
    }
    ]

    const profileBodyCouponItem = [{
        icon: "qr-code-outline",
        title: "Scan for Coupon",
    },]
    
    const handleSignIn = () => {
        openModal();
    }

    const handleSignOut = () => {
        setUser(null)
        auth().signOut();
    }


    return (
        <View>
            <ScrollView style={styles.profileBody}>
                <View style={styles.userDetails}>
                    <View style={styles.imageHolder}>
                        <Ionicons name="person-outline" size={100} />
                    </View>
                    <View style={styles.loginHolder}>
                        <TouchableOpacity onPress={handleSignIn} style={styles.loginButton}>
                            <Text style={{ color: "white", fontWeight: "bold", fontSize: 12 }} >
                                LOG IN/SIGN UP
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={{ width: "100%" }}>
                    {profileBodyItems.map((item, index) => (
                        <ProfileOption
                            key={index}
                            item={item}
                            hasBorder={index !== profileBodyItems.length - 1}
                            onPress={() => {
                                if (!user) {
                                    useRouteStore.getState().setRequestedRoute(item.title.toLowerCase(), {});
                                    openModal();
                                } else {
                                    navigation.navigate(item.title.toLowerCase());
                                }
                            }}
                        />
                    ))}

                </View>

                <View style={styles.divider} />

                <View style={{ width: "100%" }}>
                    {profileBodyCouponItem.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.profileBodyItemsContainer,
                                    index !== profileBodyCouponItem.length - 1 && styles.profileBodyItemBorder,
                                ]}
                                onPress={handleSignOut}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Ionicons name={item.icon} style={styles.subTitleColor} size={20} />
                                    <View style={styles.profileBodyItem}>
                                        <Text style={styles.title}>{item.title}</Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" style={styles.subTitleColor} size={12} />
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.divider} />

            </ScrollView>
            </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    profileBody: {
        backgroundColor: "white",
        width: "100%"
    },
    userDetails: {
        height: 180,
        backgroundColor: "#555555",
        flexDirection: "row"
    },
    loginHolder: {
        backgroundColor: "white",
        height: "40%",
        width: "100%",
        alignSelf: "flex-end",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingHorizontal: 50
    },
    loginButton: {
        width: "65%",
        height: "60%",
        backgroundColor: "#ff406c",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 2
    },
    imageHolder: {
        height: "65%",
        width: "30%",
        backgroundColor: "white",
        position: "absolute",
        borderWidth: 2,
        borderColor: "#eeeeee",
        borderRadius: 3,
        zIndex: 10,
        bottom: 13.5,
        left: 25,
        alignItems: "center",
        justifyContent: "center"
    },
    divider: {
        width: "100%",
        height: 15,
        backgroundColor: "#eeeeee"
    },
    profileBodyItemsContainer: {
        flexDirection: "row",
        width: "100%",
        padding: 20,
        alignItems: "center",
        justifyContent: "space-between"
    },
    profileBodyItem: {
        paddingLeft: 20,
        gap: 5,
        justifyContent: "center"
    },
    profileBodyItemBorder: {
        borderBlockColor: "#eeeeee",
        borderBottomWidth: 1
    },
    title: {
        fontWeight: "bold",
        color: "#555555"
    },
    subTitleColor: {
        color: "#aaaaaa"
    },
    subTitle: {
        fontSize: 10
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    modalContainer: {
        width: "100%",
        backgroundColor: "white",
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        elevation: 5,
        minHeight: 400,
        justifyContent: "flex-end"
    },
});
