import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase/client';

// Mock data for analytics (would be replaced with real data from backend)
const MOCK_ANALYTICS = {
    salesThisWeek: 4250,
    salesLastWeek: 3800,
    ordersThisWeek: 18,
    ordersLastWeek: 15,
    viewsToday: 124,
    activeProducts: 8,
};

// Sample product data (would be fetched from database)
const MOCK_RECENT_ORDERS = [
    {
        id: 'ord-001',
        customer_name: 'Amina Diallo',
        total_amount: 1250,
        status: 'pending',
        created_at: '2023-05-15T14:30:00Z',
        items: 3,
    },
    {
        id: 'ord-002',
        customer_name: 'Ibrahim Toure',
        total_amount: 750,
        status: 'paid',
        created_at: '2023-05-14T11:20:00Z',
        items: 1,
    },
    {
        id: 'ord-003',
        customer_name: 'Fatima Kamara',
        total_amount: 2200,
        status: 'delivered',
        created_at: '2023-05-13T16:45:00Z',
        items: 4,
    },
];

export default function MerchantDashboardScreen() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const { isDark } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [storeData, setStoreData] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);

    const screenWidth = Dimensions.get('window').width;

    // Fetch store data and products
    const fetchData = async () => {
        if (!user?.storeId) {
            return;
        }

        try {
            // Fetch store information
            const { data: store, error: storeError } = await supabase
                .from('stores')
                .select('*')
                .eq('id', user.storeId)
                .single();

            if (storeError) throw storeError;
            setStoreData(store);

            // Fetch products
            const { data: productData, error: productError } = await supabase
                .from('products')
                .select('*')
                .eq('store_id', user.storeId)
                .order('created_at', { ascending: false });

            if (productError) throw productError;
            setProducts(productData || []);

            // In a real app, fetch real orders
            // For now, use mock data with slight delay to simulate loading
            setTimeout(() => {
                setRecentOrders(MOCK_RECENT_ORDERS);
                setIsLoading(false);
                setRefreshing(false);
            }, 1000);

        } catch (error) {
            console.error('Error fetching merchant data:', error);
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
                <ActivityIndicator size="large" color="#FF5722" />
            </View>
        );
    }

    // Format currency (would be adjusted based on local currency)
    const formatCurrency = (amount: number) => {
        return `₵${amount.toLocaleString()}`;
    };

    // Color for status badges
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#FFC107';
            case 'paid': return '#4CAF50';
            case 'processing': return '#2196F3';
            case 'shipped': return '#9C27B0';
            case 'delivered': return '#4CAF50';
            case 'cancelled': return '#F44336';
            default: return '#757575';
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    // Calculate growth percentage
    const calculateGrowth = (current: number, previous: number) => {
        if (previous === 0) return 100;
        return ((current - previous) / previous) * 100;
    };

    const salesGrowth = calculateGrowth(MOCK_ANALYTICS.salesThisWeek, MOCK_ANALYTICS.salesLastWeek);
    const ordersGrowth = calculateGrowth(MOCK_ANALYTICS.ordersThisWeek, MOCK_ANALYTICS.ordersLastWeek);

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <StatusBar style={isDark ? 'light' : 'dark'} />

            {/* Store header */}
            <View style={styles.storeHeader}>
                {storeData?.logo_url ? (
                    <Image
                        source={{ uri: storeData.logo_url }}
                        style={styles.storeLogo}
                    />
                ) : (
                    <View style={[styles.storeLogoPlaceholder, { backgroundColor: isDark ? '#333333' : '#DDDDDD' }]}>
                        <Ionicons name="storefront" size={28} color={isDark ? '#BBBBBB' : '#666666'} />
                    </View>
                )}

                <View style={styles.storeInfo}>
                    <Text style={[styles.storeName, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                        {storeData?.name || 'My Store'}
                    </Text>
                    <Text style={[styles.storeCategory, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                        {storeData?.category || 'General'}
                    </Text>
                </View>
            </View>

            {/* Action buttons */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: isDark ? '#333333' : '#FFFFFF' }]}
                    onPress={() => router.push('/merchant/products')}
                >
                    <Ionicons name="pricetags-outline" size={24} color="#FF5722" />
                    <Text style={[styles.actionButtonText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                        Products
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: isDark ? '#333333' : '#FFFFFF' }]}
                    onPress={() => router.push('/merchant/orders')}
                >
                    <Ionicons name="receipt-outline" size={24} color="#4CAF50" />
                    <Text style={[styles.actionButtonText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                        Orders
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: isDark ? '#333333' : '#FFFFFF' }]}
                    onPress={() => router.push('/merchant/settings')}
                >
                    <Ionicons name="settings-outline" size={24} color="#2196F3" />
                    <Text style={[styles.actionButtonText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                        Settings
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Analytics cards */}
            <View style={styles.analyticsContainer}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    Analytics Overview
                </Text>

                <View style={styles.analyticsRow}>
                    <View style={[styles.analyticsCard, { backgroundColor: isDark ? '#333333' : '#FFFFFF' }]}>
                        <Text style={[styles.analyticsValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                            {formatCurrency(MOCK_ANALYTICS.salesThisWeek)}
                        </Text>
                        <Text style={[styles.analyticsLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                            Sales this week
                        </Text>
                        <View style={[
                            styles.growthIndicator,
                            { backgroundColor: salesGrowth >= 0 ? '#E6F7ED' : '#FDEDED' }
                        ]}>
                            <Ionicons
                                name={salesGrowth >= 0 ? "arrow-up" : "arrow-down"}
                                size={14}
                                color={salesGrowth >= 0 ? '#4CAF50' : '#F44336'}
                            />
                            <Text style={[
                                styles.growthText,
                                { color: salesGrowth >= 0 ? '#4CAF50' : '#F44336' }
                            ]}>
                                {Math.abs(salesGrowth).toFixed(1)}%
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.analyticsCard, { backgroundColor: isDark ? '#333333' : '#FFFFFF' }]}>
                        <Text style={[styles.analyticsValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                            {MOCK_ANALYTICS.ordersThisWeek}
                        </Text>
                        <Text style={[styles.analyticsLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                            Orders this week
                        </Text>
                        <View style={[
                            styles.growthIndicator,
                            { backgroundColor: ordersGrowth >= 0 ? '#E6F7ED' : '#FDEDED' }
                        ]}>
                            <Ionicons
                                name={ordersGrowth >= 0 ? "arrow-up" : "arrow-down"}
                                size={14}
                                color={ordersGrowth >= 0 ? '#4CAF50' : '#F44336'}
                            />
                            <Text style={[
                                styles.growthText,
                                { color: ordersGrowth >= 0 ? '#4CAF50' : '#F44336' }
                            ]}>
                                {Math.abs(ordersGrowth).toFixed(1)}%
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.analyticsRow}>
                    <View style={[styles.analyticsCard, { backgroundColor: isDark ? '#333333' : '#FFFFFF' }]}>
                        <Text style={[styles.analyticsValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                            {MOCK_ANALYTICS.viewsToday}
                        </Text>
                        <Text style={[styles.analyticsLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                            Store views today
                        </Text>
                    </View>

                    <View style={[styles.analyticsCard, { backgroundColor: isDark ? '#333333' : '#FFFFFF' }]}>
                        <Text style={[styles.analyticsValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                            {MOCK_ANALYTICS.activeProducts}
                        </Text>
                        <Text style={[styles.analyticsLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                            Active products
                        </Text>
                    </View>
                </View>
            </View>

            {/* Recent orders */}
            <View style={styles.ordersContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                        Recent Orders
                    </Text>
                    <TouchableOpacity onPress={() => router.push('/merchant/orders')}>
                        <Text style={[styles.viewAllText, { color: '#FF5722' }]}>View All</Text>
                    </TouchableOpacity>
                </View>

                {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                        <TouchableOpacity
                            key={order.id}
                            style={[styles.orderCard, { backgroundColor: isDark ? '#333333' : '#FFFFFF' }]}
                            onPress={() => router.push(`/merchant/orders/${order.id}`)}
                        >
                            <View style={styles.orderHeader}>
                                <Text style={[styles.orderNumber, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                                    #{order.id.slice(-4)}
                                </Text>
                                <View style={[
                                    styles.statusBadge,
                                    { backgroundColor: getStatusColor(order.status) }
                                ]}>
                                    <Text style={styles.statusText}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.orderDetails}>
                                <View>
                                    <Text style={[styles.customerName, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                                        {order.customer_name}
                                    </Text>
                                    <Text style={[styles.orderMeta, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                                        {order.items} {order.items === 1 ? 'item' : 'items'} · {formatDate(order.created_at)}
                                    </Text>
                                </View>
                                <Text style={[styles.orderAmount, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                                    {formatCurrency(order.total_amount)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={[styles.emptyStateContainer, { backgroundColor: isDark ? '#333333' : '#FFFFFF' }]}>
                        <Ionicons name="receipt-outline" size={48} color={isDark ? '#555555' : '#CCCCCC'} />
                        <Text style={[styles.emptyStateText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                            No orders yet
                        </Text>
                    </View>
                )}
            </View>

            {/* Add product button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push('/merchant/products/new')}
            >
                <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    storeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 30,
    },
    storeLogo: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    storeLogoPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    storeInfo: {
        marginLeft: 15,
    },
    storeName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    storeCategory: {
        fontSize: 14,
    },
    actionButtons: {
        flexDirection: 'row',
        padding: 20,
        paddingTop: 0,
        justifyContent: 'space-between',
    },
    actionButton: {
        width: '30%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionButtonText: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '500',
    },
    analyticsContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    analyticsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    analyticsCard: {
        width: '48%',
        padding: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    analyticsValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    analyticsLabel: {
        fontSize: 12,
        marginBottom: 5,
    },
    growthIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    growthText: {
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 2,
    },
    ordersContainer: {
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '500',
    },
    orderCard: {
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    orderNumber: {
        fontWeight: '500',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
    },
    orderDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    customerName: {
        fontWeight: '500',
        marginBottom: 4,
    },
    orderMeta: {
        fontSize: 12,
    },
    orderAmount: {
        fontWeight: 'bold',
    },
    emptyStateContainer: {
        padding: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyStateText: {
        marginTop: 10,
        fontSize: 14,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FF5722',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
}); 