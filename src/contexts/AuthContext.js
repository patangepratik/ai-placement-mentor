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
        getUserProgress(user.uid); // This will update userProgress state inside
      } catch (e) {
        console.error("Auth init error:", e);
        localStorage.removeItem("current-user");
      }
    }
    setLoading(false);
  }, []);

  const [userProgress, setUserProgress] = useState(null);

  async function getUserProgress(userId) {
    if (!userId) return null;

    // First check local for quick responsive feel
    const progressKey = `user-progress-${userId}`;
    const stored = localStorage.getItem(progressKey);
    let initialData = stored ? JSON.parse(stored) : {
      questionsSolved: 0,
      mockInterviews: 0,
      timeSpent: 0,
      recentActivity: []
    };

    try {
      const response = await fetch(`http://localhost:5000/api/progress/${userId}`);
      if (response.ok) {
        const remoteData = await response.json();
        localStorage.setItem(progressKey, JSON.stringify(remoteData));
        setUserProgress(remoteData);
        return remoteData;
      }
    } catch (e) {
      console.warn("Backend progress fetch failed, using local fallback");
    }

    setUserProgress(initialData);
    return initialData;
  }

  async function updateUserProgress(userId, progressData) {
    if (!userId) return;
    const progressKey = `user-progress-${userId}`;

    // Optimistic update
    localStorage.setItem(progressKey, JSON.stringify(progressData));
    setUserProgress(progressData);

    try {
      await fetch(`http://localhost:5000/api/progress/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progressData),
      });
    } catch (e) {
      console.error("Failed to sync progress to backend:", e);
    }

    return progressData;
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
