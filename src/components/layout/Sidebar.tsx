import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
  useTheme,
} from '@mui/material';
import { TreeView } from '@mui/lab';
import {
  Home,
  ChevronLeft,
  Menu,
  FileCode,
  BarChart2,
  Settings,
  Code,
  MessageSquare,
  MessageCircle,
  Wallet,
  Zap,
  FolderTree,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUI, toggleSidebar } from '../../store/slices/uiSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { menuItems } from './menuItems';

export default function Sidebar() {
  const { sidebarOpen } = useSelector(selectUI);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarOpen ? 240 : 64,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: sidebarOpen ? 240 : 64,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowX: 'hidden',
          background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(45,45,45,0.95) 100%)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255,255,255,0.1)',
        },
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            animation: 'pulse 4s ease-in-out infinite',
          },
        }}
      >
        {sidebarOpen ? (
          <>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              Web3 Platform
            </Typography>
            <IconButton
              onClick={() => dispatch(toggleSidebar())}
              sx={{ color: 'white', position: 'relative', zIndex: 1 }}
            >
              <ChevronLeft />
            </IconButton>
          </>
        ) : (
          <IconButton
            onClick={() => dispatch(toggleSidebar())}
            sx={{ color: 'white', position: 'relative', zIndex: 1 }}
          >
            <Menu />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      <List sx={{ p: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Tilt
              key={item.text}
              tiltMaxAngleX={5}
              tiltMaxAngleY={5}
              scale={1.02}
              transitionSpeed={2000}
              perspective={1000}
              tiltReverse
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ListItem
                  button
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: sidebarOpen ? 'initial' : 'center',
                    px: 2.5,
                    mb: 1,
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden',
                    transform: 'perspective(1000px)',
                    transformStyle: 'preserve-3d',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: isActive
                        ? `linear-gradient(135deg, ${item.color}44, ${item.color}22)`
                        : 'transparent',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      transform: 'translateZ(-1px)',
                    },
                    '&:hover::before': {
                      background: `linear-gradient(135deg, ${item.color}33, ${item.color}11)`,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: sidebarOpen ? 2 : 'auto',
                      justifyContent: 'center',
                      color: isActive ? item.color : 'grey.500',
                      transition: 'color 0.3s ease',
                      transform: 'translateZ(10px)',
                    }}
                  >
                    <item.icon size={20} />
                  </ListItemIcon>
                  {sidebarOpen && (
                    <ListItemText
                      primary={item.text}
                      sx={{
                        color: isActive ? item.color : 'grey.300',
                        '& .MuiListItemText-primary': {
                          fontWeight: isActive ? 600 : 400,
                          transform: 'translateZ(10px)',
                        },
                      }}
                    />
                  )}
                </ListItem>
              </motion.div>
            </Tilt>
          );
        })}
      </List>
    </Drawer>
  );
}
