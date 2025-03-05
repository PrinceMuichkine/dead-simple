import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { supabase } from '@/lib/supabase/client';
import { STORE_CATEGORIES } from '@/lib/data/onboarding';

type FormData = {
    storeName: string;
    category: string;
    location: string;
    mobileMoneyAccount: string;
};

export default function MerchantOnboardingScreen() {
    const router = useRouter();
    const { user, updateUserData } = useAuth();
    const { isDark } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [logoImage, setLogoImage] = useState<string | null>(null);
    const [logoUploading, setLogoUploading] = useState(false);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
        defaultValues: {
            storeName: '',
            category: '',
            location: '',
            mobileMoneyAccount: '',
        }
    });

    const watchCategory = watch('category');

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission Required', 'We need permission to access your photo library to upload a store logo.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                setLogoUploading(true);

                try {
                    const img = result.assets[0];

                    // Upload to Supabase Storage
                    const fileExt = img.uri.split('.').pop();
                    const fileName = `${Date.now()}.${fileExt}`;
                    const filePath = `store_logos/${fileName}`;

                    // Convert image to Blob
                    const response = await fetch(img.uri);
                    const blob = await response.blob();

                    // Upload to Supabase
                    const { error } = await supabase.storage
                        .from('store_assets')
                        .upload(filePath, blob);

                    if (error) {
                        throw error;
                    }

                    // Get public URL
                    const { data } = supabase.storage
                        .from('store_assets')
                        .getPublicUrl(filePath);

                    setLogoImage(data.publicUrl);
                } catch (error) {
                    console.error('Error uploading image:', error);
                    Alert.alert('Upload Failed', 'Failed to upload your image. Please try again.');
                } finally {
                    setLogoUploading(false);
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'An error occurred while selecting the image.');
            setLogoUploading(false);
        }
    };

    const getLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission Required', 'We need location permission to help customers find your store.');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setCoordinates({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            // Get readable address from coordinates
            const [address] = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (address) {
                const formattedAddress = [
                    address.street,
                    address.district,
                    address.city,
                    address.region,
                    address.country
                ].filter(Boolean).join(', ');

                setValue('location', formattedAddress);
            }
        } catch (error) {
            console.error('Error getting location:', error);
            Alert.alert('Location Error', 'Failed to get your current location. Please enter it manually.');
        }
    };

    const createStore = async (data: FormData) => {
        if (!user) {
            Alert.alert('Error', 'You must be logged in to create a store.');
            return;
        }

        setIsLoading(true);

        try {
            // Create store in database
            const { data: store, error } = await supabase
                .from('stores')
                .insert({
                    name: data.storeName,
                    owner_id: user.id,
                    category: data.category,
                    location: data.location,
                    coordinates: coordinates,
                    logo_url: logoImage,
                    mobile_money_account: data.mobileMoneyAccount,
                })
                .select()
                .single();

            if (error) throw error;

            // Update user profile with store_id
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ store_id: store.id })
                .eq('id', user.id);

            if (profileError) throw profileError;

            // Update local user data
            updateUserData({ storeId: store.id });

            // Navigate to dashboard
            router.replace('/merchant/dashboard');

        } catch (error) {
            console.error('Error creating store:', error);
            Alert.alert('Error', 'Failed to create your store. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                Basic Store Information
            </Text>

            <View style={styles.logoContainer}>
                <TouchableOpacity
                    style={[
                        styles.logoPickerButton,
                        { backgroundColor: isDark ? '#333333' : '#EEEEEE' }
                    ]}
                    onPress={pickImage}
                    disabled={logoUploading}
                >
                    {logoUploading ? (
                        <ActivityIndicator size="small" color="#FF5722" />
                    ) : logoImage ? (
                        <Image source={{ uri: logoImage }} style={styles.logoImage} />
                    ) : (
                        <>
                            <Ionicons name="image-outline" size={40} color={isDark ? '#BBBBBB' : '#666666'} />
                            <Text style={[styles.logoText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                                Upload Logo
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: isDark ? '#BBBBBB' : '#555555' }]}>
                Store Name*
            </Text>
            <Controller
                control={control}
                rules={{
                    required: 'Store name is required',
                    minLength: {
                        value: 3,
                        message: 'Store name must be at least 3 characters'
                    }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: isDark ? '#333333' : '#FFFFFF',
                                color: isDark ? '#FFFFFF' : '#000000',
                                borderColor: errors.storeName ? '#FF3B30' : isDark ? '#555555' : '#DDDDDD'
                            }
                        ]}
                        placeholder="Enter your store name"
                        placeholderTextColor={isDark ? '#777777' : '#999999'}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="storeName"
            />
            {errors.storeName && (
                <Text style={styles.errorText}>{errors.storeName.message}</Text>
            )}

            <Text style={[styles.inputLabel, { color: isDark ? '#BBBBBB' : '#555555' }]}>
                Store Category*
            </Text>
            <TouchableOpacity
                style={[
                    styles.input,
                    styles.pickerButton,
                    {
                        backgroundColor: isDark ? '#333333' : '#FFFFFF',
                        borderColor: errors.category ? '#FF3B30' : isDark ? '#555555' : '#DDDDDD'
                    }
                ]}
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            >
                <Text
                    style={{
                        color: watchCategory ? (isDark ? '#FFFFFF' : '#000000') : (isDark ? '#777777' : '#999999')
                    }}
                >
                    {watchCategory || 'Select store category'}
                </Text>
                <Ionicons
                    name={showCategoryPicker ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={isDark ? '#BBBBBB' : '#666666'}
                />
            </TouchableOpacity>
            {errors.category && (
                <Text style={styles.errorText}>{errors.category.message}</Text>
            )}

            {showCategoryPicker && (
                <View style={[
                    styles.categoryPicker,
                    { backgroundColor: isDark ? '#333333' : '#FFFFFF' }
                ]}>
                    <ScrollView style={styles.categoryList}>
                        {STORE_CATEGORIES.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.categoryItem,
                                    {
                                        backgroundColor:
                                            watchCategory === category
                                                ? (isDark ? '#555555' : '#F0F0F0')
                                                : 'transparent'
                                    }
                                ]}
                                onPress={() => {
                                    setValue('category', category);
                                    setShowCategoryPicker(false);
                                }}
                            >
                                <Text style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: '#FF5722',
                        opacity: !watch('storeName') || !watch('category') ? 0.7 : 1
                    }
                ]}
                onPress={() => {
                    if (watch('storeName') && watch('category')) {
                        setCurrentStep(2);
                    } else {
                        Alert.alert('Missing Information', 'Please fill in all required fields.');
                    }
                }}
                disabled={!watch('storeName') || !watch('category')}
            >
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                Location & Payment
            </Text>

            <Text style={[styles.inputLabel, { color: isDark ? '#BBBBBB' : '#555555' }]}>
                Store Location*
            </Text>
            <View style={styles.locationContainer}>
                <Controller
                    control={control}
                    rules={{
                        required: 'Store location is required',
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[
                                styles.input,
                                styles.locationInput,
                                {
                                    backgroundColor: isDark ? '#333333' : '#FFFFFF',
                                    color: isDark ? '#FFFFFF' : '#000000',
                                    borderColor: errors.location ? '#FF3B30' : isDark ? '#555555' : '#DDDDDD'
                                }
                            ]}
                            placeholder="Enter store location"
                            placeholderTextColor={isDark ? '#777777' : '#999999'}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="location"
                />
                <TouchableOpacity
                    style={[
                        styles.locationButton,
                        { backgroundColor: isDark ? '#555555' : '#EEEEEE' }
                    ]}
                    onPress={getLocation}
                >
                    <Ionicons
                        name="locate-outline"
                        size={24}
                        color={isDark ? '#FFFFFF' : '#000000'}
                    />
                </TouchableOpacity>
            </View>
            {errors.location && (
                <Text style={styles.errorText}>{errors.location.message}</Text>
            )}

            <Text style={[styles.inputLabel, { color: isDark ? '#BBBBBB' : '#555555' }]}>
                Mobile Money Account*
            </Text>
            <Controller
                control={control}
                rules={{
                    required: 'Mobile money account is required',
                    pattern: {
                        value: /^[0-9+\s]+$/,
                        message: 'Please enter a valid mobile money number'
                    }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: isDark ? '#333333' : '#FFFFFF',
                                color: isDark ? '#FFFFFF' : '#000000',
                                borderColor: errors.mobileMoneyAccount ? '#FF3B30' : isDark ? '#555555' : '#DDDDDD'
                            }
                        ]}
                        placeholder="Enter mobile money number"
                        placeholderTextColor={isDark ? '#777777' : '#999999'}
                        keyboardType="phone-pad"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="mobileMoneyAccount"
            />
            {errors.mobileMoneyAccount && (
                <Text style={styles.errorText}>{errors.mobileMoneyAccount.message}</Text>
            )}

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.backButton,
                        {
                            backgroundColor: isDark ? '#333333' : '#EEEEEE',
                        }
                    ]}
                    onPress={() => setCurrentStep(1)}
                >
                    <Text style={[styles.buttonText, { color: isDark ? '#FFFFFF' : '#000000' }]}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.createButton,
                        {
                            backgroundColor: '#FF5722',
                            opacity: isLoading ? 0.7 : 1
                        }
                    ]}
                    onPress={handleSubmit(createStore)}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={styles.buttonText}>Create Store</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    { backgroundColor: isDark ? '#121212' : '#F5F5F5' }
                ]}
            >
                <StatusBar style={isDark ? 'light' : 'dark'} />

                <View style={styles.progressContainer}>
                    <View style={[
                        styles.progressStep,
                        { backgroundColor: '#FF5722' }
                    ]}>
                        <Text style={styles.progressStepText}>1</Text>
                    </View>
                    <View style={[
                        styles.progressLine,
                        { backgroundColor: currentStep > 1 ? '#FF5722' : isDark ? '#555555' : '#DDDDDD' }
                    ]} />
                    <View style={[
                        styles.progressStep,
                        { backgroundColor: currentStep > 1 ? '#FF5722' : isDark ? '#555555' : '#DDDDDD' }
                    ]}>
                        <Text style={styles.progressStepText}>2</Text>
                    </View>
                </View>

                {currentStep === 1 ? renderStep1() : renderStep2()}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 30,
    },
    progressStep: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressStepText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    progressLine: {
        height: 2,
        width: 60,
    },
    stepContainer: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoPickerButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    logoText: {
        marginTop: 10,
        fontSize: 14,
    },
    inputLabel: {
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    categoryPicker: {
        marginTop: -10,
        marginBottom: 15,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        maxHeight: 200,
    },
    categoryList: {
        paddingVertical: 5,
    },
    categoryItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationInput: {
        flex: 1,
        marginRight: 10,
    },
    locationButton: {
        width: 50,
        height: 50,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        marginTop: -10,
        marginBottom: 15,
    },
    button: {
        height: 50,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    backButton: {
        flex: 1,
        marginRight: 10,
    },
    createButton: {
        flex: 2,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
}); 