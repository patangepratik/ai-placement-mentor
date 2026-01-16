import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Avatar,
    Divider,
    Paper,
    LinearProgress,
    Chip
} from '@mui/material';
import {
    TrendingUp,
    Assignment as AssignmentIcon,
    Timer as TimerIcon,
    Star as StarIcon,
    PlayArrow as PlayIcon,
    ArrowForward as ArrowIcon,
    QuestionAnswer as InterviewIcon,
    Code as CodeIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, color, trend }) => (
    <Card elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 4 }}>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main`, borderRadius: 3 }}>
                    {icon}
                </Avatar>
                {trend && (
                    <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, bgcolor: 'success.light', px: 1, py: 0.5, borderRadius: 1 }}>
                        {trend}
                    </Typography>
                )}
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>{value}</Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>{title}</Typography>
        </CardContent>
    </Card>
);

export default function Dashboard() {
    const { currentUser, getUserProgress, userProgress } = useAuth();
    const navigate = useNavigate();
    const [progress, setProgress] = useState({ questionsSolved: 0, mockInterviews: 0, timeSpent: 0, recentActivity: [] });

    useEffect(() => {
        if (currentUser && !userProgress) {
            getUserProgress(currentUser.uid);
        }
    }, [currentUser, getUserProgress, userProgress]);

    // Update local progress when userProgress state changes
    useEffect(() => {
        if (userProgress) {
            setProgress(userProgress);
        }
    }, [userProgress]);

    const stats = [
        { title: 'Questions Solved', value: progress.questionsSolved, icon: <AssignmentIcon />, color: 'primary', trend: '+12%' },
        { title: 'Preparation Score', value: `${Math.min(100, (progress.questionsSolved * 2) + (progress.mockInterviews * 5) + 30)}%`, icon: <TrendingUp />, color: 'success' },
        { title: 'Interview Readiness', value: `${Math.round(progress.mockInterviews * 10)}%`, icon: <StarIcon />, color: 'warning', trend: 'Growing' },
        { title: 'Hours Focused', value: `${(progress.questionsSolved * 0.2 + progress.mockInterviews * 0.5).toFixed(1)}h`, icon: <TimerIcon />, color: 'secondary' },
    ];

    return (
        <Box>
            {/* Hero Welcome */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 6 },
                    borderRadius: 6,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    mb: 4,
                    background: 'linear-gradient(45deg, #1a73e8 30%, #4285f4 90%)',
                    boxShadow: '0 20px 40px rgba(26, 115, 232, 0.2)'
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 600 }}>
                    <Typography variant="overline" sx={{ fontWeight: 700, opacity: 0.8, letterSpacing: 2 }}>
                        PERSONALIZED MENTORSHIP
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
                        Ready to shine, {currentUser?.email?.split('@')[0]}?
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, mb: 3 }}>
                        Your placement journey is {Math.round(progress.questionsSolved / 5)}% complete. You've solved {progress.questionsSolved} questions so far!
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/aptitude')}
                        sx={{ bgcolor: 'white', color: 'primary.main', px: 4, py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#f8f9fa' } }}
                        startIcon={<PlayIcon />}
                    >
                        Jump to Practice
                    </Button>
                </Box>
                {/* Decorative Elements */}
                <Box sx={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
            </Paper>

            <Grid container spacing={3} sx={{ mb: 6 }}>
                {stats.map((s, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <StatCard {...s} />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Live Activity Feed</Typography>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 5 }}>
                        <Box sx={{ p: 1 }}>
                            {progress.recentActivity && progress.recentActivity.length > 0 ? (
                                progress.recentActivity.map((activity, i) => (
                                    <React.Fragment key={activity.id}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, '&:hover': { bgcolor: 'action.hover' }, borderRadius: 3, transition: '0.2s' }}>
                                            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', mr: 2 }}>
                                                {activity.type === 'aptitude_solve' ? <AssignmentIcon /> :
                                                    activity.type === 'programming_solve' ? <CodeIcon /> :
                                                        <InterviewIcon />}
                                            </Avatar>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="body1" fontWeight={700}>
                                                    {activity.type === 'aptitude_solve' ? 'Solved Aptitude Question' :
                                                        activity.type === 'programming_solve' ? 'Completed Code Challenge' :
                                                            'Viewed Interview Guide'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {activity.details?.question || activity.details?.title || 'Technical Prep'}
                                                </Typography>
                                            </Box>
                                            <Chip label="Success" size="small" color="success" variant="outlined" sx={{ fontWeight: 700 }} />
                                        </Box>
                                        {i < progress.recentActivity.length - 1 && <Divider variant="inset" sx={{ opacity: 0.5 }} />}
                                    </React.Fragment>
                                ))
                            ) : (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography color="text.secondary">No recent activity. Start practicing to see your progress!</Typography>
                                </Box>
                            )}
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Smart Focus</Typography>
                    <Card elevation={0} sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 5,
                        bgcolor: 'background.paper',
                        background: (theme) => theme.palette.mode === 'dark' ? 'none' : 'linear-gradient(to bottom right, #ffffff, #f0f7ff)'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight={800} gutterBottom>Data Structures</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                                Based on your activity, we recommend focusing on **Graph Algorithms** next.
                            </Typography>
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="caption" fontWeight={800} color="primary">Current Mastery</Typography>
                                    <Typography variant="caption" fontWeight={800}>62%</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={62} sx={{ height: 10, borderRadius: 5, bgcolor: 'divider' }} />
                            </Box>
                            <Button
                                variant="outlined"
                                fullWidth
                                endIcon={<ArrowIcon />}
                                onClick={() => navigate('/programming')}
                                sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
                            >
                                Resume Learning
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
