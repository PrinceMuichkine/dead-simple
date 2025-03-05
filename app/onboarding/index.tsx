import React, { useState, useRef } from 'react';
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
    Animated,
    Dimensions,
    Keyboard
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { supabase } from '../../lib/supabase/client';

const { width } = Dimensions.get('window');

// Schema for user onboarding
const userSchema = z.object({
    // Step 1
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Please enter a valid email'),

    // Step 2
    userType: z.enum(['merchant', 'customer']),
    interests: z.array(z.string()).optional(),

    // Step 3 - Merchant specific
    storeName: z.string().min(1, 'Store name is required').optional(),
    storeCategory: z.string().min(1, 'Store category is required').optional(),

    // Step 4 - Merchant specific
    storeDescription: z.string().optional(),
    location: z.string().optional(),
});

type UserData = z.infer<typeof userSchema>;

const categories = [
    'Fashion',
    'Electronics',
    'Beauty',
    'Food',
    'Home',
    'Sports',
    'Books',
    'Other'
];

const interests = [
    'Fashion',
    'Electronics',
    'Beauty',
    'Food',
    'Home',
    'Sports',
    'Books',
    'Deals',
    'Local Products'
];

export default function OnboardingScreen() {
    const router = useRouter();
    const { updateUserData, user } = useAuth();
    const { isDark } = useTheme();
    const [step, setStep] = useState(1);
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const { control, handleSubmit, watch, formState: { errors }, setValue } = useForm<UserData>({
        defaultValues: {
            fullName: '',
            email: '',
            userType: user?.userType as 'merchant' | 'customer' || 'customer',
            interests: [],
            storeName: '',
            storeCategory: '',
            storeDescription: '',
            location: '',
        }
    });

    const userType = watch('userType');

    const totalSteps = userType === 'merchant' ? 4 : 2;

    const handleNext = () => {
        Keyboard.dismiss();

        if (step < totalSteps) {
            scrollViewRef.current?.scrollTo({
                x: width * step,
                animated: true,
            });
            setStep(step + 1);
        } else {
            handleSubmit(onSubmit)();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            scrollViewRef.current?.scrollTo({
                x: width * (step - 2),
                animated: true,
            });
            setStep(step - 1);
        } else {
            router.back();
        }
    };

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev => {
            const updated = prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest];

            setValue('interests', updated);
            return updated;
        });
    };

    const onSubmit = async (data: UserData) => {
        setIsLoading(true);

        try {
            // Update user profile in Supabase
            await updateUserData({
                // Convert the form data to match the AuthUser type
                userType: data.userType,
                // Other fields will need to be updated via the Supabase API directly
            });

            // Also update the profile in Supabase
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user?.id,
                    full_name: data.fullName,
                    email: data.email,
                    user_type: data.userType,
                    preferences: data.interests,
                    store_name: data.storeName,
                    store_category: data.storeCategory,
                    store_description: data.storeDescription,
                    location: data.location,
                });

            if (error) throw error;

            // Redirect based on user type
            if (data.userType === 'merchant') {
                router.replace('/merchant/dashboard');
            } else {
                router.replace('/browse');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            // Show error to user
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={isDark ? '#FFFFFF' : '#333333'}
                    />
                </TouchableOpacity>

                <View style={styles.progressContainer}>
                    {Array.from({ length: totalSteps }).map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.progressDot,
                                index < step ?
                                    { backgroundColor: '#FF9500' } :
                                    { backgroundColor: isDark ? '#444444' : '#DDDDDD' }
                            ]}
                        />
                    ))}
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                >
                    {/* Step 1: Basic Information */}
                    <View style={styles.slide}>
                        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                            Let's get to know you
                        </Text>

                        <Text style={[styles.label, { color: isDark ? '#DDDDDD' : '#555555' }]}>
                            Full Name
                        </Text>
                        <Controller
                            control={control}
                            rules={{ required: true }}
                            name="fullName"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                                            color: isDark ? '#FFFFFF' : '#333333',
                                            borderColor: errors.fullName ? '#FF3B30' : isDark ? '#333333' : '#DDDDDD'
                                        }
                                    ]}
                                    placeholder="Enter your full name"
                                    placeholderTextColor={isDark ? '#777777' : '#999999'}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />
                        {errors.fullName && (
                            <Text style={styles.errorText}>{errors.fullName.message}</Text>
                        )}

                        <Text style={[styles.label, { color: isDark ? '#DDDDDD' : '#555555', marginTop: 20 }]}>
                            Email Address
                        </Text>
                        <Controller
                            control={control}
                            rules={{ required: true }}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                                            color: isDark ? '#FFFFFF' : '#333333',
                                            borderColor: errors.email ? '#FF3B30' : isDark ? '#333333' : '#DDDDDD'
                                        }
                                    ]}
                                    placeholder="Enter your email"
                                    placeholderTextColor={isDark ? '#777777' : '#999999'}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            )}
                        />
                        {errors.email && (
                            <Text style={styles.errorText}>{errors.email.message}</Text>
                        )}
                    </View>

                    {/* Step 2: User Type and Interests */}
                    <View style={styles.slide}>
                        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                            How will you use JUMBO?
                        </Text>

                        <View style={styles.userTypeContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.userTypeButton,
                                    {
                                        backgroundColor: userType === 'customer' ? '#FF9500' : isDark ? '#1E1E1E' : '#FFFFFF',
                                        borderColor: isDark ? '#333333' : '#DDDDDD'
                                    }
                                ]}
                                onPress={() => setValue('userType', 'customer')}
                            >
                                <Ionicons
                                    name="cart-outline"
                                    size={24}
                                    color={userType === 'customer' ? '#FFFFFF' : (isDark ? '#DDDDDD' : '#555555')}
                                />
                                <Text style={[
                                    styles.userTypeText,
                                    {
                                        color: userType === 'customer' ?
                                            '#FFFFFF' : (isDark ? '#DDDDDD' : '#555555')
                                    }
                                ]}>
                                    I want to shop
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.userTypeButton,
                                    {
                                        backgroundColor: userType === 'merchant' ? '#FF9500' : isDark ? '#1E1E1E' : '#FFFFFF',
                                        borderColor: isDark ? '#333333' : '#DDDDDD'
                                    }
                                ]}
                                onPress={() => setValue('userType', 'merchant')}
                            >
                                <Ionicons
                                    name="storefront-outline"
                                    size={24}
                                    color={userType === 'merchant' ? '#FFFFFF' : (isDark ? '#DDDDDD' : '#555555')}
                                />
                                <Text style={[
                                    styles.userTypeText,
                                    {
                                        color: userType === 'merchant' ?
                                            '#FFFFFF' : (isDark ? '#DDDDDD' : '#555555')
                                    }
                                ]}>
                                    I want to sell
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.label, { color: isDark ? '#DDDDDD' : '#555555', marginTop: 20 }]}>
                            What are you interested in?
                        </Text>

                        <View style={styles.interestsContainer}>
                            {interests.map(interest => (
                                <TouchableOpacity
                                    key={interest}
                                    style={[
                                        styles.interestChip,
                                        {
                                            backgroundColor: selectedInterests.includes(interest) ?
                                                '#FF9500' : isDark ? '#1E1E1E' : '#FFFFFF',
                                            borderColor: isDark ? '#333333' : '#DDDDDD'
                                        }
                                    ]}
                                    onPress={() => toggleInterest(interest)}
                                >
                                    <Text style={[
                                        styles.interestText,
                                        {
                                            color: selectedInterests.includes(interest) ?
                                                '#FFFFFF' : (isDark ? '#DDDDDD' : '#555555')
                                        }
                                    ]}>
                                        {interest}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Step 3: Store Information (Merchant only) */}
                    <View style={styles.slide}>
                        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                            Let's set up your store
                        </Text>

                        <Text style={[styles.label, { color: isDark ? '#DDDDDD' : '#555555' }]}>
                            Store Name
                        </Text>
                        <Controller
                            control={control}
                            rules={{ required: userType === 'merchant' }}
                            name="storeName"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                                            color: isDark ? '#FFFFFF' : '#333333',
                                            borderColor: errors.storeName ? '#FF3B30' : isDark ? '#333333' : '#DDDDDD'
                                        }
                                    ]}
                                    placeholder="Enter your store name"
                                    placeholderTextColor={isDark ? '#777777' : '#999999'}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />
                        {errors.storeName && (
                            <Text style={styles.errorText}>{errors.storeName.message}</Text>
                        )}

                        <Text style={[styles.label, { color: isDark ? '#DDDDDD' : '#555555', marginTop: 20 }]}>
                            Store Category
                        </Text>

                        <View style={styles.categoriesContainer}>
                            {categories.map(category => (
                                <TouchableOpacity
                                    key={category}
                                    style={[
                                        styles.categoryChip,
                                        {
                                            backgroundColor: watch('storeCategory') === category ?
                                                '#FF9500' : isDark ? '#1E1E1E' : '#FFFFFF',
                                            borderColor: isDark ? '#333333' : '#DDDDDD'
                                        }
                                    ]}
                                    onPress={() => setValue('storeCategory', category)}
                                >
                                    <Text style={[
                                        styles.categoryText,
                                        {
                                            color: watch('storeCategory') === category ?
                                                '#FFFFFF' : (isDark ? '#DDDDDD' : '#555555')
                                        }
                                    ]}>
                                        {category}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Step 4: Additional Store Info (Merchant only) */}
                    <View style={styles.slide}>
                        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                            Tell customers about your store
                        </Text>

                        <Text style={[styles.label, { color: isDark ? '#DDDDDD' : '#555555' }]}>
                            Store Description
                        </Text>
                        <Controller
                            control={control}
                            name="storeDescription"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[
                                        styles.textArea,
                                        {
                                            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                                            color: isDark ? '#FFFFFF' : '#333333',
                                            borderColor: isDark ? '#333333' : '#DDDDDD'
                                        }
                                    ]}
                                    placeholder="Describe what you sell and what makes your store unique"
                                    placeholderTextColor={isDark ? '#777777' : '#999999'}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            )}
                        />

                        <Text style={[styles.label, { color: isDark ? '#DDDDDD' : '#555555', marginTop: 20 }]}>
                            Store Location
                        </Text>
                        <Controller
                            control={control}
                            name="location"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                                            color: isDark ? '#FFFFFF' : '#333333',
                                            borderColor: isDark ? '#333333' : '#DDDDDD'
                                        }
                                    ]}
                                    placeholder="Enter your store location"
                                    placeholderTextColor={isDark ? '#777777' : '#999999'}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />

                        <Text style={[styles.note, { color: isDark ? '#999999' : '#666666' }]}>
                            You can add more details to your store profile later.
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.actionContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: '#FF9500' },
                        isLoading && { opacity: 0.7 }
                    ]}
                    onPress={handleNext}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={styles.buttonText}>
                            {step < totalSteps ? 'Continue' : 'Complete'}
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => router.replace(userType === 'merchant' ? '/merchant/dashboard' : '/browse')}
                >
                    <Text style={[styles.skipText, { color: isDark ? '#999999' : '#666666' }]}>
                        Complete later
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backButton: {
        padding: 8,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        marginRight: 40,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    keyboardView: {
        flex: 1,
    },
    slide: {
        width,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        height: 120,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        marginTop: 5,
    },
    userTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    userTypeButton: {
        width: '48%',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    userTypeText: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    interestChip: {
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        margin: 5,
        borderWidth: 1,
    },
    interestText: {
        fontSize: 14,
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    categoryChip: {
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        margin: 5,
        borderWidth: 1,
    },
    categoryText: {
        fontSize: 14,
    },
    actionContainer: {
        padding: 20,
    },
    button: {
        borderRadius: 10,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    skipButton: {
        alignItems: 'center',
        marginTop: 15,
        padding: 10,
    },
    skipText: {
        fontSize: 14,
    },
    note: {
        fontSize: 14,
        marginTop: 20,
        fontStyle: 'italic',
    },
}); 