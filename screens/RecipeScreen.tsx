import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Recipe } from "../interfaces/recipe";
import * as Types from "../interfaces/instructions";
import Instructions from "../components/Instructions";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../interfaces/RootStackParamList";
import { RouteProp } from "@react-navigation/native";

type RecipeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RecipeScreen"
>;

type RecipeScreenRouteProp = RouteProp<RootStackParamList, "RecipeScreen">;

interface Props {
  navigation: RecipeScreenNavigationProp;
  route: RecipeScreenRouteProp;
}

const BASE_URL = "https://api.spoonacular.com";
const API_KEY = "082f3979c77140a9814fe4cc86bfbe68";
const IMG_HEIGHT = 300;
const RecipeScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const [info, setInfo] = useState<Recipe | null>(null);
  const [inst, setInst] = useState<Types.Root | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Function to fetch data
    const fetchInfo = async () => {
      try {
        // Set loading state to true while fetching data
        setIsLoading(true);

        // Fetch data from the API
        const response = await fetch(
          `${BASE_URL}/recipes/${id}/information?includeNutrition=false&apiKey=${API_KEY}`
        );
        // Check if response is successful
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Parse the response
        const jsonData = await response.json();

        // Update state with fetched data
        setInfo(jsonData);
        setIsLoading(false); // Set loading state to false
      } catch (error) {
        // If an error occurs, update error state
        console.log("InfoError: " + error);
      }
    };

    const fetchInst = async () => {
      try {
        // Set loading state to true while fetching data
        setIsLoading(true);

        // Fetch data from the API
        const response = await fetch(
          `${BASE_URL}/recipes/324694/analyzedInstructions?apiKey=${API_KEY}`
        );

        // Check if response is successful
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Parse the response
        const jsonData = await response.json();

        // Update state with fetched data
        setInst(jsonData);
        setIsLoading(false); // Set loading state to false
      } catch (error) {
        // If an error occurs, update error state
        console.log("InstError: " + error);
      }
    };

    // Call fetchData function when component mounts
    // fetchInfo();
    // fetchInst();
    // Cleanup function to cancel fetch request if component unmounts
    return () => {
      // Cancel fetch request or any cleanup needed
    };
  }, []); // Empty dependency array ensures this effect runs only once (on mount)

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translateY.value = event.contentOffset.y;
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            translateY.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            translateY.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [1.5, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      {info === null ? (
        <Text>Loading...</Text>
      ) : (
        <Animated.ScrollView
          style={styles.detailsContainer}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
        >
          <Animated.Image
            source={{ uri: info.image }}
            style={[styles.image, imageAnimatedStyle]}
          />
          <View style={styles.contentContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{info.title}</Text>
              <View style={styles.likeContainer}>
                <Ionicons name="heart" size={24} color={"#ff0000"} />
                <Text style={styles.likeText}>{info.aggregateLikes}</Text>
              </View>
            </View>
            <View style={styles.statsHeadingContainer}>
              <Text style={styles.statsHeadingText}>Ready In Minutes</Text>
              <View
                style={{
                  width: 2,
                  backgroundColor: "#000",
                }}
              ></View>
              <Text style={styles.statsHeadingText}>Servings</Text>
              <View
                style={{
                  width: 2,
                  backgroundColor: "#000",
                }}
              ></View>
              <Text style={styles.statsHeadingText}>Price Per Serving</Text>
            </View>
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>{info.readyInMinutes}</Text>
              <View
                style={{
                  width: 2,
                  backgroundColor: "#000",
                }}
              ></View>
              <Text style={styles.statsText}>{info.servings}</Text>
              <View
                style={{
                  width: 2,
                  backgroundColor: "#000",
                }}
              ></View>
              <Text style={styles.statsText}>
                ${Math.round(info.pricePerServing) / 100}
              </Text>
            </View>
            <View style={styles.descriptionHeadingContainer}>
              <Text style={styles.description}>Description</Text>
            </View>
            <Text style={styles.summary}>
              {info.summary.replace(/<\/?[^>]+(>|$)/g, "")}
            </Text>
            {info === null || inst === null ? null : (
              <Instructions info={info} inst={inst} />
            )}
          </View>
        </Animated.ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headingContainer: {
    backgroundColor: "#000",
    alignItems: "center",
    paddingTop: 10,
  },
  heading: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: 1.2,
    marginVertical: 40,
  },
  detailsContainer: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: IMG_HEIGHT,
  },
  contentContainer: {
    top: -15,
    backgroundColor: "#f8f9fa",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  titleContainer: {
    padding: 10,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    backgroundColor: "#F5F5DC",
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
  },
  title: {
    color: "#003049",
    fontSize: 22,
    width: "80%",
  },
  likeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 2,
  },
  likeText: {
    fontSize: 24,
    color: "#003049",
  },
  statsHeadingContainer: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderTopWidth: 1,
    justifyContent: "space-evenly",
  },
  statsHeadingText: {
    fontSize: 20,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    alignSelf: "center",
    marginVertical: 2,
    color: "#000",
  },
  statsContainer: {
    flexDirection: "row",
    flex: 1,
    borderBottomWidth: 1,
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
  },
  statsText: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    alignSelf: "center",
    marginVertical: 2,
  },
  descriptionHeadingContainer: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#000",
  },
  description: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "500",
    margin: 10,
    textAlign: "center",
  },
  summary: {
    fontSize: 20,
    fontWeight: "400",
    letterSpacing: 1.02,
    lineHeight: 25,
    margin: 10,
  },
});

export default RecipeScreen;
