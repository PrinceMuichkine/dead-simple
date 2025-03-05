import { StyleSheet } from 'react-native';

// App color palette
export const COLORS = {
  primary: '#2298FC',    // Blue
  success: '#2A9032',    // Green
  danger: '#FB2E38',     // Red
  warning: '#FEC01F',    // Yellow/Orange
  white: '#FFFFFF',
  black: '#000000',
  gray: '#888888',
  lightGray: '#DDDDDD',
  darkOverlay: 'rgba(0, 0, 0, 0.7)',
  transparentOverlay: 'rgba(0, 0, 0, 0.5)',
};

// Common styles shared across the app
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    borderRadius: 6, // Changed from 10 to 6 to match style guide
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,  // As requested, all buttons will have 6px borders
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  successButton: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  dangerButton: {
    backgroundColor: COLORS.danger,
    borderColor: COLORS.danger,
  },
  warningButton: {
    backgroundColor: COLORS.warning,
    borderColor: COLORS.warning,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: COLORS.white,
  },
  transparentButton: {
    backgroundColor: 'transparent',
    borderWidth: 0, // No border
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  outlineButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  transparentButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 15,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 6, // Changed from 10 to 6 to match style guide
    marginBottom: 15,
    borderWidth: 6,
  },
  socialButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6, // Changed from 10 to 6 to match style guide
    color: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  shadow: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
}); 