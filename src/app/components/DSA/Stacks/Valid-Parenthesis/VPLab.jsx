import React, { useState, useRef, useEffect, useCallback } from 'react';
import p5 from 'p5';

// --- Material UI Imports ---
import {
  Box, Button, TextField, Typography, Paper, Grid, Snackbar, Alert,
  Stack, ThemeProvider, createTheme, IconButton, Tooltip, Divider, keyframes
} from '@mui/material';

// --- Material UI Icons ---
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DoneIcon from '@mui/icons-material/Done';

// --- Sound Imports ---
import stepSoundFile from '/step.mp3';
import successSoundFile from '/success.mp3';
import failSoundFile from '/fail.mp3';

// --- Theme Definition ---
const theme = createTheme({
  palette: {
    primary: { main: '#2196f3' },
    secondary: { main: '#673ab7' },
    success: { main: '#4CAF50' },
    warning: { main: '#FFC107' },
    error: { main: '#d32f2f' },
    background: { default: '#eceff1', paper: '#ffffff' },
  },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', h5: { fontWeight: 700 }, h6: { fontWeight: 600 } },
  components: {
    MuiPaper: { styleOverrides: { root: { boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.08)', borderRadius: '16px' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: '8px', textTransform: 'none', fontWeight: '600' } } }
  },
});

// --- Constants & Keyframes for Stack Visualization ---
const ELEMENT_HEIGHT = 40;
const ELEMENT_MARGIN = 8;
const TOTAL_ELEMENT_SPACE = ELEMENT_HEIGHT + ELEMENT_MARGIN;
const MAX_STACK_SIZE = 8;

const pushAnimation = (stackSize) => keyframes`
  from { bottom: 100%; opacity: 0.7; }
  to { bottom: ${stackSize * TOTAL_ELEMENT_SPACE + ELEMENT_MARGIN}px; opacity: 1; }
`;

const popAnimation = (stackSize) => keyframes`
  from { bottom: ${stackSize * TOTAL_ELEMENT_SPACE + ELEMENT_MARGIN}px; opacity: 1; }
  to { bottom: 100%; opacity: 0; }
`;

// --- MODIFICATION: Component now accepts 'showSnackbar' as a prop ---
const VPLab = ({ showSnackbar }) => {
  const canvasRef = useRef();
  const [expression, setExpression] = useState('');
  const [manualExpressionInput, setManualExpressionInput] = useState('');
  const [tokens, setTokens] = useState([]);
  const [index, setIndex] = useState(0);
  const [stack, setStack] = useState([]);
  const [stepList, setStepList] = useState([]);
  const [history, setHistory] = useState([]);
  const [isValid, setIsValid] = useState(null);
  const [isExpressionSet, setIsExpressionSet] = useState(false);
  const logInputRef = useRef(null);

  // --- MODIFICATION: Removed snackbar state ---
  const [animatingElement, setAnimatingElement] = useState(null);
  const [nextState, setNextState] = useState(null);
  const audioRefs = useRef({});

  // --- Sound and General Hooks ---
  useEffect(() => {
    audioRefs.current.step = new Audio(stepSoundFile);
    audioRefs.current.success = new Audio(successSoundFile);
    audioRefs.current.fail = new Audio(failSoundFile);
  }, []);

  const playSound = (soundType) => {
    if (audioRefs.current[soundType]) {
      audioRefs.current[soundType].currentTime = 0;
      audioRefs.current[soundType].play().catch(e => console.error("Audio error:", e));
    }
  };

  useEffect(() => {
    if (logInputRef.current) {
      logInputRef.current.scrollTop = logInputRef.current.scrollHeight;
    }
  }, [stepList]);

  // --- p5.js Canvas for Expression Visualization ---
  const drawExpression = useCallback((p, currentIsValid, currentIndex, currentTokens) => {
    p.background(255);
    p.textFont('monospace', 24);
    p.textAlign(p.CENTER, p.CENTER);

    const charWidth = p.textWidth('W');
    const totalWidth = currentTokens.length * charWidth;
    let startX = p.width / 2 - totalWidth / 2;

    currentTokens.forEach((token, i) => {
      if (i === currentIndex) {
        p.fill(theme.palette.warning.main);
        p.noStroke();
        p.rect(startX - charWidth / 2, p.height / 2 - 20, charWidth, 40, 5);
        p.fill(0);
      } else if (i < currentIndex) {
        p.fill(180);
      } else {
        p.fill(0);
      }
      p.text(token, startX, p.height / 2);
      startX += charWidth;
    });
  }, []);

  useEffect(() => {
    const sketch = new p5((p) => {
      p.setup = () => {
        const parentDiv = canvasRef.current;
        const canvas = p.createCanvas(parentDiv.offsetWidth, 80);
        canvas.parent(parentDiv);
      };
      p.windowResized = () => {
        const parentDiv = canvasRef.current;
        if (parentDiv) p.resizeCanvas(parentDiv.offsetWidth, 80);
      };
      p.draw = () => {
        drawExpression(p, isValid, index, tokens);
      };
    });
    return () => sketch.remove();
  }, [drawExpression, isValid, index, tokens]);

  // --- MODIFICATION: Removed local showSnackbar and handleCloseSnackbar functions ---

  // This new function checks if the process is complete and sets the final status
  const checkCompletion = (finalStack, finalIndex) => {
    if (finalIndex >= tokens.length) {
      const finalStackIsEmpty = finalStack.length === 0;
      setIsValid(finalStackIsEmpty);
      if (finalStackIsEmpty) {
        playSound('success');
        showSnackbar("Validation Complete: Parentheses are valid!", "success");
      } else {
        playSound('fail');
        showSnackbar("Validation Complete: Invalid - Unmatched opening brackets remain.", "error");
      }
    }
  };

  const handleAnimationEnd = () => {
    if (nextState) {
      if (nextState.stack !== undefined) setStack(nextState.stack);
      if (nextState.index !== undefined) setIndex(nextState.index);
      if (nextState.stepList !== undefined) setStepList(nextState.stepList);
      if (nextState.history !== undefined) setHistory(nextState.history);
      if (nextState.isValid !== undefined) setIsValid(nextState.isValid);

      checkCompletion(nextState.stack, nextState.index);

      setNextState(null);
    }
    setAnimatingElement(null);
  };

  const handleSetExpression = () => {
    if (manualExpressionInput.trim() === '') {
      showSnackbar('Please enter an expression.', 'warning');
      return;
    }
    setExpression(manualExpressionInput);
    setTokens(manualExpressionInput.split(''));
    setStack([]);
    setStepList([]);
    setIndex(0);
    setIsValid(null);
    setHistory([]);
    setIsExpressionSet(true);
    showSnackbar('Expression set! Click "Next Step" to start.', 'success');
  };

  const performStep = () => {
    if (!isExpressionSet || animatingElement || isValid !== null || index >= tokens.length) return;

    playSound('step');
    const token = tokens[index];
    const newStack = [...stack];
    let newStepList = [...stepList];
    const finalHistory = [...history, { stack, index, stepList, isValid }];

    if (['(', '{', '['].includes(token)) {
      if (newStack.length >= MAX_STACK_SIZE) {
        showSnackbar("Stack is full!", "error");
        return;
      }
      newStack.push(token);
      newStepList.push(`⬆️ Pushed '${token}' to stack.`);
      setNextState({ stack: newStack, index: index + 1, stepList: newStepList, history: finalHistory });
      setAnimatingElement({ value: token, type: 'push' });
    } else if ([')', '}', ']'].includes(token)) {
      const lastOpen = newStack.length > 0 ? newStack[newStack.length - 1] : undefined;
      const isMatch = (lastOpen === '(' && token === ')') || (lastOpen === '{' && token === '}') || (lastOpen === '[' && token === ']');

      if (isMatch) {
        newStack.pop();
        newStepList.push(`✅ Matched '${lastOpen}' with '${token}'. Popping.`);
        setNextState({ stack: newStack, index: index + 1, stepList: newStepList, history: finalHistory });
        setAnimatingElement({ value: lastOpen, type: 'pop' });
      } else {
        playSound('fail');
        newStepList.push(`❌ Mismatch! Stack top: '${lastOpen}', current: '${token}'.`);
        setIsValid(false);
        setStepList(newStepList);
        setIndex(index + 1);
        setHistory(finalHistory);
        showSnackbar("Invalid: Mismatched brackets!", "error");
        return;
      }
    } else {
      const newIndex = index + 1;
      newStepList.push(`⏭️ Skipping non-parenthesis character: '${token}'`);
      setIndex(newIndex);
      setStepList(newStepList);
      setHistory(finalHistory);
      checkCompletion(stack, newIndex);
    }
  };

  const undoStep = () => {
    if (animatingElement || history.length === 0) return;
    const last = history[history.length - 1];
    setStack(last.stack);
    setIndex(last.index);
    setStepList(last.stepList);
    setIsValid(last.isValid);
    setHistory(prev => prev.slice(0, -1));
  };

  const handleReset = () => {
    setStack([]);
    setStepList([]);
    setIndex(0);
    setIsValid(null);
    setHistory([]);
    setAnimatingElement(null);
    setNextState(null);
    setExpression('');
    setManualExpressionInput('');
    setTokens([]);
    setIsExpressionSet(false);
    showSnackbar('Simulator has been reset.', 'info');
  };

  const stackContainerHeight = (MAX_STACK_SIZE * TOTAL_ELEMENT_SPACE) + ELEMENT_MARGIN;
  const currentAnimation = animatingElement?.type === 'push' ? pushAnimation(stack.length) : popAnimation(stack.length);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', width: '100%', p: { xs: 2, md: 3 } }}>
        <Typography variant="h5" align="center" sx={{ mb: 3 }}>
          Simulator
        </Typography>

        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={7}>
            <Paper sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Box ref={canvasRef} sx={{ width: '100%', height: '80px', mb: 3 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem' }}>Stack</Typography>
                <Box sx={{ width: '120px', height: `${stackContainerHeight}px`, position: 'relative', bgcolor: '#bdbdbd', borderRadius: '12px', boxShadow: 'inset 5px 5px 10px #9e9e9e, inset -5px -5px 10px #dcdcdc' }}>
                  <Box sx={{ position: 'absolute', bottom: 0, left: '8px', right: '8px', height: '100%', overflow: 'hidden' }}>
                    {stack.map((value, idx) => (
                      <Box key={idx} sx={{ position: 'absolute', bottom: `${(idx * TOTAL_ELEMENT_SPACE) + ELEMENT_MARGIN}px`, width: '100%', bgcolor: 'primary.main', color: 'primary.contrastText', height: `${ELEMENT_HEIGHT}px`, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>{value}</Box>
                    ))}
                    {animatingElement && (
                      <Box onAnimationEnd={handleAnimationEnd} sx={{ position: 'absolute', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: `${currentAnimation} 0.8s forwards ease-in-out` }}>
                        {animatingElement.type === 'pop' && <ArrowUpwardIcon sx={{ color: 'error.main', mb: 0.5 }} />}
                        <Box sx={{ bgcolor: 'secondary.light', color: 'primary.contrastText', width: '100%', height: `${ELEMENT_HEIGHT}px`, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>{animatingElement.value}</Box>
                        {animatingElement.type === 'push' && <ArrowDownwardIcon sx={{ color: 'success.main', mt: 0.5 }} />}
                      </Box>
                    )}
                  </Box>
                  {stack.length === 0 && !animatingElement && (<Typography variant="subtitle1" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#616161' }}>Empty</Typography>)}
                </Box>
                {isValid !== null && (
                  <Alert severity={isValid ? "success" : "error"} sx={{ mt: 2, fontWeight: 'bold' }}>
                    {isValid ? "VALID" : "INVALID"}
                  </Alert>
                )}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: { xs: 2, md: 2.5 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Stack spacing={2.5} sx={{ flexGrow: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Controls</Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <TextField fullWidth size="small" label="Enter Expression" value={manualExpressionInput} onChange={(e) => setManualExpressionInput(e.target.value)} placeholder="e.g., ({[]})" />
                    <Button variant="contained" onClick={handleSetExpression} startIcon={<DoneIcon />}>Set</Button>
                  </Stack>
                  <Grid container spacing={1}>
                    <Grid item xs={6}><Button fullWidth variant="contained" startIcon={<ArrowForwardIcon />} onClick={performStep} disabled={!isExpressionSet || !!animatingElement || isValid !== null}>Next Step</Button></Grid>
                    <Grid item xs={6}><Button fullWidth variant="outlined" startIcon={<ArrowBackIcon />} onClick={undoStep} disabled={!isExpressionSet || !!animatingElement || history.length === 0}>Prev Step</Button></Grid>
                  </Grid>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Execution Log</Typography>
                    <Tooltip title="Reset"><IconButton onClick={handleReset} color="error"><RestartAltIcon /></IconButton></Tooltip>
                  </Box>
                  <Box sx={{ flexGrow: 1, minHeight: 200, bgcolor: '#fafafa', borderRadius: 1, p: 1.5, border: '1px solid #eee', mt: 1 }}>
                    <TextField value={stepList.length > 0 ? stepList.join('\n') : "Enter an expression and click 'Set'..."} multiline fullWidth readOnly variant="standard" inputRef={logInputRef} sx={{ height: '100%', '& .MuiInputBase-root': { height: '100%', alignItems: 'flex-start' }, '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '0.85rem', overflowY: 'auto !important', height: '100% !important' } }} InputProps={{ disableUnderline: true }} />
                  </Box>
                </Box>
                <Button variant="contained" color="secondary" size="small" startIcon={<ContentCopyIcon />} onClick={() => navigator.clipboard.writeText(stepList.join('\n'))}>Copy Log</Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
        {/* --- MODIFICATION: Removed the <Snackbar> component from here --- */}
      </Box>
    </ThemeProvider>
  );
};

export default VPLab;