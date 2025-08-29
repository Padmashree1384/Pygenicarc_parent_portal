import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import p5 from 'p5';
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Tooltip,
  IconButton,
  TextField,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

// Import sound files
import stepSoundFile from '/step.mp3';
import successSoundFile from '/success.mp3';
import failSoundFile from '/fail.mp3';

// --- STYLING DEFINITIONS ---
const aestheticTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2c3e50' },
    secondary: { main: '#a9cce3' }, // Visited
    success: { main: '#abebc6' },   // Found
    warning: { main: '#f9e79f' },   // Current
    info: { main: '#e5e7e9' },      // Not Visited
    error: { main: '#f5b7b1' },     // Not Found
    background: {
      default: 'linear-gradient(135deg, #f0f2f5 0%, #e0e7ff 100%)',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
  },
  typography: {
    fontFamily: ['"Inter"', '"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'].join(','),
    h5: {
      fontWeight: 700,
      letterSpacing: 1,
      color: '#2c3e50',
    },
    h6: {
      fontWeight: 700,
      color: '#2c3e50',
    },
    body1: {
      fontWeight: 600,
    },
    body2: {
      fontSize: '0.95rem',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 8px 32px 0 rgba(44, 62, 80, 0.12), 0 1.5px 6px 0 rgba(160,196,255,0.08)',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(2px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: 'none',
          fontWeight: 700,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#2c3e50',
          background: '#ffffff',
          border: '1px solid #e0e0e0',
          '&:hover': {
            background: '#f0f2f5',
            borderColor: '#bdbdbd',
          }
        }
      }
    },
  },
});

const styles = {
  container: {
    p: { xs: 2, sm: 4 },
    background: 'linear-gradient(135deg, #f0f2f5 0%, #e0e7ff 100%)',
  },
  canvasWrapper: {
    position: 'relative',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px 0 rgba(44, 62, 80, 0.12), 0 1.5px 6px 0 rgba(160,196,255,0.08)',
    background: 'rgba(255,255,255,0.95)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasBox: {
    width: '100%',
    maxWidth: 800,
    aspectRatio: '16 / 9',
  },
  stepListBox: {
    height: '250px',
    overflowY: 'auto',
    mt: 1,
    p: 1.5,
    borderRadius: '12px',
    background: 'linear-gradient(145deg, #e2e8f0, #f8fafc)',
    boxShadow: 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#bdc3c7',
      borderRadius: '4px',
    },
  },
};

const LS_EX1 = () => {
  const sketchRef = useRef();
  const [target, setTarget] = useState(25);
  const [inputValue, setInputValue] = useState(25);
  const [status, setStatus] = useState('Ready to search');
  const [stepList, setStepList] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRefs = useRef({});
  const stepListRef = useRef(null);

  const stateRef = useRef({
    arr: [1, 5, 8, 12, 15, 22, 25, 30, 35, 40],
    currentIndex: -1,
    foundIndex: -1,
    searchComplete: false,
    history: [],
  });

  useEffect(() => {
    if (stepListRef.current) {
      stepListRef.current.scrollTop = stepListRef.current.scrollHeight;
    }
  }, [stepList]);

  useLayoutEffect(() => {
    let pInstance = null;
    let running = false;
    let paused = true;
    let stepNumber = 1;

    const preloadAudio = () => {
      try {
        audioRefs.current.step = new Audio(stepSoundFile);
        audioRefs.current.success = new Audio(successSoundFile);
        audioRefs.current.fail = new Audio(failSoundFile);
      } catch (e) { console.error('Audio files not found.', e); }
    };

    const playSound = (soundType) => {
      if (audioRefs.current[soundType]) {
        audioRefs.current[soundType].currentTime = 0;
        audioRefs.current[soundType].play().catch((e) => console.error('Error playing sound:', e));
      }
    };

    const sketch = (p) => {
      p.setup = () => {
        const container = sketchRef.current;
        const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
        canvas.parent(container);
        p.textAlign(p.CENTER, p.CENTER);
        p.textFont(aestheticTheme.typography.fontFamily);
        preloadAudio();
        p.reset();
      };

      p.draw = () => {
        p.background(aestheticTheme.palette.background.paper);
        drawArray(p);
        if (running && !paused && !stateRef.current.searchComplete && p.frameCount % 45 === 0) {
          performStep();
        }
      };

      const drawArray = (p) => {
        const { arr, currentIndex, foundIndex } = stateRef.current;
        const diameter = Math.min(60, (p.width - 40) / arr.length);
        const radius = diameter / 2;
        const spacing = (p.width - 40) / arr.length;
        const startX = p.width / 2 - (arr.length - 1) * spacing / 2;
        const yPos = p.height / 2 + 30;

        for (let i = 0; i < arr.length; i++) {
          const xPos = startX + i * spacing;

          let circleColor = p.color(aestheticTheme.palette.info.main);
          if (i < currentIndex) circleColor = p.color(aestheticTheme.palette.secondary.main);
          if (i === currentIndex) circleColor = p.color(aestheticTheme.palette.warning.main);
          if (i === foundIndex) circleColor = p.color(aestheticTheme.palette.success.main);

          p.stroke(aestheticTheme.palette.primary.main);
          p.strokeWeight(2);
          p.fill(circleColor);
          p.ellipse(xPos, yPos, diameter, diameter);

          p.noStroke();
          p.fill(aestheticTheme.palette.primary.main);
          p.textSize(Math.max(12, diameter * 0.3));
          p.text(arr[i], xPos, yPos);

          p.fill(aestheticTheme.palette.text.secondary);
          p.textSize(12);
          p.text(`[${i}]`, xPos, yPos + radius + 15);

          if (i === currentIndex) {
            p.fill(p.lerpColor(p.color(aestheticTheme.palette.warning.main), p.color('black'), 0.35));
            p.noStroke();
            p.textSize(14);
            p.text("Current", xPos, yPos - radius - 25);
          }
        }
      };

      const performStep = () => {
        stateRef.current.history.push(JSON.parse(JSON.stringify(stateRef.current)));
        let { arr, currentIndex } = stateRef.current;

        currentIndex++;
        stateRef.current.currentIndex = currentIndex;

        if (currentIndex >= arr.length) {
          setStatus(`❌ ${target} not found in the array.`);
          setStepList(prev => [...prev, `Step ${stepNumber++}: ❌ Target not found`]);
          stateRef.current.searchComplete = true;
          running = false; paused = true; setIsPlaying(false);
          playSound('fail');
          return;
        }

        setStatus(`🔎 Checking index ${currentIndex}...`);
        setStepList(prev => [...prev, `Step ${stepNumber++}: Checking index ${currentIndex} (value ${arr[currentIndex]})`]);
        playSound('step');

        if (arr[currentIndex] === target) {
          setStatus(`✅ Found ${target} at index ${currentIndex}!`);
          setStepList(prev => [...prev, `Step ${stepNumber++}: ✅ Found target at index ${currentIndex}`]);
          stateRef.current.foundIndex = currentIndex;
          stateRef.current.searchComplete = true;
          running = false; paused = true; setIsPlaying(false);
          playSound('success');
        }
      };

      p.reset = () => {
        stateRef.current = {
          arr: [1, 5, 8, 12, 15, 22, 25, 30, 35, 40],
          currentIndex: -1,
          foundIndex: -1,
          searchComplete: false,
          history: [],
        };
        stepNumber = 1;
        setStatus('Ready to search');
        setStepList([]);
        setIsPlaying(false);
        running = false; paused = true;
      };

      p.step = () => {
        if (stateRef.current.searchComplete) return;
        paused = true; running = false; setIsPlaying(false);
        performStep();
      };

      p.run = () => {
        if (stateRef.current.searchComplete) return;
        running = true; paused = false; setIsPlaying(true);
      };

      p.pause = () => {
        paused = true; running = false; setIsPlaying(false);
      };

      p.prevStep = () => {
        if (stateRef.current.history.length > 0) {
          const prevState = stateRef.current.history.pop();
          stateRef.current = prevState;
          setStepList(prev => prev.slice(0, -1));
          stepNumber--;
          setStatus(stepNumber > 1 ? `Reverted to Step ${stepNumber - 1}` : "Ready to search");
          setIsPlaying(false); paused = true; running = false;
        }
      };

      pInstance = p;
    };

    const p5Instance = new p5(sketch, sketchRef.current);
    if (sketchRef.current) {
      Object.assign(sketchRef.current, {
        reset: p5Instance.reset,
        step: p5Instance.step,
        run: p5Instance.run,
        pause: p5Instance.pause,
        prevStep: p5Instance.prevStep,
      });
    }

    return () => { p5Instance.remove(); };
  }, [target]);

  const handleReset = () => {
    if (sketchRef.current.reset) {
      sketchRef.current.reset();
    }
  };

  const handleSetTarget = () => {
    const newTarget = parseInt(inputValue);
    if (!isNaN(newTarget)) {
      setTarget(newTarget);
      if (sketchRef.current.reset) {
        sketchRef.current.reset();
      }
    }
  };

  return (
    <ThemeProvider theme={aestheticTheme}>
      <CssBaseline />
      <Box sx={styles.container}>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Find Target "{target}"
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2, alignItems: 'center' }}>
          <TextField
            label="Target Value"
            type="number"
            variant="outlined"
            size="small"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSetTarget()}
            sx={{ width: '140px' }}
          />
          <Button variant="contained" onClick={handleSetTarget}>
            Set & Reset
          </Button>
        </Stack>

        <Box sx={{ p: 1, mb: 2, display: 'flex', justifyContent: 'center', gap: 1.5 }}>
          <Tooltip title="Reset">
            <IconButton onClick={handleReset}><RestartAltIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Previous Step">
            <IconButton onClick={() => sketchRef.current.prevStep()}><ArrowBackIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Next Step">
            <IconButton onClick={() => sketchRef.current.step()}><ArrowForwardIcon /></IconButton>
          </Tooltip>
          <Tooltip title={isPlaying ? "Playing" : "Run"}>
            <IconButton onClick={() => sketchRef.current.run()} sx={{ background: isPlaying ? aestheticTheme.palette.success.main : '#ffffff' }}>
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Pause">
            <IconButton onClick={() => sketchRef.current.pause()}><PauseIcon /></IconButton>
          </Tooltip>
        </Box>

        <Box sx={(theme) => ({ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' })}>
          <Stack direction="row" spacing={2} sx={(theme) => ({ p: theme.spacing(1.5), borderRadius: 2, background: 'rgba(255,255,255,0.7)', flexWrap: 'wrap', justifyContent: 'center' })}>
            <LegendItem color={aestheticTheme.palette.warning.main} text="Current" />
            <LegendItem color={aestheticTheme.palette.secondary.main} text="Visited" />
            <LegendItem color={aestheticTheme.palette.success.main} text="Found" />
            <LegendItem color={aestheticTheme.palette.info.main} text="Not Visited" />
          </Stack>
          <Typography variant="body1" color="text.primary" sx={{ mt: 2 }}>
            Status: {status}
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={8}>
            <Box sx={styles.canvasWrapper}>
              <Box sx={styles.canvasBox}>
                <div ref={sketchRef} style={{ width: '100%', height: '100%' }} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={(theme) => ({ p: { xs: 1.5, md: 2 }, width: '100%', display: 'flex', flexDirection: 'column', gap: theme.spacing(2), mx: 'auto' })}>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Execution Steps</Typography>
                </Stack>
                <Box ref={stepListRef} sx={styles.stepListBox}>
                  {stepList.map((step, index) => (
                    <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', mb: 0.5 }}>
                      {step}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

const LegendItem = ({ color, text }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Box sx={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: color, border: '2px solid rgba(0,0,0,0.1)' }} />
    <Typography variant="body2" sx={{ fontWeight: 500 }}>{text}</Typography>
  </Stack>
);

export default LS_EX1;