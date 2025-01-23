import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);
      
      const isLoggedIn = await client.isAuthenticated();
      setIsAuthenticated(isLoggedIn);
    };
    
    initAuth();
  }, []);

  const login = async () => {
    if (authClient) {
      await authClient.login({
        identityProvider: process.env.II_PROVIDER,
        onSuccess: () => {
          setIsAuthenticated(true);
          const identity = authClient.getIdentity();
          setUser(identity.getPrincipal());
        }
      });
    }
  };

  const logout = async () => {
    if (authClient) {
      await authClient.logout();
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout,
      authClient 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);