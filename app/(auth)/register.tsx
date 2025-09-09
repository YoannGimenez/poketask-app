import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { router } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RegisterData, registerSchema } from "@/schema/validationSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterScreen() {
  const { register } = useAuth();
  const { showSuccess, showError } = useToast();

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: RegisterData) => {
    const result = await register(data.username, data.email, data.password);
    if (result.success) {
      showSuccess('Inscription réussie', 'Bienvenue dans votre aventure Pokémon !');
    } else if (result.error) {
      showError('Erreur d\'inscription', result.error.message);
    }
  };

  return (
      <View style={styles.container}>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
        >
          <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                  <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Créer un compte</Text>
                <View style={styles.placeholder} />
              </View>

              {/* Formulaire */}
              <View style={styles.formContainer}>
                {/* Nom d'utilisateur */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Nom d'utilisateur</Text>
                  <Controller
                      control={control}
                      name="username"
                      render={({ field: { onChange, value, onBlur } }) => (
                          <>
                            <TextInput
                                style={[styles.input, errors.username && styles.inputError]}
                                placeholder="Votre nom d'utilisateur"
                                placeholderTextColor="#9AA0A6"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {errors.username?.message && <Text style={styles.errorText}>{errors.username.message}</Text>}
                          </>
                      )}
                  />
                </View>

                {/* Email */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <Controller
                      control={control}
                      name="email"
                      render={({ field: { onChange, value, onBlur } }) => (
                          <>
                            <TextInput
                                style={[styles.input, errors.email && styles.inputError]}
                                placeholder="votre@email.com"
                                placeholderTextColor="#9AA0A6"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {errors.email?.message && <Text style={styles.errorText}>{errors.email.message}</Text>}
                          </>
                      )}
                  />
                </View>

                {/* Mot de passe */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Mot de passe</Text>
                  <Controller
                      control={control}
                      name="password"
                      render={({ field: { onChange, value, onBlur } }) => (
                          <>
                            <TextInput
                                style={[styles.input, errors.password && styles.inputError]}
                                placeholder="Votre mot de passe"
                                placeholderTextColor="#9AA0A6"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                secureTextEntry
                                autoCapitalize="none"
                            />
                            {errors.password?.message && <Text style={styles.errorText}>{errors.password.message}</Text>}
                          </>
                      )}
                  />
                </View>

                {/* Confirmation mot de passe */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirmer le mot de passe</Text>
                  <Controller
                      control={control}
                      name="confirmPassword"
                      render={({ field: { onChange, value, onBlur } }) => (
                          <>
                            <TextInput
                                style={[styles.input, errors.confirmPassword && styles.inputError]}
                                placeholder="Confirmez votre mot de passe"
                                placeholderTextColor="#9AA0A6"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                secureTextEntry
                                autoCapitalize="none"
                            />
                            {errors.confirmPassword?.message && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
                          </>
                      )}
                  />
                </View>

                <TouchableOpacity
                    style={[styles.registerButton, isSubmitting && styles.registerButtonDisabled]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                >
                  <Text style={styles.registerButtonText}>
                    {isSubmitting ? 'Création...' : 'Créer mon compte'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    Déjà un compte ?{' '}
                    <Text
                        style={styles.linkText}
                        onPress={() => router.replace('/(auth)/login')}
                    >
                      Se connecter
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#212121',
    fontWeight: '800',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#212121',
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
    flex: 1,
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F6F7F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  registerButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#606770',
    fontSize: 16,
  },
  linkText: {
    fontWeight: '800',
    textDecorationLine: 'underline',
    color: '#FF6B6B',
  },
});