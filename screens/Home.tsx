import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { RecipeList, RecipeData } from "../interfaces/recipe";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../interfaces/RootStackParamList";

const BASE_URL = "https://api.spoonacular.com";
const API_KEY = "08b2a82b463849bb98eb06fda8f3bb39";

const Home = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Home">) => {
  const [data, setData] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        // Set loading state to true while fetching data
        setIsLoading(true);

        // Fetch data from the API
        const response = await fetch(
          `${BASE_URL}/recipes/complexSearch?apiKey=${API_KEY}&number=20`
        );

        // Check if response is successful
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Parse the response
        const jsonData = await response.json();

        // Update state with fetched data
        setData(jsonData);
        setIsLoading(false); // Set loading state to false
      } catch (error) {
        // If an error occurs, update error state
        console.log("Error: " + error);
      }
    };

    // Call fetchData function when component mounts
    // fetchData();

    // Cleanup function to cancel fetch request if component unmounts
    return () => {
      // Cancel fetch request or any cleanup needed
    };
  }, []); // Empty dependency array ensures this effect runs only once (on mount)

  const handleRecipeClick = (id: number) => {
    navigation.navigate("RecipeScreen", {
      id: id,
    });
  };

  const renderRecipeItem = ({ item }: { item: RecipeList }) => (
    <TouchableOpacity
      style={styles.recipeBox}
      onPress={() => handleRecipeClick(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Let's Cook</Text>
      </View>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={(data as RecipeData)?.results}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.flatlistContainer}
        />
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
  flatlistContainer: {
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    top: -20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  recipeBox: {
    padding: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#bde0fe",
    marginBottom: 20,
    borderRadius: 40,
    gap: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 40,
  },
  title: {
    color: "#000",
    fontSize: 24,
    textAlign: "center",
  },
});

export default Home;
