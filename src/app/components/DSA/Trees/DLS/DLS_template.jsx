import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollToTop } from 'app/hooks/useScrollToTop';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Paper,
  Menu,
  MenuItem,
  Container,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Alert,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Snackbar,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CodeIcon from '@mui/icons-material/Code';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import QuizIcon from '@mui/icons-material/Quiz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpeedIcon from '@mui/icons-material/Speed';
import LockIcon from '@mui/icons-material/Lock';

import DLS_EX1 from './DLS_EX1';
import DLS_EX2 from './DLS_EX2';
import DLSLab from './DLSLab';
import DLS_Monoco from './DLS_Monoco';

const LockOverlay = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(8px)',
      zIndex: 1301,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}
  >
    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: 3 }}>
      <LockIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
      <Typography variant="h4" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Module Locked</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        You must first pass the "Depth First Search" quiz to unlock this module.
      </Typography>
      <Button component="a" href="/dashboard/roadmap" variant="contained">
        Back to Roadmap
      </Button>
    </Paper>
  </Box>
);

const Navbar = ({ setActivePage, activePage }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredExample, setHoveredExample] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (page) => {
    setActivePage(page);
    handleClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const NavButton = ({ icon, label, page, isActive = false }) => (
    <Button
      variant="text"
      onClick={() => {
        setActivePage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      startIcon={icon}
      sx={{
        color: isActive ? '#ffffff' : '#e2e8f0',
        borderRadius: 2,
        px: { xs: 0.8, sm: 1.5, md: 2 },
        py: { xs: 0.5, sm: 1 },
        textTransform: 'none',
        fontWeight: 600,
        fontSize: { xs: '0.75rem', sm: '0.9rem', md: '1rem' },
        minWidth: { xs: 'auto', sm: 'auto' },
        transition: 'all 0.3s ease',
        background: isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
        '&:hover': {
          bgcolor: isActive ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.1)',
          color: '#ffffff',
          transform: 'translateY(-2px)',
        },
        '& .MuiButton-startIcon': {
          marginRight: { xs: 0.5, sm: 1 },
          '& > *:first-of-type': {
            fontSize: { xs: '1rem', sm: '1.2rem' }
          }
        }
      }}
    >
      {label}
    </Button>
  );

  const examples = [
    {
      id: 'example1',
      title: 'EXAMPLE 1',
      color: '#3b82f6',
      difficulty: 'Beginner',
      duration: '5 min',
    },
    {
      id: 'example2',
      title: 'EXAMPLE 2',
      color: '#10b981',
      difficulty: 'Intermediate',
      duration: '8 min',
    },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        py: 1,
      }}
    >
      <Toolbar sx={{
        justifyContent: 'center',
        gap: { xs: 0.5, sm: 1.5, md: 2.5 },
        px: { xs: 1, sm: 2 },
        flexWrap: { xs: 'wrap', md: 'nowrap' },
        minHeight: { xs: 'auto', sm: 64 },
        py: { xs: 1, sm: 0 }
      }}>
        <NavButton
          icon={<CheckCircleOutlineIcon />}
          label="Aim"
          page="aim"
          isActive={activePage === 'aim'}
        />
        <NavButton
          icon={<LightbulbOutlinedIcon />}
          label="Theory"
          page="theory"
          isActive={activePage === 'theory'}
        />
        <NavButton
          icon={<AssignmentOutlinedIcon />}
          label="Procedure"
          page="procedure"
          isActive={activePage === 'procedure'}
        />

        <Box sx={{ position: 'relative' }}>
          <Button
            variant="text"
            onClick={handleClick}
            endIcon={
              <KeyboardArrowDownIcon
                sx={{
                  transition: 'transform 0.3s ease',
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            }
            sx={{
              color: '#e2e8f0',
              borderRadius: 2,
              px: { xs: 0.8, sm: 1.5, md: 2 },
              py: { xs: 0.5, sm: 1 },
              textTransform: 'none',
              fontWeight: 600,
              fontSize: { xs: '0.75rem', sm: '0.9rem', md: '1rem' },
              minWidth: { xs: 'auto', sm: 'auto' },
              transition: 'all 0.3s ease',
              background: open ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(59, 130, 246, 0.15)',
                color: '#ffffff',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Examples
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                mt: 1,
                minWidth: 280,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                overflow: 'hidden',
              },
            }}
            transformOrigin={{ horizontal: 'center', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          >
            {examples.map((example, index) => (
              <MenuItem
                key={example.id}
                onClick={() => handleMenuItemClick(example.id)}
                onMouseEnter={() => setHoveredExample(example.id)}
                onMouseLeave={() => setHoveredExample(null)}
                sx={{
                  py: 2,
                  px: 3,
                  transition: 'all 0.3s ease',
                  borderBottom: index < examples.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  '&:hover': {
                    bgcolor: 'rgba(59, 130, 246, 0.08)',
                    transform: 'translateX(8px)',
                  },
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: '#1e3a8a',
                        mb: 0.5,
                      }}
                    >
                      {example.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Box
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: example.color + '20',
                          color: example.color,
                          border: `1px solid ${example.color}40`,
                        }}
                      >
                        {example.difficulty}
                      </Box>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        ⏱️ {example.duration}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: example.color,
                      opacity: hoveredExample === example.id ? 1 : 0.6,
                      transition: 'all 0.3s ease',
                    }}
                  />
                </Box>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <NavButton
          icon={<PlayArrowIcon />}
          label="Simulation"
          page="simulation"
          isActive={activePage === 'simulation'}
        />
        <NavButton
          icon={<CodeIcon />}
          label="Code"
          page="Code"
          isActive={activePage === 'Code'}
        />
        <NavButton
          icon={<QuizIcon />}
          label="Quiz"
          page="quiz"
          isActive={activePage === 'quiz'}
        />
        <NavButton
          icon={<FeedbackOutlinedIcon />}
          label="Feedback"
          page="feedback"
          isActive={activePage === 'feedback'}
        />
      </Toolbar>
    </AppBar>
  );
};

const theme = createTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#ffffff',
        },
        code: {
          fontFamily: 'inherit !important',
          backgroundColor: '#f3f4f6',
          padding: '2px 4px',
          borderRadius: '4px',
        },
      },
    },
  },
});

const DLS_template = () => {
  const isUnlocked = localStorage.getItem('dlsUnlocked') === 'true';
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('aim');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useScrollToTop(activePage);
  const [quizState, setQuizState] = useState({
    currentQuestion: 0,
    score: 0,
    selectedAnswer: '',
    submitted: false,
    feedback: null,
    passed: false,
  });

  const questions = [
    {
      question: 'What is the primary advantage of Depth-Limited Search (DLS) over standard DFS?',
      options: [
        'It is faster',
        'It uses less memory',
        'It avoids infinite loops on cyclic graphs',
        'It always finds the optimal solution',
      ],
      correctAnswer: 'It avoids infinite loops on cyclic graphs',
      explanation: 'By imposing a depth limit, DLS prevents the infinite traversal of cycles or very deep paths that can trap a standard DFS.',
    },
    {
      question: 'What happens if the target node in DLS is located at a depth greater than the specified limit?',
      options: [
        'The algorithm returns the path to the deepest node it found',
        'The algorithm will not find the target node',
        'The algorithm increases the depth limit automatically',
        'The algorithm switches to BFS',
      ],
      correctAnswer: 'The algorithm will not find the target node',
      explanation: 'DLS is incomplete. If the solution lies beyond the depth limit (l), the algorithm will fail to find it.',
    },
  ];

  const handleNextStep = () => {
    navigate('/dashboard/roadmap');

  };

  const handleQuizAnswer = (value) => {
    setQuizState((prev) => ({ ...prev, selectedAnswer: value }));
  };

  const handleQuizSubmit = () => {
    const currentQ = questions[quizState.currentQuestion];
    const isCorrect = quizState.selectedAnswer === currentQ.correctAnswer;
    setQuizState((prev) => ({
      ...prev,
      submitted: true,
      feedback: {
        isCorrect,
        message: currentQ.explanation,
        severity: isCorrect ? 'success' : 'error',
      },
      score: isCorrect ? prev.score + 1 : prev.score,
    }));
  };

  const handleQuizNext = () => {
    const nextQuestionIndex = quizState.currentQuestion + 1;
    if (nextQuestionIndex < questions.length) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: nextQuestionIndex,
        selectedAnswer: '',
        submitted: false,
        feedback: null,
      }));
    } else {
      if (quizState.score === questions.length) {
        setQuizState(prev => ({ ...prev, passed: true, currentQuestion: nextQuestionIndex }));
      } else {
        setQuizState(prev => ({ ...prev, passed: false, currentQuestion: nextQuestionIndex }));
      }
    }
  };

  const handleQuizReset = () => {
    setQuizState({
      currentQuestion: 0,
      score: 0,
      selectedAnswer: '',
      submitted: false,
      feedback: null,
      passed: false,
    });
  };

  const renderContent = () => {
    switch (activePage) {
      case 'aim':
        return (
          <>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 700,
                color: '#1e3a8a',
                mb: 2,
                borderLeft: '4px solid #3b82f6',
                pl: 2,
              }}
            >
              Aim
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                mb: 3,
                border: '1px solid #bfdbfe',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleOutlineIcon sx={{ color: '#3b82f6', mr: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Why Learn with the DLS Visualizer?
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#1f2937', mb: 2 }}>
                The aim of this simulation is to demonstrate <strong>Depth-Limited Search (DLS)</strong> traversal on tree data structures using an interactive visual interface.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrowIcon />}
                onClick={() => setActivePage('simulation')}
                sx={{ mt: 1, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                Try the Simulation
              </Button>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#f0fdf4',
                mb: 3,
                border: '1px solid #bbf7d0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: '#22c55e', mr: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Key Features & Learning Benefits
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Understand Behavior
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    Understand the recursive or stack-based behavior of DLS.
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Visualize Traversal
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    Visualize traversal from root to a specified depth limit.
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Observe Order
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    Observe the visiting order and how the depth limit affects the search.
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Control Traversal
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    Control the traversal using step, run, pause, and reset options.
                  </Typography>
                </Paper>
              </Box>
            </Paper>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a', mb: 2, textAlign: 'center' }}>
                Your Learning Journey
              </Typography>
              <Timeline position="alternate">
                {[
                  { label: 'Grasp DLS Basics', color: 'primary', desc: 'Understand how DLS improves upon standard DFS.', icon: <LightbulbOutlinedIcon /> },
                  { label: 'Visualize Traversal', color: 'secondary', desc: 'See the algorithm in action with a depth limit.', icon: <PlayArrowIcon /> },
                  { label: 'Practice Hands-On', color: 'success', desc: 'Use interactive controls to explore the simulation.', icon: <AssignmentOutlinedIcon /> },
                  { label: 'Connect to Code', color: 'info', desc: 'Relate the visual steps to the source code.', icon: <CodeIcon /> },
                  { label: 'Test Your Knowledge', color: 'warning', desc: 'Take the quiz to reinforce and confirm your learning.', icon: <QuizIcon /> },
                ].map((step, index, arr) => (
                  <TimelineItem key={step.label}>
                    <TimelineSeparator>
                      <TimelineDot color={step.color}>{step.icon}</TimelineDot>
                      {index < arr.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                          {step.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1f2937' }}>{step.desc}</Typography>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Box>
          </>
        );
      case 'theory':
        return (
          <>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 700,
                color: '#1e3a8a',
                mb: 2,
                borderLeft: '4px solid #3b82f6',
                pl: 2,
              }}
            >
              Theory
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#eff6ff',
                mb: 3,
                border: '1px solid #bfdbfe',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LightbulbOutlinedIcon sx={{ color: '#3b82f6', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  What is DLS?
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#1f2937', mb: 2 }}>
                <strong>Depth-Limited Search (DLS)</strong> is a tree traversal algorithm that explores as far as possible along each branch before backtracking, but with a limit on the depth. It starts from the root node and dives deep into the tree along a single branch before visiting sibling nodes, up to a specified depth limit.
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#eff6ff',
                mb: 3,
                border: '1px solid #bfdbfe',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LightbulbOutlinedIcon sx={{ color: '#3b82f6', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Working Mechanism
                </Typography>
              </Box>
              <Box component="ol" sx={{ color: '#1f2937', mb: 2, pl: 3 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  DLS uses a <strong>stack</strong> data structure (either explicitly or via recursion).
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  It follows the path from the root to the deepest node (up to the depth limit) before backtracking and continuing with other unexplored paths.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  In a binary tree, DLS generally follows the <strong>Preorder → Inorder → Postorder</strong> traversal rules within the depth limit.
                </Box>
              </Box>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#fef3c7',
                mb: 3,
                border: '1px solid #fbbf24',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SpeedIcon sx={{ color: '#d97706', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Time & Space Complexity
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Time Complexity
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    O(n^m), where m = maximum depth, n = branching factor
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Space Complexity
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    O(b × m), where b = branching factor, m = maximum depth
                  </Typography>
                </Paper>
              </Box>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#f0fdf4',
                mb: 3,
                border: '1px solid #bbf7d0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: '#22c55e', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Advantages
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    Requires less memory compared to BFS since it stores only a single path from root to leaf.
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    Can be more efficient in deeper trees where the goal is far from the root.
                  </Typography>
                </Paper>
              </Box>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#fee2e2',
                mb: 3,
                border: '1px solid #ef4444',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: '#ef4444', mr: 1, transform: 'rotate(180deg)' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Disadvantages
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    May get stuck in infinite loops if the tree has cycles or no end condition.
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    Not guaranteed to find the shortest path in weighted or unbalanced trees.
                  </Typography>
                </Paper>
              </Box>
            </Paper>
          </>
        );
      case 'procedure':
        return (
          <>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 700,
                color: '#1e3a8a',
                mb: 2,
                borderLeft: '4px solid #3b82f6',
                pl: 2,
              }}
            >
              Procedure
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#eff6ff',
                mb: 3,
                border: '1px solid #bfdbfe',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentOutlinedIcon sx={{ color: '#3b82f6', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Simulation Overview
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#1f2937', mb: 2 }}>
                This simulation module allows users to understand the step-by-step working of the <strong>Depth Limited Search (DLS)</strong> traversal on a tree through interactive visual examples and lab environments.
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#f0fdf4',
                mb: 3,
                border: '1px solid #bbf7d0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PlayArrowIcon sx={{ color: '#22c55e', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Procedure for Using Examples
                </Typography>
              </Box>
              <Box component="ol" sx={{ color: '#1f2937', mb: 2, pl: 3 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  Click on <strong>"Examples → Example 1"</strong> or <strong>"Example 2"</strong> from the navigation bar.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  The tree will be displayed on the canvas area.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  The target node is predefined for each example.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Use the following control buttons:
                </Box>
                <Box component="ul" sx={{ pl: 3 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <strong>Reset:</strong> Resets the tree and clears traversal history.
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <strong>Next Step:</strong> Perform a single step in DLS traversal.
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <strong>Prev Step:</strong> Go back to the previous traversal state.
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <strong>Run:</strong> Automatically start DLS traversal until the node is found or all nodes are visited.
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <strong>Pause:</strong> Temporarily stop automatic traversal.
                  </Box>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  The right panel shows the <strong>step-by-step traversal history</strong> and allows copying to clipboard.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Color legend is shown to indicate node states:
                </Box>
                <Box component="ul" sx={{ pl: 3 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    🟡 Current node
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    🔵 Visited nodes
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    🟢 Found node
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    ⚪ Not visited
                  </Box>
                </Box>
              </Box>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#fefce8',
                mb: 3,
                border: '1px solid #fef08a',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PlayArrowIcon sx={{ color: '#eab308', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Procedure for Using Simulation
                </Typography>
              </Box>
              <Box component="ol" sx={{ color: '#1f2937', mb: 2, pl: 3 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  Click on <strong>"Simulation"</strong> from the navigation bar.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  You will see an interactive canvas with input fields for:
                </Box>
                <Box component="ul" sx={{ pl: 3 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    Number of nodes
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    Node values
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    Edge connections (manual or auto layout)
                  </Box>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  After configuring your tree, click <strong>"Build Tree"</strong>.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  The canvas will render your custom tree structure.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Enter the <strong>target node value</strong> you want to search.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Use the same DLS control buttons:
                </Box>
                <Box component="ul" sx={{ pl: 3 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <strong>Run</strong> — start full traversal
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <strong>Next/Prev Step</strong> — move step-by-step
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <strong>Pause</strong> — stop traversal
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <strong>Reset</strong> — clear and start over
                  </Box>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  You can also:
                </Box>
                <Box component="ul" sx={{ pl: 3 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    View and copy step list
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    Download the traversal code in C, C++, Python, or Java
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    Use the Monaco editor at the bottom to explore syntax in different languages
                  </Box>
                </Box>
              </Box>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#fee2e2',
                mb: 3,
                border: '1px solid #ef4444',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentOutlinedIcon sx={{ color: '#ef4444', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Important Note
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#1f2937' }}>
                Make sure your input is valid. Invalid node values or disconnected graphs may result in incorrect simulations.
              </Typography>
            </Paper>
          </>
        );
      case 'example1':
        return (
          <>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 700,
                color: '#1e3a8a',
                mb: 2,
                borderLeft: '4px solid #3b82f6',
                pl: 2,
              }}
            >
              Example 1:
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                mb: 3,
                border: '1px solid #bfdbfe',
              }}
            >
              <DLS_EX1 />
            </Paper>
          </>
        );
      case 'example2':
        return (
          <>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 700,
                color: '#1e3a8a',
                mb: 2,
                borderLeft: '4px solid #3b82f6',
                pl: 2,
              }}
            >
              Example 2:
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                mb: 3,
                border: '1px solid #bbf7d0',
              }}
            >
              <DLS_EX2 />
            </Paper>
          </>
        );
      case 'simulation':
        return <DLSLab showSnackbar={showSnackbar} />;
      case 'Code':
        return <DLS_Monoco showSnackbar={showSnackbar} />;
      case 'quiz':
        return (
          <>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 700,
                color: '#1e3a8a',
                mb: 2,
                borderLeft: '4px solid #3b82f6',
                pl: 2,
              }}
            >
              Quiz
            </Typography>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              {quizState.currentQuestion < questions.length ? (
                <>
                  <LinearProgress
                    variant="determinate"
                    value={((quizState.currentQuestion + 1) / questions.length) * 100}
                    sx={{ mb: 3, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="h6" sx={{ mb: 3, color: '#1e3a8a', fontWeight: 600 }}>
                    Question {quizState.currentQuestion + 1} of {questions.length}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', color: '#1f2937' }}>
                    {questions[quizState.currentQuestion].question}
                  </Typography>
                  <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                    <RadioGroup value={quizState.selectedAnswer} onChange={(e) => handleQuizAnswer(e.target.value)}>
                      {questions[quizState.currentQuestion].options.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={<Radio />}
                          label={option}
                          disabled={quizState.submitted}
                          sx={{
                            mb: 1, p: 1, borderRadius: 1, border: '1px solid transparent',
                            '&:hover': { bgcolor: '#f1f5f9' },
                            ...(quizState.submitted && option === questions[quizState.currentQuestion].correctAnswer && {
                              bgcolor: '#dcfce7', border: '1px solid #22c55e',
                            }),
                            ...(quizState.submitted &&
                              option === quizState.selectedAnswer &&
                              option !== questions[quizState.currentQuestion].correctAnswer && {
                              bgcolor: '#fee2e2', border: '1px solid #ef4444',
                            }),
                          }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                  {quizState.feedback && (
                    <Alert severity={quizState.feedback.severity} sx={{ mb: 3 }}>
                      {quizState.feedback.message}
                    </Alert>
                  )}
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    {!quizState.submitted ? (
                      <Button variant="contained" onClick={handleQuizSubmit} disabled={!quizState.selectedAnswer} sx={{ borderRadius: 2 }}>
                        Submit Answer
                      </Button>
                    ) : (
                      <Button variant="contained" onClick={handleQuizNext} sx={{ borderRadius: 2 }}>
                        Next Question
                      </Button>
                    )}
                  </Box>
                </>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  {quizState.passed ? (
                    <>
                      <Typography variant="h4" sx={{ mb: 2, color: 'success.main' }}> Quiz Passed! 🏆 </Typography>
                      <Typography variant="h6" sx={{ mb: 3 }}> Congratulations! You have completed all available levels. </Typography>
                      <Button variant="contained" size="large" onClick={handleNextStep}> Go to Roadmap </Button>
                    </>
                  ) : (
                    <>
                      <Typography variant="h4" sx={{ mb: 2, color: 'error.main' }}> Try Again </Typography>
                      <Typography variant="h6" sx={{ mb: 3 }}> Your Score: {quizState.score} / {questions.length}. A perfect score is required. </Typography>
                      <Button variant="contained" onClick={handleQuizReset}> Retake Quiz </Button>
                    </>
                  )}
                </Box>
              )}
            </Paper>
          </>
        );
      case 'feedback':
        return (
          <>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 700,
                color: '#1e3a8a',
                mb: 2,
                borderLeft: '4px solid #3b82f6',
                pl: 2,
              }}
            >
              Feedback
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#fefce8',
                mb: 3,
                border: '1px solid #fef08a',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FeedbackOutlinedIcon sx={{ color: '#eab308', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Submit Your Feedback
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#1f2937', mb: 2 }}>
                Please submit your feedback about this simulation.
              </Typography>
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Your Feedback"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                />
                <Button variant="contained" color="primary" sx={{ alignSelf: 'flex-start', borderRadius: 2 }}>
                  Submit
                </Button>
              </Box>
            </Paper>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        {!isUnlocked && <LockOverlay />}
        <Navbar setActivePage={setActivePage} activePage={activePage} />
        <Container maxWidth="lg" sx={{ py: 4, willChange: 'transform' }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#1e3a8a',
              mb: 4,
              textAlign: 'center',
            }}
          >
            DEPTH LIMITED SEARCH
          </Typography>
          {renderContent()}
        </Container>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default DLS_template;