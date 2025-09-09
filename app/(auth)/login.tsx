import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {LoginData, loginSchema} from "@/schema/validationSchema";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useToast} from "@/contexts/ToastContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const { showError, showSuccess } = useToast();

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: LoginData) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      showSuccess('Connexion réussie', 'Bienvenue dans votre aventure Pokémon !');
    } else if (result.error) {
      console.log(result)
      showError('Erreur de connexion', result.error.message);
    }
  };

  return (
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Connexion</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Formulaire */}
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.formWrapper}>
            <View style={styles.formContainer}>
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

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                  style={[styles.loginButton, (isSubmitting) && styles.loginButtonDisabled]}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
              >
                <Text style={styles.loginButtonText}>
                  {isSubmitting ? 'Connexion...' : 'Se connecter'}
                </Text>
              </TouchableOpacity>

              {/*<TouchableOpacity style={styles.googleButton} onPress={() => console.log('Google login')}>*/}
              {/*  <Text style={styles.googleButtonText}>Continuer avec Google</Text>*/}
              {/*</TouchableOpacity>*/}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Pas encore de compte ?{' '}
                  <Text style={styles.linkText} onPress={() => router.replace('/(auth)/register')}>
                    S'inscrire
                  </Text>
                </Text>
              </View>
            </View>
          </KeyboardAvoidingView>

          {/* Footer */}

        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    justifyContent: 'space-between'
  },
  formWrapper: {
    flex: 1,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#FF6B6B',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  loginButton: {
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
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  googleButtonText: {
    color: '#212121',
    fontSize: 16,
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
