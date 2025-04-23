import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import LinearGradient from "react-native-linear-gradient";

const CardSlider = ({ cards }) => {
  return (
    <View style={{ marginTop: 15 }}>
      <ScrollView horizontal contentContainerStyle={styles.scrollView} showsHorizontalScrollIndicator={false}>
        {cards.map((card, index) => (
          <View key={index} style={styles.cardsContainer}>
            <LinearGradient colors={['lightblue', 'white']} style={styles.linearGradient}>
              <Image source={card.image} style={styles.image} />
            </LinearGradient>
            <Text>{card.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default CardSlider;

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 10,
  },
  cardsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  linearGradient: {
    padding: 10,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    width: 62,
    height: 62,
  },
  image: {
    width: 45,
    height: 45,
  },
});
