import React from "react";
import { View, Image, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { COLORS } from "@/lib/styles/globalStyles";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: number;
  fallback?: string;
  style?: StyleProp<ViewStyle>;
}

function getInitials(name: string): string {
  if (!name) return '';

  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

// Generate a consistent color based on the name string
function getColorForName(name: string): string {
  if (!name) return COLORS.primary;

  const colors = [
    '#2298FC', // primary
    '#2A9032', // success
    '#FB2E38', // danger
    '#FEC01F', // warning
    '#9C27B0', // purple
    '#FF9800', // orange
    '#795548', // brown
    '#607D8B', // blue grey
  ];

  // Use string to generate a consistent index
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export function Avatar({
  src,
  alt = '',
  size = 40,
  fallback,
  style,
}: AvatarProps) {
  const initials = fallback || getInitials(alt);
  const backgroundColor = getColorForName(alt);

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    >
      {src ? (
        <Image
          source={{ uri: src }}
          style={styles.image}
          accessibilityLabel={alt}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              backgroundColor,
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          <Text style={styles.fallbackText}>{initials}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

// For backward compatibility
Avatar.Image = function AvatarImage({ src, alt = '' }: { src: string, alt?: string }) {
  return <Image source={{ uri: src }} style={styles.image} accessibilityLabel={alt} />;
};

Avatar.Fallback = function AvatarFallback({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.fallback}>
      <Text style={styles.fallbackText}>{children}</Text>
    </View>
  );
};
