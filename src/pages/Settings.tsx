import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Alert,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Avatar,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectWallet } from '../store/slices/walletSlice';
import { Camera, Key, Shield, Bell, Palette, DollarSign } from 'lucide-react';

export default function Settings() {
  const wallet = useSelector(selectWallet);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [colorScheme, setColorScheme] = React.useState('default');
  const [feeRate, setFeeRate] = React.useState('2.5');
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);

  const handleSaveGeneral = () => {
    // Implement save functionality
  };

  const handleUpdateFeeRate = async () => {
    if (!wallet.isConnected) {
      return;
    }
    // Implement fee rate update
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Camera size={20} />
              Profile Settings
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar
                sx={{ width: 80, height: 80 }}
                alt="Profile Picture"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80"
              />
              <Box>
                <Button variant="outlined" size="small" startIcon={<Camera />}>
                  Change Photo
                </Button>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Display Name"
                  defaultValue="John Doe"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  defaultValue="john@example.com"
                  type="email"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Shield size={20} />
              Security Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Two-Factor Authentication"
                  secondary="Add an extra layer of security to your account"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Change Password"
                  secondary="Update your account password"
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end">
                    <Key size={20} />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Bell size={20} />
              Notification Settings
            </Typography>
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                }
                label="Email Notifications"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                Receive notifications about purchases, sales, and important updates
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                  />
                }
                label="Push Notifications"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                Receive real-time notifications in your browser
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Theme Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Palette size={20} />
              Theme Settings
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Color Scheme</InputLabel>
              <Select
                value={colorScheme}
                label="Color Scheme"
                onChange={(e) => setColorScheme(e.target.value)}
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="blue">Blue</MenuItem>
                <MenuItem value="green">Green</MenuItem>
                <MenuItem value="purple">Purple</MenuItem>
                <MenuItem value="orange">Orange</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Platform Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DollarSign size={20} />
              Platform Settings
            </Typography>
            {wallet.isConnected ? (
              <>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Fee Rate (%)"
                    type="number"
                    value={feeRate}
                    onChange={(e) => setFeeRate(e.target.value)}
                    inputProps={{ min: 0, max: 10, step: 0.1 }}
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Current fee rate: 2.5%
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleUpdateFeeRate}
                    color="primary"
                  >
                    Update Fee Rate
                  </Button>
                </Box>
              </>
            ) : (
              <Alert severity="warning">
                Please connect your wallet to access platform settings
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
