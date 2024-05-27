import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Recipe } from "../interfaces/recipe";
import * as Types from "../interfaces/instructions";

const { width } = Dimensions.get("window");

interface Props {
  info: Recipe;
  inst: Types.Root;
}

const Instructions = ({ info, inst }: Props) => {
  const translateX = useSharedValue(0);
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const scrollHandler = useAnimatedScrollHandler((event) => {
    translateX.value = event.contentOffset.x;
  });

  const IngHeadingOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translateX.value, [0, width], [1, 0.5]),
    };
  });

  const IngBorderStyle = useAnimatedStyle(() => {
    return {
      borderBottomWidth: interpolate(translateX.value, [0, width], [3, 0]),
    };
  });

  const InstHeadingOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translateX.value, [0, width], [0.5, 1]),
    };
  });

  const InstBorderStyle = useAnimatedStyle(() => {
    return {
      borderBottomWidth: interpolate(translateX.value, [0, width], [0, 3]),
    };
  });

  const handleIngPress = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, animated: true });
    }
  };

  const handleInstPress = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: width, animated: true });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <TouchableOpacity onPress={handleIngPress} activeOpacity={0.6}>
          <Animated.View style={[styles.ingredientsBox, IngBorderStyle]}>
            <Animated.Text style={[styles.heading, IngHeadingOpacityStyle]}>
              INGREDIENTS
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleInstPress} activeOpacity={0.6}>
          <Animated.View style={[styles.instructionsBox, InstBorderStyle]}>
            <Animated.Text style={[styles.heading, InstHeadingOpacityStyle]}>
              INSTRUCTIONS
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
      >
        <View style={styles.ingredientsPage}>
          {info.extendedIngredients.map((item, index) => (
            <View style={styles.horizontalContainer} key={index}>
              <Image
                source={{ uri: item.image }}
                style={styles.ingredientImage}
              />
              <View style={{ width: width - 110 }}>
                <Text style={styles.originalText}>{item.original}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.instructionsPage}>
          {inst.map((item, index) => (
            <View style={styles.instContainer} key={index}>
              {item.name === "" ? null : (
                <Text style={styles.name}>{item.name}</Text>
              )}

              {item.steps.map((item, index) => (
                <View style={styles.stepsContainer} key={index}>
                  <Text style={styles.stepText}>Step {item.number}</Text>
                  {item.equipment.length === 0 ? null : (
                    <Text style={styles.equipmentHeading}>Equipments:</Text>
                  )}
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled
                    contentContainerStyle={{ padding: 10, gap: 20 }}
                  >
                    {item.equipment.map((item, index) => (
                      <View style={styles.equipmentContainer} key={index}>
                        <Image
                          source={{ uri: item.image }}
                          style={styles.ingredientImage}
                        />
                        <Text style={styles.equipmentName}>{item.name}</Text>
                      </View>
                    ))}
                  </ScrollView>
                  {item.ingredients.length === 0 ? null : (
                    <Text style={styles.equipmentHeading}>Ingredients:</Text>
                  )}

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled
                    contentContainerStyle={{ padding: 10, gap: 20 }}
                  >
                    {item.ingredients.map((item, index) => (
                      <View style={styles.equipmentContainer} key={index}>
                        <Image
                          source={{ uri: item.image }}
                          style={styles.ingredientImage}
                        />
                        <Text style={styles.equipmentName}>{item.name}</Text>
                      </View>
                    ))}
                  </ScrollView>
                  <Text style={styles.stepDescription}>{item.step}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Animated.ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Your food is ready! Enjoy.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headingContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    backgroundColor: "#000",
  },
  ingredientsBox: {
    padding: 10,
    borderBottomColor: "#fcbf49",
  },
  instructionsBox: {
    padding: 10,
    borderBottomColor: "#fcbf49",
  },
  heading: {
    fontSize: 28,
    fontWeight: "500",
    color: "#fff",
    flex: 1,
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  ingredientsPage: {
    flexGrow: 1,
    width: width,
    padding: 10,
    height: "auto",
  },
  instructionsPage: {
    width: width,
    padding: 10,
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ingredientImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
  },
  originalText: {
    fontSize: 18,
  },
  instContainer: {
    flex: 1,
  },

  name: {
    alignSelf: "center",
    fontSize: 28,
    fontWeight: "500",
    margin: 10,
  },
  stepsContainer: {
    // flex: 1,
  },
  stepText: {
    fontSize: 24,
    fontWeight: "400",
    textDecorationLine: "underline",
    marginVertical: 10,
  },
  equipmentHeading: {
    fontSize: 21,
    fontWeight: "500",
    color: "#003049",
    marginVertical: 5,
  },
  equipmentContainer: {
    alignItems: "center",
    backgroundColor: "#fefae0",
    borderRadius: 20,
  },
  equipmentName: {
    fontSize: 16,
    color: "#003049",
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 20,
    color: "#d62828",
    marginVertical: 10,
  },
  footer: {
    // position: "absolute",
    // bottom: 10,
    padding: 20,
    backgroundColor: "#000",
  },
  footerText: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
  },
});

export default Instructions;
