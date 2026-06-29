import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchWithAuth, fetchWithoutAuth } from '@/lib/api';

export interface User {
  id: string;
  email: string;
}

export interface Session {
  access_token: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  xp_points: number;
  username: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  isTrainer: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string, username?: string) => Promise<{ error: unknown }>;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signInWithGoogle: (credential: string) => Promise<{ error: unknown }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTrainer, setIsTrainer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const data = await fetchWithAuth('/auth/me');
      if (data.user) {
        setUser({ id: data.user._id, email: data.user.email });
        setProfile({
          id: data.user._id,
          email: data.user.email,
          full_name: data.user.fullName,
          avatar_url: data.user.avatarUrl,
          xp_points: data.user.xpPoints || 0,
          username: data.user.username,
        });
        const roles = data.user.roles || [];
        setIsAdmin(roles.includes('admin'));
        setIsTrainer(roles.includes('trainer'));
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
      signOut();
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setSession({ access_token: token });
        await fetchProfile();
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, username?: string) => {
    try {
      await fetchWithoutAuth('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName, username }),
      });
      // Do not auto-login after registration
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await fetchWithoutAuth('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.session.token);
      setSession({ access_token: data.session.token });
      await fetchProfile();
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  };

  const signInWithGoogle = async (credential: string) => {
    try {
      const data = await fetchWithoutAuth('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ token: credential }),
      });
      localStorage.setItem('token', data.session.token);
      setSession({ access_token: data.session.token });
      await fetchProfile();
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
    setIsTrainer(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin,
        isTrainer,
        isLoading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        refreshProfile,
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
