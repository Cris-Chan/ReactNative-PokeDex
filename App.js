import ListItem from "./components/listItem";
import { useEffect, useState, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import axios from "axios";
import {
  TextInput,
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import ProfileCard from "./components/profileCard";

// Pokedex screen that uses PokeAPI to list Pokemon in an endless list
export default function App() {
  const [loading, setLoading] = useState(false);
  const [pokemons, setPokemons] = useState([]);
  const [nextUrl, setNextUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon?limit=151"
  );
  const [search, setSearch] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [error, setError] = useState(null);

  // Handling renames
  const [customNames, setCustomNames] = useState({});
  const handleRenamePokemon = useCallback((originalName, newName) => {
    setCustomNames((prevCustomNames) => ({
      ...prevCustomNames,
      [originalName]: newName,
    }));
  }, []);

  const fetchPokemonDetails = useCallback(async (url) => {
    try {
      const { data } = await axios.get(url);
      return {
        name: data.name,
        sprite: data.sprites.front_default,
        type: data.types.map((typeInfo) => typeInfo.type.name).join(", "),
        height: data.height,
        weight: data.weight,
      };
    } catch (error) {
      console.error("Failed to fetch Pokemon details:", error);
      setError("Failed to fetch Pokemon details. Please try again later.");
      return null;
    }
  }, []);

  const loadPokemons = useCallback(async () => {
    if (loading || !nextUrl) return;

    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(nextUrl);
      const pokemonDetails = await Promise.all(
        data.results.map((pokemon) => fetchPokemonDetails(pokemon.url))
      ).then((details) => details.filter((detail) => detail !== null)); // Filter out any null results due to errors
      setPokemons((prevPokemons) => [...prevPokemons, ...pokemonDetails]);
      setNextUrl(data.next);
    } catch (error) {
      console.error("Failed to load Pokemons:", error);
      setError("Failed to load more Pokemons. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [nextUrl, loading, fetchPokemonDetails]);

  useEffect(() => {
    loadPokemons();
  }, [loadPokemons]);

  const debouncedHandleSearch = useCallback(
    debounce((text) => {
      setSearch(text);
    }, 300),
    []
  );

  const filteredPokemons = useMemo(() => {
    const searchLower = search.toLowerCase();
    return pokemons
      .map((pokemon) => ({
        ...pokemon,
        isRenamed: !!customNames[pokemon.name],
        searchMatch:
          pokemon.name.toLowerCase().includes(searchLower) ||
          (customNames[pokemon.name] &&
            customNames[pokemon.name].toLowerCase().includes(searchLower)),
      }))
      .filter((pokemon) => pokemon.searchMatch)
      .sort((a, b) => {
        if (a.isRenamed && !b.isRenamed) return -1;
        if (!a.isRenamed && b.isRenamed) return 1;
        return 0;
      });
  }, [pokemons, search, customNames]);

  const handleSelectPokemon = useCallback((pokemon) => {
    setSelectedPokemon(pokemon);
  }, []);

  const handleCloseProfile = useCallback(() => {
    setSelectedPokemon(null);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.logo} source={require("./assets/cutepika.png")} />
        <Text style={styles.title}>PokéDex</Text>
        <TextInput
          style={styles.searchBar}
          placeholder='Search Pokémon'
          onChangeText={debouncedHandleSearch}
          autoCorrect={false}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={filteredPokemons}
        onEndReachedThreshold={0.5}
        onEndReached={loadPokemons}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectPokemon(item)}>
            <ListItem
              isLoading={loading}
              title={customNames[item.name] || item.name}
              image={item.sprite}
              type={item.type}
              customName={customNames[item.name]}
            />
          </TouchableOpacity>
        )}
      />
      {selectedPokemon && (
        <ProfileCard
          visible={!!selectedPokemon}
          onClose={handleCloseProfile}
          pokemon={selectedPokemon}
          onRename={handleRenamePokemon}
          customNames={customNames} // Pass customNames to ProfileCard
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 75,
    height: 75,
    resizeMode: "contain",
  },
  searchBar: {
    fontSize: 18,
    padding: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    padding: 10,
  },
});
