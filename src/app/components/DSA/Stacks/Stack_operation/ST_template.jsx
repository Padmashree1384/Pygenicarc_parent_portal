import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Snackbar, // <-- ADDED
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
import LayersIcon from '@mui/icons-material/Layers';

// Assuming these components exist and are adapted for Stacks
import ST_OP from './ST_OP';
import ST_Monoco from './ST_Monoco';
// CORRECTED: Importing the hook instead of defining it locally
import { useScrollToTop } from 'app/hooks/useScrollToTop';

// Navbar Component
const Navbar = ({ setActivePage, activePage }) => {
  const NavButton = ({ icon, label, page, isActive = false }) => (
    <Button
      variant="text"
      onClick={() => {
        setActivePage(page);
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
            fontSize: { xs: '1rem', sm: '1.2rem' },
          },
        },
      }}
    >
      {label}
    </Button>
  );

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
      <Toolbar
        sx={{
          justifyContent: 'center',
          gap: { xs: 0.5, sm: 1.5, md: 2.5 },
          px: { xs: 1, sm: 2 },
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          minHeight: { xs: 'auto', sm: 64 },
          py: { xs: 1, sm: 0 },
        }}
      >
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
  typography: {
    fontFamily: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
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

const ST_template = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('aim');

  useScrollToTop(activePage);

  // --- MODIFICATION START ---
  // 1. Snackbar state and logic are now managed here in the parent.
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
  // --- MODIFICATION END ---

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
      question: 'What does LIFO stand for in the context of a stack?',
      options: ['Last-In, First-Out', 'First-In, Last-Out', 'Last-In, Final-Out', 'First-In, First-Out'],
      correctAnswer: 'Last-In, First-Out',
      explanation: 'LIFO stands for Last-In, First-Out, which is the fundamental principle of a stack data structure.',
    },
    {
      question: 'Which operation is used to add an element to the top of a stack?',
      options: ['Pop', 'Enqueue', 'Push', 'Peek'],
      correctAnswer: 'Push',
      explanation: 'The "Push" operation adds a new element to the top of the stack, increasing its size by one.',
    },
  ];

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
      // Quiz is finished, check for pass condition (perfect score)
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

  const handleNextStep = () => {
    // 1. Set the unlock flag for the roadmap to read
    localStorage.setItem('queueUnlocked', 'true');
    // 2. Set the one-time animation trigger
    localStorage.setItem('playUnlockAnimation', 'true');
    // 3. Navigate back to the roadmap
    navigate('/dashboard/Roadmap'); // Adjust if your roadmap URL is different
  };

  const isQuizFinished = quizState.currentQuestion >= questions.length;

  const renderContent = () => {
    switch (activePage) {
      case 'aim':
        return (
          <>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#1e3a8a', mb: 2, borderLeft: '4px solid #3b82f6', pl: 2 }}>
              Aim
            </Typography>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', mb: 3, border: '1px solid #bfdbfe' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LayersIcon sx={{ color: '#3b82f6', mr: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Why Learn with the Stack Visualizer?
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#1f2937', mb: 2 }}>
                The <strong>Stack Visualizer</strong> brings the Stack data structure to life. The primary aim is to demonstrate the core operations (Push, Pop) in a clear, interactive, and intuitive manner.
              </Typography>
              <Button variant="contained" color="primary" startIcon={<PlayArrowIcon />} onClick={() => setActivePage('simulation')} sx={{ mt: 1, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                Try the Simulation
              </Button>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#f0fdf4', mb: 3, border: '1px solid #bbf7d0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: '#22c55e', mr: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Key Features & Learning Benefits
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Interactive Operations
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    Directly Push and Pop elements to see instant results.
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Visual Feedback
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    Watch the stack grow and shrink with clear animations.
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Step-by-Step Control
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    Use the controls to trace the history of operations.
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    LIFO Principle
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    Understand why the last element added is the first one removed.
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
                  { label: 'Understand Stack Theory', color: 'primary', desc: 'Learn the core LIFO principle.', icon: <LightbulbOutlinedIcon /> },
                  { label: 'Visualize Push & Pop', color: 'secondary', desc: 'See how elements are added and removed.', icon: <PlayArrowIcon /> },
                  { label: 'Practice Hands-On', color: 'success', desc: 'Use the simulator to build your own stacks.', icon: <AssignmentOutlinedIcon /> },
                  { label: 'Connect to Code', color: 'info', desc: 'Relate the visual steps to the implementation.', icon: <CodeIcon /> },
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
                        <Typography variant="body2" sx={{ color: '#1f2937' }}>
                          {step.desc}
                        </Typography>
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
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#1e3a8a', mb: 2, borderLeft: '4px solid #3b82f6', pl: 2 }}>
              Theory
            </Typography>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#eff6ff', mb: 3, border: '1px solid #bfdbfe' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LightbulbOutlinedIcon sx={{ color: '#3b82f6', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  What is a Stack?
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#1f2937', mb: 2 }}>
                A <strong>Stack</strong> is a linear data structure that follows a particular order in which operations are performed. The order is <strong>Last-In, First-Out (LIFO)</strong>.
              </Typography>
              <Typography variant="body1" sx={{ color: '#1f2937', mb: 2 }}>
                An excellent real-world analogy is a pile of plates: you can only add a plate to the top, and you can only remove the topmost plate.
              </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#eff6ff', mb: 3, border: '1px solid #bfdbfe' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LayersIcon sx={{ color: '#3b82f6', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Core Operations
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#1f2937', mb: 1 }}>
                <strong>Push:</strong> Adds an element to the top of the stack.
              </Typography>
              <Typography variant="body1" sx={{ color: '#1f2937', mb: 1 }}>
                <strong>Pop:</strong> Removes the top element from the stack.
              </Typography>
              <Typography variant="body1" sx={{ color: '#1f2937', mb: 1 }}>
                <strong>Peek (or Top):</strong> Returns the top element without removing it.
              </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#fef3c7', mb: 3, border: '1px solid #fbbf24' }}>
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
                    O(1) for Push, Pop, and Peek.
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Space Complexity
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    O(n) - where n is the number of items.
                  </Typography>
                </Paper>
              </Box>
            </Paper>
          </>
        );
      case 'procedure':
        return (
          <>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#1e3a8a', mb: 2, borderLeft: '4px solid #3b82f6', pl: 2 }}>
              Procedure
            </Typography>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#eff6ff', mb: 3, border: '1px solid #bfdbfe' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentOutlinedIcon sx={{ color: '#3b82f6', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  How to Use the Stack Visualizer
                </Typography>
              </Box>
              <Box component="ol" sx={{ color: '#1f2937', mb: 2, pl: 3 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  Enter a value in the input field.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Click <strong>Push</strong> to add the element to the top of the stack.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Click <strong>Pop</strong> to remove the top element from the stack.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Click <strong>Reset</strong> to clear the stack.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Observe the animation as elements are added or removed.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  The status log on the right panel will show the history of operations performed.
                </Box>
              </Box>
            </Paper>
          </>
        );
      case 'simulation':
        // --- MODIFICATION: Pass the showSnackbar function as a prop ---
        return <ST_OP showSnackbar={showSnackbar} />;
      case 'Code':
        return <ST_Monoco showSnackbar={showSnackbar} />;
      case 'quiz':
        return (
          <>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#1e3a8a', mb: 2, borderLeft: '4px solid #3b82f6', pl: 2 }}>
              Quiz
            </Typography>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              {!isQuizFinished ? (
                <>
                  <LinearProgress variant="determinate" value={((quizState.currentQuestion + 1) / questions.length) * 100} sx={{ mb: 3, height: 8, borderRadius: 4 }} />
                  <Typography variant="h6" sx={{ mb: 3, color: '#1e3a8a', fontWeight: 600 }}>
                    Question {quizState.currentQuestion + 1} of {questions.length}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', color: '#1f2937' }}>
                    {questions[quizState.currentQuestion].question}
                  </Typography>
                  <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                    <RadioGroup value={quizState.selectedAnswer} onChange={(e) => handleQuizAnswer(e.target.value)}>
                      {questions[quizState.currentQuestion].options.map((option, index) => {
                        return (
                          <FormControlLabel
                            key={index} value={option} control={<Radio />} label={option} disabled={quizState.submitted}
                            sx={{ mb: 1, p: 1, borderRadius: 1, border: '1px solid transparent' }}
                          />
                        );
                      })}
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
                      <Typography variant="h4" sx={{ mb: 2, color: 'success.main', fontWeight: 700 }}>
                        Quiz Passed! 🏆
                      </Typography>
                      <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
                        You've unlocked the next module.
                      </Typography>
                      <Button variant="contained" size="large" onClick={handleNextStep}>
                        Go to Roadmap
                      </Button>
                    </>
                  ) : (
                    <>
                      <Typography variant="h4" sx={{ mb: 2, color: 'error.main', fontWeight: 700 }}>
                        Try Again
                      </Typography>
                      <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
                        Your Score: {quizState.score} out of {questions.length}. A perfect score is required.
                      </Typography>
                      <Button variant="contained" onClick={handleQuizReset} sx={{ borderRadius: 2 }}>
                        Retake Quiz
                      </Button>
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
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#1e3a8a', mb: 2, borderLeft: '4px solid #3b82f6', pl: 2 }}>
              Feedback
            </Typography>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Typography variant="body1" sx={{ mb: 3, color: '#1f2937' }}>
                Please submit your feedback about this Stack Operations simulation.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Your Name" variant="outlined" fullWidth />
                <TextField label="Email (Optional)" variant="outlined" fullWidth />
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
        <Navbar setActivePage={setActivePage} activePage={activePage} />
        {/* THIS IS YOUR ORIGINAL CONTAINER, UNCHANGED, TO PRESERVE SCROLLING */}
        <Container
          key={activePage}
          maxWidth="lg"
          sx={{
            py: 4,
            willChange: 'transform',
            scrollBehavior: 'auto',
            position: 'relative',
            top: 0,
          }}
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
            STACK OPERATIONS
          </Typography>
          {renderContent()}
        </Container>

        {/* --- MODIFICATION: The Snackbar is rendered here, as a SIBLING to the Container --- */}
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

export default ST_template;