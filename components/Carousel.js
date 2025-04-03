import { StyleSheet, View, ScrollView, Image, Dimensions, Animated } from 'react-native';
import { useEffect, useRef, useState } from 'react';

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.75; 
const SIDE_GAP = (width - ITEM_WIDTH) / 2; 
const IMAGE_MARGIN = 10; 

const Carousel = ({ banners }) => {
    const scrollViewRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % banners.length;
            scrollViewRef.current?.scrollTo({ x: nextIndex * (ITEM_WIDTH + IMAGE_MARGIN * 2), animated: true });
            setCurrentIndex(nextIndex);
        }, 3000);

        return () => clearInterval(interval);
    }, [currentIndex, banners.length]);

    return (
        <View style={styles.carouselContainer}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={ITEM_WIDTH + IMAGE_MARGIN * 2} 
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal: SIDE_GAP - IMAGE_MARGIN }} 
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                {banners.map((item, index) => {

                    const inputRange = [
                        (index - 1) * (ITEM_WIDTH + IMAGE_MARGIN * 2),
                        index * (ITEM_WIDTH + IMAGE_MARGIN * 2),
                        (index + 1) * (ITEM_WIDTH + IMAGE_MARGIN * 2)
                    ];

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.5, 1, 0.5], 
                        extrapolate: "clamp",
                    });

                    return (
                        <Animated.Image 
                            key={index} 
                            source={item.image} 
                            style={[styles.bannerImage, { opacity }]} 
                        />
                    );
                })}
            </ScrollView>

            <View style={styles.pagination}>
                {banners.map((_, index) => {
                    const dotOpacity = scrollX.interpolate({
                        inputRange: [
                            (index - 1) * (ITEM_WIDTH + IMAGE_MARGIN * 2),
                            index * (ITEM_WIDTH + IMAGE_MARGIN * 2),
                            (index + 1) * (ITEM_WIDTH + IMAGE_MARGIN * 2)
                        ],
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: "clamp",
                    });

                    return <Animated.View key={index} style={[styles.dot, { opacity: dotOpacity }]} />;
                })}
            </View>
        </View>
    );
};

export default Carousel;

const styles = StyleSheet.create({
    carouselContainer: { alignItems: "center", paddingVertical: 10 },
    bannerImage: { 
        width: ITEM_WIDTH, 
        height: ITEM_WIDTH, 
        borderRadius: 10,
        marginHorizontal: IMAGE_MARGIN, 
    },
    pagination: { flexDirection: "row", position: "absolute", bottom: 10, alignSelf: "center" },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#ff3f6c", marginHorizontal: 5 },
});
