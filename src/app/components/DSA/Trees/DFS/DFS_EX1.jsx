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
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

// Import sound files (assuming they are in the public folder)
import stepSoundFile from '/step.mp3';
import successSoundFile from '/success.mp3';
import failSoundFile from '/fail.mp3';

// --- STYLING DEFINITIONS ---
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
    h4: {
      fontWeight: 800,
      letterSpacing: 1.5,
      color: '#2c3e50',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: 1,
      color: '#2c3e50',
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
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: 'none',
          fontWeight: 700,
          border: 'none',
          background: 'linear-gradient(90deg, #a0c4ff 0%, #b9fbc0 100%)',
          color: '#2c3e50',
          boxShadow: '0 2px 8px 0 rgba(160,196,255,0.10)',
          transition: 'background 0.2s, box-shadow 0.2s',
          '&:hover': {
            background: 'linear-gradient(90deg, #b9fbc0 0%, #a0c4ff 100%)',
            boxShadow: '0 4px 16px 0 rgba(160,196,255,0.18)',
          },
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
    p: { xs: 2, sm: 4 },
    background: 'linear-gradient(135deg, #f0f2f5 0%, #e0e7ff 100%)',
  },
  button: {
    background: '#fff',
    color: '#222',
    fontWeight: 600,
    borderRadius: 10,
    border: '1.5px solid #e0e0e0',
    boxShadow: 'none',
    minWidth: 'auto',
    minHeight: 'auto',
    padding: '6px 10px',
    fontSize: '0.8rem',
    transition: 'background 0.2s, border 0.2s',
    '&:hover': {
      background: '#f8f9fa',
      borderColor: '#bdbdbd',
      color: '#111',
    },
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
    overflowY: 'auto',
    mt: 1,
    p: 1.5,
    borderRadius: 3,
    background: 'linear-gradient(90deg, #e0e7ff 0%, #f0f2f5 100%)',
    border: '1.5px solid #e0e0e0',
    boxShadow: '0 1px 4px 0 rgba(160,196,255,0.08)',
  },
};

const DFS_EX1 = () => {
  const sketchRef = useRef();
  const [stepList, setStepList] = useState([]);
  const [statusText, setStatusText] = useState('Status: Ready');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [clickedNode, setClickedNode] = useState(null);

  const DEFAULT_TARGET = 'F';
  const audioRefs = useRef({});
  const stepListRef = useRef(null);

  useEffect(() => {
    if (stepListRef.current) {
      stepListRef.current.scrollTop = stepListRef.current.scrollHeight;
    }
  }, [stepList]);

  useLayoutEffect(() => {
    let visitCounter = 1;
    let stepNumber = 1;
    let nodes = [], root;
    let stack = [], current = null;
    let running = false, paused = true;
    let searchComplete = false;
    let history = [];
    let pInstance = null;
    let traversedEdges = [];

    function layoutTree(root, x, y, xSpacing, ySpacing) {
      root.targetX = x;
      root.targetY = y;
      if (root.children.length === 2) {
        layoutTree(root.children[0], x - xSpacing, y + ySpacing, xSpacing / 2, ySpacing);
        layoutTree(root.children[1], x + xSpacing, y + ySpacing, xSpacing / 2, ySpacing);
      } else if (root.children.length === 1) {
        layoutTree(root.children[0], x, y + ySpacing, xSpacing / 2, ySpacing);
      }
    }

    class Node {
      constructor(value, p) {
        this.value = value;
        this.children = [];
        this.targetX = 0;
        this.targetY = 0;
        this.x = 0;
        this.y = 0;
        this.visited = false;
        this.found = false;
        this.isCurrent = false;
        this.visitOrder = null;
        this.scale = 1;
        this.targetScale = 1;
        this.color = p.color(aestheticTheme.palette.info.main);
        this.targetColor = p.color(aestheticTheme.palette.info.main);
      }
      update(p) {
        this.x = p.lerp(this.x, this.targetX, 0.08);
        this.y = p.lerp(this.y, this.targetY, 0.08);
        this.scale = p.lerp(this.scale, this.targetScale, 0.1);
        this.color = p.lerpColor(this.color, this.targetColor, 0.1);
      }
    }

    const preloadAudio = () => {
      try {
        audioRefs.current.step = new Audio(stepSoundFile);
        audioRefs.current.success = new Audio(successSoundFile);
        audioRefs.current.fail = new Audio(failSoundFile);
      } catch (e) {
        console.error('Audio files not found.', e);
      }
    };

    const playSound = (soundType) => {
      if (audioRefs.current[soundType]) {
        audioRefs.current[soundType].currentTime = 0;
        audioRefs.current[soundType].play().catch((e) => console.error('Error playing sound:', e));
      }
    };

    const sketch = (p) => {
      pInstance = p;

      const createTree = (p) => {
        const A = new Node('A', p);
        const B = new Node('B', p);
        const C = new Node('C', p);
        const D = new Node('D', p);
        const E = new Node('E', p);
        const F = new Node('F', p);
        const G = new Node('G', p);
        A.children.push(B, C);
        B.children.push(D, E);
        C.children.push(F, G);
        nodes = [A, B, C, D, E, F, G];
        root = A;

        const w = p.width;
        const h = p.height;
        layoutTree(A, w / 2, h * 0.15, w * 0.25, h * 0.25);

        nodes.forEach(node => {
          node.x = node.targetX;
          node.y = node.targetY;
        });
      };

      p.setup = () => {
        const container = sketchRef.current;
        if (container) {
          const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
          canvas.parent(container);
        }
        preloadAudio();
        p.reset();
      };

      p.draw = () => {
        p.background(aestheticTheme.palette.background.paper);
        updateNodeStates(p);
        drawEdges(p);
        drawNodes(p);

        if (running && !paused && !searchComplete && p.frameCount % 60 === 0) {
          dfsStep();
        }
      };

      const updateNodeStates = (p) => {
        for (let node of nodes) {
          if (node.found) {
            node.targetColor = p.color(aestheticTheme.palette.success.main);
            node.targetScale = 1.15;
          } else if (node.isCurrent) {
            node.targetColor = p.color(aestheticTheme.palette.warning.main);
            node.targetScale = 1.2 + p.sin(p.frameCount * 0.1) * 0.1;
          } else if (node.visited) {
            node.targetColor = p.color(aestheticTheme.palette.secondary.main);
            node.targetScale = 1;
          } else {
            node.targetColor = p.color(aestheticTheme.palette.info.main);
            node.targetScale = 1;
          }
          node.update(p);
        }
      };

      const drawEdges = (p) => {
        p.stroke(aestheticTheme.palette.text.secondary);
        p.strokeWeight(2);
        for (let node of nodes) {
          for (let child of node.children) {
            if (hoveredNode && (node === hoveredNode || child === hoveredNode)) {
              p.stroke('#22d36b');
              p.strokeWeight(4);
            } else {
              p.stroke(aestheticTheme.palette.text.secondary);
              p.strokeWeight(2);
            }
            p.line(node.x, node.y, child.x, child.y);
          }
        }

        for (const edge of traversedEdges) {
          p.push();
          const fromVec = p.createVector(edge.from.x, edge.from.y);
          const toVec = p.createVector(edge.to.x, edge.to.y);
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
        p.textSize(16);
        p.textFont(aestheticTheme.typography.fontFamily);

        for (let node of nodes) {
          if (hoveredNode === node) {
            p.stroke('#22d36b');
            p.strokeWeight(4);
          } else {
            p.stroke(aestheticTheme.palette.primary.main);
            p.strokeWeight(2.5);
          }
          p.fill(node.color);
          p.ellipse(node.x, node.y, 60 * node.scale, 60 * node.scale);

          p.noStroke();
          p.fill(aestheticTheme.palette.primary.main);
          const label = node.visitOrder !== null ? `${node.value} (${node.visitOrder})` : node.value;
          p.text(label, node.x, node.y);
          if (clickedNode === node) {
            p.push();
            p.fill('#fff');
            p.stroke('#22d36b');
            p.strokeWeight(2);
            p.rect(node.x + 40, node.y - 30, 80, 32, 8);
            p.noStroke();
            p.fill('#222');
            p.text(`Node: ${node.value}`, node.x + 80, node.y - 14);
            p.pop();
          }
        }
      };

      const dfsStep = () => {
        if (stack.length === 0 && !searchComplete) {
          setStatusText(`❌ Target '${DEFAULT_TARGET}' not found.`);
          setStepList((prev) => [...prev, `Step ${stepNumber++}: ❌ Target not found.`]);
          playSound('fail');
          searchComplete = true;
          running = false;
          setIsPlaying(false);
          nodes.forEach((n) => (n.isCurrent = false));
          return;
        }

        if (searchComplete) return;

        history.push({
          nodes: nodes.map((n) => ({
            ...n,
            color: { levels: n.color.levels },
            targetColor: { levels: n.targetColor.levels },
          })),
          stack: [...stack],
          current: current,
          visitCounter,
          stepNumber,
          searchComplete,
          traversedEdges: [...traversedEdges],
        });

        const lastCurrent = current;
        current = stack.pop();
        nodes.forEach((n) => (n.isCurrent = n === current));

        if (lastCurrent && current) {
          traversedEdges.push({ from: lastCurrent, to: current });
        }

        if (!current.visited) {
          current.visited = true;
          current.visitOrder = visitCounter++;
          if (current.value === DEFAULT_TARGET) {
            current.found = true;
            setStatusText(`✅ Found '${DEFAULT_TARGET}'!`);
            setStepList((prev) => [...prev, `Step ${stepNumber++}: ✅ Found '${DEFAULT_TARGET}'!`]);
            playSound('success');
            searchComplete = true;
            running = false;
            setIsPlaying(false);
            nodes.forEach((n) => (n.isCurrent = false));
            return;
          }
          setStatusText(`🔍 Visiting: ${current.value}`);
          setStepList((prev) => [...prev, `Step ${stepNumber++}: Visiting '${current.value}'`]);
          playSound('step');
          for (let i = current.children.length - 1; i >= 0; i--) {
            const child = current.children[i];
            if (!child.visited) stack.push(child);
          }
        } else {
          if (running && !paused) dfsStep();
        }
      };

      p.reset = () => {
        createTree(p);
        visitCounter = 1;
        stepNumber = 1;
        history = [];
        traversedEdges = [];
        setStepList([]);
        setStatusText('Status: Ready');
        stack = [root];
        current = null;
        running = false;
        paused = true;
        searchComplete = false;
        setIsPlaying(false);
        p.loop();
      };
      p.step = () => {
        if (searchComplete) return;
        paused = true;
        setIsPlaying(false);
        dfsStep();
      };
      p.run = () => {
        if (searchComplete || (running && !paused)) return;
        running = true;
        paused = false;
        setIsPlaying(true);
      };
      p.pause = () => {
        paused = true;
        running = false;
        setIsPlaying(false);
      };
      p.prevStep = () => {
        if (history.length === 0) return;
        paused = true;
        setIsPlaying(false);
        const prev = history.pop();
        nodes.forEach((node, i) => {
          Object.assign(node, prev.nodes[i]);
          node.color = p.color(prev.nodes[i].color.levels);
          node.targetColor = p.color(prev.nodes[i].targetColor.levels);
        });
        stack = prev.stack.map((sNode) => nodes.find((n) => n.value === sNode.value));
        current = prev.current ? nodes.find((n) => n.value === prev.current.value) : null;
        visitCounter = prev.visitCounter;
        stepNumber = prev.stepNumber;
        searchComplete = prev.searchComplete;
        traversedEdges = prev.traversedEdges;
        setStepList((prevList) => prevList.slice(0, -1));
        const lastStatus = history.length > 0 ? history[history.length - 1].statusText : 'Status: Step Reverted';
        setStatusText(lastStatus);
      };
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
    return () => {
      p5Instance.remove();
    };
  }, []);

  return (
    <ThemeProvider theme={aestheticTheme}>
      <CssBaseline />
      <Box sx={styles.container}>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Element to be found: "F"
          </Typography>
        </Box>

        <Box sx={{ p: 1, mb: 2, display: 'flex', justifyContent: 'center', gap: 1.5 }}>
          <Tooltip title="Reset">
            <IconButton onClick={() => sketchRef.current.reset()}><RestartAltIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Previous Step">
            <IconButton onClick={() => sketchRef.current.prevStep()}><ArrowBackIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Next Step">
            <IconButton onClick={() => sketchRef.current.step()}><ArrowForwardIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Run">
            <IconButton onClick={() => sketchRef.current.run()} sx={{ background: '#b9fbc0' }}><PlayArrowIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Pause">
            <IconButton onClick={() => sketchRef.current.pause()}><PauseIcon /></IconButton>
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

        <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={7}>
            <Box sx={styles.canvasWrapper}>
              <Box sx={styles.canvasBox}>
                <div ref={sketchRef} style={{ width: '100%', height: '100%' }} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={(theme) => ({ p: { xs: 1.5, md: 2 }, width: { xs: '100%', md: 320 }, minWidth: 260, maxWidth: 350, display: 'flex', flexDirection: 'column', gap: theme.spacing(2), mx: 'auto' })} elevation={3}>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
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

export default DFS_EX1;