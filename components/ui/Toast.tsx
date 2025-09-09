import React, {useLayoutEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type ToastType = 'success' | 'warning' | 'error' | 'flee';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  imageUrl?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastData;
  index: number;
  onDismiss: (id: string) => void;
}

export default function Toast({ toast, index, onDismiss }: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const TOAST_HEIGHT = 80;
  const TOAST_MARGIN = 8;
  const TOP_OFFSET = 60;

  const topPosition = TOP_OFFSET + (index * (TOAST_HEIGHT + TOAST_MARGIN));

  useLayoutEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      dismissToast();
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, []);

  const dismissToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(toast.id);
    });
  };

  const getToastColors = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          background: '#4CAF50',
          border: '#45A049',
          icon: '#FFFFFF',
          text: '#FFFFFF',
        };
      case 'warning':
        return {
          background: '#FF9800',
          border: '#F57C00',
          icon: '#FFFFFF',
          text: '#FFFFFF',
        };
      case 'error':
        return {
          background: '#FF6B6B',
          border: '#ff4e40',
          icon: '#FFFFFF',
          text: '#FFFFFF',
        };
      case 'flee':
        return {
          background: '#dac06f',
          border: '#e1bd47',
          icon: '#FFFFFF',
          text: '#FFFFFF',
        };
    }
  };

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'close-circle';
      case "flee":
        return 'walk';
    }
  };

  const colors = getToastColors(toast.type);
  const iconName = getToastIcon(toast.type);

  return (
      <Animated.View
          style={[
            styles.container,
            {
              top: topPosition,
              transform: [{ translateY }],
              opacity,
              backgroundColor: colors.background,
              borderColor: colors.border,
              zIndex: 1000 - index,
            },
          ]}
      >
        <TouchableOpacity
            style={styles.content}
            onPress={dismissToast}
            activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={24} color={colors.icon} />
          </View>

          {toast.imageUrl && (
              <View style={styles.imageContainer}>
                <Image
                    source={{ uri: toast.imageUrl }}
                    style={styles.image}
                    resizeMode="contain"
                />
              </View>
          )}

          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              {toast.title}
            </Text>
            {toast.message && (
                <Text style={[styles.message, { color: colors.text }]}>
                  {toast.message}
                </Text>
            )}
          </View>

          <TouchableOpacity
              style={styles.closeButton}
              onPress={dismissToast}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={20} color={colors.text} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 80,
  },
  iconContainer: {
    marginRight: 12,
  },
  imageContainer: {
    marginRight: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 32,
    height: 32,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    opacity: 0.9,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
});