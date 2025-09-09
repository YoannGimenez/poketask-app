import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useToast } from "@/contexts/ToastContext";
import pokemonService from '@/api/pokemonService';

interface StarterModalProps {
  visible: boolean;
  onClose: () => void;
}

type Starter = {
  id: number;
  name: string;
  spriteUrl: string;
};

export default function StarterModal({ visible, onClose }: StarterModalProps) {
  const [loading, setLoading] = useState(true);
  const [starters, setStarters] = useState<Starter[]>([]);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [professorLoaded, setProfessorLoaded] = useState(false);
  const { showSuccess, showError } = useToast();

  const preloadImages = async (urls: string[]) => {
    try {
      await Promise.all(urls.map((u) => Image.prefetch(u)));
      setAssetsLoaded(true);
    } catch {
      setAssetsLoaded(true);
    }
  };

  const fetchStarters = async () => {
    try {
      setLoading(true);
      const result = await pokemonService.getStarters();

      if (result.success) {
        const list: Starter[] = result.data.starters || result.data;
        setStarters(list);
        await preloadImages(list.map(s => s.spriteUrl));
      } else {
        showError('Erreur', result.error?.message || 'Impossible de charger les starters');
        setStarters([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des starters:', error);
      showError('Erreur', 'Problème de connexion');
      setStarters([]);
    } finally {
      setLoading(false);
    }
  };

  const chooseStarter = async (pokemonId: number) => {
    try {
      const result = await pokemonService.addStarter(pokemonId);

      if (result.success) {
        if (result.data.pokemon) {
          showSuccess(
              'Starter ajouté !',
              `${result.data.pokemon.name} a rejoint votre équipe !`,
              result.data.pokemon.spriteUrl
          );
        }
        onClose();
      } else {
        showError('Erreur', result.error?.message || 'Impossible d\'ajouter le starter');
      }
    } catch (error) {
      console.error('Erreur lors du choix du starter:', error);
      showError('Erreur', 'Problème de connexion');
    }
  };

  useEffect(() => {
    if (visible) {
      setAssetsLoaded(false);
      setProfessorLoaded(false);
      fetchStarters();
    }
  }, [visible]);

  if (!visible) return null;

  const ready = !loading && assetsLoaded && professorLoaded;

  return (
      <>
        {!professorLoaded && (
            <Image
                source={require('@/assets/images/professor_intro.png')}
                style={{ width: 1, height: 1, position: 'absolute', opacity: 0 }}
                onLoad={() => setProfessorLoaded(true)}
            />
        )}

        {ready && (
            <Modal visible transparent animationType="fade" onRequestClose={() => {}}>
              <View style={styles.overlay}>
                <View style={styles.card}>
                  <View style={styles.header}>
                    <Text style={styles.title}>Bienvenue dans votre aventure Pokémon !</Text>
                    <Image
                        source={require('@/assets/images/professor_intro.png')}
                        style={styles.professor}
                        resizeMode="contain"
                    />
                    <Text style={styles.subtitle}>Choisissez votre premier compagnon.</Text>
                  </View>
                  <View style={styles.startersRow}>
                    {starters.map((s) => (
                        <TouchableOpacity key={s.id} style={styles.starterTile} onPress={() => chooseStarter(s.id)}>
                          <Image source={{ uri: s.spriteUrl }} style={styles.starterSprite} resizeMode="contain" />
                        </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </Modal>
        )}
      </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20
  },
  header: {
    alignItems: 'center',
    marginBottom: 16
  },
  professor: {
    width: 140,
    height: 140,
    marginTop: 6,
    marginBottom: 8
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#212121',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#606770',
    marginTop: 4
  },
  startersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  starterTile: {
    alignItems: 'center',
    backgroundColor: '#F6F7F9',
    padding: 12,
    borderRadius: 12,
    width: '30%'
  },
  starterSprite: {
    width: 72,
    height: 72
  },
});