import { Stack } from 'expo-router';

export default function RoutesLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: false,
        animation: 'none',
        presentation: 'modal',
      }}
    >
      <Stack.Screen 
        name="encounter" 
        options={{
          gestureEnabled: false,
          animation: 'none',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
