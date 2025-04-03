import { View, ActivityIndicator, StyleSheet } from "react-native";

const CircularLoader = ({ size = "large", color = "#3498db" }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CircularLoader;
