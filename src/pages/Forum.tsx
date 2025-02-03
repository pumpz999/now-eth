import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { MessageSquare, Send, Trash2, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectWallet } from '../store/slices/walletSlice';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';

interface Post {
  id: string;
  title: string;
  content: string;
  authorAddress: string;
  signature: string;
  timestamp: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  content: string;
  authorAddress: string;
  signature: string;
  timestamp: number;
}

const STORAGE_KEY = 'web3_forum_data';

export default function Forum() {
  const wallet = useSelector(selectWallet);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      setPosts(JSON.parse(storedData));
    }
  }, []);

  const saveToLocalStorage = (updatedPosts: Post[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const signMessage = async (message: string) => {
    if (!wallet.signer) return null;
    try {
      return await wallet.signer.signMessage(message);
    } catch (error) {
      console.error('Error signing message:', error);
      return null;
    }
  };

  const createPost = async () => {
    if (!wallet.isConnected || !wallet.address) return;
    
    try {
      setLoading(true);
      const message = `${newPostTitle}\n${newPostContent}`;
      const signature = await signMessage(message);
      
      if (!signature) {
        throw new Error('Failed to sign message');
      }

      const newPost: Post = {
        id: ethers.id(message + Date.now()),
        title: newPostTitle,
        content: newPostContent,
        authorAddress: wallet.address,
        signature,
        timestamp: Date.now(),
        comments: [],
      };

      const updatedPosts = [newPost, ...posts];
      saveToLocalStorage(updatedPosts);
      
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (postId: string) => {
    if (!wallet.isConnected || !wallet.address || !newComment[postId]) return;

    try {
      setLoading(true);
      const message = newComment[postId];
      const signature = await signMessage(message);

      if (!signature) {
        throw new Error('Failed to sign message');
      }

      const newCommentObj: Comment = {
        id: ethers.id(message + Date.now()),
        content: message,
        authorAddress: wallet.address,
        signature,
        timestamp: Date.now(),
      };

      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newCommentObj],
          };
        }
        return post;
      });

      saveToLocalStorage(updatedPosts);
      setNewComment({ ...newComment, [postId]: '' });
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    if (!wallet.isConnected || !wallet.address) return;

    const updatedPosts = posts.filter(post => 
      !(post.id === postId && post.authorAddress === wallet.address)
    );
    saveToLocalStorage(updatedPosts);
  };

  const deleteComment = async (postId: string, commentId: string) => {
    if (!wallet.isConnected || !wallet.address) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter(comment => 
            !(comment.id === commentId && comment.authorAddress === wallet.address)
          ),
        };
      }
      return post;
    });
    saveToLocalStorage(updatedPosts);
  };

  const getAddressColor = (address: string) => {
    const hash = ethers.id(address.toLowerCase());
    const hue = parseInt(hash.slice(2, 8), 16) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Community Forum</Typography>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={() => setNewPostOpen(true)}
          disabled={!wallet.isConnected}
        >
          New Post
        </Button>
      </Box>

      {!wallet.isConnected && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'warning.light' }}>
          <Typography>Please connect your wallet to participate in discussions.</Typography>
        </Paper>
      )}

      {posts.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: getAddressColor(post.authorAddress) }}>
                  {post.authorAddress.slice(2, 4)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{post.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {post.authorAddress.slice(0, 6)}...{post.authorAddress.slice(-4)} •{' '}
                    {new Date(post.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              {wallet.address === post.authorAddress && (
                <IconButton onClick={() => deletePost(post.id)} color="error">
                  <Trash2 size={20} />
                </IconButton>
              )}
            </Box>

            <Typography paragraph>{post.content}</Typography>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Comments ({post.comments.length})
              </Typography>
              <List>
                {post.comments.map((comment) => (
                  <ListItem
                    key={comment.id}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      py: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Avatar 
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          fontSize: '0.75rem',
                          bgcolor: getAddressColor(comment.authorAddress)
                        }}
                      >
                        {comment.authorAddress.slice(2, 4)}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        {comment.authorAddress.slice(0, 6)}...{comment.authorAddress.slice(-4)} •{' '}
                        {new Date(comment.timestamp).toLocaleString()}
                      </Typography>
                      {wallet.address === comment.authorAddress && (
                        <IconButton
                          size="small"
                          onClick={() => deleteComment(post.id, comment.id)}
                          color="error"
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      )}
                    </Box>
                    <Typography>{comment.content}</Typography>
                  </ListItem>
                ))}
              </List>

              {wallet.isConnected && (
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Write a comment..."
                    value={newComment[post.id] || ''}
                    onChange={(e) =>
                      setNewComment({ ...newComment, [post.id]: e.target.value })
                    }
                  />
                  <Button
                    variant="contained"
                    onClick={() => createComment(post.id)}
                    disabled={!newComment[post.id]}
                  >
                    <Send size={20} />
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </motion.div>
      ))}

      <Dialog open={newPostOpen} onClose={() => setNewPostOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Content"
            multiline
            rows={4}
            fullWidth
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewPostOpen(false)}>Cancel</Button>
          <Button
            onClick={createPost}
            variant="contained"
            disabled={!newPostTitle || !newPostContent || loading}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
