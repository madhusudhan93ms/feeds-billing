import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY_USER = 'retail_pos_logged_user';

export const AuthProvider = ({ children }) => {
  // Current user role: 'admin' | 'staff' | null (if needs login)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default logged in user for demo convenience
    return {
      role: window.location.pathname.includes('/admin') ? 'admin' : 'staff',
      name: window.location.pathname.includes('/admin') ? 'Store Admin' : 'Billing Staff'
    };
  });

  const loginAsAdmin = () => {
    const user = { role: 'admin', name: 'Store Admin', email: 'admin@agrofeeds.com' };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    setCurrentUser(user);
  };

  const loginAsStaff = () => {
    const user = { role: 'staff', name: 'Billing Staff', email: 'staff@agrofeeds.com' };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY_USER);
    setCurrentUser(null);
  };

  const isAdmin = currentUser?.role === 'admin';
  const isStaff = currentUser?.role === 'staff';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isStaff,
        loginAsAdmin,
        loginAsStaff,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
