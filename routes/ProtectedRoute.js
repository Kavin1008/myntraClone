import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import UserStore, { useAuthListener } from "../zustand/UserStore"; 

const ProtectedRoute = ({ children }) => {
  useAuthListener(); 

  const { isAuthenticated } = UserStore(); 
  const navigation = useNavigation();

  console.log(isAuthenticated);
  

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.replace("Signup"); 
    }
  }, [isAuthenticated, navigation]);

  if (!isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    ); 
  }

  return children; 
};

export default ProtectedRoute;
