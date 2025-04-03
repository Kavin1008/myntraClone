import { StyleSheet, Text, View, Image } from 'react-native'
import LinearGradient from "react-native-linear-gradient";


const CardSlider = ({cards}) => {
  return (
          <View
            style={styles.scrollView}
            contentContainerStyle={{ paddingHorizontal: 10 }} 
          >
              {cards.map((card, index) => (
                <View key={index} style={styles.cardsContainer}>
                <LinearGradient colors={['lightblue', 'white']} style={styles.linearGradient}>
                  <Image source={card.image} style={styles.image} />
                </LinearGradient>
                <Text>{card.label}</Text>
                </View>
              ))}
          </View>
  )
}

export default CardSlider


const styles = StyleSheet.create({
    scrollView: {
      marginTop: 15,
      marginHorizontal:10, 
      flexDirection:"row"
    },
    cardsContainer: {
      flexDirection: "column",
      alignItems: "center", 
      marginHorizontal:2,
    },
    
    linearGradient: {
      padding: 10,
      borderRadius: 3,
      marginRight: 10,
      alignItems: "center",
      justifyContent: "center",
      width:62,
      height:62
    },
    image: {
      width: 45,
      height: 45,
    },
  });

