import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  AnalyticsChart,
  MetricsGrid,
  DetailedMetrics,
  PlatformMetrics,
} from '../components/analytics';

// Mock data - replace with real data from your API/blockchain
const salesData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
  value: Math.floor(Math.random() * 100) + 50,
}));

const revenueData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
  value: Math.floor(Math.random() * 10000) + 5000,
}));

const metrics = [
  {
    title: 'Total Revenue',
    value: '$125,430',
    change: 12.5,
    changeLabel: 'vs last month',
  },
  {
    title: 'Active Users',
    value: '1,234',
    change: 8.2,
    changeLabel: 'vs last month',
  },
  {
    title: 'Templates Sold',
    value: '89',
    change: -2.4,
    changeLabel: 'vs last month',
  },
  {
    title: 'Average Price',
    value: '0.5 ETH',
    change: 5.7,
    changeLabel: 'vs last month',
  },
];

const mockTransactions = [
  {
    id: '1',
    type: 'purchase' as const,
    amount: '0.5',
    status: 'completed' as const,
    timestamp: '2024-02-20 14:30',
    address: '0x1234567890abcdef1234567890abcdef12345678',
  },
  {
    id: '2',
    type: 'sale' as const,
    amount: '1.2',
    status: 'completed' as const,
    timestamp: '2024-02-20 13:15',
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
  },
  {
    id: '3',
    type: 'deployment' as const,
    amount: '0.05',
    status: 'pending' as const,
    timestamp: '2024-02-20 12:45',
    address: '0x7890abcdef1234567890abcdef1234567890abcd',
  },
];

const templateStats = {
  data: [
    { name: 'DeFi', value: 35, color: '#3b82f6' },
    { name: 'NFT', value: 25, color: '#10b981' },
    { name: 'DAO', value: 20, color: '#8b5cf6' },
    { name: 'Gaming', value: 15, color: '#f59e0b' },
    { name: 'Other', value: 5, color: '#6b7280' },
  ],
};

const platformMetrics = {
  userStats: {
    total: 5234,
    active: 1234,
    new: 342,
  },
  templateStats,
  revenueStats: {
    daily: 2345,
    weekly: 15678,
    monthly: 64532,
  },
};

export default function Analytics() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Analytics Dashboard
      </Typography>

      <MetricsGrid metrics={metrics} />
      
      <PlatformMetrics {...platformMetrics} />

      <Box sx={{ mt: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <AnalyticsChart
            title="Daily Sales"
            data={salesData}
            dataKey="value"
            gradient={{ from: '#3b82f6', to: '#93c5fd' }}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <AnalyticsChart
            title="Revenue (USD)"
            data={revenueData}
            dataKey="value"
            gradient={{ from: '#10b981', to: '#6ee7b7' }}
          />
        </Box>
      </Box>

      <DetailedMetrics transactions={mockTransactions} />
    </Box>
  );
}
