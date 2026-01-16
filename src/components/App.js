import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import MainLayout from "./MainLayout";

// Pages
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Aptitude from "../pages/Aptitude";
import Programming from "../pages/Programming";
import Interview from "../pages/Interview";
import ResumeAnalyzer from "../pages/ResumeAnalyzer";
import AIAssistant from "../pages/AIAssistant";
import Profile from "../pages/Profile";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/aptitude"
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <Aptitude />
                        </MainLayout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/programming"
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <Programming />
                        </MainLayout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/interview"
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <Interview />
                        </MainLayout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/resume"
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <ResumeAnalyzer />
                        </MainLayout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/ai-assistant"
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <AIAssistant />
                        </MainLayout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <Profile />
                        </MainLayout>
                    </PrivateRoute>
                }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default App;
