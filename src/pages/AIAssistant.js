import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    Avatar,
    CircularProgress,
    Button,
    Chip,
    Tooltip
} from '@mui/material';
import {
    Send as SendIcon,
    SmartToy as BotIcon,
    Person as PersonIcon,
    DeleteOutline as ResetIcon,
    AutoAwesome as SparklesIcon,
    WifiOff as OfflineIcon,
    Wifi as OnlineIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import aiService from '../services/aiService';

const SUGGESTIONS = [
    "Tell me about machine learning interviews",
    "How to prepare for Google's coding round?",
    "Tips for behavioral interview questions",
    "Review my career path in Web Development"
];

export default function AIAssistant() {
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your AI Placement Mentor. How can I help you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text = input) => {
        const msgToSend = text.trim();
        if (!msgToSend) return;

        const userMessage = { text: msgToSend, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const reply = await aiService.chat(msgToSend);
            const botMessage = {
                text: reply,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMessage = {
                text: "I'm having trouble connecting to the brain center. Switching to local survival mode.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setMessages([{ text: "Chat reset. How can I assist you now?", sender: 'bot' }]);
    };

    return (
        <Box sx={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <SparklesIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                            AI Career Mentor
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {aiService.isBackendOnline ? (
                                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'success.main' }}>
                                    <OnlineIcon sx={{ fontSize: 12 }} /> Gemini Online
                                </Box>
                            ) : (
                                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'warning.main' }}>
                                    <OfflineIcon sx={{ fontSize: 12 }} /> Offline Mode
                                </Box>
                            )}
                        </Typography>
                    </Box>
                </Box>
                <Tooltip title="Reset Conversation">
                    <IconButton onClick={handleReset} color="error" sx={{ border: '1px solid', borderColor: 'error.light' }}>
                        <ResetIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    flexGrow: 1,
                    mb: 2,
                    p: { xs: 2, md: 3 },
                    overflowY: 'auto',
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : '#fff',
                    borderRadius: 5,
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.5
                }}
            >
                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                display: 'flex',
                                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                                alignItems: 'flex-start',
                                gap: 12,
                                maxWidth: '85%',
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                            }}
                        >
                            <Avatar sx={{
                                bgcolor: msg.sender === 'user' ? 'primary.main' : 'secondary.main',
                                width: 36,
                                height: 36,
                                boxShadow: 2
                            }}>
                                {msg.sender === 'user' ? <PersonIcon /> : <BotIcon />}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        borderRadius: msg.sender === 'user' ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                                        bgcolor: msg.sender === 'user'
                                            ? 'primary.main'
                                            : (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                                        color: msg.sender === 'user' ? 'white' : 'text.primary',
                                        border: msg.sender === 'bot' ? '1px solid' : 'none',
                                        borderColor: 'divider',
                                        boxShadow: msg.sender === 'user' ? '0 10px 15px -3px rgba(26, 115, 232, 0.3)' : 'none'
                                    }}
                                >
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                        {msg.text}
                                    </Typography>
                                </Paper>
                                {msg.isError && (
                                    <Button size="small" sx={{ mt: 1 }} onClick={() => handleSend(messages[index - 1]?.text)}>
                                        Retry Connection
                                    </Button>
                                )}
                            </Box>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {loading && (
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', ml: 1 }}>
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
                            <BotIcon />
                        </Avatar>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <CircularProgress size={12} thickness={5} />
                            <Typography variant="caption" color="text.secondary">AI is thinking...</Typography>
                        </Box>
                    </Box>
                )}
                <div ref={messagesEndRef} />
            </Paper>

            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {messages.length < 3 && SUGGESTIONS.map((s, i) => (
                    <Chip
                        key={i}
                        label={s}
                        onClick={() => handleSend(s)}
                        disabled={loading}
                        sx={{
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': { bgcolor: 'primary.light', borderColor: 'primary.main' }
                        }}
                    />
                ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, position: 'relative' }}>
                <TextField
                    fullWidth
                    placeholder="Ask me anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    disabled={loading}
                    autoComplete="off"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 4,
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : 'white',
                            px: 2
                        }
                    }}
                />
                <IconButton
                    color="primary"
                    onClick={() => handleSend()}
                    disabled={loading || !input.trim()}
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                        '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' },
                        width: 54,
                        height: 54,
                        boxShadow: 3
                    }}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
}
