import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Grid,
    Stack,
    ThemeProvider,
    createTheme,
    IconButton,
    Tooltip,
    Divider,
    keyframes,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

// Assuming sound files are in the public directory
import pushSoundFile from '/step.mp3';
import popSoundFile from '/success.mp3';
import failSoundFile from '/fail.mp3';

const theme = createTheme({
    palette: {
        primary: { main: '#2196f3', light: '#64b5f6', contrastText: '#fff' },
        secondary: { main: '#673ab7' },
        success: { main: '#4CAF50' },
        warning: { main: '#FFC107' },
        error: { main: '#d32f2f' },
        background: { default: '#eceff1', paper: '#ffffff' },
        text: { secondary: '#546e7a' },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h5: { fontWeight: 700 },
        h6: { fontWeight: 600 },
    },
    components: {
        MuiPaper: { styleOverrides: { root: { boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.08)', borderRadius: '16px' } } },
        MuiButton: { styleOverrides: { root: { borderRadius: '8px', textTransform: 'none', fontWeight: '600' } } },
    },
});

const ELEMENT_HEIGHT = 40;
const ELEMENT_MARGIN = 8;
const TOTAL_ELEMENT_SPACE = ELEMENT_HEIGHT + ELEMENT_MARGIN;

const pushAnimation = (stackSize) => keyframes`
  from { bottom: 100%; opacity: 0.7; }
  to { bottom: ${stackSize * TOTAL_ELEMENT_SPACE + ELEMENT_MARGIN}px; opacity: 1; }
`;

const popAnimation = (stackSize) => keyframes`
  from { bottom: ${stackSize * TOTAL_ELEMENT_SPACE + ELEMENT_MARGIN}px; opacity: 1; }
  to { bottom: 100%; opacity: 0; }
`;

// --- MODIFICATION: Component now accepts 'showSnackbar' as a prop ---
const ST_OP = ({ showSnackbar }) => {
    const [stack, setStack] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const MAX_STACK_SIZE = 8;
    const [stepList, setStepList] = useState([]);
    const [animatingElement, setAnimatingElement] = useState(null);
    const logInputRef = useRef(null);

    // --- MODIFICATION: All local Snackbar state and handlers have been removed ---

    useEffect(() => {
        if (logInputRef.current) {
            logInputRef.current.scrollTop = logInputRef.current.scrollHeight;
        }
    }, [stepList]);

    const playSound = (type) => {
        const audio =
            type === 'push'
                ? new Audio(pushSoundFile)
                : type === 'pop'
                    ? new Audio(popSoundFile)
                    : new Audio(failSoundFile);
        audio.play().catch((e) => console.error('Audio play failed', e));
    };

    const handleAnimationEnd = () => {
        if (animatingElement?.type === 'push') {
            setStack((prev) => [...prev, animatingElement.value]);
            setStepList((prev) => [...prev, `Pushed "${animatingElement.value}"`]);
        }
        setAnimatingElement(null);
    };

    const handlePush = () => {
        if (animatingElement) return;
        if (inputValue.trim() === '') {
            showSnackbar('Please enter a value to push.', 'warning'); // Uses prop
            return;
        }
        if (stack.length >= MAX_STACK_SIZE) {
            playSound('fail');
            showSnackbar('Stack Overflow: Maximum size reached!', 'error'); // Uses prop
            return;
        }
        const value = inputValue.trim();
        setInputValue('');
        playSound('push');
        setAnimatingElement({ value, type: 'push' });
    };

    const handlePop = () => {
        if (animatingElement) return;
        if (stack.length === 0) {
            playSound('fail');
            showSnackbar('Stack Underflow: Cannot pop from an empty stack.', 'error'); // Uses prop
            return;
        }
        const poppedValue = stack[stack.length - 1];
        setAnimatingElement({ value: poppedValue, type: 'pop' });
        setStack(stack.slice(0, -1));
        playSound('pop');
        setStepList((prev) => [...prev, `Popped "${poppedValue}"`]);
        showSnackbar(`Popped "${poppedValue}" from the stack.`, 'success'); // Uses prop
    };

    const handlePeek = () => {
        if (stack.length === 0) {
            showSnackbar('Stack is empty. Nothing to peek.', 'warning'); // Uses prop
            return;
        }
        const top = stack[stack.length - 1];
        setStepList((prev) => [...prev, `Peeked: "${top}"`]);
        showSnackbar(`Top element is: "${top}"`, 'info'); // Uses prop
    };

    const handleIsEmpty = () => {
        const empty = stack.length === 0;
        setStepList((prev) => [...prev, `Stack is ${empty ? 'Empty' : 'Not Empty'}`]);
        showSnackbar(empty ? 'Stack is Empty' : 'Stack is Not Empty', 'info'); // Uses prop
    };

    const handleSize = () => {
        const size = stack.length;
        setStepList((prev) => [...prev, `Size of Stack: ${size}`]);
        showSnackbar(`Current stack size is: ${size}`, 'info'); // Uses prop
    };

    const handleReset = () => {
        setStack([]);
        setStepList([]);
        setInputValue('');
        setAnimatingElement(null);
        showSnackbar('Stack has been reset.', 'info'); // Uses prop
    };

    const handleCopySteps = () => {
        if (stepList.length === 0) {
            showSnackbar('No steps to copy.', 'warning'); // Uses prop
            return;
        }
        navigator.clipboard
            .writeText(stepList.join('\n'))
            .then(() => showSnackbar('✅ Steps copied to clipboard!', 'success')) // Uses prop
            .catch(() => showSnackbar('❌ Failed to copy steps.', 'error')); // Uses prop
    };

    const currentAnimation = animatingElement?.type === 'push' ? pushAnimation(stack.length) : popAnimation(stack.length);
    const stackContainerHeight = MAX_STACK_SIZE * TOTAL_ELEMENT_SPACE + ELEMENT_MARGIN;

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Grid container spacing={3} alignItems="stretch">
                    <Grid item xs={12} md={7}>
                        <Paper
                            sx={{
                                height: '100%',
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxSizing: 'border-box',
                            }}
                        >
                            <Box
                                sx={{
                                    width: { xs: '60%', sm: '45%' },
                                    maxWidth: '220px',
                                    height: `${stackContainerHeight}px`,
                                    position: 'relative',
                                    bgcolor: '#bdbdbd',
                                    borderRadius: '12px',
                                    boxShadow: 'inset 5px 5px 10px #9e9e9e, inset -5px -5px 10px #dcdcdc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: '8px',
                                        right: '8px',
                                        height: '100%',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {stack.map((value, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                position: 'absolute',
                                                bottom: `${index * TOTAL_ELEMENT_SPACE + ELEMENT_MARGIN}px`,
                                                width: '100%',
                                                bgcolor: 'primary.main',
                                                color: 'primary.contrastText',
                                                height: `${ELEMENT_HEIGHT}px`,
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                                            }}
                                        >
                                            {value}
                                        </Box>
                                    ))}
                                    {animatingElement && (
                                        <Box
                                            onAnimationEnd={handleAnimationEnd}
                                            sx={{
                                                position: 'absolute',
                                                width: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                animation: `${currentAnimation} 0.8s forwards ease-in-out`,
                                            }}
                                        >
                                            {animatingElement.type === 'pop' && <ArrowUpwardIcon sx={{ color: 'error.main', mb: 0.5 }} />}
                                            <Box
                                                sx={{
                                                    bgcolor: 'secondary.light',
                                                    color: 'primary.contrastText',
                                                    width: '100%',
                                                    height: `${ELEMENT_HEIGHT}px`,
                                                    borderRadius: '6px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: '1rem',
                                                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                                                }}
                                            >
                                                {animatingElement.value}
                                            </Box>
                                            {animatingElement.type === 'push' && <ArrowDownwardIcon sx={{ color: 'success.main', mt: 0.5 }} />}
                                        </Box>
                                    )}
                                </Box>
                                {stack.length === 0 && !animatingElement && (
                                    <Typography variant="subtitle1" sx={{ zIndex: 1, userSelect: 'none', color: '#616161', fontWeight: 500 }}>
                                        Stack is Empty
                                    </Typography>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Paper sx={{ p: { xs: 2, md: 2.5 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Stack spacing={2.5} sx={{ flexGrow: 1 }}>
                                <Box>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Controls
                                    </Typography>
                                    <Stack direction="row" spacing={1}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Value to Push"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handlePush()}
                                            disabled={!!animatingElement}
                                        />
                                        <Button variant="contained" onClick={handlePush} startIcon={<AddCircleOutlineIcon />} disabled={!!animatingElement}>
                                            Push
                                        </Button>
                                    </Stack>
                                    <Grid container spacing={1} sx={{ mt: 1 }}>
                                        <Grid item xs={6}>
                                            <Button fullWidth variant="outlined" startIcon={<RemoveCircleOutlineIcon />} onClick={handlePop} disabled={!!animatingElement}>
                                                Pop
                                            </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button fullWidth variant="outlined" startIcon={<VisibilityIcon />} onClick={handlePeek} disabled={!!animatingElement}>
                                                Peek
                                            </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button fullWidth variant="outlined" startIcon={<HelpOutlineIcon />} onClick={handleIsEmpty} disabled={!!animatingElement}>
                                                Is Empty?
                                            </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button fullWidth variant="outlined" startIcon={<FormatListNumberedIcon />} onClick={handleSize} disabled={!!animatingElement}>
                                                Get Size
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6">Execution Log</Typography>
                                        <Tooltip title="Reset Stack & Log">
                                            <IconButton onClick={handleReset} color="error" disabled={!!animatingElement}>
                                                <RestartAltIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Box sx={{ flexGrow: 1, minHeight: 200, bgcolor: '#fafafa', borderRadius: 1, p: 1.5, border: '1px solid #eee', mt: 1 }}>
                                        <TextField
                                            value={stepList.length > 0 ? stepList.join('\n') : 'Perform an operation to see the log...'}
                                            multiline
                                            fullWidth
                                            readOnly
                                            variant="standard"
                                            inputRef={logInputRef}
                                            sx={{
                                                height: '100%',
                                                '& .MuiInputBase-root': { height: '100%', alignItems: 'flex-start' },
                                                '& .MuiInputBase-input': {
                                                    fontFamily: 'monospace',
                                                    fontSize: '0.85rem',
                                                    overflowY: 'auto !important',
                                                    height: '100% !important',
                                                    color: stepList.length === 0 ? '#999' : 'inherit',
                                                },
                                            }}
                                            InputProps={{ disableUnderline: true }}
                                        />
                                    </Box>
                                </Box>
                                <Button variant="contained" color="secondary" size="small" startIcon={<ContentCopyIcon />} onClick={handleCopySteps}>
                                    Copy Log
                                </Button>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
};

export default ST_OP;