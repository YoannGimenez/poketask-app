import { router } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
        <View style={styles.content}>
          {/* Logo/Titre */}
          <View style={styles.logoContainer}>
            <Text style={styles.title}>PokéTask</Text>
            <Text style={styles.subtitle}>Transformez vos tâches en aventure Pokémon !</Text>
          </View>

          {/* Illustration remplacée par le logo */}
          <View style={styles.illustrationContainer}>
            <Image
                source={require('@/assets/images/tab_task.png')}
                style={styles.logoImage}
                resizeMode="contain"
            />
          </View>

          {/* Boutons d'action */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={[styles.primaryButton]}
                onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.primaryButtonText}>Se connecter</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.textLink}>S'inscrire</Text>
            </TouchableOpacity>

            {/*<TouchableOpacity*/}
            {/*    style={[styles.googleButton]}*/}
            {/*    onPress={() => console.log('Google login')}*/}
            {/*>*/}
            {/*  <Text style={styles.googleButtonText}>*/}
            {/*    Continuer avec Google*/}
            {/*  </Text>*/}
            {/*</TouchableOpacity>*/}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              En continuant, vous acceptez nos conditions d'utilisation
            </Text>
          </View>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#212121',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#606770',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.8,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 180,
    height: 180,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 20,
  },
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  textLink: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B6B',
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#212121',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#8A8F98',
    textAlign: 'center',
    lineHeight: 16,
  },
});
