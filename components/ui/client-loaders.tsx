import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '@/lib/styles/globalStyles';

// Flag to detect if we're on the client side
const isClient = typeof window !== 'undefined';

// Simple client-side only wrapper for any component
export function ClientOnly({ children, fallback = null }: { children: React.ReactNode, fallback?: React.ReactNode }) {
    const [isClientSide, setIsClientSide] = React.useState(false);

    React.useEffect(() => {
        setIsClientSide(true);
    }, []);

    if (!isClientSide) {
        return fallback ? <>{fallback}</> : null;
    }

    return <>{children}</>;
}

// A simple loading indicator that works on both server and client
export function LoadingIndicator({ size = 40, color = COLORS.white }: { size?: number, color?: string }) {
    return (
        <View style={[styles.loadingIndicator, { width: size, height: size }]}>
            <View style={[styles.loadingDot, { backgroundColor: color }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    loadingIndicator: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    }
}); 