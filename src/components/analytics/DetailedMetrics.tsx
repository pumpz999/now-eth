import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'deployment';
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  address: string;
}

interface DetailedMetricsProps {
  transactions: Transaction[];
}

export function DetailedMetrics({ transactions }: DetailedMetricsProps) {
  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Activity size={20} />
        Recent Transactions
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tx.type === 'purchase' ? (
                      <ArrowUpRight className="text-green-500" size={16} />
                    ) : (
                      <ArrowDownRight className="text-red-500" size={16} />
                    )}
                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                  </Box>
                </TableCell>
                <TableCell>{tx.amount} ETH</TableCell>
                <TableCell>
                  <Chip
                    label={tx.status}
                    size="small"
                    color={
                      tx.status === 'completed'
                        ? 'success'
                        : tx.status === 'pending'
                        ? 'warning'
                        : 'error'
                    }
                  />
                </TableCell>
                <TableCell>{tx.timestamp}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {tx.address.slice(0, 6)}...{tx.address.slice(-4)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
