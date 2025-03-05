import React, { createContext, useContext, ReactNode } from 'react';
import Notification from '@/components/ui/notification';
import { useNotification } from '@/lib/hooks/use-notification';

type NotificationContextType = ReturnType<typeof useNotification>;

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const notification = useNotification();

    return (
        <NotificationContext.Provider value={notification}>
            {children}
            <Notification {...notification.notification} />
        </NotificationContext.Provider>
    );
}

export function useNotificationContext() {
    const context = useContext(NotificationContext);

    if (context === undefined) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }

    return context;
} 