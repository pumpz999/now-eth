import { Box, useTheme as useMuiTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUI } from '../../store/slices/uiSlice';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';
import Templates from '../../pages/Templates';
import Analytics from '../../pages/Analytics';
import Settings from '../../pages/Settings';
import IDE from '../../pages/IDE';
import Forum from '../../pages/Forum';
import Chat from '../../pages/Chat';

export default function Layout() {
  const { sidebarOpen } = useSelector(selectUI);
  const theme = useMuiTheme();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: sidebarOpen ? '240px' : '64px',
        }}
      >
        <Navbar />
        <Box sx={{ p: 3 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/ide" element={<IDE />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}
