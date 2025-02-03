import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Rating,
} from '@mui/material';
import { Tag, Download, Star, DollarSign, FileCode, Clock, User } from 'lucide-react';

interface TemplateDetailsProps {
  open: boolean;
  onClose: () => void;
  template: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    rating: number;
    downloads: number;
    image: string;
    tags: string[];
    author?: string;
    lastUpdated?: string;
    features?: string[];
  };
  onPurchase: (templateId: string) => void;
}

export default function TemplateDetails({
  open,
  onClose,
  template,
  onPurchase,
}: TemplateDetailsProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FileCode size={24} />
          <Typography variant="h6">{template.name}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <img
              src={template.image}
              alt={template.name}
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" paragraph>
              {template.description}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Tag size={16} />
              {template.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Star size={16} />
              <Rating value={template.rating} readOnly precision={0.5} />
              <Typography variant="body2">({template.rating})</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Download size={16} />
              <Typography variant="body2">
                {template.downloads} downloads
              </Typography>
            </Box>
          </Grid>
          {template.author && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <User size={16} />
                <Typography variant="body2">
                  By {template.author}
                </Typography>
              </Box>
            </Grid>
          )}
          {template.lastUpdated && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Clock size={16} />
                <Typography variant="body2">
                  Updated {template.lastUpdated}
                </Typography>
              </Box>
            </Grid>
          )}
          {template.features && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Features
              </Typography>
              <ul>
                {template.features.map((feature, index) => (
                  <li key={index}>
                    <Typography variant="body2">{feature}</Typography>
                  </li>
                ))}
              </ul>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DollarSign size={20} />
            {template.price} ETH
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => onPurchase(template.id)}
          >
            Purchase Template
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
