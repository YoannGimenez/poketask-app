import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'react-native';

export default function AppLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#ff6f6f',
                tabBarInactiveTintColor: '#8E8E93',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#E5E5EA',
                    paddingBottom: Math.max(insets.bottom, 5),
                    paddingTop: 5,
                    height: 60 + insets.bottom,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="bag"
                options={{
                    title: 'Sac',
                    tabBarIcon: ({ color, size }) => (
                        <Image
                            source={require('@/assets/images/tab_bag.png')}
                            style={{
                                width: size * 1.75,
                                height: size * 1.75,
                            }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="pokedex"
                options={{
                    title: 'Pokédex',
                    tabBarIcon: ({ color, size }) => (
                        <Image
                            source={require('@/assets/images/tab_pokedex.png')}
                            style={{
                                width: size * 1.4,
                                height: size * 1.4,
                            }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Accueil',
                    tabBarIcon: ({ focused, size }) => (
                        <Image
                            source={require('@/assets/images/tab_home.png')}
                            style={{
                                width: size * 1.2,
                                height: size * 1.2,
                            }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="tasks"
                options={{
                    title: 'Tâches',
                    tabBarIcon: ({ color, size }) => (
                        <Image
                            source={require('@/assets/images/tab_task.png')}
                            style={{
                                width: size * 1.4,
                                height: size * 1.4,
                            }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color, size }) => (
                        <Image
                            source={require('@/assets/images/tab_profile.png')}
                            style={{
                                width: size * 1.2,
                                height: size * 1.2,
                            }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />

        </Tabs>
    );
}
