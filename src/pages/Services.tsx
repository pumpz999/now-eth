import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectWallet } from '../store/slices/walletSlice';
import { Zap, DollarSign, Plus, Settings } from 'lucide-react';
import { ethers } from 'ethers';

interface Service {
  id: number;
  name: string;
  price: string;
  active: boolean;
}

export default function Services() {
  const theme = useTheme();
  const wallet = useSelector(selectWallet);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newServiceDialog, setNewServiceDialog] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '' });
  const [currentFee, setCurrentFee] = useState<string>('2.5');
  const [newFee, setNewFee] = useState<string>('2.5');
  const [feeDialog, setFeeDialog] = useState(false);

  const isAdmin = wallet.address === "YOUR_ADMIN_ADDRESS"; // Replace with actual admin address

  const handleCreateService = async () => {
    if (!wallet.isConnected) return;
    setLoading(true);
    try {
      // Contract interaction would go here
      setNewServiceDialog(false);
      setNewService({ name: '', price: '' });
    } catch (error) {
      setError('Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFee = async () => {
    if (!wallet.isConnected || !isAdmin) return;
    setLoading(true);
    try {
      // Contract interaction would go here
      setCurrentFee(newFee);
      setFeeDialog(false);
    } catch (error) {
      setError('Failed to update fee');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseService = async (service: Service) => {
    if (!wallet.isConnected) return;
    setLoading(true);
    try {
      // Contract interaction would go here
    } catch (error) {
      setError('Failed to purchase service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Platform Services</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isAdmin && (
            <>
              <Button
                variant="outlined"
                startIcon={<Settings />}
                onClick={() => setFeeDialog(true)}
              >
                Platform Fee: {currentFee}%
              </Button>
              <Button
                variant="contained"
                startIcon={<Plus />}
                onClick={() => setNewServiceDialog(true)}
              >
                New Service
              </Button>
            </>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}11, ${theme.palette.secondary.main}11)`,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Zap size={24} color={theme.palette.primary.main} />
                  <Typography variant="h6">{service.name}</Typography>
                </Box>
                <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>
                  <DollarSign size={20} />
                  {service.price} ETH
                </Typography>
                <Box sx={{ mt: 'auto' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handlePurchaseService(service)}
                    disabled={!wallet.isConnected || loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Purchase'}
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* New Service Dialog */}
      <Dialog open={newServiceDialog} onClose={() => setNewServiceDialog(false)}>
        <DialogTitle>Create New Service</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Service Name"
            fullWidth
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Price (ETH)"
            type="number"
            fullWidth
            value={newService.price}
            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewServiceDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateService} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fee Update Dialog */}
      <Dialog open={feeDialog} onClose={() => setFeeDialog(false)}>
        <DialogTitle>Update Platform Fee</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Fee Percentage"
            type="number"
            fullWidth
            value={newFee}
            onChange={(e) => setNewFee(e.target.value)}
            inputProps={{ min: 0, max: 10, step: 0.1 }}
            helperText="Fee must be between 0% and 10%"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeeDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateFee} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
