/**
 * Simplified AuthContext for BOLT Frontend
 * Minimal implementation - will connect to backend API later
 */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  email: string;
  full_name?: string;
  role?: 'customer' | 'helper';
  [key: string]: any;
};

type Profile = {
  id: string;
  full_name?: string;
  email?: string;
  role?: 'customer' | 'helper';
  subscription_tier?: 'basic' | 'pro' | 'premium';
  monthly_cap_remaining?: number;
  [key: string]: any;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  activeRole: 'customer' | 'helper' | null;
  setActiveRole: (role: 'customer' | 'helper') => void;
  canSwitchToHelper: boolean;
  signUp: (email: string, password: string, fullName: string, role: 'customer' | 'helper') => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ profile: Profile | null }>;
  signInWithGoogle: (role: 'customer' | 'helper') => Promise<void>;
  signInWithApple: (role: 'customer' | 'helper') => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRoleState] = useState<'customer' | 'helper' | null>(null);
  const [canSwitchToHelper, setCanSwitchToHelper] = useState(false);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('jamii_user');
    const storedToken = localStorage.getItem('jamii_token');
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setProfile(userData);
        setActiveRoleState(userData.role || null);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: 'customer' | 'helper') => {
    // Mock implementation - will connect to backend API
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      full_name: fullName,
      role,
    };
    
    setUser(newUser);
    setProfile(newUser);
    setActiveRoleState(role);
    localStorage.setItem('jamii_user', JSON.stringify(newUser));
    localStorage.setItem('jamii_token', 'mock_token_' + Date.now());
  };

  const signIn = async (email: string, password: string): Promise<{ profile: Profile | null }> => {
    // Mock implementation - will connect to backend API
    const mockUser: User = {
      id: `user_${Date.now()}`,
      email,
      full_name: email.split('@')[0],
      role: 'customer',
    };
    
    setUser(mockUser);
    setProfile(mockUser);
    setActiveRoleState('customer');
    localStorage.setItem('jamii_user', JSON.stringify(mockUser));
    localStorage.setItem('jamii_token', 'mock_token_' + Date.now());
    
    return { profile: mockUser };
  };

  const signInWithGoogle = async (role: 'customer' | 'helper') => {
    // Mock implementation - will connect to backend API
    console.log('Google sign in (mock)', role);
  };

  const signInWithApple = async (role: 'customer' | 'helper') => {
    // Mock implementation - will connect to backend API
    console.log('Apple sign in (mock)', role);
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    setActiveRoleState(null);
    localStorage.removeItem('jamii_user');
    localStorage.removeItem('jamii_token');
  };

  const refreshProfile = async () => {
    // Mock implementation - will connect to backend API
    if (user) {
      // Refresh profile data
    }
  };

  const setActiveRole = (role: 'customer' | 'helper') => {
    setActiveRoleState(role);
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      setProfile(updatedUser);
      localStorage.setItem('jamii_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        activeRole,
        setActiveRole,
        canSwitchToHelper,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithApple,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

