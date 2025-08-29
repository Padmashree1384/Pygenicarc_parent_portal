import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
    info: { main: '#e5e7e9' },      // Unsorted
    success: { main: '#abebc6' },   // Sorted
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
    h5: { fontWeight: 700, letterSpacing: 1 },
    h6: { fontWeight: 700 },
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
    MuiButton: {
      styleOverrides: { root: { borderRadius: 14, textTransform: 'none', fontWeight: 700 } },
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
    p: { xs: 2, sm: 3 },
    background: aestheticTheme.palette.background.default,
  },
  canvasWrapper: {
    position: 'relative',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px 0 rgba(44, 62, 80, 0.12)',
    background: aestheticTheme.palette.background.paper,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '450px',
    height: '100%'
  },
  stepListBox: {
    flexGrow: 1,
    overflowY: 'auto',
    mt: 1,
    p: 1.5,
    borderRadius: '12px',
    background: 'linear-gradient(145deg, #e2e8f0, #f8fafc)',
    boxShadow: 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
    '&::-webkit-scrollbar': { width: '8px' },
    '&::-webkit-scrollbar-thumb': { background: '#bdc3c7', borderRadius: '4px' },
  },
};

const BBSLab = ({ showSnackbar }) => {
  const canvasRef = useRef(null);
  const stepListRef = useRef(null);
  const [arraySize, setArraySize] = useState(10);
  const [manualArrayInputs, setManualArrayInputs] = useState(Array(10).fill(''));
  const [status, setStatus] = useState('Ready to sort');
  const [stepList, setStepList] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mode, setMode] = useState('auto');
  const [history, setHistory] = useState([]);

  const stateRef = useRef({
    arr: [],
    i: 0,
    j: 0,
    sorting: false,
    successPlayed: false,
    animation: { inProgress: false, fromIndex: -1, toIndex: -1, progress: 0 },
  });

  const p5InstanceRef = useRef(null);
  const audioRefs = useRef({});
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (stepListRef.current) {
      stepListRef.current.scrollTop = stepListRef.current.scrollHeight;
    }
  }, [stepList]);

  const resetState = useCallback((newArr = null) => {
    clearTimeout(timeoutRef.current);
    const arrToUse = newArr || stateRef.current.arr;
    stateRef.current = {
      arr: [...arrToUse],
      i: 0,
      j: 0,
      sorting: false,
      successPlayed: false,
      animation: { inProgress: false, fromIndex: -1, toIndex: -1, progress: 0 },
    };
    setStatus('Ready to sort');
    setStepList([]);
    setIsPlaying(false);
    setIsAnimating(false);
    setHistory([]);
  }, []);

  const generateRandomArray = useCallback((size) => {
    const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
    resetState(newArr);
  }, [resetState]);

  useEffect(() => {
    if (mode === 'auto') {
      generateRandomArray(arraySize);
    } else {
      const newEmptyArr = Array(arraySize).fill('');
      resetState(newEmptyArr);
      setManualArrayInputs(newEmptyArr);
    }
  }, [mode, arraySize, generateRandomArray, resetState]);


  useLayoutEffect(() => {
    const sketch = (p) => {
      p.setup = () => {
        const container = canvasRef.current;
        const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
        canvas.parent(container);
        p.textAlign(p.CENTER, p.CENTER);
        p.textFont(aestheticTheme.typography.fontFamily);
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
        }
      };

      p.windowResized = () => {
        const container = canvasRef.current;
        if (container) p.resizeCanvas(container.offsetWidth, container.offsetHeight);
      };

      const drawArray = (p) => {
        const { arr, i: outerI, j, animation } = stateRef.current;
        if (!arr || arr.length === 0) return;
        const n = arr.length;

        const barWidth = (p.width - 60) / n;
        const startX = p.width / 2 - (n * barWidth) / 2;
        const yPos = p.height - 40;

        for (let i = 0; i < n; i++) {
          const h = p.map(arr[i] || 0, 0, 100, 0, p.height - 100);
          let xPos = startX + i * barWidth;

          let barColor;
          const isSorted = !stateRef.current.sorting && outerI >= n - 1;

          if (isSorted) barColor = p.color(aestheticTheme.palette.success.main);
          else if (animation.inProgress && (i === animation.fromIndex || i === animation.toIndex)) barColor = p.color(aestheticTheme.palette.error.main);
          else if ((i === j || i === j + 1) && stateRef.current.sorting) barColor = p.color(aestheticTheme.palette.warning.main);
          else if (i >= n - outerI) barColor = p.color(aestheticTheme.palette.success.main);
          else barColor = p.color(aestheticTheme.palette.info.main);

          if (animation.inProgress) {
            if (i === animation.fromIndex) xPos = p.lerp(startX + animation.fromIndex * barWidth, startX + animation.toIndex * barWidth, animation.progress);
            else if (i === animation.toIndex) xPos = p.lerp(startX + animation.toIndex * barWidth, startX + animation.fromIndex * barWidth, animation.progress);
          }

          p.fill(barColor);
          p.stroke(aestheticTheme.palette.primary.main);
          p.strokeWeight(2);
          p.rect(xPos, yPos - h, barWidth, h);

          p.noStroke();
          p.fill(aestheticTheme.palette.text.primary);
          p.textSize(Math.max(12, barWidth * 0.3));
          p.text(arr[i], xPos + barWidth / 2, yPos - h - 20);
        }
      };
      p5InstanceRef.current = p;
    };

    let p5Instance = new p5(sketch, canvasRef.current);
    audioRefs.current.step = new Audio(stepSoundFile);
    audioRefs.current.success = new Audio(successSoundFile);
    audioRefs.current.fail = new Audio(failSoundFile);
    return () => { p5Instance.remove(); };
  }, []);

  const playSound = (soundType) => {
    const audio = audioRefs.current[soundType];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.error("Audio failed:", e));
    }
  };

  const performStep = useCallback(() => {
    const s = stateRef.current;
    if (s.i >= s.arr.length - 1) {
      if (!s.successPlayed) {
        const message = "✅ Sorting Complete!";
        setStatus(message);
        setStepList(prev => [...prev, message]);
        playSound('success');
        s.successPlayed = true;
        s.sorting = false;
      }
      setIsPlaying(false);
      return true;
    }

    setHistory(prev => [...prev, JSON.parse(JSON.stringify(s))]);

    let messageBody = '';
    if (s.j < s.arr.length - s.i - 1) {
      const a = s.arr[s.j];
      const b = s.arr[s.j + 1];
      messageBody += `Comparing ${a} and ${b}.`;

      if (a > b) {
        messageBody += ` Swapping.`;
        s.animation = { inProgress: true, fromIndex: s.j, toIndex: s.j + 1, progress: 0 };
        setIsAnimating(true);
      } else {
        messageBody += ` No swap.`;
        s.j++;
      }
    } else {
      s.j = 0;
      s.i++;
      messageBody += `Pass ${s.i} complete. Starting next pass.`;
    }

    setStepList(prevStepList => {
      const fullMessage = `Step ${prevStepList.length + 1}: ${messageBody}`;
      setStatus(fullMessage);
      return [...prevStepList, fullMessage];
    });

    playSound('step');
    return false;
  }, []);

  const endAnimation = () => {
    const s = stateRef.current;
    const { fromIndex, toIndex } = s.animation;
    [s.arr[fromIndex], s.arr[toIndex]] = [s.arr[toIndex], s.arr[fromIndex]];
    s.animation.inProgress = false;
    s.j++;
    setIsAnimating(false);
  };

  const handleRun = () => {
    if (isPlaying) {
      setIsPlaying(false);
      clearTimeout(timeoutRef.current);
      return;
    }

    if (!stateRef.current.sorting) stateRef.current.sorting = true;
    setIsPlaying(true);

    const runStep = () => {
      if (stateRef.current.animation.inProgress) {
        timeoutRef.current = setTimeout(runStep, 100);
        return;
      }

      const isDone = performStep();
      if (!isDone) {
        timeoutRef.current = setTimeout(runStep, 800);
      } else {
        setIsPlaying(false);
      }
    };
    runStep();
  };

  const handleStep = () => {
    const s = stateRef.current;
    if (s.i >= s.arr.length - 1 && !s.animation.inProgress) {
      showSnackbar("Sorting complete. Please reset.", "warning");
      return;
    }
    if (!s.sorting) s.sorting = true;
    performStep();
  };

  const handlePrevStep = () => {
    clearTimeout(timeoutRef.current);
    setIsPlaying(false);
    setIsAnimating(false);

    if (history.length > 0) {
      const prevState = history.pop();
      setHistory([...history]);
      stateRef.current = prevState;
      setStepList(prev => prev.slice(0, -1));
      setStatus("Reverted to previous step");
    }
  };

  const handleReset = useCallback(() => {
    if (mode === 'auto') {
      generateRandomArray(arraySize);
    } else {
      resetState(Array(arraySize).fill(''));
    }
  }, [mode, arraySize, generateRandomArray, resetState]);


  const handleArraySizeChange = (e) => {
    let size = parseInt(e.target.value) || 0;
    size = Math.max(1, Math.min(20, size));
    setArraySize(size);
  };

  const applyManualArray = () => {
    const arr = manualArrayInputs.map(Number).filter(n => !isNaN(n) && manualArrayInputs[manualArrayInputs.map(Number).indexOf(n)] !== '');
    if (arr.length !== arraySize) {
      showSnackbar(`Please enter exactly ${arraySize} valid numbers.`, "error");
      return;
    }
    resetState(arr);
    showSnackbar("Manual array applied successfully!", "success");
  };

  return (
    <ThemeProvider theme={aestheticTheme}>
      <CssBaseline />
      <Paper sx={styles.container}>
        <Typography variant="h5" align="center" sx={{ mb: 2 }}>
          Simulator
        </Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Mode</InputLabel>
                <Select value={mode} label="Mode" onChange={(e) => setMode(e.target.value)}>
                  <MenuItem value="auto">Auto Generate</MenuItem>
                  <MenuItem value="manual">Manual Input</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Array Size" type="number" value={arraySize} onChange={handleArraySizeChange} inputProps={{ min: 1, max: 20 }} />
            </Grid>
            {mode === 'manual' && (
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 1 }}>Enter array values (1-100):</Typography>
                <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                  {manualArrayInputs.map((val, i) => (
                    <TextField
                      key={i}
                      size="small"
                      type="number"
                      value={val}
                      onChange={e => {
                        const inputValue = e.target.value;
                        if (inputValue === '' || (Number(inputValue) >= 1 && Number(inputValue) <= 100)) {
                          const newInputs = [...manualArrayInputs];
                          newInputs[i] = inputValue;
                          setManualArrayInputs(newInputs);
                        }
                      }}
                      sx={{ minWidth: 60 }}
                      inputProps={{ min: 1, max: 100 }}
                    />
                  ))}
                </Stack>
                <Button variant="outlined" size="small" onClick={applyManualArray} sx={{ mt: 1 }}>Apply Manual Array & Reset</Button>
              </Grid>
            )}
          </Grid>
        </Paper>

        <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Stack direction="row" spacing={2} sx={{ p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.7)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <LegendItem color={aestheticTheme.palette.warning.main} text="Comparing" />
            <LegendItem color={aestheticTheme.palette.error.main} text="Swapping" />
            <LegendItem color={aestheticTheme.palette.success.main} text="Sorted" />
            <LegendItem color={aestheticTheme.palette.info.main} text="Unsorted" />
          </Stack>
          <Typography variant="body1" color="text.primary" sx={{ mt: 2 }}>
            Status: {status}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Box sx={styles.canvasWrapper} ref={canvasRef} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 2, minHeight: '450px', maxHeight: '450px', display: 'flex', flexDirection: 'column' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Execution Steps</Typography>
                <Stack direction="row" spacing={0.5}>
                  <Tooltip title="Reset"><IconButton size="small" onClick={handleReset}><RestartAltIcon /></IconButton></Tooltip>
                  <Tooltip title="Previous Step"><IconButton size="small" onClick={handlePrevStep} disabled={isAnimating || isPlaying || history.length === 0}><ArrowBackIcon /></IconButton></Tooltip>
                  <Tooltip title="Next Step"><IconButton size="small" onClick={handleStep} disabled={isPlaying || isAnimating}><ArrowForwardIcon /></IconButton></Tooltip>
                  <Tooltip title={isPlaying ? "Pause" : "Run"}>
                    <IconButton size="small" onClick={handleRun} sx={{ background: isPlaying ? aestheticTheme.palette.warning.main : aestheticTheme.palette.success.main }}>
                      {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
              <Box sx={styles.stepListBox} ref={stepListRef}>
                {stepList.map((step, index) => (
                  <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', mb: 0.5 }}>
                    {step}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  );
};

const LegendItem = ({ color, text }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Box sx={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: color, border: '2px solid rgba(0,0,0,0.1)' }} />
    <Typography variant="body2" sx={{ fontWeight: 500 }}>{text}</Typography>
  </Stack>
);

export default BBSLab;