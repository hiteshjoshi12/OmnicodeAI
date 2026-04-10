import React, { createContext, useContext, useState } from 'react';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export function AuthProvider({ children }) {
  // Initialize state directly from localStorage so it persists across refreshes
  const [user, setUserState] = useState(() => {
    const savedUser = localStorage.getItem('omnicode_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('omnicode_token') || null;
  });

  // The login function updates both React State (Context) and the Browser (localStorage)
  const login = (userData, jwtToken) => {
    setUserState(userData);
    setToken(jwtToken);
    localStorage.setItem('omnicode_user', JSON.stringify(userData));
    localStorage.setItem('omnicode_token', jwtToken);
  };

  // NEW: The updateUser function! 
  // Call this whenever you fetch fresh user data (like on the Profile page)
  // or when the user updates their profile picture/name.
  const updateUser = (newUserData) => {
    // Merge the existing user data with the new data
    const updatedUser = { ...user, ...newUserData };
    setUserState(updatedUser);
    localStorage.setItem('omnicode_user', JSON.stringify(updatedUser));
  };

  // The logout function clears both
  const logout = () => {
    setUserState(null);
    setToken(null);
    localStorage.removeItem('omnicode_user');
    localStorage.removeItem('omnicode_token');
  };

  return (
    // Make sure to expose updateUser in the value prop!
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Create a custom hook for easy importing
export const useAuth = () => useContext(AuthContext);