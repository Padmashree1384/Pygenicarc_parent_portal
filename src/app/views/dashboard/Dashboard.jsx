import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Paper,
  Divider,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolIcon from '@mui/icons-material/School';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LayersIcon from '@mui/icons-material/Layers';
import LinearScaleIcon from '@mui/icons-material/LinearScale';

// Page Components
import CanvasAnimation from './CanvasAnimation';
import ArrayVisualizer from './ArrayVisualizer';

// --- Theme Definition ---
const theme = createTheme({
  palette: {
    primary: { main: '#3a5a98' },
    secondary: { main: '#4b7be5' },
    accent: { main: '#ff7f50' },
    background: { default: '#f8f9fa', paper: '#ffffff' },
    text: { primary: '#212529', secondary: '#5a6270' },
  },
  typography: {
    fontFamily: "'Montserrat', 'Roboto', 'sans-serif'",
    h1: { fontWeight: 700, fontSize: 'clamp(2.8rem, 5vw, 3.8rem)' },
    h2: { fontWeight: 600, fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' },
    h4: { fontWeight: 600, fontSize: '1.4rem' },
    body1: { fontSize: '1.1rem', lineHeight: 1.7, fontWeight: 400 },
    button: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: '8px', textTransform: 'none' },
      },
    },
  },
});

// --- Animation Variants ---
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.5, ease: 'easeInOut' } },
};
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

// --- Reusable & Internal Components ---
const Section = ({ children, background = 'background.default', py = 10 }) => (
  <Box sx={{ py, backgroundColor: background }}><Container maxWidth="lg">{children}</Container></Box>
);

const FeatureCard = ({ icon, title, description }) => (
  <motion.div variants={itemVariants} style={{ height: '100%' }}>
    <Paper elevation={3} sx={{ p: 4, textAlign: 'center', height: '100%', borderRadius: '12px', border: '1px solid #e0e0e0', transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 15px 30px rgba(58, 90, 152, 0.15)' } }}>
      <Box sx={{ color: 'primary.main', mb: 2 }}>{icon}</Box>
      <Typography variant="h4" gutterBottom>{title}</Typography>
      <Typography variant="body1" color="text.secondary">{description}</Typography>
    </Paper>
  </motion.div>
);

const DataStructureCard = ({ logo, title, description, onClick }) => (
  <motion.div variants={itemVariants} style={{ height: '100%' }} onClick={onClick}>
    <Paper
      variant="outlined"
      sx={{
        p: 4,
        pt: 5,
        textAlign: 'center',
        height: '100%',
        borderRadius: '16px',
        borderColor: 'rgba(0, 0, 0, 0.12)',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        '&:hover': onClick ? {
          transform: 'translateY(-12px)',
          boxShadow: '0 20px 40px rgba(58, 90, 152, 0.18)',
          borderColor: 'primary.main',
        } : {},
      }}
    >
      {logo}
      <Box sx={{ mt: 'auto' }}>
        <Typography variant="h4" gutterBottom>{title}</Typography>
        <Typography variant="body1" color="text.secondary">{description}</Typography>
      </Box>
    </Paper>
  </motion.div>
);

const iconColors = { array: '#54a0ff', tree: '#2ecc71', stack: '#f39c12', queue: '#9b59b6' };

const VisualizerSelection = ({ onCardClick }) => {
  const baseIconStyle = { fontSize: 80, mb: 3 };
  const dsaItems = [
    { id: 'arrays', logo: <DataObjectIcon sx={{ ...baseIconStyle, color: iconColors.array }} />, title: "Arrays", description: "Visualize search and sort algorithms." },
    { id: 'trees', logo: <AccountTreeIcon sx={{ ...baseIconStyle, color: iconColors.tree }} />, title: "Trees", description: "Explore hierarchical data structures." },
    { id: 'stacks', logo: <LayersIcon sx={{ ...baseIconStyle, color: iconColors.stack }} />, title: "Stacks", description: "Understand the LIFO principle." },
    { id: 'queues', logo: <LinearScaleIcon sx={{ ...baseIconStyle, color: iconColors.queue }} />, title: "Queues", description: "See the First-In, First-Out data flow." },
  ];

  return (
    <Section background="transparent">
      <Box id="visualizer-selection-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants}>
          <Typography variant="h2" align="center" sx={{ mb: 8 }}>Choose a Data Structure</Typography>
          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            {dsaItems.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.id}>
                <DataStructureCard {...item} onClick={() => onCardClick(item.id)} />
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Box>
    </Section>
  );
};

const DashboardContent = ({ onCardClick, handleStartLearningClick, isCardSelectionVisible }) => (
  <motion.div key="dashboard-page" initial="initial" animate="animate" exit="exit" variants={pageVariants}>
    <Box sx={{ background: 'linear-gradient(135deg, #3a5a98 30%, #4b7be5 90%)', color: 'white', py: { xs: 12, md: 16 }, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <CanvasAnimation />
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div variants={itemVariants}><Typography variant="h1" component="h1" gutterBottom>Master Data Structures & Algorithms</Typography></motion.div>
          <motion.div variants={itemVariants}><Typography variant="h5" sx={{ my: 3, opacity: 0.9, fontWeight: 400 }}>The intuitive, interactive, and visual way to understand how algorithms work.</Typography></motion.div>
          <motion.div variants={itemVariants}>
            <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={handleStartLearningClick} sx={{ backgroundColor: 'accent.main', fontSize: '1.1rem', py: 1.5, px: 5, '&:hover': { backgroundColor: '#ff6347', transform: 'scale(1.05)' }}}>
              Start Learning Now
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </Box>

    <AnimatePresence>
      {isCardSelectionVisible && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.7, ease: 'easeInOut' }} style={{ overflow: 'hidden' }}>
          <VisualizerSelection onCardClick={onCardClick} />
        </motion.div>
      )}
    </AnimatePresence>

    <Divider sx={{ maxWidth: 'lg', mx: 'auto' }} />

    <Section>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants}>
        <Typography variant="h2" align="center" sx={{ mb: 8 }}>Why Our Platform?</Typography>
        <Grid container spacing={5} justifyContent="center" alignItems="stretch">
          <Grid item xs={12} sm={6} md={4}><FeatureCard icon={<PlayCircleOutlineIcon sx={{ fontSize: 50 }} />} title="Interactive Animations" description="Control the flow of execution and see data change in real-time."/></Grid>
          <Grid item xs={12} sm={6} md={4}><FeatureCard icon={<CodeIcon sx={{ fontSize: 50 }} />} title="Multi-Language Code" description="View synchronized code in Python, C++, and Java."/></Grid>
          <Grid item xs={12} sm={6} md={4}><FeatureCard icon={<SchoolIcon sx={{ fontSize: 50 }} />} title="Comprehensive Learning" description="Each module comes with a clear Aim, Theory, and Procedure."/></Grid>
        </Grid>
      </motion.div>
    </Section>

    <Divider sx={{ maxWidth: 'lg', mx: 'auto' }} />

    <Section background="background.paper">
      <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>Ready to Solidify Your Skills?</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}>From arrays to complex trees, our visualizers give you the 'Aha!' moment. Dive in and build a strong conceptual foundation.</Typography>
        <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={handleStartLearningClick} sx={{ backgroundColor: 'primary.main', fontSize: '1.1rem', py: 1.5, px: 5, '&:hover': { backgroundColor: 'secondary.main', transform: 'scale(1.05)' } }}>
          Start Learning Now
        </Button>
      </motion.div>
    </Section>
  </motion.div>
);

// --- Main Dashboard Component ---
const Dashboard = () => {
  const [activeVisualizer, setActiveVisualizer] = useState(null);
  const [isCardSelectionVisible, setCardSelectionVisible] = useState(false);

  const handleVisualizerSelect = (visualizerId) => {
    console.log('Visualizer selected:', visualizerId); // Debug log
    setActiveVisualizer(visualizerId);
  };

  const handleStartLearningClick = () => {
    setCardSelectionVisible(true);
    setTimeout(() => {
      document.getElementById('visualizer-selection-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleNavigation = (visualizerId) => {
    console.log('Navigation triggered:', visualizerId); // Debug log
    setActiveVisualizer(prev => prev === visualizerId ? null : visualizerId);
  };

  const renderActivePage = () => {
    console.log('Rendering page with activeVisualizer:', activeVisualizer); // Debug log
    if (activeVisualizer) {
      return (
        <ArrayVisualizer
          key={activeVisualizer}
          activeVisualizer={activeVisualizer}
          onNavClick={handleNavigation}
        />
      );
    }

    return (
      <DashboardContent
        onCardClick={handleVisualizerSelect}
        handleStartLearningClick={handleStartLearningClick}
        isCardSelectionVisible={isCardSelectionVisible}
      />
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        {renderActivePage()}
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default Dashboard;