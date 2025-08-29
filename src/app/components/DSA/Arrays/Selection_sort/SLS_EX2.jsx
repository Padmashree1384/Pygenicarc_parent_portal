import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import p5 from 'p5';
import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Tooltip,
  IconButton,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Import sound files
import stepSoundFile from '/step.mp3';
import successSoundFile from '/success.mp3';

// --- STYLING DEFINITIONS ---
const aestheticTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2c3e50' },
    info: { main: '#e5e7e9' },      // Unsorted
    success: { main: '#abebc6' },   // Sorted or Current Minimum
    warning: { main: '#f9e79f' },   // Comparing
    error: { main: '#f5b7b1' },     // Swapping
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
    h5: { fontWeight: 700, letterSpacing: 1, color: '#2c3e50' },
    h6: { fontWeight: 700, color: '#2c3e50' },
    body1: { fontWeight: 600 },
    body2: { fontSize: '0.95rem' },
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
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#2c3e50',
          background: '#ffffff',
          border: '1px solid #e0e0e0',
          '&:hover': { background: '#f0f2f5', borderColor: '#bdbdbd' }
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
    position: 'relative', borderRadius: '24px', overflow: 'hidden',
    boxShadow: '0 8px 32px 0 rgba(44, 62, 80, 0.12)',
    background: 'rgba(255,255,255,0.95)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  canvasBox: { width: '100%', maxWidth: 800, aspectRatio: '16 / 9' },
  stepListBox: {
    height: '250px', overflowY: 'auto', mt: 1, p: 1.5,
    borderRadius: '12px',
    background: 'linear-gradient(145deg, #e2e8f0, #f8fafc)',
    boxShadow: 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
    '&::-webkit-scrollbar': { width: '8px' },
    '&::-webkit-scrollbar-thumb': { background: '#bdc3c7', borderRadius: '4px' },
  },
};

const SLS_EX2 = () => {
  const sketchRef = useRef();
  const toastRef = useRef();
  const stepListRef = useRef(null);
  const [status, setStatus] = useState('Ready to sort');
  const [stepList, setStepList] = useState([]);
  const [isSorted, setIsSorted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const audioRefs = useRef({});

  const stateRef = useRef({
    arr: [],
    originalArr: [14, 34, 92, 22, 22, 11, 70, 1, 2, 105, 61, 119],
    i: 0,
    j: 1,
    minIndex: 0,
    stepCount: 0,
    sorting: false,
    paused: true,
    runMode: false,
    successPlayed: false,
    animation: { inProgress: false, fromIndex: -1, toIndex: -1, progress: 0 },
  });

  useEffect(() => {
    if (stepListRef.current) {
      stepListRef.current.scrollTop = stepListRef.current.scrollHeight;
    }
  }, [stepList]);

  useLayoutEffect(() => {
    let pInstance = null;

    const preloadAudio = () => {
      try {
        audioRefs.current.step = new Audio(stepSoundFile);
        audioRefs.current.success = new Audio(successSoundFile);
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
        const s = stateRef.current;

        if (s.animation.inProgress) {
          s.animation.progress += 0.05;
          if (s.animation.progress >= 1) {
            endAnimation();
          }
        } else if (s.sorting && !s.paused && s.runMode && p.frameCount % 20 === 0) {
          performStep();
        }
      };

      const drawArray = (p) => {
        const { arr, i: outerI, j, minIndex, animation } = stateRef.current;
        if (arr.length === 0) return;
        const barWidth = (p.width - 60) / arr.length;
        const startX = p.width / 2 - (arr.length * barWidth) / 2;
        const yPos = p.height - 40;

        for (let k = 0; k < arr.length; k++) {
          const h = p.map(arr[k], 0, Math.max(...stateRef.current.originalArr), 0, p.height - 100);
          let xPos = startX + k * barWidth;
          let barColor;

          if (isSorted) barColor = p.color(aestheticTheme.palette.success.main);
          else if (animation.inProgress && (k === animation.fromIndex || k === animation.toIndex)) barColor = p.color(aestheticTheme.palette.error.main);
          else if (k === minIndex) barColor = p.color('#32cd32'); // Specific green for current minimum
          else if (k === j) barColor = p.color(aestheticTheme.palette.warning.main);
          else if (k < outerI) barColor = p.color(aestheticTheme.palette.success.main);
          else barColor = p.color(aestheticTheme.palette.info.main);

          if (animation.inProgress) {
            if (k === animation.fromIndex) xPos = p.lerp(startX + animation.fromIndex * barWidth, startX + animation.toIndex * barWidth, animation.progress);
            else if (k === animation.toIndex) xPos = p.lerp(startX + animation.toIndex * barWidth, startX + animation.fromIndex * barWidth, animation.progress);
          }

          p.fill(barColor);
          p.stroke(aestheticTheme.palette.primary.main);
          p.strokeWeight(2);
          p.rect(xPos, yPos - h, barWidth, h);
          p.noStroke();
          p.fill(aestheticTheme.palette.text.primary);
          p.textSize(Math.max(12, barWidth * 0.2));
          p.text(arr[k], xPos + barWidth / 2, yPos - h - 20);
        }
      };

      const performStep = () => {
        const s = stateRef.current;
        if (isSorted || s.animation.inProgress) return;

        if (s.i < s.arr.length - 1) {
          if (s.j < s.arr.length) {
            let stepMsg;
            if (s.arr[s.j] < s.arr[s.minIndex]) {
              s.minIndex = s.j;
              stepMsg = `Step ${++s.stepCount}: New minimum found: ${s.arr[s.j]}`;
            } else {
              stepMsg = `Step ${++s.stepCount}: Comparing ${s.arr[s.j]} with current minimum ${s.arr[s.minIndex]}`;
            }
            s.j++;
            setStatus(stepMsg);
            setStepList(prev => [...prev, stepMsg]);
            playSound('step');
          } else {
            if (s.minIndex !== s.i) {
              const msg = `Step ${++s.stepCount}: Swapping minimum ${s.arr[s.minIndex]} with element ${s.arr[s.i]}`;
              setStatus(msg);
              setStepList(prev => [...prev, msg]);
              s.animation = { inProgress: true, fromIndex: s.i, toIndex: s.minIndex, progress: 0 };
              setIsAnimating(true);
              s.paused = true;
            } else {
              const msg = `Step ${++s.stepCount}: Element ${s.arr[s.i]} is already in correct place.`;
              setStatus(msg);
              setStepList(prev => [...prev, msg]);
              s.i++;
              s.j = s.i + 1;
              s.minIndex = s.i;
            }
          }
        } else {
          finishSort();
        }
      };

      const endAnimation = () => {
        const s = stateRef.current;
        const { fromIndex, toIndex } = s.animation;
        [s.arr[fromIndex], s.arr[toIndex]] = [s.arr[toIndex], s.arr[fromIndex]];
        s.animation.inProgress = false;

        s.i++;
        s.j = s.i + 1;
        s.minIndex = s.i;

        setIsAnimating(false);
        if (!s.runMode) s.paused = true;
        else s.paused = false;
      };

      const finishSort = () => {
        const s = stateRef.current;
        const message = `✅ Sorting Complete in ${s.stepCount} steps!`;
        setStatus(message);
        if (!isSorted) setStepList(prev => [...prev, message]);
        if (!s.successPlayed) {
          playSound('success');
          s.successPlayed = true;
        }
        s.sorting = false;
        s.runMode = false;
        s.paused = true;
        setIsPlaying(false);
        setIsSorted(true);
      };

      p.reset = () => {
        const s = stateRef.current;
        s.arr = [...s.originalArr];
        s.i = 0;
        s.j = 1;
        s.minIndex = 0;
        s.stepCount = 0;
        s.sorting = false;
        s.paused = true;
        s.runMode = false;
        s.successPlayed = false;
        s.animation = { inProgress: false, fromIndex: -1, toIndex: -1, progress: 0 };
        setStatus('Ready to sort');
        setStepList([]);
        setIsSorted(false);
        setIsPlaying(false);
        setIsAnimating(false);
      };

      p.step = () => {
        if (isSorted) return;
        if (!stateRef.current.sorting) stateRef.current.sorting = true;
        performStep();
      };

      p.run = () => {
        if (isSorted) return;
        const s = stateRef.current;
        if (!s.sorting) s.sorting = true;
        s.paused = false;
        s.runMode = true;
        setIsPlaying(true);
      };

      p.pause = () => {
        stateRef.current.paused = true;
        stateRef.current.runMode = false;
        setIsPlaying(false);
      };

      pInstance = p;
    };

    const p5Instance = new p5(sketch, sketchRef.current);
    if (sketchRef.current) {
      Object.assign(sketchRef.current, { reset: p5Instance.reset, step: p5Instance.step, run: p5Instance.run, pause: p5Instance.pause });
    }
    return () => p5Instance.remove();
  }, []);

  const copySteps = async () => {
    try {
      await navigator.clipboard.writeText(stepList.join('\n'));
      const toast = toastRef.current;
      if (toast) {
        toast.innerText = '✅ Steps copied to clipboard!';
        toast.style.visibility = 'visible';
        toast.style.opacity = 1;
        setTimeout(() => {
          toast.style.opacity = 0;
          toast.style.visibility = 'hidden';
        }, 2000);
      }
    } catch {
      alert('❌ Failed to copy steps.');
    }
  };

  return (
    <ThemeProvider theme={aestheticTheme}>
      <CssBaseline />
      <Box sx={styles.container}>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Example 2
          </Typography>
        </Box>

        <Box sx={{ p: 1, mb: 2, display: 'flex', justifyContent: 'center', gap: 1.5 }}>
          <Tooltip title="Reset"><IconButton onClick={() => sketchRef.current.reset()}><RestartAltIcon /></IconButton></Tooltip>
          <Tooltip title="Next Step"><IconButton onClick={() => sketchRef.current.step()} disabled={isSorted || isPlaying || isAnimating}><ArrowForwardIcon /></IconButton></Tooltip>
          <Tooltip title={isPlaying ? "Playing" : "Run"}><IconButton onClick={() => sketchRef.current.run()} disabled={isSorted || isPlaying || isAnimating} sx={{ background: isPlaying ? aestheticTheme.palette.success.main : '#ffffff' }}><PlayArrowIcon /></IconButton></Tooltip>
          <Tooltip title="Pause"><IconButton onClick={() => sketchRef.current.pause()} disabled={isSorted || !isPlaying}><PauseIcon /></IconButton></Tooltip>
        </Box>

        <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Stack direction="row" spacing={2} sx={{ p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.7)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <LegendItem color={aestheticTheme.palette.warning.main} text="Comparing" />
            <LegendItem color={aestheticTheme.palette.error.main} text="Swapping" />
            <LegendItem color={'#32cd32'} text="Current Minimum" />
            <LegendItem color={aestheticTheme.palette.success.main} text="Sorted" />
            <LegendItem color={aestheticTheme.palette.info.main} text="Unsorted" />
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
            <Paper sx={{ p: { xs: 1.5, md: 2 }, width: '100%', display: 'flex', flexDirection: 'column', gap: 2, mx: 'auto' }}>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Execution Steps</Typography>
                  <Tooltip title="Copy Steps"><IconButton onClick={copySteps} size="small"><ContentCopyIcon fontSize="small" /></IconButton></Tooltip>
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

      <div ref={toastRef} style={{
        visibility: 'hidden', minWidth: '200px', backgroundColor: '#323232', color: '#fff',
        textAlign: 'center', borderRadius: '8px', padding: '12px 16px', position: 'fixed',
        bottom: '30px', right: '30px', zIndex: 9999, fontSize: '14px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)', opacity: 0,
        transition: 'visibility 0s, opacity 0.3s ease-in-out'
      }}></div>
    </ThemeProvider>
  );
};

const LegendItem = ({ color, text }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Box sx={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: color, border: '2px solid rgba(0,0,0,0.1)' }} />
    <Typography variant="body2" sx={{ fontWeight: 500 }}>{text}</Typography>
  </Stack>
);

export default SLS_EX2;