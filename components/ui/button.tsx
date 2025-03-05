import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { COLORS } from "@/lib/styles/globalStyles";

// Define button variants that match the style norms
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link";

// Define button sizes
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  // Get styles based on variant
  const getVariantStyle = (): {
    container: ViewStyle;
    text: TextStyle;
  } => {
    switch (variant) {
      case "primary":
        return {
          container: {
            backgroundColor: COLORS.primary,
            borderWidth: 1,
            borderColor: COLORS.primary,
          },
          text: {
            color: COLORS.white,
          },
        };
      case "secondary":
        return {
          container: {
            backgroundColor: COLORS.warning,
            borderWidth: 1,
            borderColor: COLORS.warning,
          },
          text: {
            color: COLORS.black,
          },
        };
      case "outline":
        return {
          container: {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: COLORS.primary,
          },
          text: {
            color: COLORS.primary,
          },
        };
      case "ghost":
        return {
          container: {
            backgroundColor: "transparent",
            borderWidth: 0,
          },
          text: {
            color: COLORS.primary,
          },
        };
      case "destructive":
        return {
          container: {
            backgroundColor: COLORS.danger,
            borderWidth: 1,
            borderColor: COLORS.danger,
          },
          text: {
            color: COLORS.white,
          },
        };
      case "link":
        return {
          container: {
            backgroundColor: "transparent",
            borderWidth: 0,
            paddingVertical: 0,
            paddingHorizontal: 0,
          },
          text: {
            color: COLORS.primary,
            textDecorationLine: "underline",
          },
        };
      default:
        return {
          container: {
            backgroundColor: COLORS.primary,
            borderWidth: 1,
            borderColor: COLORS.primary,
          },
          text: {
            color: COLORS.white,
          },
        };
    }
  };

  // Get styles based on size
  const getSizeStyle = (): {
    container: ViewStyle;
    text: TextStyle;
  } => {
    switch (size) {
      case "sm":
        return {
          container: {
            paddingVertical: 10,
            paddingHorizontal: 15,
          },
          text: {
            fontSize: 14,
          },
        };
      case "lg":
        return {
          container: {
            paddingVertical: 18,
            paddingHorizontal: 24,
          },
          text: {
            fontSize: 18,
          },
        };
      case "md":
      default:
        return {
          container: {
            paddingVertical: 15, // Following your style guidelines
            paddingHorizontal: 20,
          },
          text: {
            fontSize: 16, // Following your style guidelines
          },
        };
    }
  };

  const variantStyle = getVariantStyle();
  const sizeStyle = getSizeStyle();

  const disabledStyle: ViewStyle = disabled
    ? {
      opacity: 0.5,
    }
    : {};

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyle.container,
        sizeStyle.container,
        disabledStyle,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variantStyle.text.color as string}
          size="small"
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === "left" && (
            <View style={styles.leftIcon}>{icon}</View>
          )}

          <Text
            style={[
              styles.text,
              variantStyle.text,
              sizeStyle.text,
              textStyle,
            ]}
          >
            {children}
          </Text>

          {icon && iconPosition === "right" && (
            <View style={styles.rightIcon}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6, // Following your style guidelines
    minWidth: 80,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600", // Following your style guidelines
    textAlign: "center",
  },
  leftIcon: {
    marginRight: 10, // Following your style guidelines
  },
  rightIcon: {
    marginLeft: 10, // Following your style guidelines
  },
});