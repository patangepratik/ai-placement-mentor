import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Divider,
    Chip,
    Paper,
    IconButton,
    Grid
} from '@mui/material';
import {
    NavigateBefore,
    NavigateNext,
    Code as CodeIcon,
    EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import codingDataOriginal from '../data/coding.json';
import { useUserActivity } from '../hooks/useUserActivity';
import { shuffleArray } from '../utils';
import { useEffect } from 'react';

export default function Programming() {
    const { trackActivity } = useUserActivity();
    const [codingData, setCodingData] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isSolved, setIsSolved] = useState(false);

    useEffect(() => {
        setCodingData(shuffleArray(codingDataOriginal));
    }, []);

    if (codingData.length === 0) return null;

    const problem = codingData[currentIdx];

    const handleNext = () => {
        if (currentIdx < codingData.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setIsSolved(false);
        }
    };

    const handlePrev = () => {
        if (currentIdx > 0) {
            setCurrentIdx(prev => prev - 1);
            setIsSolved(false);
        }
    };

    const handleSolve = () => {
        setIsSolved(true);
        trackActivity('programming_solve', { title: problem.title });
    };

    const getDifficultyColor = (diff) => {
        switch (diff.toLowerCase()) {
            case 'easy': return 'success';
            case 'medium': return 'warning';
            case 'hard': return 'error';
            default: return 'primary';
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Programming Practice
                </Typography>
                <Box>
                    <IconButton onClick={handlePrev} disabled={currentIdx === 0}>
                        <NavigateBefore />
                    </IconButton>
                    <Typography component="span" sx={{ mx: 2, fontWeight: 600 }}>
                        {currentIdx + 1} / {codingData.length}
                    </Typography>
                    <IconButton onClick={handleNext} disabled={currentIdx === codingData.length - 1}>
                        <NavigateNext />
                    </IconButton>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <Card elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 4, mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <Chip
                                    label={problem.difficulty}
                                    color={getDifficultyColor(problem.difficulty)}
                                    size="small"
                                    sx={{ fontWeight: 700, borderRadius: 1.5 }}
                                />
                                <Chip
                                    label={problem.category || "DSA"}
                                    variant="outlined"
                                    size="small"
                                    sx={{ borderRadius: 1.5 }}
                                />
                                {isSolved && (
                                    <Chip
                                        label="Solved"
                                        color="success"
                                        size="small"
                                        sx={{ fontWeight: 700, borderRadius: 1.5 }}
                                    />
                                )}
                            </Box>

                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                                {problem.title}
                            </Typography>

                            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.7 }}>
                                {problem.problem}
                            </Typography>

                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                                Sample Input
                            </Typography>
                            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa', mb: 3, fontSequence: 'monospace', fontFamily: 'monospace' }}>
                                {problem.sampleInput}
                            </Paper>

                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                                Sample Output
                            </Typography>
                            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa', mb: 3, fontSequence: 'monospace', fontFamily: 'monospace' }}>
                                {problem.sampleOutput}
                            </Paper>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Card elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 4, bgcolor: '#fff', mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TrophyIcon color="warning" /> Explanation & Logic
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                {problem.explanation}
                            </Typography>

                            {problem.tips && (
                                <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 3, border: '1px solid', borderColor: 'primary.main' }}>
                                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        Pro Tip:
                                    </Typography>
                                    <Typography variant="body2" color="primary.dark">
                                        {problem.tips}
                                    </Typography>
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    fullWidth
                                    onClick={handleSolve}
                                    disabled={isSolved}
                                    sx={{ py: 1.5, borderRadius: 2 }}
                                >
                                    {isSolved ? "Solved" : "Mark as Solved"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<CodeIcon />}
                                    sx={{ py: 1.5, borderRadius: 2 }}
                                    onClick={() => window.open('https://leetcode.com', '_blank')}
                                >
                                    Playground
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
