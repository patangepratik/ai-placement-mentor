import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Toolbar,
    Typography,
    Divider,
    Box
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Psychology as AptitudeIcon,
    Code as CodeIcon,
    QuestionAnswer as InterviewIcon,
    Description as ResumeIcon,
    Chat as ChatIcon,
    AccountCircle as ProfileIcon,
    ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 280;

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Aptitude Practice', icon: <AptitudeIcon />, path: '/aptitude' },
    { text: 'Programming Practice', icon: <CodeIcon />, path: '/programming' },
    { text: 'Interview Preparation', icon: <InterviewIcon />, path: '/interview' },
    { text: 'Resume Analyzer', icon: <ResumeIcon />, path: '/resume' },
    { text: 'AI Assistant', icon: <ChatIcon />, path: '/ai-assistant' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
];

export default function Sidebar({ mobileOpen, handleDrawerToggle }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexSequence: 'column', flexDirection: 'column' }}>
            <Toolbar>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 0.5, borderRadius: 1, display: 'flex' }}>
                        <AptitudeIcon fontSize="small" />
                    </Box>
                    Placement AI
                </Typography>
            </Toolbar>
            <Divider />
            <List sx={{ flexGrow: 1, px: 2, pt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            onClick={() => {
                                navigate(item.path);
                                if (handleDrawerToggle) handleDrawerToggle();
                            }}
                            selected={location.pathname === item.path}
                            sx={{
                                borderRadius: 2,
                                '&.Mui-selected': {
                                    bgcolor: 'primary.light',
                                    color: 'primary.main',
                                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                                    '&:hover': { bgcolor: 'primary.light' }
                                },
                                '&:hover': { borderRadius: 2 }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 600 : 400 }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List sx={{ px: 2, pb: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{ borderRadius: 2, color: 'error.main', '&:hover': { bgcolor: 'error.light' } }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
        >
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', lg: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none', boxShadow: 3 },
                }}
            >
                {drawer}
            </Drawer>
            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', lg: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #f0f0f0' },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
}
