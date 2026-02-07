import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Grid,
    Paper,
    Divider,
    List,
    Chip,
    LinearProgress,
    Avatar,
    Tooltip
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    CheckCircle as CheckIcon,
    ErrorOutline as ErrorIcon,
    Timeline as RoadmapIcon,
    Lightbulb as TipIcon,
    AutoAwesome as SparklesIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import aiService from '../services/aiService';

export default function ResumeAnalyzer() {
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Simulated progress steps
    useEffect(() => {
        let interval;
        if (analyzing) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress === 100) return 0;
                    const diff = Math.random() * 10;
                    return Math.min(oldProgress + diff, 95);
                });
            }, 400);
        } else {
            setProgress(0);
        }
        return () => clearInterval(interval);
    }, [analyzing]);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setAnalyzing(true);
        setError(null);
        setResult(null);

        try {
            console.log("🚀 Starting AI Analysis for:", file.name);
            const data = await aiService.analyzeResume(file);
            console.log("✅ Analysis Data received:", data);
            setProgress(100);
            setTimeout(() => {
                setResult(data);
                console.log("📊 Result state updated.");
                setAnalyzing(false);
            }, 500);
        } catch (err) {
            console.error("Analysis Error:", err);
            setError(err.message || "Analysis failed. Please try again.");
            setAnalyzing(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Box sx={{ mb: 5, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, background: 'linear-gradient(45deg, #1a73e8, #34a853)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    AI Resume Intelligence
                </Typography>
                <Typography color="text.secondary" variant="h6">
                    Unlock your career potential with Gemini-powered ATS analysis
                </Typography>
            </Box>

            {!result && !analyzing && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card elevation={0} sx={{
                        border: '2px dashed',
                        borderColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                        borderRadius: 6,
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : '#fafafa',
                        textAlign: 'center',
                        p: 8,
                        transition: '0.3s',
                        '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.light' }
                    }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', color: 'white', mb: 3, boxShadow: 4 }}>
                                <UploadIcon sx={{ fontSize: 50 }} />
                            </Avatar>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                {file ? file.name : "Select your Resume"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
                                {file ? "Resume captured. Start the AI engine to generate your report." : "Upload your PDF or Word resume. Our AI analyzes structure, keywords, and relevance for top-tier tech roles."}
                            </Typography>

                            <input type="file" id="resume-input" hidden accept=".pdf,.docx,.txt" onChange={handleFileChange} />

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button variant="outlined" component="label" htmlFor="resume-input" size="large" sx={{ borderRadius: 4, px: 4 }}>
                                    {file ? "Change File" : "Choose File"}
                                </Button>
                                {file && (
                                    <Button variant="contained" onClick={handleAnalyze} size="large" sx={{ borderRadius: 4, px: 6, boxShadow: 3 }} startIcon={<SparklesIcon />}>
                                        Analyze with Gemini
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Card>
                </motion.div>
            )}

            {analyzing && (
                <Box sx={{ textAlign: 'center', py: 10 }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 4 }}>
                        <CircularProgress size={120} thickness={2} variant="determinate" value={progress} />
                        <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="h5" color="primary" fontWeight={700}>{Math.round(progress)}%</Typography>
                        </Box>
                    </Box>
                    <Typography variant="h4" fontWeight={800} gutterBottom>Parsing Professional DNA</Typography>
                    <Typography color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                        Gemini AI is currently cross-referencing your experience with 10k+ industry benchmarks...
                    </Typography>
                    <Box sx={{ width: 400, mx: 'auto', mt: 4 }}>
                        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                </Box>
            )}

            {error && (
                <Box sx={{ mt: 3 }}>
                    <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'error.main', bgcolor: 'error.light', borderRadius: 4 }}>
                        <ErrorIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h6" color="error.dark" fontWeight={700}>{error}</Typography>
                        <Button variant="contained" color="error" onClick={() => { setAnalyzing(false); setError(null); }} sx={{ mt: 2 }}>Try Again</Button>
                    </Paper>
                </Box>
            )}

            {result && (
                <AnimatePresence>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Grid container spacing={4}>
                            {/* Score Card */}
                            <Grid item xs={12} md={4}>
                                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 6, height: '100%', position: 'relative', overflow: 'hidden' }}>
                                    <Box sx={{ position: 'absolute', top: 0, right: 0, p: 2 }}>
                                        <Tooltip title="ATS Score represents your resume's compatibility with applicant tracking systems.">
                                            <InfoIcon fontSize="small" color="disabled" />
                                        </Tooltip>
                                    </Box>
                                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                                        <Typography variant="h6" fontWeight={800} gutterBottom>ATS Result</Typography>
                                        <Box sx={{ position: 'relative', display: 'inline-flex', my: 3 }}>
                                            <CircularProgress
                                                variant="determinate"
                                                value={result.score}
                                                size={180}
                                                thickness={6}
                                                sx={{ color: result.score > 75 ? 'success.main' : 'warning.main' }}
                                            />
                                            <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                <Typography variant="h2" component="div" fontWeight={900}>{result.score}</Typography>
                                                <Typography variant="caption" fontWeight={700} color="text.secondary">/ 100</Typography>
                                            </Box>
                                        </Box>
                                        <Chip
                                            label={result.score > 75 ? "EXCELLENT" : "IMPROVEMENT NEEDED"}
                                            color={result.score > 75 ? "success" : "warning"}
                                            sx={{ fontWeight: 800, px: 2 }}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Suggestions */}
                            <Grid item xs={12} md={8}>
                                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 6, height: '100%' }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="h5" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                            <TipIcon color="primary" /> Executive Summary
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, color: 'text.secondary' }}>
                                            {result.suggestion}
                                        </Typography>
                                        <Divider sx={{ mb: 3 }} />
                                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Keywords Alignment</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                            {result.missingKeywords.map((kw, i) => (
                                                <Chip key={i} label={kw} color="error" variant="filled" size="small" sx={{ fontWeight: 600 }} />
                                            ))}
                                            {result.strengths.map((st, i) => (
                                                <Chip key={i} label={st} color="success" variant="outlined" size="small" sx={{ fontWeight: 600 }} />
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Skills Gap */}
                            <Grid item xs={12} md={6}>
                                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 6 }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="h6" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                                            <CheckIcon color="success" /> Technical Proficiency
                                        </Typography>
                                        <List disablePadding>
                                            {result.skills.map((skill, i) => (
                                                <Box key={i} sx={{ mb: 3 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="body1" fontWeight={700}>{skill.name}</Typography>
                                                        <Typography variant="body2" fontWeight={800} color="primary">{skill.level}%</Typography>
                                                    </Box>
                                                    <LinearProgress variant="determinate" value={skill.level} sx={{ height: 10, borderRadius: 5, bgcolor: 'divider' }} />
                                                </Box>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Roadmap */}
                            <Grid item xs={12} md={6}>
                                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 6, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : '#f0f7ff' }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="h6" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, color: 'primary.main' }}>
                                            <RoadmapIcon /> Personalized Roadmap
                                        </Typography>
                                        <Box sx={{ position: 'relative', pl: 4, borderLeft: '2px dashed', borderColor: 'primary.main', ml: 1 }}>
                                            {[
                                                "Adopt quantifiable metrics in project descriptions",
                                                "Integrate specific missing cloud technologies",
                                                "Solve 25+ medium questions in missing segments",
                                                "Book a technical mock interview session"
                                            ].map((step, i) => (
                                                <Box key={i} sx={{ position: 'relative', mb: 5 }}>
                                                    <Box sx={{
                                                        position: 'absolute',
                                                        left: -42,
                                                        top: 0,
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: '50%',
                                                        bgcolor: 'primary.main',
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 900,
                                                        boxShadow: 2
                                                    }}>{i + 1}</Box>
                                                    <Typography variant="body1" fontWeight={700}>{step}</Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                        <Button variant="contained" fullWidth size="large" sx={{ py: 2, borderRadius: 4, fontWeight: 800 }}>Download Full Report</Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 6, textAlign: 'center' }}>
                            <Button variant="text" size="large" sx={{ fontWeight: 700 }} onClick={() => { setResult(null); setFile(null); }}>Analyze Another Career Document</Button>
                        </Box>
                    </motion.div>
                </AnimatePresence>
            )}
        </Box>
    );
}
