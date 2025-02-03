import { Box, Chip, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectWallet } from '../../store/slices/walletSlice';
import { Globe } from 'lucide-react';

const networks: Record<number, { name: string; color: string }> = {
  1: { name: 'Ethereum', color: '#627EEA' },
  137: { name: 'Polygon', color: '#8247E5' },
  56: { name: 'BSC', color: '#F3BA2F' },
};

export default function NetworkStatus() {
  const { chainId, isConnected } = useSelector(selectWallet);

  if (!isConnected) {
    return null;
  }

  const network = chainId ? networks[chainId] : null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Globe size={16} />
      <Chip
        label={network?.name || 'Unknown Network'}
        size="small"
        sx={{
          backgroundColor: network?.color || '#666',
          color: 'white',
          fontWeight: 500,
        }}
      />
    </Box>
  );
}
