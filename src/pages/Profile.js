import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Grid,
    TextField,
    Button,
    Divider,
    Paper
} from '@mui/material';
import {
    Badge as BadgeIcon,
    Security as SecurityIcon,
    CloudDone as CloudIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
    const { currentUser } = useAuth();

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Account Profile
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
                Manage your account settings and preferences
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 4, textAlign: 'center', p: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    bgcolor: 'primary.main',
                                    fontSize: '3rem',
                                    fontWeight: 700,
                                    mb: 2,
                                    boxShadow: '0 8px 16px rgba(26, 115, 232, 0.2)'
                                }}
                            >
                                {currentUser?.email?.[0].toUpperCase()}
                            </Avatar>
                            <Typography variant="h5" fontWeight={700}>{currentUser?.email?.split('@')[0]}</Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>{currentUser?.email}</Typography>
                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                <Paper variant="outlined" sx={{ px: 2, py: 0.5, borderRadius: 2, bgcolor: '#f8f9fa' }}>
                                    <Typography variant="caption" fontWeight={700} color="primary">STUDENT</Typography>
                                </Paper>
                                <Paper variant="outlined" sx={{ px: 2, py: 0.5, borderRadius: 2, bgcolor: '#f8f9fa' }}>
                                    <Typography variant="caption" fontWeight={700} color="success.main">ACTIVE</Typography>
                                </Paper>
                            </Box>
                        </Box>
                        <Divider sx={{ my: 4 }} />
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Member Since</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>January 2026</Typography>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Placement Status</Typography>
                            <Typography variant="body2" color="text.secondary">In Preparation</Typography>
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 4, mb: 4 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                                <BadgeIcon color="primary" /> Basic Information
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Full Name" defaultValue={currentUser?.email?.split('@')[0]} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Email Address" defaultValue={currentUser?.email} variant="outlined" disabled sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="College/University" defaultValue="Indian Institute of Technology" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                                </Grid>
                            </Grid>
                            <Button variant="contained" sx={{ mt: 4, borderRadius: 3, px: 4 }}>Save Changes</Button>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 4 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                                <SecurityIcon color="primary" /> Security & Privacy
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Box>
                                    <Typography variant="body1" fontWeight={600}>Two-Factor Authentication</Typography>
                                    <Typography variant="body2" color="text.secondary">Add an extra layer of security to your account</Typography>
                                </Box>
                                <Button variant="outlined" sx={{ borderRadius: 2 }}>Enable</Button>
                            </Box>
                            <Divider sx={{ mb: 3 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="body1" fontWeight={600}>Data Sync</Typography>
                                    <Typography variant="body2" color="text.secondary">Automatically sync your progress across devices</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                                    <CloudIcon fontSize="small" />
                                    <Typography variant="caption" fontWeight={700}>ENABLED</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
