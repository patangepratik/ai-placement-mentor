import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Link,
    Container,
    Alert,
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || "Failed to log in");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#f8f9fa' }}>
            <Container maxWidth="xs">
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                        AI Placement Mentor
                    </Typography>
                    <Typography color="text.secondary">
                        Sign in to continue your preparation
                    </Typography>
                </Box>

                <Card elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 4, p: 2 }}>
                    <CardContent>
                        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                variant="outlined"
                                margin="normal"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                variant="outlined"
                                margin="normal"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                <Link
                                    component="button"
                                    type="button"
                                    variant="body2"
                                    onClick={async () => {
                                        if (!email) return setError("Please enter your email first");
                                        try {
                                            setError('');
                                            await resetPassword(email);
                                            alert("Reset link sent to " + email);
                                        } catch (err) { setError(err.message); }
                                    }}
                                    sx={{ fontWeight: 600, textDecoration: 'none' }}
                                >
                                    Forgot Password?
                                </Link>
                            </Box>
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                type="submit"
                                disabled={loading}
                                sx={{ mt: 3, py: 1.5, borderRadius: 3, fontWeight: 700 }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={async () => {
                                    setLoading(true);
                                    await login('test@test.com', 'password');
                                    navigate('/dashboard');
                                }}
                                disabled={loading}
                                sx={{ mt: 1.5, py: 1.2, borderRadius: 3, fontWeight: 700, borderColor: '#e0e0e0', color: 'text.secondary' }}
                            >
                                Login as Guest
                            </Button>
                        </form>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Don't have an account? <Link href="/signup" sx={{ fontWeight: 700, textDecoration: 'none' }}>Sign Up</Link>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Box sx={{ mt: 6, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                        &copy; 2026 AI Placement Mentor. Built for Excellence.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
