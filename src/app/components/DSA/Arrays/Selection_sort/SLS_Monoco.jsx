import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { SLScodeSnippets } from './SLScodeSnippets';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Tooltip,
  Fade,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CodeIcon from '@mui/icons-material/Code';

// Helper function to handle code actions
const handleCodeAction = (action, code, language, showSnackbar) => {
  switch (action) {
    case 'download':
      if (!code) {
        showSnackbar('❌ No code to download.', 'error');
        return;
      }
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `selection_sort_code.${getFileExtension(language)}`; // Corrected filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showSnackbar('✅ Code downloaded successfully!', 'success');
      break;

    case 'copy':
      if (!code) {
        showSnackbar('❌ No code to copy.', 'error');
        return;
      }
      navigator.clipboard.writeText(code).then(() => {
        showSnackbar('✅ Code copied to clipboard!', 'success');
      }).catch(err => {
        console.error('Failed to copy code: ', err);
        showSnackbar('❌ Failed to copy code.', 'error');
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

const SLS_Monoco = ({ showSnackbar }) => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(SLScodeSnippets['python']);

  useEffect(() => {
    const selectedCode = SLScodeSnippets[language];
    setCode(selectedCode);
  }, [language]);

  const handleTabChange = (event, newValue) => {
    setLanguage(newValue);
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
        <Box sx={{ p: { xs: 2, md: 4 }, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <CodeIcon sx={{ fontSize: { xs: 30, md: 40 }, color: '#64ffda', mr: 2, textShadow: '0 0 10px #64ffda' }} />
            <Typography variant="h4" component="h3" sx={{ fontWeight: 'bold', color: '#e0e0e0', letterSpacing: 1 }}>
              Code Implementation
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 3, color: '#94a3b8', maxWidth: '700px', mx: 'auto' }}>
            Select a language to see its Selection Sort implementation. Feel free to download or copy the code.
          </Typography>
        </Box>

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
              '& .MuiTab-root': { color: '#94a3b8', fontWeight: 600, textTransform: 'none', fontSize: '1rem', transition: 'color 0.3s ease', '&:hover': { color: '#e0e0e0' } },
              '& .Mui-selected': { color: '#64ffda !important' },
              '& .MuiTabs-indicator': { backgroundColor: '#64ffda', height: '3px', borderRadius: '3px 3px 0 0' },
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
                onClick={() => handleCodeAction('download', code, language, showSnackbar)}
                sx={{ color: '#94a3b8', '&:hover': { color: '#64ffda', background: 'rgba(100, 255, 218, 0.1)' } }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy Code">
              <IconButton
                onClick={() => handleCodeAction('copy', code, language, showSnackbar)}
                sx={{ color: '#94a3b8', '&:hover': { color: '#64ffda', background: 'rgba(100, 255, 218, 0.1)' } }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ height: '600px', '& ::-webkit-scrollbar': { width: '10px', height: '10px' }, '& ::-webkit-scrollbar-thumb': { background: '#4b5563', borderRadius: '5px' }, '& ::-webkit-scrollbar-track': { background: 'transparent' } }}>
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value ?? '')}
            theme="vs-dark"
            options={{ fontSize: 16, minimap: { enabled: true, scale: 2 }, scrollBeyondLastLine: false, readOnly: true, wordWrap: 'on', padding: { top: 24, bottom: 24 }, fontFamily: "'Fira Code', 'Roboto Mono', monospace", lineNumbers: 'on', roundedSelection: true, automaticLayout: true, glyphMargin: true, fontLigatures: true }}
          />
        </Box>
      </Paper>
    </Fade>
  );
};

export default SLS_Monoco;