import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import {PokemonType} from "@/models/enums/PokemonType";
import {TYPE_COLORS} from "@/models/enums/PokemonTypeColors";

export interface PokedexCardProps {
  name: string;
  spriteUrl: string;
  types: PokemonType[];
  amountCaught: number;
  cardSize: number;
}

export default function PokedexCard({ name, spriteUrl, types, amountCaught, cardSize }: PokedexCardProps) {
  const hasCaught = amountCaught > 0;

  const baseColors = (() => {
    if (!hasCaught) return ['#131313', '#575757'];
    if (types.length === 1) {
      const c = TYPE_COLORS[types[0]] || '#888';
      return [c, c];
    }
    const c1 = TYPE_COLORS[types[0]] || '#888';
    const c2 = TYPE_COLORS[types[1]] || c1;
    return [c1, c2];
  })();

  const gradientColors = hasCaught && baseColors[0] !== baseColors[1]
    ? [baseColors[0], baseColors[0], baseColors[1], baseColors[1]]
    : baseColors;

  return (
    <View style={[styles.container, { width: cardSize }]}> 
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={[styles.card, { height: cardSize }]}
      >
        <View style={styles.spriteWrapper}>
          <View style={[
            styles.spriteBackdrop,
            { backgroundColor: hasCaught ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0)' }
          ]} />

          <Image
            source={{ uri: spriteUrl }}
            style={{
              ...styles.sprite,
              tintColor: hasCaught ? undefined : 'black'
            }}
            resizeMode="contain"
          />
        </View>

        {hasCaught && (
            <View style={styles.nameBadge}>
              <Text style={styles.nameText}>{name}</Text>
            </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 12,
    flex: 1,
    maxWidth: '30%',
  },
  card: {
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    aspectRatio: 1,
  },
  spriteWrapper: {
    width: '82%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  spriteBackdrop: {
    position: 'absolute',
    width: '88%',
    height: '88%',
    borderRadius: 14,
  },
  sprite: {
    width: '100%',
    height: '100%',
  },
  nameBadge: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
});


