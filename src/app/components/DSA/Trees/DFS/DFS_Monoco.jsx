import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { DFScodeSnippets } from './DFScodeSnippets';
import {
  Box,
  Snackbar,
  Alert,
  Typography,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Tooltip,
  Fade,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
// REMOVED: import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // ADDED: Icon for copy button
import CodeIcon from '@mui/icons-material/Code';

// Helper function to handle code actions
const handleCodeAction = (action, code, originalCode, language, setCode, setSnackbarMessage, setSnackbarSeverity, setOpenSnackbar) => {
  switch (action) {
    case 'download':
      if (!code) {
        setSnackbarMessage('❌ No code to download.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dfs_code.${getFileExtension(language)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setSnackbarMessage('✅ Code downloaded successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      break;

    // MODIFIED: 'reset' case changed to 'copy'
    case 'copy':
      if (!code) {
        setSnackbarMessage('❌ No code to copy.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }
      navigator.clipboard.writeText(code).then(() => {
        setSnackbarMessage('✅ Code copied to clipboard!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      }).catch(err => {
        console.error('Failed to copy code: ', err);
        setSnackbarMessage('❌ Failed to copy code.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
      break;

    default:
      break;
  }
};

// Helper function to get file extension based on language
const getFileExtension = (language) => {
  const extensions = {
    python: 'py',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
  };
  return extensions[language] || 'txt';
};

const DFS_Monoco_Enhanced = () => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(DFScodeSnippets['python']);
  const [originalCode, setOriginalCode] = useState(DFScodeSnippets['python']);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const selectedCode = DFScodeSnippets[language];
    setCode(selectedCode);
    setOriginalCode(selectedCode);
  }, [language]);

  const handleTabChange = (event, newValue) => {
    setLanguage(newValue);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Fade in timeout={800}>
      <Paper
        elevation={12}
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          borderRadius: '20px',
          background: 'linear-gradient(145deg, #1e293b, #2c3e50)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Enhanced Header */}
        <Box sx={{ p: { xs: 2, md: 4 }, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <CodeIcon sx={{ fontSize: { xs: 30, md: 40 }, color: '#64ffda', mr: 2, textShadow: '0 0 10px #64ffda' }} />
            <Typography variant="h4" component="h3" sx={{ fontWeight: 'bold', color: '#e0e0e0', letterSpacing: 1 }}>
              Code Implementation
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 3, color: '#94a3b8', maxWidth: '700px', mx: 'auto' }}>
            Select a language to see its Depth-First Search implementation. Feel free to download or copy the code.
          </Typography>
        </Box>

        {/* Unified Control Bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: { xs: 2, md: 4 },
            py: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Tabs
            value={language}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                color: '#94a3b8',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#e0e0e0',
                },
              },
              '& .Mui-selected': {
                color: '#64ffda !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#64ffda',
                height: '3px',
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab label="Python" value="python" />
            <Tab label="Java" value="java" />
            <Tab label="C++" value="cpp" />
            <Tab label="C" value="c" />
          </Tabs>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Download Code">
              <IconButton
                onClick={() => handleCodeAction('download', code, originalCode, language, setCode, setSnackbarMessage, setSnackbarSeverity, setOpenSnackbar)}
                sx={{ color: '#94a3b8', '&:hover': { color: '#64ffda', background: 'rgba(100, 255, 218, 0.1)' } }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            {/* MODIFIED: Reset button changed to Copy button */}
            <Tooltip title="Copy Code">
              <IconButton
                onClick={() => handleCodeAction('copy', code, originalCode, language, setCode, setSnackbarMessage, setSnackbarSeverity, setOpenSnackbar)}
                sx={{ color: '#94a3b8', '&:hover': { color: '#64ffda', background: 'rgba(100, 255, 218, 0.1)' } }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Dark-themed Editor Container */}
        <Box
          sx={{
            height: '600px',
            '& ::-webkit-scrollbar': {
              width: '10px',
              height: '10px',
            },
            '& ::-webkit-scrollbar-thumb': {
              background: '#4b5563',
              borderRadius: '5px',
            },
            '& ::-webkit-scrollbar-track': {
              background: 'transparent',
            },
          }}
        >
          <Editor
            height="100%"
            language={language}
            value={code}
            // MODIFIED: onChange is not needed for read-only editor but kept to prevent breaking changes if you revert.
            onChange={(value) => setCode(value ?? '')}
            theme="vs-dark"
            options={{
              fontSize: 16,
              minimap: { enabled: true, scale: 2 },
              scrollBeyondLastLine: false,
              readOnly: true, // MODIFIED: Editor is now read-only
              wordWrap: 'on',
              padding: { top: 24, bottom: 24 },
              fontFamily: "'Fira Code', 'Roboto Mono', monospace",
              lineNumbers: 'on',
              roundedSelection: true,
              automaticLayout: true,
              glyphMargin: true,
              fontLigatures: true,
            }}
          />
        </Box>

        {/* Themed Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            variant="filled"
            sx={{ width: '100%', borderRadius: '8px' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Fade>
  );
};

export default DFS_Monoco_Enhanced;