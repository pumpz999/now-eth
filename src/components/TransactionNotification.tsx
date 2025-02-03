import React from 'react';
import { Snackbar, Alert, CircularProgress, Box } from '@mui/material';
import { CheckCircle, XCircle } from 'lucide-react';

interface TransactionNotificationProps {
  open: boolean;
  status: 'pending' | 'success' | 'error';
  message: string;
  onClose: () => void;
}

export function TransactionNotification({
  open,
  status,
  message,
  onClose,
}: TransactionNotificationProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={status === 'pending' ? null : 6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        severity={
          status === 'pending' ? 'info' :
          status === 'success' ? 'success' :
          'error'
        }
        icon={
          status === 'pending' ? <CircularProgress size={20} /> :
          status === 'success' ? <CheckCircle size={20} /> :
          <XCircle size={20} />
        }
        onClose={onClose}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {message}
        </Box>
      </Alert>
    </Snackbar>
  );
}
