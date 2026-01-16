import React, { useState } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Avatar,
    Container,
    BottomNavigation,
    BottomNavigationAction,
    Paper as MuiPaper
} from '@mui/material';
import {
    Menu as MenuIcon,
    DarkMode,
    LightMode,
    Dashboard as DashIcon,
    Assignment as AptIcon,
    Code as CodeIcon,
    Chat as ChatIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { useColorMode } from '../index';

const drawerWidth = 280;

export default function MainLayout({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { currentUser } = useAuth();
    const colorMode = useColorMode();
    const navigate = useNavigate();
    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const bottomNavValue = () => {
        const path = location.pathname;
        if (path === '/dashboard') return 0;
        if (path === '/aptitude') return 1;
        if (path === '/programming') return 2;
        if (path === '/ai-assistant') return 3;
        return 0;
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', pb: { xs: 8, lg: 0 } }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { lg: `calc(100% - ${drawerWidth}px)` },
                    ml: { lg: `${drawerWidth}px` },
                    boxShadow: 'none',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { lg: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800, background: 'linear-gradient(45deg, #1a73e8, #4285f4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        AI Placement Mentor
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton color="inherit" onClick={colorMode.toggleColorMode}>
                            {colorMode.mode === 'dark' ? <LightMode /> : <DarkMode />}
                        </IconButton>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '0.9rem', fontWeight: 700 }}>
                                {currentUser?.email?.[0].toUpperCase()}
                            </Avatar>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, md: 3 },
                    width: { lg: `calc(100% - ${drawerWidth}px)` },
                    mt: '64px',
                    minHeight: 'calc(100vh - 64px)',
                    bgcolor: 'background.default'
                }}
            >
                <Container maxWidth="lg" sx={{ py: 2 }}>
                    {children}
                </Container>
            </Box>

            {/* Mobile Bottom Navigation */}
            <Box sx={{ display: { xs: 'block', lg: 'none' }, position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
                <MuiPaper elevation={16} sx={{ borderRadius: '20px 20px 0 0', overflow: 'hidden' }}>
                    <BottomNavigation
                        showLabels
                        value={bottomNavValue()}
                        onChange={(event, newValue) => {
                            const paths = ['/dashboard', '/aptitude', '/programming', '/ai-assistant'];
                            navigate(paths[newValue]);
                        }}
                        sx={{ height: 70 }}
                    >
                        <BottomNavigationAction label="Home" icon={<DashIcon />} />
                        <BottomNavigationAction label="Practice" icon={<AptIcon />} />
                        <BottomNavigationAction label="Code" icon={<CodeIcon />} />
                        <BottomNavigationAction label="AI" icon={<ChatIcon />} />
                    </BottomNavigation>
                </MuiPaper>
            </Box>
        </Box>
    );
}
