import React, { useState } from 'react';
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    TextField,
    InputAdornment
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Search as SearchIcon,
    ChatBubbleOutline as ChatIcon
} from '@mui/icons-material';
import interviewDataOriginal from '../data/interview.json';
import { useUserActivity } from '../hooks/useUserActivity';
import { shuffleArray } from '../utils';
import { useEffect } from 'react';

export default function Interview() {
    const { trackActivity } = useUserActivity();
    const [interviewData, setInterviewData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setInterviewData(shuffleArray(interviewDataOriginal));
    }, []);

    const filteredQuestions = interviewData.filter(q =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Interview Preparation
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
                Common HR and Technical Interview Questions with Expert Answers
            </Typography>

            <TextField
                fullWidth
                placeholder="Search questions or categories (e.g. HR, Behavioral, Technical)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: 'white' } }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                }}
            />

            <Box>
                {filteredQuestions.map((item, index) => (
                    <Accordion
                        key={index}
                        elevation={0}
                        onChange={(e, expanded) => expanded && trackActivity('interview_view', { question: item.question })}
                        sx={{
                            mb: 2,
                            border: '1px solid #f0f0f0',
                            borderRadius: '16px !important',
                            '&:before': { display: 'none' },
                            overflow: 'hidden'
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, bgcolor: 'primary.light', borderRadius: 2, color: 'primary.main' }}>
                                    <ChatIcon fontSize="small" />
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography sx={{ fontWeight: 600 }}>{item.question}</Typography>
                                    <Chip
                                        label={item.type}
                                        size="small"
                                        variant="outlined"
                                        sx={{ mt: 0.5, height: 20, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}
                                    />
                                </Box>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ bgcolor: '#fcfcfc', borderTop: '1px solid #f0f0f0', p: 3 }}>
                            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                                Suggested Answer:
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                {item.answer}
                            </Typography>

                            {item.tips && (
                                <Box sx={{ mt: 3, p: 2, bgcolor: '#fff', borderLeft: '4px solid', borderColor: 'secondary.main', borderRadius: 1 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: 'secondary.main' }}>
                                        EXPERT TIP
                                    </Typography>
                                    <Typography variant="body2" fontStyle="italic">
                                        {item.tips}
                                    </Typography>
                                </Box>
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))}
                {filteredQuestions.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <Typography color="text.secondary">No questions found matching your search.</Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
