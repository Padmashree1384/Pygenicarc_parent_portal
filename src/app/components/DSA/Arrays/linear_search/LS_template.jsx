import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
import SearchIcon from '@mui/icons-material/Search';
import LockIcon from '@mui/icons-material/Lock';

import LS_EX1 from './LS_EX1';
import LS_EX2 from './LS_EX2';
import LSLab from './LSLab';
import LS_Monoco from './LS_Monoco';
import { useScrollToTop } from 'app/hooks/useScrollToTop';

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
        You must first pass the "Valid Parentheses" quiz to unlock this module.
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
  };

  const NavButton = ({ icon, label, page, isActive = false }) => (
    <Button
      variant="text"
      onClick={() => setActivePage(page)}
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
        transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.3s ease',
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
      duration: '5 min'
    },
    {
      id: 'example2',
      title: 'EXAMPLE 2',
      color: '#10b981',
      difficulty: 'Intermediate',
      duration: '8 min'
    },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        py: 1,
        transform: 'translateZ(0)',
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
              transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.3s ease',
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
                  transition: 'background-color 0.3s ease, transform 0.3s ease',
                  borderBottom: index < examples.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  '&:hover': {
                    bgcolor: 'rgba(59, 130, 246, 0.08)',
                    transform: 'translateX(8px)',
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
                      <Box sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: example.color + '20',
                        color: example.color,
                        border: `1px solid ${example.color}40`
                      }}>
                        {example.difficulty}
                      </Box>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        ⏱️ {example.duration}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: example.color,
                    opacity: hoveredExample === example.id ? 1 : 0.6,
                    transition: 'opacity 0.3s ease',
                  }} />
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

const LS_template = () => {
  const isUnlocked = localStorage.getItem('linearSearchUnlocked') === 'true';
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('aim');
  useScrollToTop(activePage);

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
      question: 'What is the worst-case time complexity of Linear Search?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 'O(n)',
      explanation: 'In the worst case, Linear Search must check every single element in the array, resulting in O(n) time complexity.',
    },
    {
      question: 'On which type of array does Linear Search work?',
      options: ['Sorted arrays only', 'Unsorted arrays only', 'Both sorted and unsorted arrays', 'Arrays with unique elements only'],
      correctAnswer: 'Both sorted and unsorted arrays',
      explanation: 'Linear Search is simple and does not require the array to be sorted, though it works on sorted arrays as well.',
    },
  ];

  const handleNextStep = () => {
    localStorage.setItem('binarySearchUnlocked', 'true');
    localStorage.setItem('expandLevel3', 'true');
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
              sx={{ fontWeight: 700, color: '#1e3a8a', mb: 2, borderLeft: '4px solid #3b82f6', pl: 2 }}
            >
              Aim
            </Typography>
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', mb: 3, border: '1px solid #bfdbfe' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SearchIcon sx={{ color: '#3b82f6', mr: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Aim of the Simulation
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#1f2937', mb: 2 }}>
                The aim of this simulation is to showcase the working of the <strong>Linear Search</strong> algorithm to find a target value in an unsorted array. Ideal for beginners, this helps reinforce the concept of brute-force searching and highlights the O(n) time complexity.
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 2, bgcolor: '#f0fdf4', mb: 3, border: '1px solid #bbf7d0' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: '#22c55e', mr: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Learning Objectives
                </Typography>
              </Box>
              <Box component="ul" sx={{ color: '#1f2937', pl: 3 }}>
                <Typography component="li" sx={{ mb: 1 }}>Understand how each element is checked from left to right.</Typography>
                <Typography component="li" sx={{ mb: 1 }}>Visualize visited elements and the current index pointer.</Typography>
                <Typography component="li" sx={{ mb: 1 }}>Receive feedback upon success or failure of search.</Typography>
                <Typography component="li" sx={{ mb: 1 }}>Use step and run modes to control the visualization speed.</Typography>
              </Box>
            </Paper>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a', mb: 2, textAlign: 'center' }}>
                Your Learning Journey
              </Typography>
              <Timeline position="alternate">
                {[
                  { label: 'Grasp the Basics', color: 'primary', desc: 'Learn the core concept of sequential searching.', icon: <LightbulbOutlinedIcon /> },
                  { label: 'Visualize the Process', color: 'secondary', desc: 'See how the algorithm checks each element one by one.', icon: <PlayArrowIcon /> },
                  { label: 'Practice Hands-On', color: 'success', desc: 'Use interactive controls to explore different scenarios.', icon: <AssignmentOutlinedIcon /> },
                  { label: 'Connect to Code', color: 'info', desc: 'Relate the visual steps to its simple implementation.', icon: <CodeIcon /> },
                  { label: 'Test Your Knowledge', color: 'warning', desc: 'Take the quiz to reinforce your learning.', icon: <QuizIcon /> },
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
              sx={{ fontWeight: 700, color: '#1e3a8a', mb: 2, borderLeft: '4px solid #3b82f6', pl: 2 }}
            >
              Theory
            </Typography>
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 2, bgcolor: '#eff6ff', mb: 3, border: '1px solid #bfdbfe' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LightbulbOutlinedIcon sx={{ color: '#3b82f6', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Definition
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#1f2937' }}>
                <b>Linear Search</b> is a simple searching algorithm that checks each element in the array sequentially until the target value is found or the list ends. It starts from the first element and compares the target value with each element one by one.
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 2, bgcolor: '#f0fdf4', mb: 3, border: '1px solid #bbf7d0' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: '#22c55e', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Advantages
                </Typography>
              </Box>
              <Box component="ul" sx={{ color: '#1f2937', pl: 3 }}>
                <Typography component="li" sx={{ mb: 1 }}>Works on both sorted and unsorted arrays.</Typography>
                <Typography component="li" sx={{ mb: 1 }}>Simple and intuitive to implement.</Typography>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 2, bgcolor: '#fee2e2', mb: 3, border: '1px solid #ef4444' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: '#ef4444', mr: 1, transform: 'rotate(180deg)' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Disadvantages
                </Typography>
              </Box>
              <Box component="ul" sx={{ color: '#1f2937', pl: 3 }}>
                <Typography component="li" sx={{ mb: 1 }}>Inefficient for large datasets.</Typography>
                <Typography component="li" sx={{ mb: 1 }}>Time-consuming if the element is near the end or not present.</Typography>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 2, bgcolor: '#fef3c7', mb: 3, border: '1px solid #fbbf24' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SpeedIcon sx={{ color: '#d97706', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Time & Space Complexity
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#1f2937' }}><b>Time Complexity:</b> <code>O(n)</code></Typography>
              <Typography variant="body1" sx={{ color: '#1f2937' }}><b>Space Complexity:</b> <code>O(1)</code></Typography>
            </Paper>
          </>
        );
      case 'procedure':
        return (
          <>
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: 700, color: '#1e3a8a', mb: 2, borderLeft: '4px solid #3b82f6', pl: 2 }}
            >
              Procedure
            </Typography>
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 2, bgcolor: '#eff6ff', mb: 3, border: '1px solid #bfdbfe' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentOutlinedIcon sx={{ color: '#3b82f6', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  How to Use the Linear Search Visualizer
                </Typography>
              </Box>
              <Box component="ol" sx={{ color: '#1f2937', pl: 3 }}>
                <Box component="li" sx={{ mb: 1 }}>Set the target value using the input field.</Box>
                <Box component="li" sx={{ mb: 1 }}>Click <strong>Set Target</strong> to apply the value.</Box>
                <Box component="li" sx={{ mb: 1 }}>Click <strong>Reset</strong> to reload the array and reset all states.</Box>
                <Box component="li" sx={{ mb: 1 }}>Click <strong>Next Step</strong> to check one element at a time from left to right.</Box>
                <Box component="li" sx={{ mb: 1 }}>Click <strong>Run</strong> to perform the full search automatically.</Box>
                <Box component="li" sx={{ mb: 1 }}>Click <strong>Pause</strong> to stop the animation at any time.</Box>
                <Box component="li" sx={{ mb: 1 }}>Visited elements will be highlighted.</Box>
                <Box component="li" sx={{ mb: 1 }}>Once the element is found or not found, you will see the result.</Box>
              </Box>
            </Paper>
          </>
        );
      case 'example1':
        return <LS_EX1 />;
      case 'example2':
        return <LS_EX2 />;
      case 'simulation':
        return <LSLab showSnackbar={showSnackbar} />;
      case 'Code':
        return <LS_Monoco showSnackbar={showSnackbar} />;
      case 'quiz':
        return (
          <>
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: 700, color: '#1e3a8a', mb: 2, borderLeft: '4px solid #3b82f6', pl: 2 }}
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
                      <Typography variant="h6" sx={{ mb: 3 }}> You've unlocked the next module! </Typography>
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
              sx={{ fontWeight: 700, color: '#1e3a8a', mb: 2, borderLeft: '4px solid #3b82f6', pl: 2 }}
            >
              Feedback
            </Typography>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Typography variant="body1" sx={{ mb: 3, color: '#1f2937' }}>
                Please submit your feedback about this Linear Search simulation.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Your Feedback" variant="outlined" multiline rows={4} fullWidth />
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
        <Container
          key={activePage}
          maxWidth="lg"
          sx={{ py: 4, willChange: 'transform' }}
        >
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
            LINEAR SEARCH
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

export default LS_template;