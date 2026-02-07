import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Alert,
    LinearProgress
} from '@mui/material';
import aptitudeDataOriginal from '../data/aptitude.json';
import { useUserActivity } from '../hooks/useUserActivity';
import { shuffleArray } from '../utils';
import { useEffect } from 'react';

export default function Aptitude() {
    const { trackActivity } = useUserActivity();
    const [aptitudeData, setAptitudeData] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [isCorrect, setIsCorrect] = useState(null);

    useEffect(() => {
        setAptitudeData(shuffleArray(aptitudeDataOriginal));
    }, []);

    if (aptitudeData.length === 0) return null;

    const currentQuestion = aptitudeData[currentIdx];

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = () => {
        const correct = selectedOption === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        if (correct) {
            setScore(prev => prev + 1);
            trackActivity('aptitude_solve', { question: currentQuestion.question });
        }
        setShowResult(true);
    };

    const handleNext = () => {
        if (currentIdx < aptitudeData.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelectedOption('');
            setShowResult(false);
            setIsCorrect(null);
        }
    };

    const progress = ((currentIdx + 1) / aptitudeData.length) * 100;

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Aptitude Practice
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
                Quantitative, Logical, and Verbal Reasoning Mock Test
            </Typography>

            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                        Question {currentIdx + 1} of {aptitudeData.length}
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight={600}>
                        Score: {score}
                    </Typography>
                </Box>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
            </Box>

            <Card elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 4, p: 2 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                        {currentQuestion.question}
                    </Typography>

                    <FormControl component="fieldset" fullWidth>
                        <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                            {currentQuestion.options.map((option, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        mb: 1.5,
                                        p: 1.5,
                                        border: '1px solid',
                                        borderColor: selectedOption === option ? 'primary.main' : '#f0f0f0',
                                        borderRadius: 3,
                                        bgcolor: selectedOption === option ? 'primary.light' : 'transparent',
                                        '&:hover': { bgcolor: selectedOption === option ? 'primary.light' : '#f8f9fa' }
                                    }}
                                >
                                    <FormControlLabel
                                        value={option}
                                        control={<Radio />}
                                        label={option}
                                        disabled={showResult}
                                        sx={{ width: '100%', m: 0 }}
                                    />
                                </Box>
                            ))}
                        </RadioGroup>
                    </FormControl>

                    {!showResult ? (
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handleSubmit}
                            disabled={!selectedOption}
                            sx={{ mt: 3, py: 1.5 }}
                        >
                            Check Answer
                        </Button>
                    ) : (
                        <Box sx={{ mt: 3 }}>
                            {isCorrect ? (
                                <Alert severity="success" sx={{ borderRadius: 3, mb: 2 }}>
                                    Correct! Well done.
                                </Alert>
                            ) : (
                                <Alert severity="error" sx={{ borderRadius: 3, mb: 2 }}>
                                    Incorrect. The correct answer is: <strong>{currentQuestion.correctAnswer}</strong>
                                </Alert>
                            )}

                            <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 3, mb: 3 }}>
                                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                    Explanation:
                                </Typography>
                                <Typography variant="body2 text.secondary">
                                    {currentQuestion.explanation}
                                </Typography>
                            </Box>

                            <Button
                                variant="outlined"
                                fullWidth
                                size="large"
                                onClick={handleNext}
                                disabled={currentIdx === aptitudeData.length - 1}
                                sx={{ py: 1.5 }}
                            >
                                {currentIdx === aptitudeData.length - 1 ? "End of Test" : "Next Question"}
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
