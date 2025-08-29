import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Material UI Imports ---
import {
  Box, Button, TextField, Typography, Paper, Grid,
  Stack, ThemeProvider, createTheme, IconButton, Tooltip, Divider, keyframes
} from '@mui/material';

// --- Material UI Icons ---
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// --- Sound Imports ---
import enqueueSoundFile from '/step.mp3';
import dequeueSoundFile from '/success.mp3';
import failSoundFile from '/fail.mp3';

// --- Theme Definition ---
const theme = createTheme({
  palette: {
    primary: { main: '#2196f3' },
    secondary: { main: '#673ab7' },
    success: { main: '#4CAF50' },
    warning: { main: '#FFC107' },
    error: { main: '#d32f2f' },
    background: { default: '#f4f6f8', paper: '#ffffff' },
  },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', h5: { fontWeight: 700 }, h6: { fontWeight: 600 } },
  components: {
    MuiPaper: { styleOverrides: { root: { boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.08)', borderRadius: '16px' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: '8px', textTransform: 'none', fontWeight: '600' } } }
  },
});

// --- Constants & Keyframes ---
const ELEMENT_WIDTH = 55;
const ELEMENT_HEIGHT = 55;
const fadeIn = keyframes`from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); }`;
const fadeOut = keyframes`from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.5); }`;


const CQOP = ({ showSnackbar }) => {
  const [maxSize, setMaxSize] = useState(8);
  const [sizeInput, setSizeInput] = useState('8');
  const [queue, setQueue] = useState(Array(8).fill(null));
  const [front, setFront] = useState(-1);
  const [rear, setRear] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const [stepList, setStepList] = useState([]);
  const [isAnimating, setIsAnimating] = useState({ index: -1, type: null });
  const logInputRef = useRef(null);

  const handleReset = useCallback(() => {
    setQueue(Array(maxSize).fill(null));
    setFront(-1);
    setRear(-1);
    setStepList([]);
    setInputValue('');
    setIsAnimating({ index: -1, type: null });
  }, [maxSize]);

  useEffect(() => {
    handleReset();
    if (maxSize > 0) {
      showSnackbar(`Queue size set to ${maxSize}.`, 'info');
    }
  }, [maxSize, handleReset, showSnackbar]);

  useEffect(() => {
    if (logInputRef.current) {
      logInputRef.current.scrollTop = logInputRef.current.scrollHeight;
    }
  }, [stepList]);

  const playSound = (type) => {
    const audio =
      type === 'enqueue' ? new Audio(enqueueSoundFile) :
        type === 'dequeue' ? new Audio(dequeueSoundFile) :
          new Audio(failSoundFile);
    audio.play().catch(e => console.error("Audio play failed", e));
  };

  const handleEnqueue = () => {
    if (isAnimating.type) return;
    if (inputValue.trim() === '') { showSnackbar("Please enter a value.", 'warning'); return; }
    if ((rear + 1) % maxSize === front) { playSound('fail'); showSnackbar("Queue Overflow!", 'error'); return; }

    const value = inputValue.trim();
    let newRear;
    let newFront = front;

    if (front === -1) {
      newFront = 0;
      newRear = 0;
    } else {
      newRear = (rear + 1) % maxSize;
    }

    playSound('enqueue');
    setInputValue('');
    setFront(newFront);
    setRear(newRear);
    setIsAnimating({ index: newRear, type: 'enqueue' });

    setTimeout(() => {
      const newQueue = [...queue];
      newQueue[newRear] = value;
      setQueue(newQueue);
      setStepList(prev => [...prev, `Enqueued "${value}" at index ${newRear}`]);
      setIsAnimating({ index: -1, type: null });
    }, 500);
  };

  const handleDequeue = () => {
    if (isAnimating.type) return;
    if (front === -1) { playSound('fail'); showSnackbar("Queue Underflow!", 'error'); return; }

    const dequeuedValue = queue[front];
    playSound('dequeue');
    setIsAnimating({ index: front, type: 'dequeue' });

    setTimeout(() => {
      const newQueue = [...queue];
      newQueue[front] = null;
      setQueue(newQueue);

      if (front === rear) {
        setFront(-1);
        setRear(-1);
        setStepList(prev => [...prev, `Dequeued "${dequeuedValue}". Queue is now empty.`]);
        showSnackbar(`Dequeued "${dequeuedValue}". Queue is now empty.`, 'success');
      } else {
        setFront((prevFront) => (prevFront + 1) % maxSize);
        setStepList(prev => [...prev, `Dequeued "${dequeuedValue}" from index ${front}`]);
        showSnackbar(`Dequeued "${dequeuedValue}" from the queue.`, 'success');
      }
      setIsAnimating({ index: -1, type: null });
    }, 500);
  };

  const handleFrontElement = () => {
    if (front === -1) { showSnackbar('Queue is empty.', 'warning'); return; }
    const frontValue = queue[front];
    setStepList(prev => [...prev, `Front is: "${frontValue}" at index ${front}`]);
    showSnackbar(`Front element is: "${frontValue}"`, 'info');
  };

  const handleIsEmpty = () => {
    const isEmpty = front === -1;
    showSnackbar(isEmpty ? "Queue is Empty" : "Queue is not Empty", 'info');
    setStepList(prev => [...prev, `Is Empty? ${isEmpty}`]);
  };

  const handleIsFull = () => {
    const isFull = (rear + 1) % maxSize === front;
    showSnackbar(isFull ? "Queue is Full" : "Queue is not Full", 'info');
    setStepList(prev => [...prev, `Is Full? ${isFull}`]);
  };

  const handleSizeInputChange = (event) => {
    const value = event.target.value;
    if (value === '') {
      setSizeInput('');
      return;
    }
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 12) {
      setSizeInput(value);
      if (maxSize !== numValue) {
        setMaxSize(numValue);
      }
    }
  };

  const handleSizeInputBlur = () => {
    const numValue = parseInt(sizeInput, 10);
    if (isNaN(numValue) || numValue < 1 || numValue > 12) {
      const defaultSize = 8;
      setSizeInput(String(defaultSize));
      if (maxSize !== defaultSize) {
        setMaxSize(defaultSize);
      }
    }
  };

  const handleCopySteps = () => {
    if (stepList.length === 0) { showSnackbar("No steps to copy.", "warning"); return; }
    navigator.clipboard.writeText(stepList.join('\n'))
      .then(() => showSnackbar("✅ Steps copied to clipboard!", 'success'))
      .catch(() => showSnackbar("❌ Failed to copy steps.", 'error'));
  };

  const getPositionOnCircle = (index, radius, currentMaxSize, containerSize = 350) => {
    if (currentMaxSize === 0 || isNaN(currentMaxSize)) return { top: '50%', left: '50%' };
    const angle = (index / currentMaxSize) * 2 * Math.PI - (Math.PI / 2);
    const centerX = containerSize / 2;
    const centerY = containerSize / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { top: `${y}px`, left: `${x}px` };
  };

  const renderPointer = (type, index, isOverlapped) => {
    const isFront = type === 'front';
    const label = isFront ? 'Front' : 'Rear';
    const color = isFront ? theme.palette.error.main : theme.palette.secondary.main;
    const radius = isOverlapped && !isFront ? 250 : 220;
    const position = getPositionOnCircle(index, radius, maxSize);

    const rotationDeg = (index / maxSize) * 360;

    return (
      <Stack
        sx={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          transform: 'translate(-50%, -50%)',
          zIndex: 4,
          transition: 'all 0.5s ease-in-out',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <Typography sx={{ fontWeight: 'bold', color: color, mb: 0.5 }}>
          {label}
        </Typography>
        <Box
          sx={{
            width: 0,
            height: 0,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderTop: `10px solid ${color}`,
            transform: `rotate(${rotationDeg}deg)`,
            transition: 'transform 0.5s ease-in-out',
          }}
        />
      </Stack>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', width: '100%', p: { xs: 2, md: 3 } }}>
        <Typography variant="h5" align="center" sx={{ mb: 3 }}>
          Simulator
        </Typography>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={7}>
            <Paper sx={{ height: '100%', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 450, overflow: 'hidden' }}>
              <Box sx={{ position: 'relative', width: 350, height: 350 }}>

                {[...Array(maxSize).keys()].map(index => {
                  const value = queue[index];
                  const { top, left } = getPositionOnCircle(index, 140, maxSize);
                  return (
                    <Box key={`slot-${index}`} sx={{
                      position: 'absolute', left, top,
                      transform: 'translate(-50%, -50%)',
                      width: `${ELEMENT_WIDTH}px`, height: `${ELEMENT_HEIGHT}px`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 2,
                      borderRadius: '50%',
                      border: `1px solid ${theme.palette.grey[400]}`,
                      background: `radial-gradient(circle at 30% 30%, #ffffff, ${theme.palette.grey[200]})`,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1), inset 0 2px 4px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                    }}>
                      <Typography sx={{ position: 'absolute', top: '-25px', color: 'text.secondary', fontSize: '0.9rem' }}>
                        {index}
                      </Typography>
                      {value !== null && (
                        <Box sx={{
                          width: '100%', height: '100%',
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 'bold', fontSize: '1rem',
                          animation: `${isAnimating.index === index ? (isAnimating.type === 'enqueue' ? fadeIn : fadeOut) : ''} 0.5s forwards`,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          zIndex: 3
                        }}>
                          {value}
                        </Box>
                      )}
                    </Box>
                  );
                })}

                {front !== -1 && (
                  <>
                    {renderPointer('front', front, front === rear)}
                    {renderPointer('rear', rear, front === rear)}
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: { xs: 2, md: 2.5 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Stack spacing={2.5} sx={{ flexGrow: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Controls</Typography>
                  <TextField
                    fullWidth size="small" label="Queue Size (1-12)" type="number"
                    value={sizeInput}
                    onChange={handleSizeInputChange}
                    onBlur={handleSizeInputBlur}
                    inputProps={{ min: 1, max: 12 }}
                    sx={{ mb: 2 }}
                  />
                  <Stack direction="row" spacing={1}>
                    <TextField fullWidth size="small" label="Value to Enqueue" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleEnqueue()} disabled={!!isAnimating.type} />
                    <Button variant="contained" onClick={handleEnqueue} startIcon={<AddCircleOutlineIcon />} disabled={!!isAnimating.type}>Enqueue</Button>
                  </Stack>
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={6}><Button fullWidth variant="outlined" startIcon={<RemoveCircleOutlineIcon />} onClick={handleDequeue} disabled={!!isAnimating.type}>Dequeue</Button></Grid>
                    <Grid item xs={6}><Button fullWidth variant="outlined" startIcon={<VisibilityIcon />} onClick={handleFrontElement} disabled={!!isAnimating.type}>Front</Button></Grid>
                    <Grid item xs={6}><Button fullWidth variant="outlined" startIcon={<HelpOutlineIcon />} onClick={handleIsEmpty} disabled={!!isAnimating.type}>Is Empty?</Button></Grid>
                    <Grid item xs={6}><Button fullWidth variant="outlined" startIcon={<CheckCircleIcon />} onClick={handleIsFull} disabled={!!isAnimating.type}>Is Full?</Button></Grid>
                  </Grid>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Execution Log</Typography>
                    <Tooltip title="Reset Queue & Log"><IconButton onClick={() => { setSizeInput('8'); setMaxSize(8); }} color="error" disabled={!!isAnimating.type}><RestartAltIcon /></IconButton></Tooltip>
                  </Box>
                  <Box sx={{ flexGrow: 1, minHeight: 200, bgcolor: '#fafafa', borderRadius: 1, p: 1.5, border: '1px solid #eee', mt: 1 }}>
                    <TextField value={stepList.length > 0 ? stepList.join('\n') : "Perform an operation..."} multiline fullWidth readOnly variant="standard" inputRef={logInputRef} sx={{ height: '100%', '& .MuiInputBase-root': { height: '100%', alignItems: 'flex-start' }, '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '0.85rem', overflowY: 'auto !important', height: '100% !important' } }} InputProps={{ disableUnderline: true }} />
                  </Box>
                </Box>
                <Button variant="contained" color="secondary" size="small" startIcon={<ContentCopyIcon />} onClick={handleCopySteps}>Copy Log</Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default CQOP;