import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Users, FileCode, DollarSign } from 'lucide-react';

interface PlatformMetricsProps {
  userStats: {
    total: number;
    active: number;
    new: number;
  };
  templateStats: {
    data: Array<{
      name: string;
      value: number;
      color: string;
    }>;
  };
  revenueStats: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export function PlatformMetrics({
  userStats,
  templateStats,
  revenueStats,
}: PlatformMetricsProps) {
  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Users size={20} />
            <Typography variant="h6">User Statistics</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Users
              </Typography>
              <Typography variant="h4">{userStats.total}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Active Users
              </Typography>
              <Typography variant="h5">{userStats.active}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                New Users (30d)
              </Typography>
              <Typography variant="h5">{userStats.new}</Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FileCode size={20} />
            <Typography variant="h6">Template Distribution</Typography>
          </Box>
          <Box sx={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={templateStats.data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                >
                  {templateStats.data.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <DollarSign size={20} />
            <Typography variant="h6">Revenue Overview</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Daily Revenue
              </Typography>
              <Typography variant="h4">${revenueStats.daily}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Weekly Revenue
              </Typography>
              <Typography variant="h5">${revenueStats.weekly}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Monthly Revenue
              </Typography>
              <Typography variant="h5">${revenueStats.monthly}</Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
