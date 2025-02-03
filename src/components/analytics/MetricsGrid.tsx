import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Metric {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
}

interface MetricsGridProps {
  metrics: Metric[];
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              {metric.title}
            </Typography>
            <Typography variant="h4" component="div" gutterBottom>
              {metric.value}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: metric.change >= 0 ? 'success.main' : 'error.main',
              }}
            >
              {metric.change >= 0 ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <Typography variant="body2">
                {Math.abs(metric.change)}% {metric.changeLabel}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
