import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ItemType = 'POKEBALL' | 'EVOLUTION' | 'POTION' | 'BERRY' | 'MISC';

type InventoryItem = {
  id: string;
  name: string;
  description: string;
  spriteUrl: string;
  type: ItemType;
  quantity: number;
};

type EvolvablePokemon = {
  baseId: string;
  baseName: string;
  baseSpriteUrl: string;
  evolvedId: string;
  evolvedName: string;
  evolvedSpriteUrl?: string | null;
  hasEvolved: boolean;
};

export default function BagScreen() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [evolvables, setEvolvables] = useState<EvolvablePokemon[]>([]);
  const [evoLoading, setEvoLoading] = useState(false);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Token manquant');
      const res = await fetch(`${API_URL}/item/my-items`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!res.ok) throw new Error('Erreur chargement inventaire');
      const data = await res.json();
      setItems(data.userItems || data);
    } catch (e: any) {
      setError(e.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const groupedSections = useMemo(() => {
    const order: ItemType[] = ['POKEBALL', 'EVOLUTION', 'POTION', 'BERRY', 'MISC'];
    const titles: Record<ItemType, string> = {
      POKEBALL: 'Pokéballs',
      EVOLUTION: 'Objets d\'évolution',
      POTION: 'Potions',
      BERRY: 'Baies',
      MISC: 'Divers',
    };
    return order
        .map(type => ({
          title: titles[type],
          data: items.filter(i => i.type === type),
          key: type,
        }))
        .filter(section => section.data.length > 0);
  }, [items]);

  const openItem = async (item: InventoryItem) => {
    setSelectedItem(item);
    if (item.type === 'EVOLUTION') {
      await loadEvolvables(item.id);
    } else {
      setEvolvables([]);
    }
  };

  const loadEvolvables = async (itemId: string) => {
    try {
      setEvoLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Token manquant');
      const res = await fetch(`${API_URL}/item/${itemId}/evolvables`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!res.ok) throw new Error('Erreur chargement évolutions');
      const data = await res.json();
      setEvolvables(data);
    } catch (e) {
      setEvolvables([]);
    } finally {
      setEvoLoading(false);
    }
  };

  const evolve = async (itemId: string, baseId: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;
      const res = await fetch(`${API_URL}/evolution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId, basePokemonId: baseId })
      });
      if (res.ok) {
        await fetchItems();
        if (selectedItem) await loadEvolvables(selectedItem.id);
      }
    } catch {}
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const renderItem = ({ item }: { item: InventoryItem }) => (
      <TouchableOpacity style={styles.itemTile} key={`${item.id}-${item.name}`} onPress={() => openItem(item)}>
        <View style={styles.itemSpriteContainer}>
          <Image source={{ uri: item.spriteUrl }} style={styles.itemSprite} resizeMode="contain" />
          <View style={styles.itemQtyBadge}>
            <Text style={styles.itemQtyText}>x{item.quantity}</Text>
          </View>
        </View>
        <Text style={styles.itemTileName}>{item.name}</Text>
      </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: any) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
  );

  const renderSection = ({ section }: any) => (
      <View style={styles.sectionContainer}>
        <BlurView intensity={20} tint="light" style={styles.sectionBlur}>
          <View style={styles.sectionContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.itemsGrid}>
              {section.data.map((item: InventoryItem) => (
                  <TouchableOpacity key={`${item.type}`} style={styles.itemTile} onPress={() => openItem(item)}>
                    <View style={styles.itemSpriteContainer}>
                      <Image source={{ uri: item.spriteUrl }} style={styles.itemSprite} resizeMode="contain" />
                      <View style={styles.itemQtyBadge}>
                        <Text style={styles.itemQtyText}>x{item.quantity}</Text>
                      </View>
                    </View>
                    <Text style={styles.itemTileName}>{item.name}</Text>
                  </TouchableOpacity>
              ))}
            </View>
          </View>
        </BlurView>
      </View>
  );

  return (
      <View style={styles.container}>
        {/* Background avec gradient rouge diagonal (haut droite vers bas gauche) */}
        <LinearGradient
            colors={['#FF6B6B', '#FFFFFF']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.80]}
            style={styles.background}
        />

        <SafeAreaView style={styles.safeArea}>
          {/* Header avec effet glass */}
          <View style={styles.headerContainer}>
            <BlurView intensity={30} tint="light" style={styles.headerBlur}>
              <View style={styles.headerContent}>
                <Text style={styles.title}>Mon Sac</Text>
                <Text style={styles.subtitle}>Tous vos objets collectés</Text>
              </View>
            </BlurView>
          </View>

          {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
              </View>
          ) : error ? (
              <View style={styles.loaderContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
          ) : (
              <View style={styles.contentWrapper}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                  {groupedSections.map((section) => (
                      <View key={section.key} style={styles.sectionContainer}>
                        <BlurView intensity={20} tint="light" style={styles.sectionBlur}>
                          <View style={styles.sectionContent}>
                            <View style={styles.sectionHeader}>
                              <Text style={styles.sectionTitle}>{section.title}</Text>
                            </View>
                            <View style={styles.itemsGrid}>
                              {section.data.map((item: InventoryItem) => (
                                  <TouchableOpacity key={`${item.id}-${item.name}`} style={styles.itemTile} onPress={() => openItem(item)}>
                                    <View style={styles.itemSpriteContainer}>
                                      <Image source={{ uri: item.spriteUrl }} style={styles.itemSprite} resizeMode="contain" />
                                      <View style={styles.itemQtyBadge}>
                                        <Text style={styles.itemQtyText}>x{item.quantity}</Text>
                                      </View>
                                    </View>
                                    <Text style={styles.itemTileName}>{item.name}</Text>
                                  </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                        </BlurView>
                      </View>
                  ))}
                </ScrollView>
              </View>
          )}

          {/* Modale de détails */}
          <Modal visible={!!selectedItem} transparent animationType="fade" onRequestClose={() => setSelectedItem(null)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                {selectedItem && (
                    <>
                      <View style={styles.modalHeader}>
                        <Image source={{ uri: selectedItem.spriteUrl }} style={styles.modalImage} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                          <Text style={styles.modalDescription}>{selectedItem.description}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setSelectedItem(null)}>
                          <Ionicons name="close" size={22} color="#333" />
                        </TouchableOpacity>
                      </View>

                      {selectedItem.type === 'EVOLUTION' && (
                          <View style={styles.evolutionBlock}>
                            <Text style={styles.evoTitle}>Évolutions possibles</Text>
                            {evoLoading ? (
                                <View style={styles.centered}><ActivityIndicator /></View>
                            ) : (
                                evolvables.map((p) => (
                                    <View key={p.baseId} style={styles.evoRow}>
                                      <Image source={{ uri: p.baseSpriteUrl }} style={styles.evoSprite} />
                                      <Ionicons name="arrow-forward" size={20} color="#333" />
                                      {p.evolvedSpriteUrl ? (
                                          <Image source={{ uri: p.evolvedSpriteUrl }} style={styles.evoSprite} />
                                      ) : (
                                          <View style={styles.evoSilhouette} />
                                      )}
                                      <TouchableOpacity style={styles.evoButton} onPress={() => evolve(selectedItem.id, p.baseId)}>
                                        <Text style={styles.evoButtonText}>{p.hasEvolved ? 'Possédé' : 'Évoluer'}</Text>
                                      </TouchableOpacity>
                                    </View>
                                ))
                            )}
                          </View>
                      )}
                    </>
                )}
              </View>
            </View>
          </Modal>
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
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerBlur: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    alignItems: "center"
  },
  title: {
    color: "#333333",
    fontSize: 28,
    fontWeight: "bold",
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    color: '#666666',
    fontSize: 14,
    marginTop: 6,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  contentWrapper: {
    flex: 1,
    marginHorizontal: 8,
    marginTop: 20,
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionContainer: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  sectionBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionContent: {
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#333333',
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
  },
  itemTile: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    width: '30%',
    minHeight: 100,
    justifyContent: 'center',
  },
  itemSpriteContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  itemSprite: {
    width: '80%',
    height: '80%'
  },
  itemQtyBadge: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  itemQtyText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  itemTileName: {
    color: '#333333',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#333333',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalCard: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  modalImage: {
    width: 48,
    height: 48,
    marginRight: 8
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333'
  },
  modalDescription: {
    color: '#566',
    marginTop: 4
  },
  evolutionBlock: {
    padding: 16
  },
  evoTitle: {
    fontWeight: '700',
    color: '#333',
    marginBottom: 8
  },
  evoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12
  },
  evoSprite: {
    width: 40,
    height: 40
  },
  evoSilhouette: {
    width: 40,
    height: 40,
    backgroundColor: '#1E1E1E',
    borderRadius: 6
  },
  evoButton: {
    marginLeft: 'auto',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  evoButtonText: {
    color: '#FFF',
    fontWeight: '700'
  },
});