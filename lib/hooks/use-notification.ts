import { useState } from 'react';
import { NotificationType } from '@/components/ui/notification';

type NotificationState = {
  visible: boolean;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
};

const defaultState: NotificationState = {
  visible: false,
  type: 'info',
  title: '',
  message: '',
  duration: 3000,
};

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState>(defaultState);

  const showNotification = (options: Omit<NotificationState, 'visible'>) => {
    setNotification({
      visible: true,
      ...options,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  const notificationProps = {
    ...notification,
    onDismiss: hideNotification,
  };

  return {
    notification: notificationProps,
    showNotification,
    hideNotification,
    // Convenience methods
    success: (title: string, message?: string, duration?: number) => 
      showNotification({ type: 'success', title, message, duration }),
    error: (title: string, message?: string, duration?: number) => 
      showNotification({ type: 'error', title, message, duration }),
    info: (title: string, message?: string, duration?: number) => 
      showNotification({ type: 'info', title, message, duration }),
    warning: (title: string, message?: string, duration?: number) => 
      showNotification({ type: 'warning', title, message, duration }),
  };
} 