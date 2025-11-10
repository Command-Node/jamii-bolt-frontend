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
    // Check for stored user session and verify with backend
    const storedUser = localStorage.getItem('jamii_user');
    const storedToken = localStorage.getItem('jamii_token');
    
    if (storedToken) {
      // Verify token with backend
      const verifyUser = async () => {
        try {
          const api = (await import('../lib/api')).default;
          const userData = await api.getCurrentUser();
          
          if (userData) {
            const user: User = {
              id: userData.id,
              email: userData.email,
              full_name: userData.name,
              role: userData.role,
            };
            
            setUser(user);
            setProfile(user);
            setActiveRoleState(user.role || null);
            localStorage.setItem('jamii_user', JSON.stringify(user));
          }
        } catch (error) {
          // Token invalid, clear storage
          console.error('Token verification failed:', error);
          localStorage.removeItem('jamii_token');
          localStorage.removeItem('jamii_user');
        } finally {
          setLoading(false);
        }
      };
      
      verifyUser();
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: 'customer' | 'helper') => {
    try {
      const api = (await import('../lib/api')).default;
      const data = await api.register({
        email,
        password,
        name: fullName,
        role,
      });
      
      if (data.user) {
        const newUser: User = {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.name || fullName,
          role: data.user.role || role,
        };
        
        setUser(newUser);
        setProfile(newUser);
        setActiveRoleState(role);
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string): Promise<{ profile: Profile | null }> => {
    try {
      const api = (await import('../lib/api')).default;
      const data = await api.login(email, password);
      
      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.name || email.split('@')[0],
          role: data.user.role || 'customer',
        };
        
        setUser(user);
        setProfile(user);
        setActiveRoleState(user.role || 'customer');
        
        return { profile: user };
      }
      
      return { profile: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
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
    try {
      const api = (await import('../lib/api')).default;
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setProfile(null);
      setActiveRoleState(null);
      localStorage.removeItem('jamii_user');
      localStorage.removeItem('jamii_token');
    }
  };

  const refreshProfile = async () => {
    try {
      const api = (await import('../lib/api')).default;
      const userData = await api.getCurrentUser();
      
      if (userData) {
        const updatedUser: User = {
          id: userData.id,
          email: userData.email,
          full_name: userData.name,
          role: userData.role,
        };
        
        setUser(updatedUser);
        setProfile(updatedUser);
        setActiveRoleState(updatedUser.role || null);
        localStorage.setItem('jamii_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
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

