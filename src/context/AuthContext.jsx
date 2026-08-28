import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => storageService.getCurrentSession());
  const [allUsers, setAllUsers] = useState(() => storageService.getUsers());
  const [branches, setBranches] = useState(() => storageService.getBranches());

  useEffect(() => {
    // If no user in session, set default admin
    if (!currentUser) {
      const users = storageService.getUsers();
      if (users.length > 0) {
        storageService.setCurrentSession(users[0]);
        setCurrentUser(users[0]);
      }
    }
  }, []);

  const refreshUserData = () => {
    setAllUsers(storageService.getUsers());
    setBranches(storageService.getBranches());
    const session = storageService.getCurrentSession();
    if (session) {
      const freshUser = storageService.getUserById(session.id);
      if (freshUser) {
        setCurrentUser(freshUser);
        storageService.setCurrentSession(freshUser);
      }
    }
  };

  const login = (username, password) => {
    const user = storageService.authenticate(username, password);
    setCurrentUser(user);
    refreshUserData();
    return user;
  };

  const switchUser = (userOrId) => {
    let targetUser = null;
    if (typeof userOrId === 'string') {
      targetUser = storageService.getUserById(userOrId);
    } else {
      targetUser = userOrId;
    }

    if (targetUser) {
      storageService.setCurrentSession(targetUser);
      setCurrentUser(targetUser);
      storageService.logActivity(
        'Switched User',
        targetUser.branchName || 'Central',
        `USER-${targetUser.id}`,
        `Fast-switched active session to ${targetUser.name} (${targetUser.role === 'admin' ? 'Admin' : targetUser.branchName})`
      );
    }
  };

  const logout = () => {
    storageService.clearSession();
    setCurrentUser(null);
  };

  const isAdmin = currentUser?.role === 'admin';
  const assignedBranch = currentUser?.branchId ? storageService.getBranchById(currentUser.branchId) : null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        assignedBranch,
        allUsers,
        branches,
        login,
        logout,
        switchUser,
        refreshUserData
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
