import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Play, Save, Download, Upload, Plus, X, ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectWallet } from '../store/slices/walletSlice';
import { TreeView } from '@mui/lab';
import { motion } from 'framer-motion';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ height: '100%' }}
    >
      {value === index && <Box sx={{ height: '100%' }}>{children}</Box>}
    </div>
  );
}

interface FileTab {
  id: string;
  name: string;
  content: string;
  path: string;
}

interface ConsoleMessage {
  type: 'info' | 'error' | 'warning' | 'success';
  message: string;
  timestamp: string;
}

const mockFileTree = {
  id: 'root',
  name: 'Project',
  children: [
    {
      id: 'contracts',
      name: 'contracts',
      children: [
        { id: '1', name: 'Contract.sol', path: '/contracts/Contract.sol' },
        { id: '2', name: 'Token.sol', path: '/contracts/Token.sol' },
      ],
    },
    {
      id: 'scripts',
      name: 'scripts',
      children: [
        { id: '3', name: 'deploy.js', path: '/scripts/deploy.js' },
        { id: '4', name: 'test.js', path: '/scripts/test.js' },
      ],
    },
  ],
};

export default function IDE() {
  const wallet = useSelector(selectWallet);
  const [activeTab, setActiveTab] = useState(0);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [consoleHeight, setConsoleHeight] = useState(200);
  const [files, setFiles] = useState<FileTab[]>([
    {
      id: '1',
      name: 'Contract.sol',
      path: '/contracts/Contract.sol',
      content: '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.19;\n\ncontract MyContract {\n    // Your code here\n}',
    },
  ]);

  const addConsoleMessage = (type: ConsoleMessage['type'], message: string) => {
    setConsoleMessages(prev => [
      {
        type,
        message,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  const handleEditorChange = (event: React.ChangeEvent<HTMLTextAreaElement>, fileId: string) => {
    setFiles(files.map(file => 
      file.id === fileId ? { ...file, content: event.target.value } : file
    ));
  };

  const addNewFile = () => {
    const newFile = {
      id: Date.now().toString(),
      name: 'New File.sol',
      path: '/contracts/New File.sol',
      content: '',
    };
    setFiles([...files, newFile]);
    setActiveTab(files.length);
  };

  const closeFile = (fileId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newFiles = files.filter(file => file.id !== fileId);
    setFiles(newFiles);
    if (activeTab >= newFiles.length) {
      setActiveTab(Math.max(0, newFiles.length - 1));
    }
  };

  const handleCompile = async () => {
    addConsoleMessage('info', 'Starting compilation...');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addConsoleMessage('success', 'Compilation successful!');
    } catch (error) {
      addConsoleMessage('error', `Compilation failed: ${error}`);
    }
  };

  const handleDeploy = async () => {
    if (!wallet.isConnected) {
      addConsoleMessage('error', 'Please connect your wallet first');
      return;
    }
    addConsoleMessage('info', 'Starting deployment...');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      addConsoleMessage('success', 'Contract deployed successfully!');
    } catch (error) {
      addConsoleMessage('error', `Deployment failed: ${error}`);
    }
  };

  const renderFileTree = (node: any) => (
    <ListItem
      key={node.id}
      sx={{ pl: node.children ? 2 : 4, cursor: 'pointer' }}
      onClick={() => {
        if (!node.children) {
          // Handle file click
        }
      }}
    >
      <ListItemIcon>
        {node.children ? <Folder size={20} /> : <FileText size={20} />}
      </ListItemIcon>
      <ListItemText primary={node.name} />
      {node.children && (
        <List>
          {node.children.map((child: any) => renderFileTree(child))}
        </List>
      )}
    </ListItem>
  );

  return (
    <Box sx={{ height: 'calc(100vh - 120px)' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Smart Contract IDE
      </Typography>

      <Paper sx={{ height: 'calc(100% - 48px)', display: 'flex' }}>
        {/* File Explorer */}
        <Box sx={{ width: 250, borderRight: 1, borderColor: 'divider', p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Files
          </Typography>
          <TreeView
            defaultCollapseIcon={<ChevronDown size={20} />}
            defaultExpandIcon={<ChevronRight size={20} />}
          >
            {renderFileTree(mockFileTree)}
          </TreeView>
        </Box>

        {/* Editor Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
            <Tabs 
              value={activeTab} 
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ flex: 1 }}
            >
              {files.map((file, index) => (
                <Tab
                  key={file.id}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FileText size={14} />
                      {file.name}
                      <IconButton
                        size="small"
                        onClick={(e) => closeFile(file.id, e)}
                        sx={{ ml: 1 }}
                      >
                        <X size={14} />
                      </IconButton>
                    </Box>
                  }
                />
              ))}
            </Tabs>
            <IconButton onClick={addNewFile} sx={{ mr: 1 }}>
              <Plus size={20} />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              {files.map((file, index) => (
                <TabPanel key={file.id} value={activeTab} index={index}>
                  <textarea
                    value={file.content}
                    onChange={(e) => handleEditorChange(e, file.id)}
                    style={{
                      width: '100%',
                      height: '100%',
                      resize: 'none',
                      padding: '1rem',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      backgroundColor: '#1e1e1e',
                      color: '#d4d4d4',
                      border: 'none',
                      outline: 'none',
                    }}
                  />
                </TabPanel>
              ))}
            </Box>

            {/* Console */}
            <Box
              sx={{
                height: consoleHeight,
                borderTop: 1,
                borderColor: 'divider',
                overflow: 'auto',
                bgcolor: 'background.paper',
              }}
            >
              <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2">Console</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                {consoleMessages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 1,
                      color: msg.type === 'error' ? 'error.main' :
                             msg.type === 'warning' ? 'warning.main' :
                             msg.type === 'success' ? 'success.main' : 'inherit'
                    }}
                  >
                    <Typography variant="body2" component="span" color="text.secondary">
                      [{msg.timestamp}]
                    </Typography>{' '}
                    <Typography variant="body2" component="span">
                      {msg.message}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Play />}
              onClick={handleCompile}
            >
              Compile
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Upload />}
              onClick={handleDeploy}
              disabled={!wallet.isConnected}
            >
              Deploy
            </Button>
            <Button
              variant="outlined"
              startIcon={<Save />}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
            >
              Download
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
