import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

// List item that will list a pokemon from a pokemon api as an item in a list
const ListItem = ({
  title = "Unknown",
  type = "normal",
  image = "https://via.placeholder.com/150",
  customName,
}) => {
  const imageSource = typeof image === "number" ? image : { uri: image };
  const backgroundColor = getTypeColor(type);

  return (
    <View style={[styles.item, { backgroundColor }]}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{customName || title}</Text>
        <Text style={styles.type}>{type.replace(/, /g, " | ")}</Text>
      </View>
    </View>
  );
};

// Function to determine background color based on the pokemon type
// Adjusted to handle hybrid types (e.g., "water, dragon")
const getTypeColor = (typeString) => {
  const typeColors = {
    fire: "#F08030",
    grass: "#78C850",
    electric: "#F8D030",
    water: "#6890F0",
    ground: "#E0C068",
    rock: "#B8A038",
    fairy: "#EE99AC",
    poison: "#A040A0",
    bug: "#A8B820",
    dragon: "#7038F8",
    psychic: "#F85888",
    flying: "#A890F0",
    fighting: "#C03028",
    normal: "#A8A878",
  };

  // Split the type string and find the corresponding color for each type
  const types = typeString.toLowerCase().split(", ");
  const colors = types.map((type) => typeColors[type] || typeColors["normal"]);
  // If there's more than one type, blend the colors, otherwise return the single color
  return colors.length > 1 ? blendColors(colors) : colors[0];
};

// Function to blend colors
const blendColors = (colors) => {
  let totalR = 0,
    totalG = 0,
    totalB = 0;
  colors.forEach((color) => {
    let { r, g, b } = hexToRgb(color);
    totalR += r;
    totalG += g;
    totalB += b;
  });
  // Calculate the average of each color component
  const averageR = Math.round(totalR / colors.length);
  const averageG = Math.round(totalG / colors.length);
  const averageB = Math.round(totalB / colors.length);
  // Convert the average color to a hex string and return it
  return rgbToHex(averageR, averageG, averageB);
};

// Helper function to convert hex color to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Helper function to convert RGB color to hex
const rgbToHex = (r, g, b) => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    padding: 5,
  },
  image: {
    width: 60,
    height: 60,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  type: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },
});
export default ListItem;
