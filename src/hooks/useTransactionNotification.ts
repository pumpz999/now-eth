import { useState, useCallback } from 'react';

export function useTransactionNotification() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');

  const showNotification = useCallback((
    newStatus: 'pending' | 'success' | 'error',
    newMessage: string
  ) => {
    setStatus(newStatus);
    setMessage(newMessage);
    setOpen(true);
  }, []);

  const hideNotification = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    open,
    status,
    message,
    showNotification,
    hideNotification,
  };
}
