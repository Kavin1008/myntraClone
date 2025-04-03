import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import img from "../../assets/leetcodebadge.png";
import Carousel from "../../components/Carousel";
import CardSlider from "../../components/CardSlider";
import SearchBar from "../../components/SearchBar";
import ChipBar from "../../components/ChipBar";
import ProductsListHorizontal from "../../components/ProductsListHorizontal";
import AddLocationModal from "../../components/LocationModal";

const banners = Array.from({ length: 3 }, (_, i) => ({ id: i + 1, image: img }));
const chips = ["All", "Men", "Women"].map((label, i) => ({ id: i + 1, image: img, label }));
const cards = ["Fashion", "Beauty", "Home", "Footwear", "Accessories"].map((label, i) => ({
  id: i + 1,
  image: img,
  label,
}));


const HomeScreen = ({ navigation }) => {
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const toggleLocationModal = useCallback(() => {
    setIsAddLocationModalOpen((prev) => !prev);
  }, []);

  const handleProfileNavigate = i => {
    switch (i) {
      case 0:
        break;

      case 1:
        
        break;

      case 2:
        navigation.navigate('Profile')
        break; 
    
      default:
        break;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={styles.staticHeader}
        onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.logoContainer}>
              <Text style={styles.logo}>Myntra</Text>
              <FontAwesome5 name="chevron-down" size={16} style={styles.arrowDownIcon} />
            </TouchableOpacity>
            <View style={styles.memberStatus}>
              <FontAwesome5 name="crown" size={18} style={styles.crownIcon} />
              <View>
                <Text style={styles.selectText}>SELECT</Text>
                <View style={styles.insider}>
                  <Text style={styles.insiderText}>INSIDER</Text>
                  <FontAwesome5 name="chevron-right" size={13} style={styles.arrowRightIcon} />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.headerIcons}>
            {["notifications-outline", "heart-outline", "person-circle-outline"].map((icon, i) => (
              <Ionicons key={i} name={icon} size={24} style={styles.iconSpacing} onPress={() => handleProfileNavigate(i)}/>
            ))}
          </View>
        </View>
        <TouchableOpacity style={styles.locationIndicator} onPress={toggleLocationModal}>
          <Ionicons name="location" size={16}/>
          <Text>Add Delivery Location</Text>
        </TouchableOpacity>
        <AddLocationModal isAddLocationModalOpen={isAddLocationModalOpen} setIsAddLocationModalOpen={setIsAddLocationModalOpen} />
        <SearchBar navigation={navigation} />
      </View>
      
      <ScrollView style={[styles.body, { marginTop: headerHeight }]}>
        <ChipBar chips={chips} />
        <CardSlider cards={cards} />
        <Carousel banners={banners} />
        <ProductsListHorizontal />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", marginTop:15 },
  staticHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 10,
    elevation: 5,
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom:10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerLeft: { flexDirection: "row", gap: 10 },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "beige",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: "gold",
    borderWidth: 1,
  },
  logo: { fontSize: 15, fontWeight: "bold", color: "black" },
  memberStatus: { flexDirection: "row", alignItems: "center", gap: 5 },
  selectText: { fontWeight: "bold", fontSize: 10 },
  insider: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: -5 },
  insiderText: { fontWeight: "bold", color: "#996600" },
  crownIcon: { color: "#996600" },
  arrowDownIcon: { color: "#ff5050" },
  arrowRightIcon: { color: "#996600" },
  headerIcons: { flexDirection: "row" },
  iconSpacing: { marginLeft: 15 },
  locationIndicator: { alignSelf: "flex-start", paddingHorizontal:20, paddingVertical:10, flexDirection:"row", gap:5 },
  body: { flex: 1 },
});

export default HomeScreen;
