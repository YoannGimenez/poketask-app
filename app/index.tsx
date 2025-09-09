import { useAuth } from '@/contexts/AuthContext';
import { ActivityIndicator, Text, View } from 'react-native';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' }}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ color: '#fff', fontSize: 16, marginTop: 16, fontFamily: 'SpaceMono' }}>
          Vérification de l'authentification...
        </Text>
      </View>
    );
  }

  return null;
}
