import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';

type Language = 'en' | 'fr';

interface LanguageContextType {
    language: Language;
    changeLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    // Change language function
    const changeLanguage = (lang: Language) => {
        i18n.changeLanguage(lang);
        setLanguage(lang);
    };

    // Effect to initialize language from storage or device settings
    useEffect(() => {
        // Here you could load the saved language preference from storage
        // For now we just use the default set in i18n
        setLanguage(i18n.language as Language);
    }, []);

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
} 