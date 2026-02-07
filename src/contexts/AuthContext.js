import React, { useContext, useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS } from "../apiBase";


const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper for retries and better error messages
  const fetchWithRetry = async (url, options, retries = 5) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Server error: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      // If it's a network error (failed to fetch), retry
      const errLower = err.message.toLowerCase();
      const isNetworkError = errLower.includes('fetch') || errLower.includes('network') || errLower.includes('typeerror');

      if (retries > 0 && isNetworkError) {
        console.warn(`Connection to ${url} failed. Retrying in 3s... (${retries} left)`);
        await new Promise(r => setTimeout(r, 3000));
        return fetchWithRetry(url, options, retries - 1);
      }

      if (isNetworkError) {
        throw new Error(`Server is temporarily unavailable (Failed to connect to backend). Please ensure the backend is active at ${url} and wait 30 seconds for it to wake up.`);
      }
      throw err;
    }
  };


  // Signup - Calls backend
  async function signup(email, password) {
    const data = await fetchWithRetry(API_ENDPOINTS.SIGNUP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setCurrentUser(data.user);
    localStorage.setItem("current-user", JSON.stringify(data.user));
    return data.user;
  }

  // Login - Calls backend
  async function login(email, password) {
    const data = await fetchWithRetry(API_ENDPOINTS.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setCurrentUser(data.user);
    localStorage.setItem("current-user", JSON.stringify(data.user));
    return data.user;
  }

  // Guest Login
  function continueAsGuest() {
    const guestUser = {
      email: "guest@example.com",
      uid: "guest-" + Math.random().toString(36).substr(2, 9),
      isGuest: true
    };
    setCurrentUser(guestUser);
    localStorage.setItem("current-user", JSON.stringify(guestUser));
    return guestUser;
  }


  // Logout
  function logout() {
    return new Promise((resolve) => {
      setCurrentUser(null);
      localStorage.removeItem("current-user");
      resolve();
    });
  }




  const [userProgress, setUserProgress] = useState(null);

  const getUserProgress = useCallback(async (userId) => {
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
      if (currentUser?.isGuest) {
        setUserProgress(initialData);
        return initialData;
      }

      const response = await fetch(API_ENDPOINTS.PROGRESS(userId));
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
  }, [currentUser]);

  const updateUserProgress = useCallback(async (userId, progressData) => {
    if (!userId) return;
    const progressKey = `user-progress-${userId}`;

    // Optimistic update
    localStorage.setItem(progressKey, JSON.stringify(progressData));
    setUserProgress(progressData);

    if (currentUser?.isGuest) return progressData;

    try {
      await fetch(API_ENDPOINTS.PROGRESS(userId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progressData),
      });
    } catch (e) {
      console.error("Failed to sync progress to backend:", e);
    }


    return progressData;
  }, [currentUser]);

  useEffect(() => {
    // Check for persisted user
    const stored = localStorage.getItem("current-user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setCurrentUser(user);
        // We call this directly here, but we don't want to depend on the function identity
        // to avoid infinite loops since getUserProgress depends on currentUser
      } catch (e) {
        console.error("Auth init error:", e);
        localStorage.removeItem("current-user");
      }
    }
    setLoading(false);
  }, []); // Run ONCE on mount

  // Sync progress when user changes
  useEffect(() => {
    if (currentUser?.uid) {
      getUserProgress(currentUser.uid);
    }
  }, [currentUser, getUserProgress]);



  function resetPassword(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // In a real app, call backend to send reset email
        resolve("Password reset email sent (simulated)");
      }, 500);
    });
  }

  const value = {
    currentUser,
    login,
    signup,
    logout,
    continueAsGuest,
    resetPassword,
    userProgress,
    getUserProgress,
    updateUserProgress,
    isMock: false

  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
