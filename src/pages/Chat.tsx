import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  Divider,
  Chip,
} from '@mui/material';
import { Send, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectWallet } from '../store/slices/walletSlice';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';

interface Message {
  id: string;
  content: string;
  authorAddress: string;
  signature: string;
  timestamp: number;
}

interface User {
  address: string;
  lastSeen: number;
}

export default function Chat() {
  const wallet = useSelector(selectWallet);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wallet.isConnected && wallet.address) {
      // Connect to WebSocket server
      const wsConnection = new WebSocket('wss://web3-chat-server.example.com');
      
      wsConnection.onopen = () => {
        // Send join message with wallet address
        wsConnection.send(JSON.stringify({
          type: 'join',
          address: wallet.address,
        }));
      };

      wsConnection.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'message':
            setMessages(prev => [...prev, data.message]);
            break;
          case 'users':
            setOnlineUsers(data.users);
            break;
        }
      };

      wsConnection.onclose = () => {
        // Attempt to reconnect after a delay
        setTimeout(() => {
          if (wallet.isConnected) {
            window.location.reload();
          }
        }, 3000);
      };

      setWs(wsConnection);

      return () => {
        wsConnection.close();
      };
    }
  }, [wallet.isConnected, wallet.address]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const signMessage = async (message: string) => {
    if (!wallet.signer) return null;
    try {
      return await wallet.signer.signMessage(message);
    } catch (error) {
      console.error('Error signing message:', error);
      return null;
    }
  };

  const sendMessage = async () => {
    if (!wallet.isConnected || !wallet.address || !newMessage.trim() || !ws) return;

    try {
      const signature = await signMessage(newMessage);
      
      if (!signature) {
        throw new Error('Failed to sign message');
      }

      const messageObj: Message = {
        id: ethers.id(newMessage + Date.now()),
        content: newMessage,
        authorAddress: wallet.address,
        signature,
        timestamp: Date.now(),
      };

      ws.send(JSON.stringify({
        type: 'message',
        message: messageObj,
      }));

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getAddressColor = (address: string) => {
    const hash = ethers.id(address.toLowerCase());
    const hue = parseInt(hash.slice(2, 8), 16) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Live Chat</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Users size={20} />
          <Typography>
            {onlineUsers.length} online
          </Typography>
        </Box>
      </Box>

      {!wallet.isConnected ? (
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'warning.light' }}>
          <Typography>Please connect your wallet to join the chat.</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Chat Messages */}
          <Paper sx={{ flex: 1, height: 'calc(100vh - 240px)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
              <List>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ListItem
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: message.authorAddress === wallet.address ? 'flex-end' : 'flex-start',
                        py: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            fontSize: '0.75rem',
                            bgcolor: getAddressColor(message.authorAddress),
                          }}
                        >
                          {message.authorAddress.slice(2, 4)}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                          {message.authorAddress.slice(0, 6)}...{message.authorAddress.slice(-4)} •{' '}
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Box>
                      <Paper
                        sx={{
                          p: 1.5,
                          bgcolor: message.authorAddress === wallet.address ? 'primary.main' : 'background.paper',
                          color: message.authorAddress === wallet.address ? 'primary.contrastText' : 'text.primary',
                          maxWidth: '80%',
                        }}
                      >
                        <Typography>{message.content}</Typography>
                      </Paper>
                    </ListItem>
                    {index < messages.length - 1 && <Divider variant="middle" />}
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </List>
            </Box>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button
                  variant="contained"
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send size={20} />
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Online Users */}
          <Paper sx={{ width: 240, height: 'fit-content', p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Online Users</Typography>
            <List>
              {onlineUsers.map((user) => (
                <ListItem key={user.address}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: getAddressColor(user.address),
                      }}
                    >
                      {user.address.slice(2, 4)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2">
                        {user.address.slice(0, 6)}...{user.address.slice(-4)}
                      </Typography>
                      <Chip
                        label="Online"
                        size="small"
                        sx={{
                          bgcolor: 'success.main',
                          color: 'success.contrastText',
                          fontSize: '0.625rem',
                        }}
                      />
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
