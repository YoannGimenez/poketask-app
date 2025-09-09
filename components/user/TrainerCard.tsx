import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface TrainerCardProps {
  username: string;
  completedTasks: number;
  capturedPokemon: number;
  showEditButton?: boolean;
  onEditPress?: () => void;
}

export default function TrainerCard({ 
  username, 
  completedTasks, 
  capturedPokemon, 
  showEditButton = false,
  onEditPress 
}: TrainerCardProps) {
  return (
    <View style={styles.trainerCardWrapper}>
      <View style={styles.trainerCard}>
        <LinearGradient
          colors={['#F8F9FA', '#ff9c9c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0.3, 1]}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>Carte de Dresseur</Text>
            <View style={styles.cardHeaderLine} />
          </View>

          <View style={styles.cardBody}>
            <View style={styles.cardInfo}>
              <Text style={styles.userName}>{username}</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                  </View>
                  <Text style={styles.statText}>{completedTasks} tâches accomplies</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                  </View>
                  <Text style={styles.statText}>{capturedPokemon} Pokémon capturés</Text>
                </View>
              </View>
            </View>

            <View style={styles.avatarContainer}>
              <View style={styles.avatarFrame}>
                <Image
                  source={require('@/assets/images/character_profile.png')}
                  style={styles.avatarImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  trainerCardWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 16,
    marginBottom: 24,
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
});