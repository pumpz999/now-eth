import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  useTheme,
} from '@mui/material';
import { Sun, Moon, Wallet } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectWallet } from '../../store/slices/walletSlice';
import { useTheme as useAppTheme } from '../../theme/ThemeProvider';
import NetworkStatus from '../shared/NetworkStatus';

export default function Navbar() {
  const wallet = useSelector(selectWallet);
  const { mode, toggleMode } = useAppTheme();
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <NetworkStatus />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={toggleMode} size="large">
            {mode === 'dark' ? <Sun /> : <Moon />}
          </IconButton>
          {wallet.isConnected ? (
            <Button
              variant="outlined"
              startIcon={<Wallet />}
              sx={{ textTransform: 'none' }}
            >
              {`${wallet.address?.slice(0, 6)}...${wallet.address?.slice(-4)}`}
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<Wallet />}
              sx={{ textTransform: 'none' }}
            >
              Connect Wallet
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
