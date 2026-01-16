import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
    palette: {
        mode,
        primary: {
            main: '#1a73e8',
            light: mode === 'dark' ? '#1a2736' : '#e8f0fe',
            dark: '#174ea6',
        },
        secondary: {
            main: '#34a853',
        },
        background: {
            default: mode === 'dark' ? '#121212' : '#f8f9fa',
            paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
        },
        text: {
            primary: mode === 'dark' ? '#e8eaed' : '#202124',
            secondary: mode === 'dark' ? '#9aa0a6' : '#5f6368',
        },
    },
    typography: {
        fontFamily: '"Google Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 24, padding: '8px 24px' },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: mode === 'dark' ? '0 4px 6px rgba(0,0,0,0.4)' : '0 1px 3px rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
                    backgroundImage: 'none',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
                    color: mode === 'dark' ? '#e8eaed' : '#202124',
                    borderBottom: mode === 'dark' ? '1px solid #333' : '1px solid #f0f0f0',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
                    borderRight: mode === 'dark' ? '1px solid #333' : '1px solid #f0f0f0',
                },
            },
        },
    },
});
