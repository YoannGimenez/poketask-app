import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface PokemonData {
  id: number;
  name: string;
  spriteUrl: string;
  isShiny: boolean;
}

interface PokeballItem {
  id: string;
  name: string;
  spriteUrl: string;
  quantity: number;
  captureBonusRate: number;
}

interface PokemonEncounterProps {
  pokemon: PokemonData;
  pokeballs: PokeballItem[];
  selectedPokeball: string | null;
  onPokeballSelect: (pokeballId: string) => void;
  showPokeballDropdown: boolean;
  onTogglePokeballDropdown: () => void;
  onCapture: () => void;
  onFlee: () => void;
  catchRatePercent?: number;
}

export default function PokemonEncounter({
                                           pokemon,
                                           pokeballs,
                                           selectedPokeball,
                                           onPokeballSelect,
                                           showPokeballDropdown,
                                           onTogglePokeballDropdown,
                                           onCapture,
                                           onFlee,
                                           catchRatePercent,
                                         }: PokemonEncounterProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const selectedPokeballData = pokeballs.find(pb => pb.id === selectedPokeball);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handleCapture = async () => {
    if (isCapturing) return;

    setIsCapturing(true);

    // Démarrer l'animation de rotation
    const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
    );
    rotateAnimation.start();

    setTimeout(() => {
      onCapture();
      setIsCapturing(false);
      rotateAnimation.stop();
      rotateAnim.setValue(0);
    }, 1000);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
      <View style={styles.container}>
        {/* Background avec gradient rouge diagonal */}
        <LinearGradient
            colors={['#FF6B6B', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 0.50]}
            style={styles.background}
        />

        {/* Texte de rencontre */}
        <View style={styles.encounterTextContainer}>
          <Text style={styles.encounterText}>
            Tu as rencontré un {pokemon.name}!
          </Text>
        </View>

        {/* Zone de combat centrée */}
        <View style={styles.battleAreaContainer}>
          <ImageBackground
              source={require('@/assets/images/background_encounter.png')}
              style={styles.battleArea}
              resizeMode="contain"
          >
            {/* Pokémon au centre */}
            <View style={styles.pokemonContainer}>
              {isCapturing ? (
                  <View style={styles.loadingContainer}>
                    <Animated.Image
                        source={require('@/assets/images/pokeball_loader.png')}
                        style={[
                          styles.loadingPokeball,
                          { transform: [{ rotate: spin }] }
                        ]}
                        resizeMode="contain"
                    />
                    <Text style={styles.loadingText}>Capture en cours...</Text>
                  </View>
              ) : (
                  <View style={styles.pokemonImageContainer}>
                    <Image
                        source={{ uri: pokemon.spriteUrl }}
                        style={[
                          styles.pokemonImage,
                          pokemon.isShiny && styles.shinyPokemon
                        ]}
                        resizeMode="contain"
                    />
                    {pokemon.isShiny && (
                        <View style={styles.shinyIndicator}>
                          <Ionicons name="star" size={20} color="#FFD700" />
                          <Text style={styles.shinyText}>SHINY!</Text>
                        </View>
                    )}
                  </View>
              )}
            </View>
          </ImageBackground>
        </View>

        {/* Bouton Pokéball (sac) - au-dessus des actions */}
        <View style={styles.pokeballButtonContainer}>
          <TouchableOpacity
              style={styles.pokeballButton}
              onPress={onTogglePokeballDropdown}
          >
            <Image
                source={require('@/assets/images/tab_bag.png')}
                style={styles.pokeballIcon}
                resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Dropdown des Pokéballs en grille */}
          {showPokeballDropdown && (
              <View style={styles.pokeballDropdown}>
                {/* Pointe vers le bouton */}
                <View style={styles.dropdownArrow} />

                <View style={styles.pokeballGrid}>
                  {pokeballs.map((pokeball) => (
                      <TouchableOpacity
                          key={pokeball.id}
                          style={[
                            styles.pokeballGridItem,
                            selectedPokeball === pokeball.id && styles.selectedPokeballGridItem
                          ]}
                          onPress={() => {
                            onPokeballSelect(pokeball.id);
                            onTogglePokeballDropdown();
                          }}
                      >
                        <View style={styles.pokeballEmojiContainer}>
                          <Image source={{ uri: pokeball.spriteUrl }} style={styles.pokeballSprite} />
                          <View style={styles.quantityBadge}>
                            <Text style={styles.quantityText}>{pokeball.quantity}</Text>
                          </View>
                        </View>
                        <Text style={styles.pokeballGridName}>{pokeball.name}</Text>
                      </TouchableOpacity>
                  ))}
                </View>
              </View>
          )}
        </View>

        {/* Taux de capture - au-dessus des boutons */}
        {typeof catchRatePercent === 'number' && (
            <View style={styles.rateContainer}>
              <Text style={styles.rateText}>Taux de capture : {catchRatePercent}%</Text>
            </View>
        )}

        {/* Actions principales */}
        <View style={styles.actionsContainer}>
          {/* Bouton de capture (rouge plein) */}
          <TouchableOpacity
              style={[styles.actionBtn, styles.captureBtn, isCapturing && styles.buttonDisabled]}
              onPress={handleCapture}
              disabled={isCapturing}
          >
            <Text style={styles.captureBtnText}>
              {isCapturing ? 'Capture...' : 'Capturer'}
            </Text>
          </TouchableOpacity>

          {/* Bouton de fuite (transparent bord rouge) */}
          <TouchableOpacity
              style={[styles.actionBtn, styles.fleeBtn, isCapturing && styles.buttonDisabled]}
              onPress={onFlee}
              disabled={isCapturing}
          >
            <Text style={styles.fleeBtnText}>Fuir</Text>
          </TouchableOpacity>
        </View>

        {/* Indicateur de Pokéball sélectionnée */}
        {selectedPokeballData && (
            <View style={styles.selectedPokeballIndicator}>
              <Text style={styles.selectedPokeballText}>
                {selectedPokeballData.name} sélectionnée
              </Text>
            </View>
        )}
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
  encounterTextContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 5,
  },
  encounterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  battleAreaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  battleArea: {
    width: 300,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pokemonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pokemonImageContainer: {
    position: 'relative',
  },
  pokemonImage: {
    width: 200,
    height: 200,
    marginBottom: 70,
  },
  shinyPokemon: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  shinyIndicator: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shinyText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingPokeball: {
    width: 80,
    height: 80,
  },
  loadingText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  pokeballButtonContainer: {
    position: 'absolute',
    bottom: 200,
    right: 20,
    zIndex: 10,
  },
  pokeballButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pokeballIcon: {
    width: 40,
    height: 40,
  },
  pokeballSprite: {
    width: 32,
    height: 32,
  },
  pokeballDropdown: {
    position: 'absolute',
    bottom: 60,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 10,
    minWidth: 250,
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownArrow: {
    position: 'absolute',
    bottom: -8,
    right: 15,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#000000',
  },
  pokeballGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
  pokeballGridItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  selectedPokeballGridItem: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  pokeballEmojiContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  quantityBadge: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  pokeballGridName: {
    color: '#333333',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    gap: 16,
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  captureBtn: {
    backgroundColor: '#FF6B6B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  captureBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  fleeBtn: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  fleeBtnText: {
    color: '#FF6B6B',
    fontSize: 18,
    fontWeight: '800',
  },
  rateContainer: {
    position: 'absolute',
    bottom: 180,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  rateText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '700',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    textAlign: 'center',
  },
  selectedPokeballIndicator: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedPokeballText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});