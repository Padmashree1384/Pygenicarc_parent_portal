import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Container, styled, alpha, Button, Paper } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import { Link } from 'react-router-dom';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import LayersIcon from '@mui/icons-material/Layers';
import SortIcon from '@mui/icons-material/Sort';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ImageStyledCard = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'levelColor',
})(({ theme, levelColor }) => ({
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: '16px',
    padding: theme.spacing(3),
    background: `linear-gradient(145deg, ${alpha(levelColor, 0.95)}, ${alpha(levelColor, 0.8)})`,
    color: theme.palette.common.white,
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'none',
    boxShadow: `0px 8px 30px -8px ${alpha(levelColor, 0.6)}, 0px 4px 15px -4px ${alpha(theme.palette.common.black, 0.2)}`,
    border: `1px solid ${alpha(levelColor, 0.7)}`,
    '&:hover': {
        boxShadow: `0px 8px 30px -8px ${alpha(levelColor, 0.6)}, 0px 4px 15px -4px ${alpha(theme.palette.common.black, 0.2)}`
    }
}));

const CurrentLevelIndicator = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'activeColor',
})(({ theme, activeColor }) => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 0,
    pointerEvents: 'none',
    '@keyframes ripple': {
        '0%': { transform: 'scale(0.8)', opacity: 1 },
        '100%': { transform: 'scale(2.5)', opacity: 0 }
    },
    '& .ring': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: `3px solid ${alpha(activeColor, 0.7)}`,
        animation: 'ripple 2s cubic-bezier(0, 0.2, 0.8, 1) 3'
    },
    '& .ring.delay': {
        animationDelay: '1s'
    }
}));


const CustomTimelineDot = styled(TimelineDot, {
    shouldForwardProp: (prop) =>
        prop !== 'levelColor' && prop !== 'isCurrentLevel' && prop !== 'activeColor',
})(({ theme, levelColor, isCurrentLevel, activeColor }) => ({
    backgroundColor: `${levelColor} !important`,
    color: '#fff',
    width: 60,
    height: 60,
    fontSize: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
    boxShadow: isCurrentLevel ? `0px 0px 0px 6px ${alpha(activeColor, 0.6)}, 0px 0px 25px 10px ${alpha(activeColor, 0.4)}` : `0px 0px 0px 4px ${alpha(levelColor, 0.4)}`,
    transition: 'none',
    '&:hover': {
        transform: 'none'
    }
}));

const CustomTimelineConnector = styled(TimelineConnector, {
    shouldForwardProp: (prop) => prop !== 'isCovered' && prop !== 'activeColor',
})(({ theme, isCovered, activeColor }) => ({
    backgroundColor: 'transparent',
    position: 'relative',
    height: 100,
    width: '4px',
    transition: 'none',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        height: '100%',
        borderRadius: '2px',
        background: isCovered ? activeColor : `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.4)}, ${alpha(theme.palette.secondary.main, 0.4)})`,
        boxShadow: isCovered ? `0 0 15px 4px ${alpha(activeColor, 0.7)}` : `0 0 10px 2px ${alpha(theme.palette.primary.main, 0.2)}`,
        animation: isCovered ? 'none' : 'pulseGlow 2s infinite alternate',
        transition: 'background 0.6s ease-in-out, box-shadow 0.6s ease-in-out',
    },
    '@keyframes pulseGlow': {
        '0%': { opacity: 0.8 },
        '100%': { opacity: 1 }
    }
}));

const ModuleCard = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'locked' && prop !== 'color',
})(({ theme, locked, color }) => ({
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    background: locked ? '#f1f5f9' : '#ffffff',
    borderRadius: '16px',
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
    border: `1px solid ${locked ? '#e2e8f0' : alpha(color, 0.5)}`,
    transition: 'none',
    opacity: locked ? 0.7 : 1,
    filter: locked ? 'grayscale(50%)' : 'none',
    cursor: locked ? 'not-allowed' : 'pointer',
    '&:hover': {
        boxShadow: '0 4px 20px rgba(0,0,0,0.07)'
    }
}));

const roadmapLevels = [
    {
        level: 'Level 1', title: 'Operations on Data Structures', icon: <SettingsIcon />, color: '#2196F3', cards: [
            { id: 'stack-operations', title: 'Stack Operations', description: 'Explore the LIFO principle.', url: '/components/Stacks/Operations' },
            { id: 'queue-operations', title: 'Queue Operations', description: 'Explore the FIFO principle.', url: '/components/Queue/Operations', requires: 'stack-operations' },
            { id: 'circular-queue-operations', title: 'Circular Queue', description: 'Efficient array usage.', url: '/components/Queue/Circular-Queue-Operations', requires: 'queue-operations' }
        ]
    },
    {
        level: 'Level 2', title: 'Stack Applications', icon: <LayersIcon />, color: '#4CAF50', cards: [
            { id: 'infix-postfix', title: 'Infix → Postfix Conversion', description: 'Convert expressions for evaluation.', url: '/components/Stacks/INPO', requires: 'circular-queue-operations' },
            { id: 'valid-parenthesis', title: 'Valid Parenthesis Checking', description: 'Check for balanced brackets.', url: '/components/Stacks/VP', requires: 'infix-postfix' }
        ]
    },
    {
        level: 'Level 3', title: 'Searching and Sorting', icon: <SortIcon />, color: '#FF9800', cards: [
            { id: 'linear-search', title: 'Linear Search', description: 'Sequential search algorithm.', url: '/components/Search/LS', requires: 'valid-parenthesis' },
            { id: 'binary-search', title: 'Binary Search', description: 'Efficient search on sorted arrays.', url: '/components/Search/BNS', requires: 'linear-search' },
            { id: 'bubble-sort', title: 'Bubble Sort', description: 'Simple comparison-based sorting.', url: '/components/Sort/BBS', requires: 'binary-search' },
            { id: 'selection-sort', title: 'Selection Sort', description: 'In-place comparison sorting.', url: '/components/Sort/SLS', requires: 'bubble-sort' }
        ]
    },
    {
        level: 'Level 4', title: 'Tree Traversals', icon: <AccountTreeIcon />, color: '#9C27B0', cards: [
            { id: 'bfs', title: 'Breadth First Search', description: 'Level-by-level traversal.', url: '/components/trees/BFS', requires: 'selection-sort' },
            { id: 'dfs', title: 'Depth First Search', description: 'Branch-by-branch traversal.', url: '/components/Tree/DFS', requires: 'bfs' },
            { id: 'dls', title: 'Depth Limited Search', description: 'DFS with a depth constraint.', url: '/components/Tree/DLS', requires: 'dfs' },
        ]
    }
];

const Roadmap = () => {
    // Levels 1 & 2
    const [isQueueUnlocked, setIsQueueUnlocked] = useState(() => localStorage.getItem('queueUnlocked') === 'true');
    const [isCQUnlocked, setIsCQUnlocked] = useState(() => localStorage.getItem('circularQueueUnlocked') === 'true');
    const [isInfixPostfixUnlocked, setIsInfixPostfixUnlocked] = useState(() => localStorage.getItem('infixPostfixUnlocked') === 'true');
    const [isValidParenthesisUnlocked, setIsValidParenthesisUnlocked] = useState(() => localStorage.getItem('validParenthesisUnlocked') === 'true');

    // Level 3
    const [isLinearSearchUnlocked, setIsLinearSearchUnlocked] = useState(() => localStorage.getItem('linearSearchUnlocked') === 'true');
    const [isBinarySearchUnlocked, setIsBinarySearchUnlocked] = useState(() => localStorage.getItem('binarySearchUnlocked') === 'true');
    const [isBubbleSortUnlocked, setIsBubbleSortUnlocked] = useState(() => localStorage.getItem('bubbleSortUnlocked') === 'true');
    const [isSelectionSortUnlocked, setIsSelectionSortUnlocked] = useState(() => localStorage.getItem('selectionSortUnlocked') === 'true');

    // Level 4
    const [isBfsUnlocked, setIsBfsUnlocked] = useState(() => localStorage.getItem('bfsUnlocked') === 'true');
    const [isDfsUnlocked, setIsDfsUnlocked] = useState(() => localStorage.getItem('dfsUnlocked') === 'true');
    const [isDlsUnlocked, setIsDlsUnlocked] = useState(() => localStorage.getItem('dlsUnlocked') === 'true');

    const [currentLevel, setCurrentLevel] = useState('Level 1');
    const [expandedLevel, setExpandedLevel] = useState(null);
    const [animationProgressIndex, setAnimationProgressIndex] = useState(0);

    useEffect(() => {
        const playQueueAnim = localStorage.getItem('playUnlockAnimation') === 'true';
        const playCQAnim = localStorage.getItem('playCQUnlockAnimation') === 'true';
        const expandLevel2 = localStorage.getItem('expandLevel2') === 'true';
        const expandLevel3 = localStorage.getItem('expandLevel3') === 'true';
        const expandLevel4 = localStorage.getItem('expandLevel4') === 'true';

        if (playQueueAnim) {
            localStorage.removeItem('playUnlockAnimation');
            setExpandedLevel('Level 1');
        }
        if (playCQAnim) {
            localStorage.removeItem('playCQUnlockAnimation');
            setExpandedLevel('Level 1');
        }
        if (expandLevel2) {
            localStorage.removeItem('expandLevel2');
            setExpandedLevel('Level 2');
        }
        if (expandLevel3) {
            localStorage.removeItem('expandLevel3');
            setExpandedLevel('Level 3');
        }
        if (expandLevel4) {
            localStorage.removeItem('expandLevel4');
            setExpandedLevel('Level 4');
        }
    }, []);

    useEffect(() => {
        if (isBfsUnlocked) {
            setCurrentLevel('Level 4');
        } else if (isLinearSearchUnlocked) {
            setCurrentLevel('Level 3');
        } else if (isInfixPostfixUnlocked) {
            setCurrentLevel('Level 2');
        } else {
            setCurrentLevel('Level 1');
        }
    }, [isInfixPostfixUnlocked, isLinearSearchUnlocked, isBfsUnlocked]);

    const currentLevelIndex = roadmapLevels.findIndex(l => l.level === currentLevel);

    useEffect(() => {
        setAnimationProgressIndex(0);
        if (currentLevelIndex > 0) {
            const interval = setInterval(() => {
                setAnimationProgressIndex(prevIndex => {
                    if (prevIndex < currentLevelIndex) {
                        return prevIndex + 1;
                    }
                    clearInterval(interval);
                    return prevIndex;
                });
            }, 700);

            return () => clearInterval(interval);
        }
    }, [currentLevelIndex]);


    const handleLevelClick = (levelId) => {
        setExpandedLevel(prev => (prev === levelId ? null : levelId));
    };

    const activeColor = roadmapLevels[currentLevelIndex]?.color || '#FFC107';

    const simulateStackQuizCompletion = () => { localStorage.setItem('queueUnlocked', 'true'); localStorage.setItem('playUnlockAnimation', 'true'); window.location.reload(); };
    const simulateQueueQuizCompletion = () => { localStorage.setItem('circularQueueUnlocked', 'true'); localStorage.setItem('playCQUnlockAnimation', 'true'); window.location.reload(); };
    const simulateCQQuizCompletion = () => { localStorage.setItem('infixPostfixUnlocked', 'true'); localStorage.setItem('expandLevel2', 'true'); window.location.reload(); };
    const simulateInfixQuizCompletion = () => { localStorage.setItem('validParenthesisUnlocked', 'true'); localStorage.setItem('expandLevel2', 'true'); window.location.reload(); };
    const simulateVPQuizCompletion = () => { localStorage.setItem('linearSearchUnlocked', 'true'); localStorage.setItem('expandLevel3', 'true'); window.location.reload(); };
    const simulateLSQuizCompletion = () => { localStorage.setItem('binarySearchUnlocked', 'true'); localStorage.setItem('expandLevel3', 'true'); window.location.reload(); };
    const simulateBSQuizCompletion = () => { localStorage.setItem('bubbleSortUnlocked', 'true'); localStorage.setItem('expandLevel3', 'true'); window.location.reload(); };
    const simulateSLSQuizCompletion = () => { localStorage.setItem('selectionSortUnlocked', 'true'); localStorage.setItem('expandLevel3', 'true'); window.location.reload(); };
    const simulateSelectionSortQuizCompletion = () => { localStorage.setItem('bfsUnlocked', 'true'); localStorage.setItem('expandLevel4', 'true'); window.location.reload(); };
    const simulateBfsQuizCompletion = () => { localStorage.setItem('dfsUnlocked', 'true'); localStorage.setItem('expandLevel4', 'true'); window.location.reload(); };
    const simulateDfsQuizCompletion = () => { localStorage.setItem('dlsUnlocked', 'true'); localStorage.setItem('expandLevel4', 'true'); window.location.reload(); };

    const resetProgress = () => {
        localStorage.clear();
        setIsQueueUnlocked(false);
        setIsCQUnlocked(false);
        setIsInfixPostfixUnlocked(false);
        setIsValidParenthesisUnlocked(false);
        setIsLinearSearchUnlocked(false);
        setIsBinarySearchUnlocked(false);
        setIsBubbleSortUnlocked(false);
        setIsSelectionSortUnlocked(false);
        setIsBfsUnlocked(false);
        setIsDfsUnlocked(false);
        setIsDlsUnlocked(false);
        setCurrentLevel('Level 1');
    };

    return (
        <Box sx={{ py: 8, background: 'linear-gradient(135deg, #e0f2f7 0%, #ffffff 100%)', minHeight: '100vh' }}>
            <Container maxWidth="md">
                <Typography variant="h3" align="center" fontWeight={800} mb={2} color="#212121">YOUR DSA MASTERY JOURNEY</Typography>
                <Typography align="center" variant="h6" mb={6} color="#616161">Complete modules to unlock new challenges and advance your skills.</Typography>
                <Timeline position="alternate" sx={{ p: 0, mt: 4 }}>
                    {roadmapLevels.map((level, idx) => {
                        const isExpanded = expandedLevel === level.level;
                        return (
                            <TimelineItem key={level.level}>
                                <TimelineOppositeContent sx={{ flex: 1 }} />
                                <TimelineSeparator>
                                    <CustomTimelineDot levelColor={level.color} isCurrentLevel={level.level === currentLevel} activeColor={activeColor}>
                                        {level.level === currentLevel && <CurrentLevelIndicator activeColor={activeColor}><div className="ring" /><div className="ring delay" /></CurrentLevelIndicator>}
                                        {level.icon}
                                    </CustomTimelineDot>
                                    {idx < roadmapLevels.length - 1 && <CustomTimelineConnector isCovered={idx < animationProgressIndex} activeColor={activeColor} />}
                                </TimelineSeparator>
                                <TimelineContent sx={{ py: '12px', px: 2 }}>
                                    <ImageStyledCard levelColor={level.color} onClick={() => handleLevelClick(level.level)}>
                                        <Box sx={{ p: 2 }}>
                                            <Typography variant="overline" display="block">{level.level}</Typography>
                                            <Typography variant="h5" fontWeight={700}>{level.title}</Typography>
                                        </Box>
                                    </ImageStyledCard>
                                    {isExpanded && level.cards && (
                                        <Box>
                                            {level.cards.map((card, index) => {
                                                let isLocked = false;
                                                if (card.requires === 'stack-operations') { isLocked = !isQueueUnlocked; }
                                                else if (card.requires === 'queue-operations') { isLocked = !isCQUnlocked; }
                                                else if (card.requires === 'circular-queue-operations') { isLocked = !isInfixPostfixUnlocked; }
                                                else if (card.requires === 'infix-postfix') { isLocked = !isValidParenthesisUnlocked; }
                                                else if (card.requires === 'valid-parenthesis') { isLocked = !isLinearSearchUnlocked; }
                                                else if (card.requires === 'linear-search') { isLocked = !isBinarySearchUnlocked; }
                                                else if (card.requires === 'binary-search') { isLocked = !isBubbleSortUnlocked; }
                                                else if (card.requires === 'bubble-sort') { isLocked = !isSelectionSortUnlocked; }
                                                else if (card.requires === 'selection-sort') { isLocked = !isBfsUnlocked; }
                                                else if (card.requires === 'bfs') { isLocked = !isDfsUnlocked; }
                                                else if (card.requires === 'dfs') { isLocked = !isDlsUnlocked; }


                                                const cardContent = (
                                                    <ModuleCard
                                                        color={level.color}
                                                        locked={isLocked}
                                                    >
                                                        <Box sx={{ background: alpha(level.color, 0.1), borderRadius: '12px', p: 2, mr: 2 }}>
                                                            <Typography variant="h6" fontWeight="bold" color={level.color}>{level.level.charAt(6)}.{index + 1}</Typography>
                                                        </Box>
                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <Typography variant="h6" fontWeight={600} color="text.primary">{card.title}</Typography>
                                                            <Typography variant="body2" color="text.secondary">{card.description}</Typography>
                                                        </Box>
                                                        <Box sx={{ ml: 1 }}>
                                                            {isLocked ? <LockIcon color="action" /> : <ArrowForwardIosIcon color="action" />}
                                                        </Box>
                                                    </ModuleCard>
                                                );

                                                return (
                                                    <Box key={card.id}>
                                                        {isLocked ? cardContent : <Link to={card.url} style={{ textDecoration: 'none' }}>{cardContent}</Link>}
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    )}
                                </TimelineContent>
                            </TimelineItem>
                        );
                    })}
                </Timeline>
                <Paper sx={{ p: 2, mt: 4, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>Simulation Controls</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Button variant="contained" color="primary" onClick={simulateStackQuizCompletion} disabled={isQueueUnlocked}> 1. Complete Stack </Button>
                        <Button variant="contained" color="primary" onClick={simulateQueueQuizCompletion} disabled={!isQueueUnlocked || isCQUnlocked}> 2. Complete Queue </Button>
                        <Button variant="contained" color="primary" onClick={simulateCQQuizCompletion} disabled={!isCQUnlocked || isInfixPostfixUnlocked}> 3. Complete C-Queue </Button>
                        <Button variant="contained" color="success" onClick={simulateInfixQuizCompletion} disabled={!isInfixPostfixUnlocked || isValidParenthesisUnlocked}> 4. Complete Infix→Postfix </Button>
                        <Button variant="contained" color="success" onClick={simulateVPQuizCompletion} disabled={!isValidParenthesisUnlocked || isLinearSearchUnlocked}> 5. Complete VP </Button>
                        <Button variant="contained" color="warning" onClick={simulateLSQuizCompletion} disabled={!isLinearSearchUnlocked || isBinarySearchUnlocked}> 6. Complete Linear Search </Button>
                        <Button variant="contained" color="warning" onClick={simulateBSQuizCompletion} disabled={!isBinarySearchUnlocked || isBubbleSortUnlocked}> 7. Complete Binary Search </Button>
                        <Button variant="contained" color="warning" onClick={simulateSLSQuizCompletion} disabled={!isBubbleSortUnlocked || isSelectionSortUnlocked}> 8. Complete Bubble Sort </Button>
                        <Button variant="contained" color="warning" onClick={simulateSelectionSortQuizCompletion} disabled={!isSelectionSortUnlocked || isBfsUnlocked}> 9. Complete Selection Sort </Button>
                        <Button variant="contained" sx={{ bgcolor: '#9C27B0', '&:hover': { bgcolor: '#7B1FA2' } }} onClick={simulateBfsQuizCompletion} disabled={!isBfsUnlocked || isDfsUnlocked}> 10. Complete BFS </Button>
                        <Button variant="contained" sx={{ bgcolor: '#9C27B0', '&:hover': { bgcolor: '#7B1FA2' } }} onClick={simulateDfsQuizCompletion} disabled={!isDfsUnlocked || isDlsUnlocked}> 11. Complete DFS </Button>
                        <Button variant="outlined" color="error" onClick={resetProgress}> Reset All Progress </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

// Add id to the main roadmap container for scroll targeting
const RoadmapWithId = (props) => <div id="roadmap-section"><Roadmap {...props} /></div>;
export default RoadmapWithId;