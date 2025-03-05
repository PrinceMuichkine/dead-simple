import React, { useEffect, useState } from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
    SafeAreaView,
    TextStyle,
    useWindowDimensions
} from "react-native";
import { COLORS } from "@/lib/styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { CountryData, COUNTRIES } from "@/lib/data/onboarding";
import { useTranslation } from "react-i18next";

// Remove the fixed width and use the dynamic window dimensions
// const { width } = Dimensions.get("window");

interface PhoneNumberInputProps {
    value: string;
    onChange: (value: string | undefined) => void;
}

export default function PhoneNumberInput({ value, onChange }: PhoneNumberInputProps) {
    const { t } = useTranslation();
    // Use useWindowDimensions hook to dynamically get screen dimensions
    const { width, height } = useWindowDimensions();
    const [country, setCountry] = useState<CountryData>(COUNTRIES.find(c => c.code === "CI") || COUNTRIES[0]);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { isDark } = useTheme();

    useEffect(() => {
        // Get user's country using their IP
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                const foundCountry = COUNTRIES.find(c => c.code === data.country_code);
                if (foundCountry) {
                    setCountry(foundCountry);
                }
            })
            .catch(() => {
                // Fallback to default if geolocation fails
                console.log('Geolocation failed, using default country');
            });
    }, []);

    // Filter countries based on search query
    const filteredCountries = searchQuery
        ? COUNTRIES.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.dialCode.includes(searchQuery))
        : COUNTRIES;

    // Simple handler for phone number input
    const handlePhoneChange = (text: string) => {
        // Remove non-numeric characters
        const numericText = text.replace(/[^0-9]/g, '');
        onChange(numericText);
    };

    const selectCountry = (countryData: CountryData) => {
        setCountry(countryData);
        setModalVisible(false);
        setSearchQuery("");
    };

    // Dynamic styles based on theme
    const textColor: TextStyle = {
        color: isDark ? COLORS.white : COLORS.black,
    };

    const modalBgColor = isDark
        ? { backgroundColor: '#121212' }
        : { backgroundColor: '#f5f5f5' };

    const itemBorderColor = isDark
        ? { borderBottomColor: 'rgba(255, 255, 255, 0.1)' }
        : { borderBottomColor: 'rgba(0, 0, 0, 0.1)' };

    // Calculate responsive modal dimensions - more compact for mobile devices
    const isSmallDevice = width < 375; // iPhone SE and similar small phones
    const isTablet = width > 768;

    // More appropriate size calculations for different devices
    const modalWidth = isTablet
        ? Math.min(width * 0.5, 400) // Tablets: 50% of screen width up to 400px
        : isSmallDevice
            ? width * 0.85 // Small phones: 85% of screen width
            : width * 0.8;  // Regular phones: 80% of screen width

    const modalHeight = isTablet
        ? Math.min(height * 0.6, 500) // Tablets: 60% of screen height up to 500px
        : isSmallDevice
            ? height * 0.6 // Small phones: 60% of screen height
            : height * 0.65; // Regular phones: 65% of screen height

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity
                    style={[
                        styles.countryCode,
                        isDark
                            ? { backgroundColor: "rgba(255, 255, 255, 0.1)" }
                            : { backgroundColor: "rgba(0, 0, 0, 0.05)" }
                    ]}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={[styles.countryText, textColor]}>+{country.dialCode}</Text>
                    <Ionicons
                        name="chevron-down"
                        size={16}
                        color={isDark ? COLORS.white : COLORS.black}
                        style={styles.dropdownIcon}
                    />
                </TouchableOpacity>
                <TextInput
                    style={[
                        styles.input,
                        isDark
                            ? {
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                color: COLORS.white
                            }
                            : {
                                backgroundColor: "rgba(0, 0, 0, 0.05)",
                                color: COLORS.black
                            }
                    ]}
                    placeholder={t('phoneInput.placeholder')}
                    placeholderTextColor={isDark ? "#AAAAAA" : "#666666"}
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={handlePhoneChange}
                />
            </View>

            {/* Country Selection Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <SafeAreaView
                        style={[
                            styles.modalContent,
                            modalBgColor,
                            // Apply dynamic width and height
                            { width: modalWidth, maxHeight: modalHeight }
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, textColor]}>{t('phoneInput.selectCountry')}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                    setSearchQuery("");
                                }}
                                style={styles.closeButton}
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color={isDark ? COLORS.white : COLORS.black}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Search input */}
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={[
                                    styles.searchInput,
                                    isDark
                                        ? { backgroundColor: "rgba(255, 255, 255, 0.1)", color: COLORS.white }
                                        : { backgroundColor: "rgba(0, 0, 0, 0.05)", color: COLORS.black }
                                ]}
                                placeholder={t('phoneInput.searchCountries')}
                                placeholderTextColor={isDark ? "#AAAAAA" : "#666666"}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoCapitalize="none"
                            />
                        </View>

                        <FlatList
                            data={filteredCountries}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.countryItem, itemBorderColor]}
                                    onPress={() => selectCountry(item)}
                                >
                                    <Text style={[styles.countryName, textColor]}>{item.name}</Text>
                                    <Text style={[styles.countryDialCode, textColor]}>+{item.dialCode}</Text>
                                </TouchableOpacity>
                            )}
                            style={styles.countryList}
                            initialNumToRender={15}
                            maxToRenderPerBatch={10}
                            windowSize={7}
                            removeClippedSubviews={true}
                        />
                    </SafeAreaView>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        marginBottom: 0,
        height: 50,
    },
    countryCode: {
        paddingHorizontal: 10,
        height: 50,
        borderRadius: 6,
        marginRight: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        minWidth: 80,
    },
    countryText: {
        fontWeight: "600",
        fontSize: 16,
    },
    dropdownIcon: {
        marginLeft: 5,
    },
    input: {
        flex: 1,
        paddingHorizontal: 15,
        height: 50,
        borderRadius: 6,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: 6,
        overflow: 'hidden',
        // Width and height will be dynamically set
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    closeButton: {
        padding: 5,
    },
    searchContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    searchInput: {
        height: 40,
        borderRadius: 6,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    countryList: {
        flex: 1,
    },
    countryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12, // Reduced from 15 to 12
        borderBottomWidth: 1,
    },
    countryName: {
        fontSize: 15, // Reduced from 16 to 15
        flex: 1,
    },
    countryDialCode: {
        fontSize: 15, // Reduced from 16 to 15
        marginLeft: 10,
    }
});
