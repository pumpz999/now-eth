import { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Button,
  Rating,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import { Search, Tag, Download, Star, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectWallet } from '../store/slices/walletSlice';

const categories = [
  'All',
  'DeFi',
  'NFT',
  'DAO',
  'Gaming',
  'Social',
  'Utility',
];

const mockTemplates = [
  {
    id: '1',
    name: 'DeFi Swap Interface',
    description: 'Professional DEX interface with advanced trading features and analytics.',
    price: 0.5,
    category: 'DeFi',
    rating: 4.5,
    downloads: 128,
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    tags: ['DEX', 'Trading', 'Analytics'],
  },
  {
    id: '2',
    name: 'NFT Marketplace Pro',
    description: 'Complete NFT marketplace solution with bidding and auctions.',
    price: 0.8,
    category: 'NFT',
    rating: 4.8,
    downloads: 256,
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800',
    tags: ['NFT', 'Marketplace', 'Auctions'],
  },
  {
    id: '3',
    name: 'DAO Governance Portal',
    description: 'Enterprise-grade DAO governance system with proposal management.',
    price: 1.2,
    category: 'DAO',
    rating: 4.7,
    downloads: 89,
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800',
    tags: ['DAO', 'Governance', 'Voting'],
  },
  {
    id: '4',
    name: 'Play2Earn Game Platform',
    description: 'Blockchain gaming platform with reward system and marketplace.',
    price: 1.5,
    category: 'Gaming',
    rating: 4.6,
    downloads: 167,
    image: 'https://images.unsplash.com/photo-1642006953663-06f0387d8573?w=800',
    tags: ['Gaming', 'P2E', 'NFT'],
  },
];

const MotionCard = motion(Card);

export default function Templates() {
  const theme = useTheme();
  const wallet = useSelector(selectWallet);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const filteredTemplates = mockTemplates
    .filter((template) => {
      const matchesSearch = template.name.toLowerCase().includes(search.toLowerCase()) ||
        template.description.toLowerCase().includes(search.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === 'All' || template.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default: // 'popular'
          return b.downloads - a.downloads;
      }
    });

  const handlePurchase = async (templateId: string) => {
    if (!wallet.isConnected) {
      // TODO: Show connect wallet modal
      return;
    }
    // TODO: Implement purchase logic
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Template Marketplace
      </Typography>

      {/* Search and Filters */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              label="Sort by"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="popular">Most Popular</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Template Grid */}
      <Grid container spacing={3}>
        {filteredTemplates.map((template) => (
          <Grid item xs={12} sm={6} lg={4} key={template.id}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                  transition: 'all 0.3s ease-in-out',
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={template.image}
                alt={template.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack spacing={2}>
                  <Typography variant="h6" gutterBottom>
                    {template.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {template.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tag size={16} />
                    {template.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{ borderRadius: 1 }}
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star size={16} />
                      <Typography variant="body2">
                        {template.rating}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Download size={16} />
                      <Typography variant="body2">
                        {template.downloads}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <DollarSign size={20} />
                      {template.price} ETH
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => handlePurchase(template.id)}
                      disabled={!wallet.isConnected}
                    >
                      Purchase
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
