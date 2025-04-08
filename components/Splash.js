import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import img from '../assets/Myntra_Logo.png'

const Splash = () => {
  const navigation = useNavigation()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'MainApp',
          },
        ],
      })
    }, 1500)

    return () => clearTimeout(timer) 
  }, []) 

  return (
    <View style={styles.container}>
      <Image source={img}/>
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
})
