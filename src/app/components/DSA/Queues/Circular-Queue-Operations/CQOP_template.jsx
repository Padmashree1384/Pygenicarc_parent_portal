import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Paper,
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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpeedIcon from '@mui/icons-material/Speed';
import LoopIcon from '@mui/icons-material/Loop';

// Assuming these components exist and are adapted for Circular Queues
import CQOP from './CQOP';
import CQOP_Monoco from './CQOP_Monoco';
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
      zIndex: 1301, // Set high z-index to be on top of everything
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
        You must first pass the "Queue Operations" quiz to unlock this module.
      </Typography>
      <Button component="a" href="/dashboard/roadmap" variant="contained">
        Back to Roadmap
      </Button>
    </Paper>
  </Box>
);
// Navbar Component
const Navbar = ({ setActivePage, activePage }) => {
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
        minWidth: 'auto',
        transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.3s ease',
        background: isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
        '&:hover': {
          bgcolor: isActive ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.1)',
          color: '#ffffff',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {label}
    </Button>
  );

  return (
    <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)', py: 1 }}>
      <Toolbar sx={{ justifyContent: 'center', gap: { xs: 0.5, sm: 1.5, md: 2.5 }, flexWrap: 'wrap' }}>
        <NavButton icon={<CheckCircleOutlineIcon />} label="Aim" page="aim" isActive={activePage === 'aim'} />
        <NavButton icon={<LightbulbOutlinedIcon />} label="Theory" page="theory" isActive={activePage === 'theory'} />
        <NavButton icon={<AssignmentOutlinedIcon />} label="Procedure" page="procedure" isActive={activePage === 'procedure'} />
        <NavButton icon={<PlayArrowIcon />} label="Simulation" page="simulation" isActive={activePage === 'simulation'} />
        <NavButton icon={<CodeIcon />} label="Code" page="Code" isActive={activePage === 'Code'} />
        <NavButton icon={<QuizIcon />} label="Quiz" page="quiz" isActive={activePage === 'quiz'} />
        <NavButton icon={<FeedbackOutlinedIcon />} label="Feedback" page="feedback" isActive={activePage === 'feedback'} />
      </Toolbar>
    </AppBar>
  );
};

const theme = createTheme({
  typography: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif' },
  components: { MuiCssBaseline: { styleOverrides: { body: { backgroundColor: '#ffffff' } } } },
});

const CQOP_template = () => {
  const navigate = useNavigate();
  const isUnlocked = localStorage.getItem('circularQueueUnlocked') === 'true';
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
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const [quizState, setQuizState] = useState({ currentQuestion: 0, score: 0, selectedAnswer: '', submitted: false, feedback: null, passed: false });
  const questions = [
    {
      question: 'What is the primary advantage of a circular queue over a standard linear queue?',
      options: ['Faster access time', 'More secure', 'Efficient use of space', 'Simpler to implement'],
      correctAnswer: 'Efficient use of space',
      explanation: 'A circular queue reuses the empty space created by dequeuing elements, preventing the "false full" condition of a linear queue.',
    },
    {
      question: 'What mathematical operator is crucial for implementing the "wrap-around" logic in a circular queue?',
      options: ['Addition (+)', 'Multiplication (*)', 'Modulo (%)', 'Division (/)'],
      correctAnswer: 'Modulo (%)',
      explanation: 'The modulo operator is used to calculate the next index for the front and rear pointers, allowing them to wrap around to the beginning of the array.',
    },
  ];

  const handleNextStep = () => {
    localStorage.setItem('infixPostfixUnlocked', 'true');
    localStorage.setItem('expandLevel2', 'true'); // This tells the roadmap to open Level 2
    navigate('/dashboard/roadmap');
  };

  const handleQuizAnswer = (value) => setQuizState((prev) => ({ ...prev, selectedAnswer: value }));
  const handleQuizSubmit = () => {
    const currentQ = questions[quizState.currentQuestion];
    const isCorrect = quizState.selectedAnswer === currentQ.correctAnswer;
    setQuizState((prev) => ({ ...prev, submitted: true, feedback: { isCorrect, message: currentQ.explanation, severity: isCorrect ? 'success' : 'error' }, score: isCorrect ? prev.score + 1 : prev.score }));
  };
  const handleQuizNext = () => {
    const nextQuestionIndex = quizState.currentQuestion + 1;
    if (nextQuestionIndex < questions.length) {
      setQuizState((prev) => ({ ...prev, currentQuestion: nextQuestionIndex, selectedAnswer: '', submitted: false, feedback: null, }));
    } else {
      if (quizState.score === questions.length) {
        setQuizState(prev => ({ ...prev, passed: true, currentQuestion: nextQuestionIndex }));
      } else {
        setQuizState(prev => ({ ...prev, passed: false, currentQuestion: nextQuestionIndex }));
      }
    }
  };
  const handleQuizReset = () => setQuizState({ currentQuestion: 0, score: 0, selectedAnswer: '', submitted: false, feedback: null, passed: false });

  const renderContent = () => {
    switch (activePage) {
      case 'aim':
        return (
          <>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', mb: 3, border: '1px solid #bfdbfe' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleOutlineIcon sx={{ color: '#3b82f6', mr: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>Aim of the Visualizer</Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#1f2937' }}>
                The aim of this visualization is to understand the working of a <strong>Circular Queue</strong>. It demonstrates how this data structure efficiently uses a fixed-size array by allowing pointers to "wrap around" from the end to the beginning.
              </Typography>
            </Paper>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#f0fdf4', mb: 3, border: '1px solid #bbf7d0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: '#22c55e', mr: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>Key Features & Learning Benefits</Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}><Typography fontWeight="bold">Wrap-Around Logic</Typography><Typography variant="body2">See how the front and rear pointers loop back to the start.</Typography></Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}><Typography fontWeight="bold">Pointer Visualization</Typography><Typography variant="body2">Clearly track the movement of `front` and `rear` pointers.</Typography></Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}><Typography fontWeight="bold">FIFO Principle</Typography><Typography variant="body2">Understand how the First-In, First-Out order is maintained.</Typography></Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}><Typography fontWeight="bold">Efficient Space Usage</Typography><Typography variant="body2">Learn how circular queues prevent wasted space.</Typography></Paper>
              </Box>
            </Paper>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a', mb: 2, textAlign: 'center' }}>Your Learning Journey</Typography>
              <Timeline position="alternate">
                <TimelineItem><TimelineSeparator><TimelineDot color="primary"><LightbulbOutlinedIcon /></TimelineDot><TimelineConnector /></TimelineSeparator><TimelineContent><Paper variant="outlined" sx={{ p: 2 }}><Typography fontWeight="bold">Understand Linear Queues</Typography><Typography>Grasp the basic FIFO concept.</Typography></Paper></TimelineContent></TimelineItem>
                <TimelineItem><TimelineSeparator><TimelineDot color="secondary"><TrendingUpIcon /></TimelineDot><TimelineConnector /></TimelineSeparator><TimelineContent><Paper variant="outlined" sx={{ p: 2 }}><Typography fontWeight="bold">The "Wasted Space" Problem</Typography><Typography>See the limitations of a simple array queue.</Typography></Paper></TimelineContent></TimelineItem>
                <TimelineItem><TimelineSeparator><TimelineDot color="success"><LoopIcon /></TimelineDot><TimelineConnector /></TimelineSeparator><TimelineContent><Paper variant="outlined" sx={{ p: 2 }}><Typography fontWeight="bold">Learn the Circular Solution</Typography><Typography>Understand the wrap-around logic.</Typography></Paper></TimelineContent></TimelineItem>
                <TimelineItem><TimelineSeparator><TimelineDot color="info"><CodeIcon /></TimelineDot><TimelineConnector /></TimelineSeparator><TimelineContent><Paper variant="outlined" sx={{ p: 2 }}><Typography fontWeight="bold">Connect to Code</Typography><Typography>Relate the visuals to implementation.</Typography></Paper></TimelineContent></TimelineItem>
                <TimelineItem><TimelineSeparator><TimelineDot color="warning"><QuizIcon /></TimelineDot></TimelineSeparator><TimelineContent><Paper variant="outlined" sx={{ p: 2 }}><Typography fontWeight="bold">Test Your Knowledge</Typography><Typography>Take the quiz to reinforce learning.</Typography></Paper></TimelineContent></TimelineItem>
              </Timeline>
            </Box>
          </>
        );
      case 'theory':
        return (
          <>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#eff6ff', mb: 3, border: '1px solid #bfdbfe' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}><LightbulbOutlinedIcon sx={{ color: '#3b82f6', mr: 1 }} /><Typography variant="h6" sx={{ fontWeight: 600 }}>What is a Circular Queue?</Typography></Box>
              <Typography variant="body1">A <strong>Circular Queue</strong> is a linear data structure that uses a single, fixed-size array as if it were connected end-to-end. This structure follows the FIFO (First-In, First-Out) principle, but it efficiently reuses empty slots left by dequeued elements by allowing the rear pointer to "wrap around" to the start of the array.</Typography>
            </Paper>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#eff6ff', mb: 3, border: '1px solid #bfdbfe' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}><LoopIcon sx={{ color: '#3b82f6', mr: 1 }} /><Typography variant="h6" sx={{ fontWeight: 600 }}>Core Logic</Typography></Box>
              <Typography variant="body1">The "wrap-around" logic is achieved using the modulo operator (`%`). For a queue of `size`, the next position for a pointer `p` is always calculated as `(p + 1) % size`.</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}><strong>Full Condition:</strong> `(rear + 1) % size == front`</Typography>
              <Typography variant="body1"><strong>Empty Condition:</strong> `front == -1` (initially) or `front == rear` after a dequeue.</Typography>
            </Paper>
          </>
        );
      case 'procedure':
        return (
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}><AssignmentOutlinedIcon sx={{ color: '#3b82f6', mr: 1 }} /><Typography variant="h6" sx={{ fontWeight: 600 }}>How to Use the Visualizer</Typography></Box>
            <Box component="ol" sx={{ pl: 3 }}>
              <li>Enter a value in the input field.</li>
              <li>Click <strong>Enqueue</strong> to add an element to the rear of the queue.</li>
              <li>Click <strong>Dequeue</strong> to remove an element from the front.</li>
              <li>Observe how the `front` and `rear` pointers move and wrap around the fixed-size array.</li>
            </Box>
          </Paper>
        );
      case 'simulation': return <CQOP showSnackbar={showSnackbar} />;
      case 'Code': return <CQOP_Monoco showSnackbar={showSnackbar} />;
      case 'quiz':
        return (
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#f8fafc' }}>
            {quizState.currentQuestion < questions.length ? (
              <>
                <LinearProgress variant="determinate" value={((quizState.currentQuestion + 1) / questions.length) * 100} sx={{ mb: 3 }} />
                <Typography variant="h6" sx={{ mb: 3 }}>Question {quizState.currentQuestion + 1}</Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>{questions[quizState.currentQuestion].question}</Typography>
                <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                  <RadioGroup value={quizState.selectedAnswer} onChange={(e) => handleQuizAnswer(e.target.value)}>
                    {questions[quizState.currentQuestion].options.map((option, index) => (
                      <FormControlLabel key={index} value={option} control={<Radio />} label={option} disabled={quizState.submitted} />
                    ))}
                  </RadioGroup>
                </FormControl>
                {quizState.feedback && <Alert severity={quizState.feedback.severity} sx={{ mb: 3 }}>{quizState.feedback.message}</Alert>}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {!quizState.submitted ? <Button variant="contained" onClick={handleQuizSubmit} disabled={!quizState.selectedAnswer}>Submit</Button> : <Button variant="contained" onClick={handleQuizNext}>Next</Button>}
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                {quizState.passed ? (
                  <>
                    <Typography variant="h4" sx={{ mb: 2, color: 'success.main' }}> Quiz Passed! 🏆 </Typography>
                    <Typography variant="h6" sx={{ mb: 3 }}> You've unlocked the next module. </Typography>
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
        );
      case 'feedback':
        return (
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#f8fafc' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Feedback</Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Your Name" variant="outlined" fullWidth />
              <TextField label="Your Feedback" variant="outlined" multiline rows={4} fullWidth />
              <Button variant="contained" sx={{ alignSelf: 'flex-start' }}>Submit</Button>
            </Box>
          </Paper>
        );
      default: return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        {!isUnlocked && <LockOverlay />}
        <Navbar setActivePage={setActivePage} activePage={activePage} />
        <Container key={activePage} maxWidth="lg" sx={{ py: 4, willChange: 'transform', scrollBehavior: 'auto', position: 'relative', top: 0 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: '#1e3a8a', mb: 4, textAlign: 'center' }}>
            CIRCULAR QUEUE OPERATIONS
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

export default CQOP_template;