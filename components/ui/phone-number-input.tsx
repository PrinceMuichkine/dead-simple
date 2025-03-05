import React, { useEffect, useState } from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Modal,
    FlatList,
    SafeAreaView,
    TextStyle
} from "react-native";
import { COLORS } from "@/lib/styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";

const { width } = Dimensions.get("window");

interface PhoneNumberInputProps {
    value: string;
    onChange: (value: string | undefined) => void;
}

// Define a type for country data
interface CountryData {
    code: string;
    name: string;
    dialCode: string;
}

// Full list of countries with their dial codes
const COUNTRIES: CountryData[] = [
    { code: "AF", name: "Afghanistan", dialCode: "93" },
    { code: "AL", name: "Albania", dialCode: "355" },
    { code: "DZ", name: "Algeria", dialCode: "213" },
    { code: "AS", name: "American Samoa", dialCode: "1684" },
    { code: "AD", name: "Andorra", dialCode: "376" },
    { code: "AO", name: "Angola", dialCode: "244" },
    { code: "AI", name: "Anguilla", dialCode: "1264" },
    { code: "AQ", name: "Antarctica", dialCode: "672" },
    { code: "AG", name: "Antigua and Barbuda", dialCode: "1268" },
    { code: "AR", name: "Argentina", dialCode: "54" },
    { code: "AM", name: "Armenia", dialCode: "374" },
    { code: "AW", name: "Aruba", dialCode: "297" },
    { code: "AU", name: "Australia", dialCode: "61" },
    { code: "AT", name: "Austria", dialCode: "43" },
    { code: "AZ", name: "Azerbaijan", dialCode: "994" },
    { code: "BS", name: "Bahamas", dialCode: "1242" },
    { code: "BH", name: "Bahrain", dialCode: "973" },
    { code: "BD", name: "Bangladesh", dialCode: "880" },
    { code: "BB", name: "Barbados", dialCode: "1246" },
    { code: "BY", name: "Belarus", dialCode: "375" },
    { code: "BE", name: "Belgium", dialCode: "32" },
    { code: "BZ", name: "Belize", dialCode: "501" },
    { code: "BJ", name: "Benin", dialCode: "229" },
    { code: "BM", name: "Bermuda", dialCode: "1441" },
    { code: "BT", name: "Bhutan", dialCode: "975" },
    { code: "BO", name: "Bolivia", dialCode: "591" },
    { code: "BA", name: "Bosnia and Herzegovina", dialCode: "387" },
    { code: "BW", name: "Botswana", dialCode: "267" },
    { code: "BR", name: "Brazil", dialCode: "55" },
    { code: "IO", name: "British Indian Ocean Territory", dialCode: "246" },
    { code: "VG", name: "British Virgin Islands", dialCode: "1284" },
    { code: "BN", name: "Brunei", dialCode: "673" },
    { code: "BG", name: "Bulgaria", dialCode: "359" },
    { code: "BF", name: "Burkina Faso", dialCode: "226" },
    { code: "BI", name: "Burundi", dialCode: "257" },
    { code: "KH", name: "Cambodia", dialCode: "855" },
    { code: "CM", name: "Cameroon", dialCode: "237" },
    { code: "CA", name: "Canada", dialCode: "1" },
    { code: "CV", name: "Cape Verde", dialCode: "238" },
    { code: "KY", name: "Cayman Islands", dialCode: "1345" },
    { code: "CF", name: "Central African Republic", dialCode: "236" },
    { code: "TD", name: "Chad", dialCode: "235" },
    { code: "CL", name: "Chile", dialCode: "56" },
    { code: "CN", name: "China", dialCode: "86" },
    { code: "CX", name: "Christmas Island", dialCode: "61" },
    { code: "CC", name: "Cocos Islands", dialCode: "61" },
    { code: "CO", name: "Colombia", dialCode: "57" },
    { code: "KM", name: "Comoros", dialCode: "269" },
    { code: "CK", name: "Cook Islands", dialCode: "682" },
    { code: "CR", name: "Costa Rica", dialCode: "506" },
    { code: "HR", name: "Croatia", dialCode: "385" },
    { code: "CU", name: "Cuba", dialCode: "53" },
    { code: "CW", name: "Curacao", dialCode: "599" },
    { code: "CY", name: "Cyprus", dialCode: "357" },
    { code: "CZ", name: "Czech Republic", dialCode: "420" },
    { code: "CD", name: "Democratic Republic of the Congo", dialCode: "243" },
    { code: "DK", name: "Denmark", dialCode: "45" },
    { code: "DJ", name: "Djibouti", dialCode: "253" },
    { code: "DM", name: "Dominica", dialCode: "1767" },
    { code: "DO", name: "Dominican Republic", dialCode: "1809" },
    { code: "TL", name: "East Timor", dialCode: "670" },
    { code: "EC", name: "Ecuador", dialCode: "593" },
    { code: "EG", name: "Egypt", dialCode: "20" },
    { code: "SV", name: "El Salvador", dialCode: "503" },
    { code: "GQ", name: "Equatorial Guinea", dialCode: "240" },
    { code: "ER", name: "Eritrea", dialCode: "291" },
    { code: "EE", name: "Estonia", dialCode: "372" },
    { code: "ET", name: "Ethiopia", dialCode: "251" },
    { code: "FK", name: "Falkland Islands", dialCode: "500" },
    { code: "FO", name: "Faroe Islands", dialCode: "298" },
    { code: "FJ", name: "Fiji", dialCode: "679" },
    { code: "FI", name: "Finland", dialCode: "358" },
    { code: "FR", name: "France", dialCode: "33" },
    { code: "PF", name: "French Polynesia", dialCode: "689" },
    { code: "GA", name: "Gabon", dialCode: "241" },
    { code: "GM", name: "Gambia", dialCode: "220" },
    { code: "GE", name: "Georgia", dialCode: "995" },
    { code: "DE", name: "Germany", dialCode: "49" },
    { code: "GH", name: "Ghana", dialCode: "233" },
    { code: "GI", name: "Gibraltar", dialCode: "350" },
    { code: "GR", name: "Greece", dialCode: "30" },
    { code: "GL", name: "Greenland", dialCode: "299" },
    { code: "GD", name: "Grenada", dialCode: "1473" },
    { code: "GU", name: "Guam", dialCode: "1671" },
    { code: "GT", name: "Guatemala", dialCode: "502" },
    { code: "GG", name: "Guernsey", dialCode: "44" },
    { code: "GN", name: "Guinea", dialCode: "224" },
    { code: "GW", name: "Guinea-Bissau", dialCode: "245" },
    { code: "GY", name: "Guyana", dialCode: "592" },
    { code: "HT", name: "Haiti", dialCode: "509" },
    { code: "HN", name: "Honduras", dialCode: "504" },
    { code: "HK", name: "Hong Kong", dialCode: "852" },
    { code: "HU", name: "Hungary", dialCode: "36" },
    { code: "IS", name: "Iceland", dialCode: "354" },
    { code: "IN", name: "India", dialCode: "91" },
    { code: "ID", name: "Indonesia", dialCode: "62" },
    { code: "IR", name: "Iran", dialCode: "98" },
    { code: "IQ", name: "Iraq", dialCode: "964" },
    { code: "IE", name: "Ireland", dialCode: "353" },
    { code: "IM", name: "Isle of Man", dialCode: "44" },
    { code: "IL", name: "Israel", dialCode: "972" },
    { code: "IT", name: "Italy", dialCode: "39" },
    { code: "CI", name: "Ivory Coast", dialCode: "225" },
    { code: "JM", name: "Jamaica", dialCode: "1876" },
    { code: "JP", name: "Japan", dialCode: "81" },
    { code: "JE", name: "Jersey", dialCode: "44" },
    { code: "JO", name: "Jordan", dialCode: "962" },
    { code: "KZ", name: "Kazakhstan", dialCode: "7" },
    { code: "KE", name: "Kenya", dialCode: "254" },
    { code: "KI", name: "Kiribati", dialCode: "686" },
    { code: "XK", name: "Kosovo", dialCode: "383" },
    { code: "KW", name: "Kuwait", dialCode: "965" },
    { code: "KG", name: "Kyrgyzstan", dialCode: "996" },
    { code: "LA", name: "Laos", dialCode: "856" },
    { code: "LV", name: "Latvia", dialCode: "371" },
    { code: "LB", name: "Lebanon", dialCode: "961" },
    { code: "LS", name: "Lesotho", dialCode: "266" },
    { code: "LR", name: "Liberia", dialCode: "231" },
    { code: "LY", name: "Libya", dialCode: "218" },
    { code: "LI", name: "Liechtenstein", dialCode: "423" },
    { code: "LT", name: "Lithuania", dialCode: "370" },
    { code: "LU", name: "Luxembourg", dialCode: "352" },
    { code: "MO", name: "Macau", dialCode: "853" },
    { code: "MK", name: "Macedonia", dialCode: "389" },
    { code: "MG", name: "Madagascar", dialCode: "261" },
    { code: "MW", name: "Malawi", dialCode: "265" },
    { code: "MY", name: "Malaysia", dialCode: "60" },
    { code: "MV", name: "Maldives", dialCode: "960" },
    { code: "ML", name: "Mali", dialCode: "223" },
    { code: "MT", name: "Malta", dialCode: "356" },
    { code: "MH", name: "Marshall Islands", dialCode: "692" },
    { code: "MR", name: "Mauritania", dialCode: "222" },
    { code: "MU", name: "Mauritius", dialCode: "230" },
    { code: "YT", name: "Mayotte", dialCode: "262" },
    { code: "MX", name: "Mexico", dialCode: "52" },
    { code: "FM", name: "Micronesia", dialCode: "691" },
    { code: "MD", name: "Moldova", dialCode: "373" },
    { code: "MC", name: "Monaco", dialCode: "377" },
    { code: "MN", name: "Mongolia", dialCode: "976" },
    { code: "ME", name: "Montenegro", dialCode: "382" },
    { code: "MS", name: "Montserrat", dialCode: "1664" },
    { code: "MA", name: "Morocco", dialCode: "212" },
    { code: "MZ", name: "Mozambique", dialCode: "258" },
    { code: "MM", name: "Myanmar", dialCode: "95" },
    { code: "NA", name: "Namibia", dialCode: "264" },
    { code: "NR", name: "Nauru", dialCode: "674" },
    { code: "NP", name: "Nepal", dialCode: "977" },
    { code: "NL", name: "Netherlands", dialCode: "31" },
    { code: "NC", name: "New Caledonia", dialCode: "687" },
    { code: "NZ", name: "New Zealand", dialCode: "64" },
    { code: "NI", name: "Nicaragua", dialCode: "505" },
    { code: "NE", name: "Niger", dialCode: "227" },
    { code: "NG", name: "Nigeria", dialCode: "234" },
    { code: "NU", name: "Niue", dialCode: "683" },
    { code: "KP", name: "North Korea", dialCode: "850" },
    { code: "MP", name: "Northern Mariana Islands", dialCode: "1670" },
    { code: "NO", name: "Norway", dialCode: "47" },
    { code: "OM", name: "Oman", dialCode: "968" },
    { code: "PK", name: "Pakistan", dialCode: "92" },
    { code: "PW", name: "Palau", dialCode: "680" },
    { code: "PS", name: "Palestine", dialCode: "970" },
    { code: "PA", name: "Panama", dialCode: "507" },
    { code: "PG", name: "Papua New Guinea", dialCode: "675" },
    { code: "PY", name: "Paraguay", dialCode: "595" },
    { code: "PE", name: "Peru", dialCode: "51" },
    { code: "PH", name: "Philippines", dialCode: "63" },
    { code: "PN", name: "Pitcairn", dialCode: "64" },
    { code: "PL", name: "Poland", dialCode: "48" },
    { code: "PT", name: "Portugal", dialCode: "351" },
    { code: "PR", name: "Puerto Rico", dialCode: "1787" },
    { code: "QA", name: "Qatar", dialCode: "974" },
    { code: "CG", name: "Republic of the Congo", dialCode: "242" },
    { code: "RE", name: "Reunion", dialCode: "262" },
    { code: "RO", name: "Romania", dialCode: "40" },
    { code: "RU", name: "Russia", dialCode: "7" },
    { code: "RW", name: "Rwanda", dialCode: "250" },
    { code: "BL", name: "Saint Barthelemy", dialCode: "590" },
    { code: "SH", name: "Saint Helena", dialCode: "290" },
    { code: "KN", name: "Saint Kitts and Nevis", dialCode: "1869" },
    { code: "LC", name: "Saint Lucia", dialCode: "1758" },
    { code: "MF", name: "Saint Martin", dialCode: "590" },
    { code: "PM", name: "Saint Pierre and Miquelon", dialCode: "508" },
    { code: "VC", name: "Saint Vincent and the Grenadines", dialCode: "1784" },
    { code: "WS", name: "Samoa", dialCode: "685" },
    { code: "SM", name: "San Marino", dialCode: "378" },
    { code: "ST", name: "Sao Tome and Principe", dialCode: "239" },
    { code: "SA", name: "Saudi Arabia", dialCode: "966" },
    { code: "SN", name: "Senegal", dialCode: "221" },
    { code: "RS", name: "Serbia", dialCode: "381" },
    { code: "SC", name: "Seychelles", dialCode: "248" },
    { code: "SL", name: "Sierra Leone", dialCode: "232" },
    { code: "SG", name: "Singapore", dialCode: "65" },
    { code: "SX", name: "Sint Maarten", dialCode: "1721" },
    { code: "SK", name: "Slovakia", dialCode: "421" },
    { code: "SI", name: "Slovenia", dialCode: "386" },
    { code: "SB", name: "Solomon Islands", dialCode: "677" },
    { code: "SO", name: "Somalia", dialCode: "252" },
    { code: "ZA", name: "South Africa", dialCode: "27" },
    { code: "KR", name: "South Korea", dialCode: "82" },
    { code: "SS", name: "South Sudan", dialCode: "211" },
    { code: "ES", name: "Spain", dialCode: "34" },
    { code: "LK", name: "Sri Lanka", dialCode: "94" },
    { code: "SD", name: "Sudan", dialCode: "249" },
    { code: "SR", name: "Suriname", dialCode: "597" },
    { code: "SJ", name: "Svalbard and Jan Mayen", dialCode: "47" },
    { code: "SZ", name: "Swaziland", dialCode: "268" },
    { code: "SE", name: "Sweden", dialCode: "46" },
    { code: "CH", name: "Switzerland", dialCode: "41" },
    { code: "SY", name: "Syria", dialCode: "963" },
    { code: "TW", name: "Taiwan", dialCode: "886" },
    { code: "TJ", name: "Tajikistan", dialCode: "992" },
    { code: "TZ", name: "Tanzania", dialCode: "255" },
    { code: "TH", name: "Thailand", dialCode: "66" },
    { code: "TG", name: "Togo", dialCode: "228" },
    { code: "TK", name: "Tokelau", dialCode: "690" },
    { code: "TO", name: "Tonga", dialCode: "676" },
    { code: "TT", name: "Trinidad and Tobago", dialCode: "1868" },
    { code: "TN", name: "Tunisia", dialCode: "216" },
    { code: "TR", name: "Turkey", dialCode: "90" },
    { code: "TM", name: "Turkmenistan", dialCode: "993" },
    { code: "TC", name: "Turks and Caicos Islands", dialCode: "1649" },
    { code: "TV", name: "Tuvalu", dialCode: "688" },
    { code: "VI", name: "U.S. Virgin Islands", dialCode: "1340" },
    { code: "UG", name: "Uganda", dialCode: "256" },
    { code: "UA", name: "Ukraine", dialCode: "380" },
    { code: "AE", name: "United Arab Emirates", dialCode: "971" },
    { code: "GB", name: "United Kingdom", dialCode: "44" },
    { code: "US", name: "United States", dialCode: "1" },
    { code: "UY", name: "Uruguay", dialCode: "598" },
    { code: "UZ", name: "Uzbekistan", dialCode: "998" },
    { code: "VU", name: "Vanuatu", dialCode: "678" },
    { code: "VA", name: "Vatican", dialCode: "379" },
    { code: "VE", name: "Venezuela", dialCode: "58" },
    { code: "VN", name: "Vietnam", dialCode: "84" },
    { code: "WF", name: "Wallis and Futuna", dialCode: "681" },
    { code: "EH", name: "Western Sahara", dialCode: "212" },
    { code: "YE", name: "Yemen", dialCode: "967" },
    { code: "ZM", name: "Zambia", dialCode: "260" },
    { code: "ZW", name: "Zimbabwe", dialCode: "263" }
];

export default function PhoneNumberInput({ value, onChange }: PhoneNumberInputProps) {
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
                    placeholder="Phone number"
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
                    <SafeAreaView style={[styles.modalContent, modalBgColor]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, textColor]}>Select Country</Text>
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
                                placeholder="Search countries..."
                                placeholderTextColor={isDark ? "#AAAAAA" : "#666666"}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
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
        width: width * 0.9,
        maxHeight: '80%',
        borderRadius: 6,
        overflow: 'hidden',
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
        padding: 15,
        borderBottomWidth: 1,
    },
    countryName: {
        fontSize: 16,
    },
    countryDialCode: {
        fontSize: 16,
    }
});
