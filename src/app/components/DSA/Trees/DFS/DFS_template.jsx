import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Container,
  Divider,
  TextField,
  Collapse,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Alert,
  createTheme,
  ThemeProvider,
  CssBaseline,
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpeedIcon from '@mui/icons-material/Speed';

// Assuming these components exist
import DFS_EX1 from './DFS_EX1';
import DFS_EX2 from './DFS_EX2';
import DFSLab from './DFSLab';
import DFS_Monoco from './DFS_Monoco';

// Reusable Section Component (kept for reference, but no longer used in renderContent)
const Section = ({ title, children }) => (
  <Paper
    elevation={3}
    sx={{
      maxWidth: '1200px',
      mx: 'auto',
      p: { xs: 2, sm: 3, md: 4 },
      borderRadius: 2,
      mb: 4,
      bgcolor: 'white',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'translateY(-4px)' },
    }}
  >
    
    <Box sx={{ color: '#1f2937', lineHeight: 1.6 }}>{children}</Box>
  </Paper>
);

// Navbar Component
const Navbar = ({ setActivePage, activePage }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredExample, setHoveredExample] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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
        px: { xs: 1.5, sm: 2 },
        py: 1,
        textTransform: 'none',
        fontWeight: 600,
        fontSize: { xs: '0.9rem', sm: '1rem' },
        transition: 'all 0.3s ease',
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
      }}
    >
      <Toolbar sx={{ justifyContent: 'center', gap: { xs: 1, sm: 2.5 } }}>
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
        
        {/* Enhanced Examples Dropdown */}
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
              px: { xs: 1.5, sm: 2 },
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: { xs: '0.9rem', sm: '1rem' },
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
            
            
            {/* Examples List */}
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
                  }
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
                    transition: 'all 0.3s ease',
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

const DFS_template = () => {
  const [activePage, setActivePage] = useState('aim');
  const [expanded, setExpanded] = useState({});
  const [quizState, setQuizState] = useState({
    currentQuestion: 0,
    score: 0,
    selectedAnswer: '',
    submitted: false,
    feedback: null,
  });

  const questions = [
    {
      question: 'Each node in a tree points to a:',
      options: [
        'Root (if it exists)',
        'Leaf (if it exists)',
        'Child (if it exists)',
        'None of the above',
      ],
      correctAnswer: 'Child (if it exists)',
      explanation: 'Each node in a tree points to child nodes (if they exist)',
    },
  ];

  const handleExpand = (section) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
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
    setQuizState((prev) => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1,
      selectedAnswer: '',
      submitted: false,
      feedback: null,
    }));
  };

  const handleQuizReset = () => {
    setQuizState({
      currentQuestion: 0,
      score: 0,
      selectedAnswer: '',
      submitted: false,
      feedback: null,
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
                  Why Learn with the DFS Visualizer?
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#1f2937', mb: 2 }}>
                The <strong>DFS Visualizer</strong> brings the Depth-First Search algorithm to life. It transforms an abstract concept into an engaging, interactive experience, making it easier to master DFS for pathfinding, topological sorting, puzzle-solving, and crucial coding interviews.
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
                    Interactive Learning
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                  Understand the recursive or stack-based behavior of DFS.
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Visual Feedback
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                  Visualize traversal from root to deep leaves before backtracking.
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Stack Visualization
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                  Observe the visiting order and how nodes are pushed and popped
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Customization
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
                  { label: 'Grasp DFS Basics', color: 'primary', desc: 'Understand the core concept of depth-first traversal.', icon: <LightbulbOutlinedIcon /> },
                  { label: 'Visualize Traversal', color: 'secondary', desc: 'See the algorithm in action on sample trees.', icon: <PlayArrowIcon /> },
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
                  What is DFS?
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#1f2937', mb: 2 }}>
                <strong>Depth-First Search (DFS)</strong> s a tree traversal algorithm that explores as far as possible along each branch before backtracking. It starts from the root node and dives deep into the tree along a single branch before visiting sibling nodes.
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
                Working Principle
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#1f2937', mb: 2 }}>
              DFS uses a <b>stack</b> data structure (either explicitly or via recursion). It follows the path from the root to the deepest node before backtracking and continuing with other unexplored paths.
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
                <AssignmentOutlinedIcon sx={{ color: '#22c55e', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Traversal Types
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Preorder
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    Root → Left → Right
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                    A → B → D → E → C → F
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Inorder
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    Left → Root → Right
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                    D → B → E → A → F → C
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Postorder
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    Left → Right → Root
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                    D → E → B → F → C → A
                  </Typography>
                </Paper>
                
              </Box>
              <Typography variant="body2" sx={{ color: '#1f2937' }}>
                In a binary tree, DFS generally follows the <b>Preorder → Inorder → Postorder</b>
                </Typography>
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
                <TrendingUpIcon sx={{ color: '#eab308', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Pros & Cons
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Advantages
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                  Requires less memory compared to BFS since it stores only a single path from root to leaf.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                  Can be more efficient in deeper trees where the goal is far from the root.
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Disadvantages
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    Risk of infinite loops in cyclic graphs.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                  Not guaranteed to find the shortest path in weighted or unbalanced trees.
                  </Typography>
                </Paper>
                
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
                    <code>O(n^m)</code> where <code>m</code> is the maximum depth and <code>n</code> is the branching factor.
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Space Complexity
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    <code>O(b × m)</code>, where <code>b</code> is the branching factor and <code>m</code> is the maximum depth.
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
                <PlayArrowIcon sx={{ color: '#3b82f6', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  DFS Algorithm Implementation
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#1f2937', mb: 2 }}>
                The DFS algorithm implemented in this visualizer follows a systematic approach using a stack-based data structure. Here's how the algorithm works step by step.
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
                <AssignmentOutlinedIcon sx={{ color: '#22c55e', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Algorithm Steps
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    1. Initialization
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    • Create a stack and push the root node
                    • Set visit counter to 1
                    • Initialize all nodes as unvisited
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    2. Main Loop
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    • While stack is not empty:
                    • Pop a node from stack
                    • Mark as current node (highlighted in yellow)
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    3. Node Processing
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    • If node is unvisited:
                    • Mark as visited (blue color)
                    • Assign visit order number
                    • Check if target found
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    4. Child Exploration
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    • Push unvisited children to stack
                    • Process from right to left (LIFO)
                    • Continue until stack is empty
                  </Typography>
                </Paper>
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
                  Visual Controls & Features
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Control Buttons
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    • <strong>Reset:</strong> Initialize tree and clear history
                    • <strong>Previous Step:</strong> Go back to previous state
                    • <strong>Next Step:</strong> Execute one DFS step
                    • <strong>Run:</strong> Continuous execution
                    • <strong>Pause:</strong> Stop execution
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Visual Indicators
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    • <strong>Yellow:</strong> Current node being processed
                    • <strong>Blue:</strong> Visited nodes
                    • <strong>Green:</strong> Target node found
                    • <strong>Gray:</strong> Unvisited nodes
                  </Typography>
                </Paper>
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
                <CodeIcon sx={{ color: '#d97706', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  Implementation Details
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#1f2937', mb: 2 }}>
                The visualizer implements a complete DFS algorithm with the following key features:
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Data Structures
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    • <strong>Stack:</strong> LIFO structure for node traversal
                    • <strong>Node Class:</strong> Contains value, children, position, and state
                    • <strong>History:</strong> Tracks all algorithm states for backtracking
                  </Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                    Key Functions
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937' }}>
                    • <strong>dfsStep():</strong> Core algorithm logic
                    • <strong>updateNodeStates():</strong> Visual state management
                    • <strong>drawNodes() & drawEdges():</strong> Rendering functions
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
                <AssignmentOutlinedIcon sx={{ color: '#22c55e', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                  How to Use the Visualizer
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#1f2937', mb: 2 }}>
                <b>Step-by-Step Usage of DFS Visualizer:</b>
              </Typography>
              <Box component="ol" sx={{ color: '#1f2937', mb: 2, pl: 3 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  Click on <b>Reset</b> to initialize the tree structure.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  The search target will be highlighted in the heading.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Click <b>Next Step</b> to explore one node at a time in DFS order (deepest child first).
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Click <b>Run</b> to auto-animate the entire traversal without manual steps.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Click <b>Pause</b> at any time to stop the animation.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Click <b>Prev Step</b> to backtrack to the previous state.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Observe how the nodes are visited and how the algorithm uses the stack-like approach.
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Traversal stops once the target is found or all nodes are visited.
                </Box>
              </Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrowIcon />}
                onClick={() => setActivePage('simulation')}
                sx={{ mt: 1, borderRadius: 2 }}
              >
                Start Simulation
              </Button>
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
            Example 1
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

              <DFS_EX1 />
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
            Example 2
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
             
              <DFS_EX2 />
            </Paper>
          </>
        );
      
         
        
      case 'simulation':
        return <DFSLab />;
      case 'Code':
        return <DFS_Monoco />;
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
                  Share Your Thoughts
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#1f2937', mb: 2 }}>
                Help us improve the DFS Visualizer by sharing your feedback!
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
              Test your knowledge of trees!
            </Typography>
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
              
              <Typography variant="body2" sx={{ color: '#1f2937', mb: 4 }}>
                Mark as complete Save for later
              </Typography>
              <Typography variant="h6" sx={{ color: '#1f2937', mb: 2 }}>
                Quiz
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                  Progress: Question {quizState.currentQuestion + 1}/{questions.length}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(quizState.currentQuestion / questions.length) * 100}
                  sx={{ mt: 1, height: 8, borderRadius: 4, bgcolor: '#e5e7eb', '& .MuiLinearProgress-bar': { bgcolor: '#3b82f6' } }}
                />
                {quizState.currentQuestion === questions.length && (
                  <Typography variant="h6" sx={{ mt: 2, color: '#1e3a8a', fontWeight: 600 }}>
                    Final Score: {quizState.score}/{questions.length} (
                    {((quizState.score / questions.length) * 100).toFixed(0)}%)
                  </Typography>
                )}
              </Box>
              {quizState.currentQuestion < questions.length ? (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1f2937', mb: 2 }}>
                    1. {questions[quizState.currentQuestion].question}
                  </Typography>
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      value={quizState.selectedAnswer}
                      onChange={(e) => handleQuizAnswer(e.target.value)}
                    >
                      {questions[quizState.currentQuestion].options.map((option, index) => {
                        const currentQ = questions[quizState.currentQuestion];
                        return (
                          <FormControlLabel
                            key={index}
                            value={option}
                            control={<Radio />}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {option}
                                {quizState.submitted && option === currentQ.correctAnswer && (
                                  <Box
                                    sx={{
                                      ml: 2,
                                      px: 2,
                                      py: 0.5,
                                      borderRadius: 999,
                                      bgcolor: '#d1fae5',
                                      color: '#065f46',
                                      fontSize: '0.875rem',
                                      fontWeight: 500,
                                    }}
                                  >
                                    Correct
                                  </Box>
                                )}
                                {quizState.submitted && option === quizState.selectedAnswer && option !== currentQ.correctAnswer && (
                                  <Box
                                    sx={{
                                      ml: 2,
                                      px: 2,
                                      py: 0.5,
                                      borderRadius: 999,
                                      bgcolor: '#fee2e2',
                                      color: '#b91c1c',
                                      fontSize: '0.875rem',
                                      fontWeight: 500,
                                    }}
                                  >
                                    Incorrect
                                  </Box>
                                )}
                              </Box>
                            }
                            sx={{
                              borderRadius: 1,
                              p: 1,
                              mb: 1,
                              '&:hover': { bgcolor: '#f3f4f6' },
                            }}
                          />
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  {quizState.feedback && (
                    <Alert severity={quizState.feedback.severity} sx={{ mt: 2, borderRadius: 2 }}>
                      {quizState.feedback.message}
                    </Alert>
                  )}
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleQuizSubmit}
                      disabled={!quizState.selectedAnswer || quizState.submitted}
                      sx={{ borderRadius: 2 }}
                    >
                      Submit
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleQuizNext}
                      disabled={!quizState.submitted}
                      sx={{ borderRadius: 2 }}
                    >
                      Next
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleQuizReset}
                      sx={{ borderRadius: 2, ml: 'auto' }}
                    >
                      Reset Quiz
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ color: '#1f2937', mb: 2 }}>
                    Quiz completed! Try again to improve your score.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleQuizReset}
                    startIcon={<QuizIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Retake Quiz
                  </Button>
                </Box>
              )}
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
      <Box sx={{ minHeight: '100vh', bgcolor: 'white' }}>
        <Navbar setActivePage={setActivePage} activePage={activePage} />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#1e3a8a',
              mb: 4,
              textAlign: 'center',
              transform: 'translateZ(0)',
            }}
          >
            DEPTH FIRST SEARCH
          </Typography>
          {renderContent()}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default DFS_template;