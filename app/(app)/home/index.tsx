import StarterModal from '@/components/StarterModal';
import { useAuth } from '@/contexts/AuthContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {router, useFocusEffect} from 'expo-router';
import {useCallback, useEffect, useState} from "react";
import { Alert, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrainerCard from "@/components/user/TrainerCard";


export default function HomeScreen() {
  const { user, needsStarter, setNeedsStarter } = useAuth();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [locations, setLocations] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Erreur', 'Token d\'authentification manquant');
        return;
      }
      const response = await fetch(`${API_URL}/location/my-locations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLocations(data.userLocations || [])
      } else {
        console.error('Erreur lors de la récupération des lieux');
        Alert.alert('Erreur', 'Impossible de récupérer les lieux');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      Alert.alert('Erreur', 'Problème de connexion');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
      useCallback(() => {
        fetchLocations();
      }, [user?.level])
  );

  const userLevel = user?.level || 1;
  const userExperience = user?.experience || 0;
  const nextLevelExp = user?.nextLevelExperience || 100;
  const userMoney = user?.money || 0;

  const experienceProgress = nextLevelExp > 0 ? userExperience / nextLevelExp : 0;
  const experiencePercentage = Math.min(experienceProgress * 100, 100);


  const completedTasks = user?.completedTasksCount || 0;
  const capturedPokemon = user?.pokemonsCount || 0;

  const handleRoutePress = (location: any) => {
    console.log('Explorer la route:', location.name);
    router.replace({
      pathname: '/(routes)/encounter',
      params: { locationId: location.locationId }
    });
  };

  const getRouteBackground = (type: string) => {
    switch (type) {
      case 'ROUTE':
        return require('@/assets/images/background_route_testbig.png');
      case 'CAVE':
        return require('@/assets/images/background_interior.png');
      default:
        return require('@/assets/images/background_route_bis.png');
    }
  };

  return (
      <SafeAreaView style={styles.container}>
        <StarterModal
            visible={needsStarter}
            onClose={() => setNeedsStarter(false)}
        />

        {/* Header amélioré avec niveau et monnaie */}
        <View style={styles.header}>
          {/* Section niveau avec design amélioré */}
          <View style={styles.levelSection}>
            <View style={styles.levelCard}>
              <View style={styles.levelHeader}>
                <Text style={styles.levelLabel}>Niveau</Text>
                <Text style={styles.levelNumber}>{userLevel}</Text>
              </View>
              <View style={styles.experienceContainer}>
                <View style={styles.experienceBar}>
                  <LinearGradient
                      colors={['#4CAF50', '#8BC34A']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.experienceProgress, { width: `${experiencePercentage}%` }]}
                  />
                </View>
                <Text style={styles.experienceText}>
                  {userExperience} / {nextLevelExp} XP
                </Text>
              </View>
            </View>
          </View>

          {/* Section monnaie */}
          <View style={styles.currencySection}>
            <View style={styles.currencyCard}>
              <View style={styles.currencyIconContainer}>
                <Image
                    source={require('@/assets/images/icon_money.png')}
                    style={styles.currencyIcon}
                    resizeMode="contain"
                />
              </View>
              <View style={styles.currencyInfo}>
                <Text style={styles.currencyAmount}>{userMoney.toLocaleString()}</Text>
                <Text style={styles.currencyLabel}>Pokécoins</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Carte de dresseur améliorée */}
        <View style={styles.trainerCardWrapper}>
          <TrainerCard
              username={user?.username || 'Dresseur'}
              completedTasks={completedTasks}
              capturedPokemon={capturedPokemon}
          />
        </View>

        {/* Section Exploration */}
        <View style={styles.explorationContainer}>
          <ImageBackground
              source={require('@/assets/images/background_explore.png')}
              style={styles.explorationBackground}
              resizeMode="cover"
          >
            <BlurView intensity={20} style={styles.blurOverlay}>
              <View style={styles.darkOverlay} />
            </BlurView>

            <View style={styles.explorationContent}>
              <Text style={styles.explorationTitle}>Exploration</Text>
              <ScrollView
                  style={styles.routesScrollView}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.routesContainer}
              >
                {locations.map((location: any) => (
                    <TouchableOpacity
                        key={location.locationId}
                        style={styles.routeButton}
                        onPress={() => handleRoutePress(location)}
                    >
                      <ImageBackground
                          source={getRouteBackground(location.type)}
                          style={styles.routeBackground}
                          resizeMode="contain"
                      >
                        <View style={styles.routeContent}>
                          <Text style={styles.routeName}>{location.name}</Text>
                        </View>
                      </ImageBackground>
                    </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </ImageBackground>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  levelSection: {
    flex: 1,
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4CAF50',
  },
  experienceContainer: {
    gap: 8,
  },
  experienceBar: {
    height: 8,
    backgroundColor: '#E8F5E8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  experienceProgress: {
    height: '100%',
    borderRadius: 4,
  },
  experienceText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    fontWeight: '500',
  },
  currencySection: {
    flex: 1,
  },
  currencyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  currencyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3CD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  currencyIcon: {
    width: 24,
    height: 24,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
  },
  currencyLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  trainerCardWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 16,
  },
  trainerCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardHeaderText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardHeaderLine: {
    width: 80,
    height: 3,
    backgroundColor: '#FF6B6B',
    borderRadius: 2,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginRight: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFrame: {
    width: 80,
    height: 100,
    borderRadius: 12,
    backgroundColor: 'rgba(255,105,105,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 90,
    height: 90,
  },
  explorationContainer: {
    flex: 1,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  explorationBackground: {
    flex: 1,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  explorationContent: {
    flex: 1,
    padding: 20,
    zIndex: 1,
  },
  explorationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  routesScrollView: {
    flex: 1,
  },
  routesContainer: {
    paddingBottom: 20,
  },
  routeButton: {
    width: '100%',
    height: 70,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  routeBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    paddingHorizontal: 8,
  },
});