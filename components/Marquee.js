import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Marquee} from '@animatereactnative/marquee';
import Animated, {
    Easing,
  FadeIn,
  FadeInUp,
  FadeOut,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import {Stagger} from '@animatereactnative/stagger';

const images = [
  'https://i.pinimg.com/736x/10/ef/58/10ef58da6b3201ac2b28fbd3ba86fa4a.jpg',
  'https://i.pinimg.com/736x/24/50/e6/2450e6db6074d7436fda2146cab23766.jpg',
  'https://i.pinimg.com/736x/c8/df/85/c8df859487651bb1ada750b5708590d2.jpg',
  'https://i.pinimg.com/736x/e0/a1/cd/e0a1cd590fa1c0f35281b9b7ebceca48.jpg',
];

const {width} = Dimensions.get('window');
const _itemWidth = width * 0.62;
const _itemHeight = _itemWidth * 1.67;
const _spacing = 16;
const _itemSize = _itemWidth + _spacing;

const Item = ({imgUrl, index}) => {
  return (
    <View
      style={{
        width: _itemWidth,
        height: _itemHeight,
      }}>
      <Image source={{uri: imgUrl}} style={{flex: 1, borderRadius: 16}} />
    </View>
  );
};

const MarqueePage = () => {
  const offset = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useAnimatedReaction(
    () => {
      const floatIndex =
        ((offset.value + _itemWidth) / _itemSize) % images.length;
      return Math.abs(Math.floor(floatIndex));
    },
    value => {
      runOnJS(setActiveIndex)(value);
    },
  );
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
      }}>
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity: 0.5,
          },
        ]}>
        <Animated.Image
          key={`image-${activeIndex}`}
          source={{uri: images[activeIndex]}}
          style={{flex: 1}}
          blurRadius={20}
          entering={FadeIn.duration(1000)}
          exiting={FadeOut.duration(1000)}
        />
      </View>
      <Marquee spacing={_spacing} position={offset}>
        <Animated.View
          style={{flexDirection: 'row', gap: _spacing}}
          entering={FadeInUp.delay(500)
            .duration(1000)
            .easing(Easing.elastic(0.9)).withInitialValues({
                transform: [{translateY: -_itemHeight / 2}],
            })}>
          {images.map((imgUrl, index) => (
            <Item key={`image-${index}`} imgUrl={imgUrl} index={index} />
          ))}
        </Animated.View>
      </Marquee>
      <Stagger
        key={'random'}
        initialEnteringDelay={1000}
        duration={500}
        stagger={100}
        style={{flex: 0.5, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'white', opacity: 0.6, fontWeight: '500'}}>
          Welcome to
        </Text>
        <Text
          style={{
            color: 'white',
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: 10,
          }}>
          Myntra.com
        </Text>
        <Text
          style={{
            color: 'white',
            opacity: 0.8,
            textAlign: 'center',
            paddingHorizontal: 'center',
          }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries,
        </Text>
      </Stagger>
    </View>
  );
};

export default MarqueePage;

const styles = StyleSheet.create({});
