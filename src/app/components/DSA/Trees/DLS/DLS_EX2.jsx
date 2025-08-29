import React, { useEffect, useRef, useState } from 'react';
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

// --- STYLING & THEME DEFINITIONS ---
const aestheticTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2c3e50' },
    secondary: { main: '#89CFF0' },
    success: { main: '#b9fbc0' },
    warning: { main: '#FFD700' },
    info: { main: '#E0E0E0' },
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
      fontWeight: 800,
      letterSpacing: 1,
      color: '#2c3e50',
      textAlign: 'center',
      marginBottom: '16px',
    },
    h6: {
      fontWeight: 700,
      color: '#2c3e50',
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
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: '#2c3e50',
          color: '#ffffff',
          borderRadius: '14px',
          boxShadow: '0 4px 20px 0 rgba(44, 62, 80, 0.2)',
        },
      },
    },
  },
});

const styles = {
  container: {
    pt: 2,
    pb: 4,
    px: { xs: 2, sm: 4 },
    background: aestheticTheme.palette.background.default,
    minHeight: '100vh',
  },
  canvasWrapper: {
    position: 'relative',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px 0 rgba(44, 62, 80, 0.12)',
    background: 'rgba(255,255,255,0.95)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
  },
  stepListBox: {
    overflowY: 'auto',
    mt: 1,
    p: 1.5,
    borderRadius: 3,
    background: 'linear-gradient(90deg, #e0e7ff 0%, #f0f2f5 100%)',
    border: '1.5px solid #e0e0e0',
    boxShadow: '0 1px 4px 0 rgba(160,196,255,0.08)',
  },
};

const DLS_EX2 = () => {
  const sketchRef = useRef();
  const stepListRef = useRef(null);
  const [stepList, setStepList] = useState([]);
  const [statusText, setStatusText] = useState('Status: Ready');
  const [isPlaying, setIsPlaying] = useState(false);

  const DEFAULT_TARGET = 'J';
  const DEFAULT_DEPTH_LIMIT = 3;

  const visitCounter = useRef(1);
  const stepNumber = useRef(1);
  const nodes = useRef([]);
  const root = useRef(null);
  const stack = useRef([]);
  const current = useRef(null);
  const running = useRef(false);
  const paused = useRef(false);
  const searchComplete = useRef(false);
  const history = useRef([]);
  const target = useRef(DEFAULT_TARGET);
  const depthLimit = useRef(DEFAULT_DEPTH_LIMIT);
  const traversedEdges = useRef([]);

  const [targetInput, setTargetInput] = useState(DEFAULT_TARGET);
  const [depthInput, setDepthInput] = useState(DEFAULT_DEPTH_LIMIT);

  const audioRefs = useRef({});
  const p5Instance = useRef(null);

  function layoutTree(node, x, y, xSpacing, ySpacing) {
    node.targetX = x;
    node.targetY = y;
    if (node.children.length === 2) {
      layoutTree(node.children[0], x - xSpacing, y + ySpacing, xSpacing / 2, ySpacing);
      layoutTree(node.children[1], x + xSpacing, y + ySpacing, xSpacing / 2, ySpacing);
    } else if (node.children.length === 1) {
      layoutTree(node.children[0], x, y + ySpacing, xSpacing / 2, ySpacing);
    }
  }

  class Node {
    constructor(value) {
      this.value = value;
      this.x = 0;
      this.y = 0;
      this.targetX = 0;
      this.targetY = 0;
      this.children = [];
      this.visited = false;
      this.found = false;
      this.visitOrder = null;
      this.depth = 0;
    }
  }

  useEffect(() => {
    if (!p5Instance.current) {
      audioRefs.current.step = new Audio(stepSoundFile);
      audioRefs.current.success = new Audio(successSoundFile);
      audioRefs.current.fail = new Audio(failSoundFile);

      const sketch = (p) => {
        p.setup = () => {
          const container = sketchRef.current;
          const cnv = p.createCanvas(container.offsetWidth, container.offsetHeight);
          cnv.parent(container);
          setupTree(p);
        };

        p.draw = () => {
          p.background(aestheticTheme.palette.background.paper);
          drawEdges(p);
          drawNodes(p);
          if (running.current && !paused.current && !searchComplete.current && p.frameCount % 60 === 0) {
            dlsStepWithChecks();
          }
        };
      };

      p5Instance.current = new p5(sketch, sketchRef.current);
    }

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (stepListRef.current) {
      stepListRef.current.scrollTop = stepListRef.current.scrollHeight;
    }
  }, [stepList]);

  const setupTree = (p) => {
    const A = new Node('A'); const B = new Node('B');
    const C = new Node('C'); const D = new Node('D');
    const E = new Node('E'); const F = new Node('F');
    const G = new Node('G'); const H = new Node('H');
    const I = new Node('I'); const J = new Node('J');
    const K = new Node('K'); const L = new Node('L');
    const M = new Node('M'); const N = new Node('N');
    const O = new Node('O');

    A.children.push(B, C);
    B.children.push(D, E);
    C.children.push(F, G);
    D.children.push(H, I);
    E.children.push(J, K);
    F.children.push(L, M);
    G.children.push(N, O);

    nodes.current = [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O];
    root.current = A;

    const assignDepths = (node, depth) => {
      node.depth = depth;
      node.children.forEach(child => assignDepths(child, depth + 1));
    };
    assignDepths(root.current, 0);

    const w = p.width;
    const h = p.height;
    layoutTree(root.current, w / 2, h * 0.1, w / 4, h / 5);

    nodes.current.forEach(node => {
      node.x = node.targetX;
      node.y = node.targetY;
    });

    resetTraversal();
    setStatusText("✅ Tree built. Ready to search!");
  };

  const resetTraversal = () => {
    target.current = targetInput.toUpperCase();
    depthLimit.current = parseInt(depthInput, 10) || 0;

    stack.current = [root.current];
    current.current = null;
    visitCounter.current = 1;
    stepNumber.current = 1;
    running.current = false;
    paused.current = false;
    searchComplete.current = false;
    history.current = [];
    traversedEdges.current = [];
    nodes.current.forEach(n => {
      n.visited = false;
      n.found = false;
      n.visitOrder = null;
    });
    setStepList([]);
    setStatusText('Status: Ready');
  };

  const dlsStep = () => {
    if (stack.current.length === 0) return;

    history.current.push({
      stack: stack.current.map(n => n.value),
      current: current.current ? current.current.value : null,
      nodes: JSON.parse(JSON.stringify(nodes.current)),
      traversedEdges: [...traversedEdges.current],
      stepList: [...stepList, `Step ${stepNumber.current}: `],
      statusText: statusText,
    });

    const lastCurrent = current.current;
    current.current = stack.current.pop();

    if (lastCurrent && current.current) {
      traversedEdges.current.push({ from: lastCurrent, to: current.current });
    }

    if (current.current.depth > depthLimit.current) {
      logStep(`Cutoff: Skipping ${current.current.value} (Depth ${current.current.depth} > Limit ${depthLimit.current})`);
      playSound('step');
      return;
    }

    if (!current.current.visited) {
      current.current.visited = true;
      current.current.visitOrder = visitCounter.current++;

      if (current.current.value === target.current) {
        current.current.found = true;
        done(`✅ Success! Found '${target.current}' at depth ${current.current.depth}.`);
        playSound('success');
        return;
      }

      logStep(`Visiting ${current.current.value} (Depth: ${current.current.depth})`);
      playSound('step');

      for (let i = current.current.children.length - 1; i >= 0; i--) {
        const child = current.current.children[i];
        if (!child.visited) {
          stack.current.push(child);
        }
      }
    }
  };

  const dlsStepWithChecks = () => {
    if (stack.current.length > 0) {
      dlsStep();
    } else {
      if (!searchComplete.current) {
        const targetNode = nodes.current.find(n => n.value === target.current);
        let finalMessage = `❌ Failure: Target '${target.current}' not found within the search space.`;
        if (targetNode && targetNode.depth > depthLimit.current) {
          finalMessage = `⚠️ Cutoff: Target '${target.current}' exists but is beyond depth limit ${depthLimit.current}.`;
        }
        done(finalMessage);
        playSound('fail');
      }
    }
  };

  const done = (msg) => {
    setStatusText(msg);
    logStep(msg);
    searchComplete.current = true;
    running.current = false;
    paused.current = true;
  };

  const logStep = (text) => {
    setStatusText(text);
    setStepList(prev => [...prev, `Step ${stepNumber.current++}: ${text}`]);
  };

  const playSound = (soundType) => {
    if (audioRefs.current[soundType]) {
      audioRefs.current[soundType].currentTime = 0;
      audioRefs.current[soundType].play().catch(e => console.error("Audio error:", e));
    }
  };

  const handleNextStep = () => {
    if (searchComplete.current) return;
    paused.current = true;
    running.current = false;
    dlsStepWithChecks();
  }

  const handleRun = () => {
    if (searchComplete.current) return;
    running.current = true;
    paused.current = false;
  }

  const handlePause = () => {
    paused.current = true;
    running.current = false;
  }

  const handlePrevStep = () => {
    if (history.current.length === 0) return;
    paused.current = true;
    running.current = false;

    const prevState = history.current.pop();

    nodes.current = prevState.nodes;
    stack.current = prevState.stack.map(val => nodes.current.find(n => n.value === val));
    current.current = prevState.current ? nodes.current.find(n => n.value === prevState.current) : null;
    traversedEdges.current = prevState.traversedEdges;

    setStepList(prevState.stepList.slice(0, -1));
    setStatusText(prevState.statusText);
    stepNumber.current--;
    searchComplete.current = false;

    const lastVisitedNodeValue = prevState.nodes.find(n => n.visitOrder === visitCounter.current - 1)?.value;
    if (lastVisitedNodeValue) {
      visitCounter.current--;
    }
  };

  const drawEdges = (p) => {
    p.stroke(aestheticTheme.palette.text.secondary);
    p.strokeWeight(2);
    nodes.current.forEach(node => {
      node.children.forEach(child => {
        p.line(node.x, node.y, child.x, child.y);
      });
    });

    for (const edge of traversedEdges.current) {
      p.push();
      const fromNode = nodes.current.find(n => n.value === edge.from.value);
      const toNode = nodes.current.find(n => n.value === edge.to.value);
      if (!fromNode || !toNode) continue;

      const fromVec = p.createVector(fromNode.x, fromNode.y);
      const toVec = p.createVector(toNode.x, toNode.y);
      p.stroke(p.color(aestheticTheme.palette.warning.main));
      p.strokeWeight(3);
      p.drawingContext.setLineDash([8, 6]);
      p.line(fromVec.x, fromVec.y, toVec.x, toVec.y);
      p.drawingContext.setLineDash([]);
      const midPoint = p5.Vector.lerp(fromVec, toVec, 0.5);
      const angle = p.atan2(toVec.y - fromVec.y, toVec.x - fromVec.x);
      let arrowSize = 10;
      p.translate(midPoint.x, midPoint.y);
      p.rotate(angle);
      p.fill(p.color(aestheticTheme.palette.warning.main));
      p.noStroke();
      p.triangle(0, 0, -arrowSize * 1.5, -arrowSize * 0.7, -arrowSize * 1.5, arrowSize * 0.7);
      p.pop();
    }
  };

  const drawNodes = (p) => {
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    p.textFont(aestheticTheme.typography.fontFamily);

    nodes.current.forEach(node => {
      if (node.found) p.fill(aestheticTheme.palette.success.main);
      else if (node === current.current) p.fill(aestheticTheme.palette.warning.main);
      else if (node.visited) p.fill(aestheticTheme.palette.secondary.main);
      else p.fill(aestheticTheme.palette.info.main);

      p.stroke(aestheticTheme.palette.primary.main);
      p.strokeWeight(2.5);
      p.ellipse(node.x, node.y, 50, 50);
      p.fill(aestheticTheme.palette.text.primary);
      p.noStroke();
      const text = node.visitOrder !== null ? `${node.value} (${node.visitOrder})` : node.value;
      p.text(text, node.x, node.y);

      p.textSize(10);
      p.fill(aestheticTheme.palette.text.secondary);
      p.text(`D: ${node.depth}`, node.x, node.y + 30);
      p.textSize(14);
    });
  };

  const LegendItem = ({ color, text }) => (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: color, border: '2px solid rgba(0,0,0,0.1)' }} />
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{text}</Typography>
    </Stack>
  );

  return (
    <ThemeProvider theme={aestheticTheme}>
      <CssBaseline />
      <Box sx={styles.container}>

        <Paper sx={{ p: 2, mb: 3, maxWidth: 600, mx: 'auto' }}>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={5}>
              <TextField
                label="Target Node"
                variant="outlined"
                size="small"
                fullWidth
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="Depth Limit"
                type="number"
                variant="outlined"
                size="small"
                fullWidth
                value={depthInput}
                onChange={(e) => setDepthInput(e.target.value)}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Tooltip title="Apply & Reset">
                <IconButton onClick={resetTraversal} sx={{ width: '100%', height: '40px' }}>
                  <RestartAltIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ p: 1, mb: 2, display: 'flex', justifyContent: 'center', gap: 1.5 }}>
          <Tooltip title="Reset Algorithm">
            <IconButton onClick={resetTraversal}><RestartAltIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Previous Step">
            <IconButton onClick={handlePrevStep}><ArrowBackIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Next Step">
            <IconButton onClick={handleNextStep}><ArrowForwardIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Run">
            <IconButton onClick={handleRun} sx={{ background: aestheticTheme.palette.success.main }}><PlayArrowIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Pause">
            <IconButton onClick={handlePause}><PauseIcon /></IconButton>
          </Tooltip>
        </Box>

        <Box sx={(theme) => ({ mb: theme.spacing(3), display: 'flex', justifyContent: 'center', width: '100%' })}>
          <Stack direction="row" spacing={2} sx={(theme) => ({ p: theme.spacing(1.5), borderRadius: 2, background: 'rgba(255,255,255,0.7)', flexWrap: 'wrap', justifyContent: 'center' })}>
            <LegendItem color={aestheticTheme.palette.warning.main} text="Current" />
            <LegendItem color={aestheticTheme.palette.secondary.main} text="Visited" />
            <LegendItem color={aestheticTheme.palette.success.main} text="Found" />
            <LegendItem color={aestheticTheme.palette.info.main} text="Not Visited" />
          </Stack>
        </Box>

        <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center" alignItems="flex-start">
          <Grid item xs={12} lg={7}>
            <Box sx={styles.canvasWrapper}>
              <div ref={sketchRef} style={{ width: 800, height: 500 }} />
            </Box>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Paper sx={(theme) => ({ p: { xs: 1.5, md: 2 }, display: 'flex', flexDirection: 'column', gap: theme.spacing(2) })}>
              <Box>
                <Typography variant="h6" gutterBottom>Execution Steps</Typography>
                <Typography variant="body2" sx={{ minHeight: '48px', p: 1, borderRadius: 2, background: '#f5f5f5' }}>
                  <strong>Status:</strong> {statusText}
                </Typography>
                <Box ref={stepListRef} sx={styles.stepListBox}>
                  {stepList.map((step, index) => (
                    <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', mb: 0.5, fontSize: '0.8rem' }}>
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

export default DLS_EX2;