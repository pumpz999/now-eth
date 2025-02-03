import React from 'react';
import { Box, Grid, Paper, Typography, Button, useTheme } from '@mui/material';
import {
  BarChart,
  Activity,
  Users,
  DollarSign,
  FileCode,
  ShieldCheck,
  Zap,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectWallet } from '../store/slices/walletSlice';

const features = [
  {
    title: 'Smart Contract Templates',
    description: 'Pre-audited, secure smart contract templates for quick deployment',
    icon: FileCode,
    color: '#4ECDC4',
    path: '/templates',
  },
  {
    title: 'Live Chat & Forum',
    description: 'Connect with the community and get support in real-time',
    icon: MessageSquare,
    color: '#FF6B6B',
    path: '/chat',
  },
  {
    title: 'Web3 Services',
    description: 'Access premium blockchain services and tools',
    icon: Zap,
    color: '#45B7D1',
    path: '/services',
  },
];

const stats = [
  {
    label: 'Total Volume',
    value: '125.5 ETH',
    change: '+15%',
    icon: BarChart,
    color: '#FF6B6B',
  },
  {
    label: 'Active Users',
    value: '1,234',
    change: '+8%',
    icon: Users,
    color: '#4ECDC4',
  },
  {
    label: 'Templates Sold',
    value: '89',
    change: '+12%',
    icon: Activity,
    color: '#45B7D1',
  },
  {
    label: 'Platform Revenue',
    value: '45.3 ETH',
    change: '+25%',
    icon: DollarSign,
    color: '#96CEB4',
  },
];

export default function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const wallet = useSelector(selectWallet);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Box>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(78,205,196,0.1), rgba(255,107,107,0.1))',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            className="parallax-bg"
            sx={{
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                animation: 'pulse 4s ease-in-out infinite',
              },
            }}
          />
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            Welcome to Web3 Platform
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
            Your All-in-One Solution for Blockchain Development
          </Typography>
          {!wallet.isConnected && (
            <Button
              variant="contained"
              size="large"
              startIcon={<Zap />}
              onClick={() => {/* Connect wallet */}}
              sx={{
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF8585, #65E6DE)',
                },
              }}
            >
              Connect Wallet to Get Started
            </Button>
          )}
        </Box>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <motion.div variants={item}>
                <Tilt
                  tiltMaxAngleX={5}
                  tiltMaxAngleY={5}
                  scale={1.02}
                  transitionSpeed={2000}
                >
                  <Paper
                    sx={{
                      p: 3,
                      height: '100%',
                      background: `linear-gradient(135deg, ${stat.color}11, ${stat.color}22)`,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 20px ${stat.color}33`,
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          color: stat.color,
                        }}
                      >
                        <stat.icon size={24} />
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        {stat.label}
                      </Typography>
                      <Typography variant="h4" sx={{ color: stat.color, mb: 1 }}>
                        {stat.value}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUp size={16} color={stat.color} />
                        <Typography variant="body2" sx={{ color: stat.color }}>
                          {stat.change} this month
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Tilt>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Features Section */}
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Core Features
      </Typography>
      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={feature.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Tilt
                tiltMaxAngleX={5}
                tiltMaxAngleY={5}
                scale={1.02}
                transitionSpeed={2000}
              >
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    cursor: 'pointer',
                    background: `linear-gradient(135deg, ${feature.color}11, ${feature.color}22)`,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 20px ${feature.color}33`,
                    },
                  }}
                  onClick={() => navigate(feature.path)}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${feature.color}22, ${feature.color}44)`,
                        color: feature.color,
                      }}
                    >
                      <feature.icon size={32} />
                    </Box>
                    <Typography variant="h5" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{
                        mt: 2,
                        color: feature.color,
                        borderColor: feature.color,
                        '&:hover': {
                          borderColor: feature.color,
                          background: `${feature.color}11`,
                        },
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </Paper>
              </Tilt>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
