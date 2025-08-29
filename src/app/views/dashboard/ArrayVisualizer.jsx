import React, { useEffect } from 'react';
import { Box, Container, Paper, Grid, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// --- ICONS (For the data structure cards) ---
import DataObjectIcon from '@mui/icons-material/DataObject';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LayersIcon from '@mui/icons-material/Layers';
import LinearScaleIcon from '@mui/icons-material/LinearScale';

// --- AlgorithmCard (Styled with fixed height for alignment) ---
const AlgorithmCard = styled(motion.div)(({ theme, color }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '18px',
  background: `linear-gradient(135deg, ${color}20 0%, #ffffff 80%)`,
  border: `1.5px solid ${color}55`,
  boxShadow: `0 4px 24px 0 rgba(64,68,156,0.11)`,
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  width: '260px',
  height: '220px', // Standardized height
  transition: 'transform 0.18s cubic-bezier(.17,.67,.83,.67), box-shadow 0.18s',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.03)',
    boxShadow: `0 12px 32px ${color}28`,
  },
}));

// --- TreeAlgorithmCard: now just an alias for AlgorithmCard ---
const TreeAlgorithmCard = styled(AlgorithmCard)({});

// --- DataStructureCard styled to match Dashboard ---
const DataStructureCard = ({ logo, title, description, onClick, isSelected }) => (
  <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} style={{ height: '100%' }} onClick={onClick}>
    <Paper
      variant="outlined"
      sx={{
        p: 4,
        pt: 5,
        textAlign: 'center',
        height: '100%',
        borderRadius: '16px',
        borderColor: isSelected ? 'primary.main' : 'rgba(0, 0, 0, 0.12)',
        backgroundColor: isSelected ? 'rgba(84, 160, 255, 0.05)' : 'inherit',
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

// ----------------------------
// Algorithm Visual Components (STATIC VERSION)
// ----------------------------
const BinarySearchVisual = ({ color }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
    {[...Array(7)].map((_, i) => (
      <Box
        key={i}
        style={{
          width: 22,
          height: 22,
          margin: 4,
          borderRadius: '50%',
          border: `1px solid #bbb`,
          backgroundColor: i === 3 ? color : '#f4f7fa',
        }}
      />
    ))}
  </Box>
);

const LinearSearchVisual = ({ color }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mt: 2,
      width: 176,
      mx: 'auto',
    }}
  >
    {[...Array(7)].map((_, i) => (
      <Box
        key={i}
        style={{
          width: 22,
          height: 22,
          margin: 4,
          borderRadius: '6px',
          border: `1px solid #bbb`,
          backgroundColor: i === 4 ? color : '#f4f7fa',
        }}
      />
    ))}
  </Box>
);

const BubbleSortVisual = ({ color }) => {
  const baseHeights = [28, 45, 20, 56, 38, 27]; // Scaled down heights
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'center',
      }}
    >
      {baseHeights.map((h, i) => (
        <Box
          key={i}
          style={{
            width: 14,
            height: h,
            background: color,
            borderRadius: '6px',
            margin: '0 3px',
            boxShadow:
              i === 1 || i === 2 ? `0 0 0 2px ${color}40` : '0 1px 3px #bbb',
          }}
        />
      ))}
    </Box>
  );
};

const SelectionSortVisual = ({ color }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mt: 2,
    }}
  >
    {[...Array(6)].map((_, i) => (
      <Box
        key={i}
        style={{
          width: 22,
          height: 22,
          margin: 4,
          borderRadius: '7px',
          border: `1px solid #bbb`,
          backgroundColor:
            i === 2 ? '#fee9cb' : i === 4 ? color : '#f4f7fa',
        }}
      />
    ))}
  </Box>
);

// --- Stack Visual Components ---
const StackOperationsVisual = ({ color }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
    {[...Array(4)].map((_, i) => (
      <Box
        key={i}
        style={{
          width: 60,
          height: 15,
          margin: '1px 0',
          borderRadius: '3px',
          border: `1px solid #bbb`,
          backgroundColor: i === 0 ? color : '#f4f7fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          color: i === 0 ? '#fff' : '#666',
        }}
      >
        {i === 0 ? 'Top' : ''}
      </Box>
    ))}
  </Box>
);

const InfixToPostfixVisual = ({ color }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#666' }}>
      <Box sx={{ mr: 1 }}>a+b*c</Box>
      <Box sx={{ mx: 1 }}>&rarr;</Box>
      <Box sx={{ color, fontWeight: 600 }}>abc*+</Box>
    </Box>
  </Box>
);

const ValidParenthesesVisual = ({ color }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, fontSize: '16px', fontWeight: 500 }}>
    <Box sx={{ color: '#666' }}>{`({[]})`}</Box>
    <Box sx={{ mx: 1.5 }}>&rarr;</Box>
    <Box sx={{ color }}>Valid</Box>
  </Box>
);

// ------------ Data for Array Algorithm Cards ------------
const algorithmData = [
  {
    id: 'binary-search',
    title: 'Binary Search',
    color: '#54a0ff',
    description: 'Splits array to find elements efficiently.',
  },
  {
    id: 'linear-search',
    title: 'Linear Search',
    color: '#2ecc71',
    description: 'Scans array sequentially for an element.',
  },
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    color: '#f39c12',
    description: 'Swaps adjacent elements to sort.',
  },
  {
    id: 'selection-sort',
    title: 'Selection Sort',
    color: '#9b59b6',
    description: 'Selects minimum to sort step-by-step.',
  },
];

const visuals = {
  'binary-search': BinarySearchVisual,
  'linear-search': LinearSearchVisual,
  'bubble-sort': BubbleSortVisual,
  'selection-sort': SelectionSortVisual,
};

// --- Data for Stack Algorithm Cards ---
const stackAlgorithmData = [
  {
    id: 'stack-operations',
    title: 'Stack Operations',
    color: '#f39c12',
    description: 'Push and pop elements in LIFO order.',
  },
  {
    id: 'infix-to-postfix',
    title: 'Infix to Postfix',
    color: '#e74c3c',
    description: 'Converts expressions using a stack.',
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    color: '#3498db',
    description: 'Checks for balanced brackets.',
  },
];

const stackVisuals = {
  'stack-operations': StackOperationsVisual,
  'infix-to-postfix': InfixToPostfixVisual,
  'valid-parentheses': ValidParenthesesVisual,
};

// --- Data for Queue Algorithm Cards ---
const queueAlgorithmData = [
  {
    id: 'queue-operations',
    title: 'Queue Operations',
    color: '#9b59b6',
    description: 'Enqueue and dequeue in FIFO order.',
  },
  {
    id: 'circular-queue',
    title: 'Circular Queue',
    color: '#1abc9c',
    description: 'An efficient fixed-size queue.',
  },
];

// --- Queue Visual Components ---
const QueueOperationsVisual = ({ color }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
    <Box sx={{ fontSize: '12px', mr: 1, color: '#666' }}>Front</Box>
    {[...Array(4)].map((_, i) => (
      <Box
        key={i}
        style={{
          width: 30,
          height: 30,
          margin: '0 2px',
          borderRadius: '4px',
          border: `1px solid #bbb`,
          backgroundColor: '#f4f7fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: '#666',
        }}
      >
        {i + 1}
      </Box>
    ))}
    <Box sx={{ fontSize: '12px', ml: 1, color: '#666' }}>Rear</Box>
  </Box>
);

const CircularQueueVisual = ({ color }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: 70, height: 70 }}>
    {[...Array(5)].map((_, i) => (
      <Box
        key={i}
        style={{
          position: 'absolute',
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: `1px solid #bbb`,
          backgroundColor: i === 1 ? color : '#f4f7fa',
          transform: `rotate(${i * (360 / 5)}deg) translate(26px) rotate(-${i * (360 / 5)}deg)`,
        }}
      />
    ))}
  </Box>
);

const queueVisuals = {
  'queue-operations': QueueOperationsVisual,
  'circular-queue': CircularQueueVisual,
};

// --- Standardized component for rendering the text part of a card ---
const CardText = ({ title, description }) => (
  <Box sx={{ textAlign: 'center', px: 1, mt: 1 }}>
    <Typography
      variant="h6"
      title={title}
      sx={{
        fontWeight: 600,
        color: '#1a202c',
        height: 56, // Fixed height for 2 lines
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {title}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        mt: 0.5,
        color: 'text.secondary',
        maxWidth: 190,
        mx: 'auto',
        height: 40, // Fixed height for 2 lines
      }}
    >
      {description}
    </Typography>
  </Box>
);

// -----------------
// AlgorithmCards Component
// -----------------
const AlgorithmCards = React.memo(() => {
  const routeMap = {
    'binary-search': '/components/arrays/Bsearch',
    'linear-search': '/components/arrays/Lsearch',
    'bubble-sort': '/components/arrays/BBS',
    'selection-sort': '/components/arrays/SLS',
  };

  const navigateAndEnsureTop = (navigate, to, options = {}) => {
    const { extraRetries = 0 } = options;
    const scrollNow = () => {
      try { window.scrollTo({ top: 0, behavior: 'auto' }); }
      catch { window.scrollTo(0, 0); }
    };

    navigate(to);
    requestAnimationFrame(() => {
      scrollNow();
      setTimeout(scrollNow, 20);
      setTimeout(scrollNow, 80);
      for (let i = 0; i < extraRetries; i += 1) {
        setTimeout(scrollNow, 150 + i * 60);
      }
    });
  };

  const NavCard = ({ to, children, id }) => {
    const navigate = useNavigate();
    const handleClick = (e) => {
      e.preventDefault();
      if (e.currentTarget && e.currentTarget.blur) e.currentTarget.blur();
      if (id === 'bfs') {
        navigateAndEnsureTop(navigate, to, { extraRetries: 3 });
      } else {
        navigateAndEnsureTop(navigate, to, { extraRetries: 0 });
      }
    };

    return (
      <a href={to} onClick={handleClick} style={{ textDecoration: 'none' }}>
        {children}
      </a>
    );
  };

  return (
    <Box sx={{ pt: 6, pb: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} justifyContent="center" alignItems="stretch">
          {algorithmData.map((algo) => {
            const VisualComponent = visuals[algo.id];
            const routePath = routeMap[algo.id];
            return (
              <Grid item xs={12} sm={6} md={3} key={algo.id} display="flex" justifyContent="center">
                <NavCard to={routePath} id={algo.id}>
                  <AlgorithmCard color={algo.color}>
                    <Box sx={{ width: '100%', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <VisualComponent color={algo.color} />
                    </Box>
                    <CardText title={algo.title} description={algo.description} />
                  </AlgorithmCard>
                </NavCard>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
});

// --- Tree Algorithm Data ---
const treeAlgorithmData = [
  {
    id: 'bfs',
    title: 'Breadth-First Search',
    color: '#3498db',
    description: 'Traverses tree level by level.',
  },
  {
    id: 'dfs',
    title: 'Depth-First Search',
    color: '#2ecc71',
    description: 'Explores branches to the deepest level.',
  },
  {
    id: 'dls',
    title: 'Depth-Limited Search',
    color: '#9b59b6',
    description: 'DFS with a depth limit.',
  },
];

// --- Tree Visual Components ---
const TreeVisual = ({ highlightNodes, color }) => {
  const nodes = [
    { cx: 50, cy: 10 },
    { cx: 30, cy: 40 },
    { cx: 70, cy: 40 },
    { cx: 20, cy: 70 },
    { cx: 40, cy: 70 },
    { cx: 60, cy: 70 },
    { cx: 80, cy: 70 },
  ];

  return (
    <svg width="90" height="72" viewBox="0 0 100 80">
      <line x1="50" y1="10" x2="30" y2="40" stroke="#ccc" />
      <line x1="50" y1="10" x2="70" y2="40" stroke="#ccc" />
      <line x1="30" y1="40" x2="20" y2="70" stroke="#ccc" />
      <line x1="30" y1="40" x2="40" y2="70" stroke="#ccc" />
      <line x1="70" y1="40" x2="60" y2="70" stroke="#ccc" />
      <line x1="70" y1="40" x2="80" y2="70" stroke="#ccc" />
      {nodes.map((node, index) => (
        <circle
          key={index}
          cx={node.cx}
          cy={node.cy}
          r="8"
          fill={highlightNodes.includes(index) ? color : '#f4f7fa'}
          stroke="#bbb"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
};

const BFSVisual = ({ color }) => <TreeVisual highlightNodes={[1, 2]} color={color} />;
const DFSVisual = ({ color }) => <TreeVisual highlightNodes={[0, 1, 3]} color={color} />;
const DLSVisual = ({ color }) => <TreeVisual highlightNodes={[0, 1, 2]} color={color} />;

const treeVisuals = {
  'bfs': BFSVisual,
  'dfs': DFSVisual,
  'dls': DLSVisual,
};

// -----------------
// TreeAlgorithmCards Component
// -----------------
const TreeAlgorithmCards = React.memo(() => {
  const treeRouteMap = {
    'bfs': '/components/trees/BFS',
    'dfs': '/components/trees/DFS',
    'dls': '/components/trees/DLS',
  };

  const navigate = useNavigate();

  const navigateAndEnsureTop = (to, options = {}) => {
    const { extraRetries = 0 } = options;
    const scrollNow = () => {
      try { window.scrollTo({ top: 0, behavior: 'auto' }); }
      catch { window.scrollTo(0, 0); }
    };

    navigate(to);
    requestAnimationFrame(() => {
      scrollNow();
      setTimeout(scrollNow, 20);
      setTimeout(scrollNow, 80);
      for (let i = 0; i < extraRetries; i += 1) {
        setTimeout(scrollNow, 150 + i * 60);
      }
    });
  };

  const NavCard = ({ to, children, id }) => {
    const handleClick = (e) => {
      e.preventDefault();
      if (e.currentTarget && e.currentTarget.blur) e.currentTarget.blur();
      if (id === 'bfs') {
        navigateAndEnsureTop(to, { extraRetries: 4 });
      } else {
        navigateAndEnsureTop(to, { extraRetries: 0 });
      }
    };

    return (
      <a href={to} onClick={handleClick} style={{ textDecoration: 'none' }}>
        {children}
      </a>
    );
  };

  return (
    <Box sx={{ pt: 6, pb: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} justifyContent="center" alignItems="stretch">
          {treeAlgorithmData.map((algo) => {
            const VisualComponent = treeVisuals[algo.id];
            const routePath = treeRouteMap[algo.id];
            return (
              <Grid item xs={12} sm={6} md={3} key={algo.id} display="flex" justifyContent="center">
                <NavCard to={routePath} id={algo.id}>
                  <TreeAlgorithmCard color={algo.color}>
                    <Box sx={{ width: '100%', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <VisualComponent color={algo.color} />
                    </Box>
                    <CardText title={algo.title} description={algo.description} />
                  </TreeAlgorithmCard>
                </NavCard>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
});

// -----------------
// StackAlgorithmCards Component
// -----------------
const StackAlgorithmCards = React.memo(() => {
  const stackRouteMap = {
    'stack-operations': '/components/Stacks/Operations',
    'infix-to-postfix': '/components/Stacks/INPO',
    'valid-parentheses': '/components/Stacks/VP',
  };
  const navigate = useNavigate();

  const navigateAndEnsureTop = (to, options = {}) => {
    const { extraRetries = 0 } = options;
    const scrollNow = () => {
      try { window.scrollTo({ top: 0, behavior: 'auto' }); }
      catch { window.scrollTo(0, 0); }
    };

    navigate(to);
    requestAnimationFrame(() => {
      scrollNow();
      setTimeout(scrollNow, 20);
      setTimeout(scrollNow, 80);
      for (let i = 0; i < extraRetries; i += 1) {
        setTimeout(scrollNow, 150 + i * 60);
      }
    });
  };

  const NavCard = ({ to, children, id }) => {
    const handleClick = (e) => {
      e.preventDefault();
      if (e.currentTarget && e.currentTarget.blur) e.currentTarget.blur();
      navigateAndEnsureTop(to, { extraRetries: 0 });
    };

    return (
      <a href={to} onClick={handleClick} style={{ textDecoration: 'none' }}>
        {children}
      </a>
    );
  };

  return (
    <Box sx={{ pt: 6, pb: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} justifyContent="center" alignItems="stretch">
          {stackAlgorithmData.map((algo) => {
            const VisualComponent = stackVisuals[algo.id];
            const routePath = stackRouteMap[algo.id];
            return (
              <Grid item xs={12} sm={6} md={3} key={algo.id} display="flex" justifyContent="center">
                <NavCard to={routePath} id={algo.id}>
                  <AlgorithmCard color={algo.color}>
                    <Box sx={{ width: '100%', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <VisualComponent color={algo.color} />
                    </Box>
                    <CardText title={algo.title} description={algo.description} />
                  </AlgorithmCard>
                </NavCard>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
});

// -----------------
// QueueAlgorithmCards Component
// -----------------
const QueueAlgorithmCards = React.memo(() => {
  const queueRouteMap = {
    'queue-operations': '/components/Queue/Operations',
    'circular-queue': '/components/Queue/Circular-Queue-Operations',
  };

  const navigate = useNavigate();

  const navigateAndEnsureTop = (to, options = {}) => {
    const { extraRetries = 0 } = options;
    const scrollNow = () => {
      try { window.scrollTo({ top: 0, behavior: 'auto' }); }
      catch { window.scrollTo(0, 0); }
    };

    navigate(to);
    requestAnimationFrame(() => {
      scrollNow();
      setTimeout(scrollNow, 20);
      setTimeout(scrollNow, 80);
      for (let i = 0; i < extraRetries; i += 1) {
        setTimeout(scrollNow, 150 + i * 60);
      }
    });
  };

  const NavCard = ({ to, children, id }) => {
    const handleClick = (e) => {
      e.preventDefault();
      if (e.currentTarget && e.currentTarget.blur) e.currentTarget.blur();
      navigateAndEnsureTop(to, { extraRetries: 0 });
    };

    return (
      <a href={to} onClick={handleClick} style={{ textDecoration: 'none' }}>
        {children}
      </a>
    );
  };

  return (
    <Box sx={{ pt: 6, pb: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} justifyContent="center" alignItems="stretch">
          {queueAlgorithmData.map((algo) => {
            const VisualComponent = queueVisuals[algo.id];
            const routePath = queueRouteMap[algo.id];
            return (
              <Grid item xs={12} sm={6} md={3} key={algo.id} display="flex" justifyContent="center">
                <NavCard to={routePath} id={algo.id}>
                  <AlgorithmCard color={algo.color}>
                    <Box sx={{ width: '100%', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <VisualComponent color={algo.color} />
                    </Box>
                    <CardText title={algo.title} description={algo.description} />
                  </AlgorithmCard>
                </NavCard>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
});

// ------------ Data Structure Selection Component ------------
const DataStructureSelection = ({ onNavClick, activeVisualizer }) => {
  const iconColors = {
    array: '#54a0ff',
    tree: '#2ecc71',
    stack: '#f39c12',
    queue: '#9b59b6',
  };

  const baseIconStyle = { fontSize: 80, mb: 3 };
  const dsaItems = [
    {
      id: 'arrays',
      logo: <DataObjectIcon sx={{ ...baseIconStyle, color: iconColors.array }} />,
      title: 'Arrays',
      description: 'Visualize search and sort algorithms.',
    },
    {
      id: 'trees',
      logo: <AccountTreeIcon sx={{ ...baseIconStyle, color: iconColors.tree }} />,
      title: 'Trees',
      description: 'Explore hierarchical data structures.',
    },
    {
      id: 'stacks',
      logo: <LayersIcon sx={{ ...baseIconStyle, color: iconColors.stack }} />,
      title: 'Stacks',
      description: 'Understand the LIFO principle.',
    },
    {
      id: 'queues',
      logo: <LinearScaleIcon sx={{ ...baseIconStyle, color: iconColors.queue }} />,
      title: 'Queues',
      description: 'See the First-In, First-Out data flow.',
    },
  ];

  return (
    <Box sx={{ py: 4, width: '100%' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          {dsaItems.map((item) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={item.id}
              display="flex"
              justifyContent="center"
            >
              <DataStructureCard
                logo={item.logo}
                title={item.title}
                description={item.description}
                onClick={() => onNavClick(item.id)}
                isSelected={item.id === activeVisualizer}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// ------------ Main ArrayVisualizer Page Component ------------
const ArrayVisualizer = ({ onNavClick, activeVisualizer }) => {
  useEffect(() => {
    try { window.scrollTo({ top: 0, behavior: 'auto' }); }
    catch { window.scrollTo(0, 0); }
  }, [activeVisualizer]);

  const handleNavClick = (id) => {
    if (activeVisualizer !== id) {
      onNavClick(id);
    }
  };

  const renderContent = () => {
    switch (activeVisualizer) {
      case 'arrays':
        return <AlgorithmCards />;
      case 'trees':
        return <TreeAlgorithmCards />;
      case 'stacks':
        return <StackAlgorithmCards />;
      case 'queues':
        return <QueueAlgorithmCards />;
      default:
        return (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Container maxWidth="sm">
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, color: '#1a202c' }}>
                Welcome to AlgoVisualizer
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Select a data structure above to explore its algorithms.
              </Typography>
            </Container>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Box
        sx={{
          py: 4,
          borderBottom: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.08)',
        }}
      >
        <DataStructureSelection onNavClick={handleNavClick} activeVisualizer={activeVisualizer} />
      </Box>
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeVisualizer || 'default'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </Box>
  );
};

export default ArrayVisualizer;