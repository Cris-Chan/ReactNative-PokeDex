import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const ProfileCard = ({ visible, onClose, pokemon, onRename, customNames }) => {
  const currentName = customNames?.[pokemon.name] || pokemon.name;
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(currentName);
  const [hasRenamed, setHasRenamed] = useState(false);

  const handleRename = () => {
    if (newName.trim() !== "" && newName.trim() !== currentName) {
      onRename(pokemon.name, newName.trim()); // Use the original name as key
      setHasRenamed(true);
    }
    setIsRenaming(false);
  };

  const handleNamePress = () => {
    setIsRenaming(true);
  };

  const handleClose = () => {
    if (hasRenamed) {
      handleRename();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='fade'
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        <View style={styles.card}>
          {isRenaming ? (
            <TextInput
              value={newName}
              onChangeText={(text) => {
                setNewName(text);
                setHasRenamed(true);
              }}
              style={[styles.name, styles.nameInput]}
              autoFocus={true}
              onSubmitEditing={handleRename}
              onBlur={handleRename}
              textAlign={"center"} // Keep text centered while editing
            />
          ) : (
            <TouchableOpacity onPress={handleNamePress}>
              <Text style={styles.name}>{currentName}</Text>
            </TouchableOpacity>
          )}
          <Image source={{ uri: pokemon.sprite }} style={styles.image} />
          <Text style={styles.info}>Type: {pokemon.type}</Text>
          <Text style={styles.info}>
            Base Experience: {pokemon.base_experience}
          </Text>
          <Text style={styles.info}>Height: {pokemon.height}</Text>
          <Text style={styles.info}>Weight: {pokemon.weight}</Text>
          <Text style={styles.closeButton} onPress={handleClose}>
            Close
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  card: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 300, // Fixed width to ensure the card size stays the same
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  nameInput: {
    minWidth: "100%", // Ensure the input is as wide as the name text
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    padding: 0, // Remove padding to prevent visual size changes
    margin: 0, // Remove margin to prevent visual size changes
  },
  image: {
    width: 150,
    height: 150,
    margin: 10,
  },
  info: {
    fontSize: 16,
    marginVertical: 5,
  },
  closeButton: {
    marginTop: 20,
    color: "blue",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProfileCard;
