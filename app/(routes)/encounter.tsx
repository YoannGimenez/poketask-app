import PokemonEncounter from '@/components/encounter/PokemonEncounter';
import { useToast } from "@/contexts/ToastContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler } from 'react-native';
import pokemonService from "@/api/pokemonService";

interface PokemonData {
  id: number;
  name: string;
  spriteUrl: string;
  isShiny: boolean;
    catchRate?: number;
}

interface PokeballItem {
  id: string;
  name: string;
  spriteUrl: string;
  quantity: number;
  captureBonusRate: number;
}

export default function EncounterScreen() {
  const { locationId } = useLocalSearchParams<{ locationId: string }>();
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [pokeballs, setPokeballs] = useState<PokeballItem[]>([]);
  const [selectedPokeball, setSelectedPokeball] = useState<string | null>(null);
  const [catchRatePercent, setCatchRatePercent] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showPokeballDropdown, setShowPokeballDropdown] = useState(false);
  const { showSuccess, showWarning, showError, toastFlee } = useToast();


  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  // Réinitialiser toutes les données quand on quitte
  const resetData = () => {
    setPokemon(null);
    setPokeballs([]);
    setSelectedPokeball(null);
    setShowPokeballDropdown(false);
    setIsLoading(true);
  };

  // Charger les données de l'encounter
  const fetchEncounterData = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Erreur', 'Token d\'authentification manquant');
        router.replace('/(app)/home');
        return;
      }

      // Appel API pour l'encounter (doit idéalement renvoyer pokemon + pokeballs)
      const encounterResponse = await fetch(`${API_URL}/location/${locationId}/encounter`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (encounterResponse.ok) {
        const encounterData = await encounterResponse.json();
        const p = encounterData.pokemon ?? encounterData;
        const pokemonData: PokemonData = {
          id: p.id,
          name: p.name,
          spriteUrl: p.spriteUrl,
          isShiny: !!(encounterData.isShiny ?? p.isShiny),
          catchRate: p.catchChance,
        };
        setPokemon(pokemonData);

        const ballsRaw = encounterData.pokeballs ?? [];
        if (Array.isArray(ballsRaw) && ballsRaw.length) {
          const balls = ballsRaw.map((b: any) => ({
            id: String(b.item.id),
            name: b.item.name,
            spriteUrl: b.item.spriteUrl,
            quantity: b.quantity ?? 0,
            captureBonusRate: b.item.catchChanceBonus ?? 0,
          })) as PokeballItem[];
          setPokeballs(balls);
          setSelectedPokeball(balls.find(pb => (pb.quantity ?? 0) > 0)?.id || balls[0]?.id || null);
        } else {
          // Fallback: récupérer l'inventaire des pokéballs
          try {
            const resBalls = await fetch(`${API_URL}/item/my-pokeballs`, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            });
            if (resBalls.ok) {
              const dataBalls = await resBalls.json();
              const list = (dataBalls.userPokeballs ?? dataBalls).map((b: any) => ({
                id: String(b.id),
                name: b.name,
                spriteUrl: b.spriteUrl,
                quantity: b.quantity ?? 0,
                captureBonusRate: b.captureBonusRate ?? b.bonus ?? b.bonusCaptureRate ?? 0,
              })) as PokeballItem[];
              setPokeballs(list);
              setSelectedPokeball(list.find(pb => (pb.quantity ?? 0) > 0)?.id || list[0]?.id || null);
            }
          } catch {}
        }
      } else {
        Alert.alert('Erreur', 'Impossible de générer une rencontre');
        router.replace('/(app)/home');
        return;
      }

    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      Alert.alert('Erreur', 'Problème de connexion');
      router.replace('/(app)/home');
    } finally {
      setIsLoading(false);
    }
  };

  // Action de capture
  const handleCapture = async () => {
    if (!pokemon || !selectedPokeball) {
      Alert.alert('Erreur', 'Données manquantes pour la capture');
      return;
    }

    try {
      const result = await pokemonService.catchPokemon(
          pokemon.id,
          locationId!,
          selectedPokeball,
          pokemon.isShiny
      );

      if (result.success) {
        if (result.data.captured) {
          showSuccess(
              'Pokémon capturé !',
              `${pokemon.name} a été ajouté à votre équipe !`,
              pokemon.spriteUrl
          );
        } else {
          showWarning(
              'Échec de capture',
              `${pokemon.name} s'est échappé !`,
              pokemon.spriteUrl
          );
        }
        router.replace('/(app)/home');
      } else {
        showError('Erreur', result.error?.message || 'Impossible de capturer le Pokémon');
      }
    } catch (error) {
      console.error('Erreur lors de la capture:', error);
      showError('Erreur', 'Problème de connexion');
    }
  };

  // Action de fuite
  const handleFlee = () => {
    resetData();
    toastFlee('Vous avez pris la fuite !');
    router.replace('/(app)/home');
  };

  // Calcul du taux de capture affiché
  useEffect(() => {
    if (!pokemon) return;
    const base = typeof pokemon.catchRate === 'number' ? pokemon.catchRate : 0;
    const ball = pokeballs.find(pb => pb.id === selectedPokeball);
    const bonus = ball?.captureBonusRate ?? 0;
    const pct = Math.max(0, Math.min(100, Math.round(base + bonus)));
    setCatchRatePercent(pct);
  }, [pokemon, pokeballs, selectedPokeball]);

  // Bloquer le bouton retour système
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Empêche le retour avec le bouton système
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription?.remove();
    }, [])
  );

  useEffect(() => {
    if (locationId) {
      fetchEncounterData();
    } else {
      Alert.alert('Erreur', 'ID de localisation manquant');
      router.replace('/(app)/home');
    }

    // Nettoyer les données quand on quitte l'écran
    return () => {
      resetData();
    };
  }, [locationId]);

  if (isLoading) {
    return null; // Ou un loader si vous en avez un
  }

  if (!pokemon) {
    return null;
  }

  return (
    <PokemonEncounter
      pokemon={pokemon}
      pokeballs={pokeballs}
      selectedPokeball={selectedPokeball}
      onPokeballSelect={setSelectedPokeball}
      showPokeballDropdown={showPokeballDropdown}
      onTogglePokeballDropdown={() => setShowPokeballDropdown(!showPokeballDropdown)}
      onCapture={handleCapture}
      onFlee={handleFlee}
      catchRatePercent={catchRatePercent}
    />
  );
}
