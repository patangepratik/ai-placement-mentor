import React, { useContext, useState, useEffect } from "react";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Signup - Calls backend
  async function signup(email, password) {
    const response = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to create account");
    }

    setCurrentUser(data.user);
    localStorage.setItem("current-user", JSON.stringify(data.user));
    return data.user;
  }

  // Login - Calls backend
  async function login(email, password) {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to login");
    }

    setCurrentUser(data.user);
    localStorage.setItem("current-user", JSON.stringify(data.user));
    return data.user;
  }

  // Logout
  function logout() {
    return new Promise((resolve) => {
      setCurrentUser(null);
      localStorage.removeItem("current-user");
      resolve();
    });
  }

  useEffect(() => {
    // Check for persisted user
    const stored = localStorage.getItem("current-user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setCurrentUser(user);
        setUserProgress(getUserProgress(user.uid));
      } catch (e) {
        console.error("Auth init error:", e);
        localStorage.removeItem("current-user");
      }
    }
    setLoading(false);
  }, []);

  const [userProgress, setUserProgress] = useState(null);

  function getUserProgress(userId) {
    if (!userId) return null;
    const progressKey = `user-progress-${userId}`;
    const stored = localStorage.getItem(progressKey);
    const data = stored ? JSON.parse(stored) : {
      questionsSolved: 0,
      mockInterviews: 0,
      timeSpent: 0,
      recentActivity: []
    };
    return data;
  }

  function updateUserProgress(userId, progressData) {
    if (!userId) return;
    const progressKey = `user-progress-${userId}`;
    const current = getUserProgress(userId);
    const updated = { ...current, ...progressData };
    localStorage.setItem(progressKey, JSON.stringify(updated));
    setUserProgress(updated);
    return updated;
  }

  function resetPassword(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("mock-users") || "[]");
        if (users.find(u => u.email === email)) {
          resolve("Password reset email sent (simulated)");
        } else {
          reject(new Error("Email not found"));
        }
      }, 500);
    });
  }

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    userProgress,
    getUserProgress,
    updateUserProgress,
    isMock: true
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
