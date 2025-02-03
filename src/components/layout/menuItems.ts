import {
  Home,
  FileCode,
  BarChart2,
  Settings,
  Code,
  MessageSquare,
  MessageCircle,
  Wallet,
  Zap,
} from 'lucide-react';

export const menuItems = [
  { text: 'Dashboard', icon: Home, path: '/', color: '#FF6B6B' },
  { text: 'Templates', icon: FileCode, path: '/templates', color: '#4ECDC4' },
  { text: 'IDE', icon: Code, path: '/ide', color: '#45B7D1' },
  { text: 'Analytics', icon: BarChart2, path: '/analytics', color: '#96CEB4' },
  { text: 'Forum', icon: MessageSquare, path: '/forum', color: '#FFEEAD' },
  { text: 'Chat', icon: MessageCircle, path: '/chat', color: '#D4A5A5' },
  { text: 'Wallet', icon: Wallet, path: '/wallet', color: '#9B59B6' },
  { text: 'Services', icon: Zap, path: '/services', color: '#3498DB' },
  { text: 'Settings', icon: Settings, path: '/settings', color: '#95A5A6' },
];
