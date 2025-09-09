import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrainerCard from '@/components/user/TrainerCard';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const menuItems = [
    {
      id: 'account',
      title: 'Compte',
      subtitle: 'Gérer vos informations personnelles',
      icon: 'person-circle-outline',
      color: '#4A90E2',
    },
    {
      id: 'achievements',
      title: 'Succès',
      subtitle: 'Voir vos succès débloqués',
      icon: 'trophy-outline',
      color: '#FFD700',
    },
    {
      id: 'statistics',
      title: 'Statistiques',
      subtitle: 'Voir vos performances détaillées',
      icon: 'analytics-outline',
      color: '#4CAF50',
    },
    {
      id: 'settings',
      title: 'Paramètres',
      subtitle: 'Personnaliser votre expérience',
      icon: 'settings-outline',
      color: '#9C27B0',
    },
    {
      id: 'help',
      title: 'Aide & Support',
      subtitle: 'Besoin d\'aide ?',
      icon: 'help-circle-outline',
      color: '#FF9800',
    },
    {
      id: 'about',
      title: 'À propos',
      subtitle: 'Version 1.0.0',
      icon: 'information-circle-outline',
      color: '#607D8B',
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const handleEditProfile = () => {
    // TODO: Implémenter l'édition du profil
    console.log('Édition du profil');
  };

  const renderMenuItem = (item : any) => (
      <TouchableOpacity key={item.id} style={styles.menuItem}>
        <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon} size={24} color="#FFFFFF" />
        </View>
        <View style={styles.menuContent}>
          <Text style={styles.menuTitle}>{item.title}</Text>
          <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      </TouchableOpacity>
  );

  return (
      <View style={styles.container}>
        {/* Background avec gradient rouge diagonal (haut gauche vers bas droite) */}
        <LinearGradient
            colors={['#FF6B6B', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.50 }}
            locations={[0, 0.80]}
            style={styles.background}
        />

        <SafeAreaView style={styles.safeArea}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <TrainerCard
                  username={user?.username || 'Dresseur'}
                  completedTasks={user?.completedTasksCount || 0}
                  capturedPokemon={user?.pokemonsCount || 0}
                  showEditButton={true}
                  onEditPress={handleEditProfile}
              />

              <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <Ionicons name="pencil" size={20} color="black" />
              </TouchableOpacity>
            </View>

            {/* Paramètres rapides */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Paramètres rapides</Text>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="notifications-outline" size={24} color="#4A90E2" />
                  <Text style={styles.settingTitle}>Notifications</Text>
                </View>
                <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: '#E0E0E0', true: '#4A90E2' }}
                    thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="moon-outline" size={24} color="#9C27B0" />
                  <Text style={styles.settingTitle}>Mode sombre</Text>
                </View>
                <Switch
                    value={darkModeEnabled}
                    onValueChange={setDarkModeEnabled}
                    trackColor={{ false: '#E0E0E0', true: '#9C27B0' }}
                    thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* Menu principal */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Menu principal</Text>
              {menuItems.map(renderMenuItem)}
            </View>

            {/* Bouton de déconnexion */}
            <View style={styles.logoutContainer}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                <Text style={styles.logoutText}>Se déconnecter</Text>
              </TouchableOpacity>
            </View>

            {/* Espace en bas */}
            <View style={{ height: 20 }} />
          </ScrollView>
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
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: 30,
    right: 30,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FF3B30',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
});