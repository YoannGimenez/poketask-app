import PokedexCard from "@/components/pokedex/PokedexCard";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import pokemonService from "@/api/pokemonService";
import {PokemonType} from "@/models/enums/PokemonType";
import {useToast} from "@/contexts/ToastContext";

type ApiPokemon = {
  id: string;
  name: string;
  spriteUrl: string;
  types: PokemonType[];
  amountCaught: number;
};

export default function PokedexScreen() {
  const [pokemons, setPokemons] = useState<ApiPokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchMyPokemons = async () => {
    try {
      setLoading(true);

      const result = await pokemonService.getMyPokemons();

      if (result.success) {
        setPokemons(result.data.userPokemons);
      }
    } catch (e: any) {
      showError('Erreur', e?.message );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPokemons();
  }, []);

  return (
      <View style={styles.container}>
        <LinearGradient
            colors={['#FF6B6B', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 0.80]}
            style={styles.background}
        />

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerContainer}>
            <BlurView intensity={20} style={styles.headerBlur}>
              <View style={styles.headerContent}>
                <Text style={styles.title}>Pokédex</Text>
                <Text style={styles.subtitle}>Votre collection de Pokémon</Text>
              </View>
            </BlurView>
          </View>

          {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
              </View>
          ) : (
              <View style={styles.contentWrapper}>
                <BlurView intensity={15} style={styles.listContainer}>
                  <FlatList
                      data={pokemons}
                      keyExtractor={(item, index) => `${item.id}-${index}`}
                      numColumns={3}
                      contentContainerStyle={styles.grid}
                      columnWrapperStyle={styles.row}
                      renderItem={({ item }) => (
                          <PokedexCard
                              name={item.name}
                              spriteUrl={item.spriteUrl}
                              types={item.types}
                              amountCaught={item.amountCaught}
                              cardSize={110}
                          />
                      )}
                  />
                </BlurView>
              </View>
          )}
        </SafeAreaView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    marginHorizontal: 8,
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerBlur: {
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: "center"
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold"
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 6
  },
  contentWrapper: {
    flex: 1,
    marginHorizontal: 8,
    marginTop: 20,
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  grid: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  row: {
    justifyContent: 'flex-start',
    gap: 20
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});