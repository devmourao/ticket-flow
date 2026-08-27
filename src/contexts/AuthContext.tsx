import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';


export type Role = 'admin' | 'client' | 'agent' | 'demo';

export interface Profile {
  id: string;
  role: Role;
  full_name: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  activeRole: Role | null;
  setActiveRole: (role: Role) => void; 
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  

  const [activeRole, setActiveRoleState] = useState<Role | null>(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

  
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setActiveRoleState(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      setProfile(data);
     
      setActiveRoleState(data.role); 
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

 
  const handleSetActiveRole = (newRole: Role) => {
    if (profile?.role === 'admin' || profile?.role === 'demo') {
      setActiveRoleState(newRole);
    } else {
      console.warn('Acesso negado: Apenas administradores e contas demo podem trocar de visão.');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      activeRole, 
      setActiveRole: handleSetActiveRole, 
      loading 
    }}>
    
      {!loading && children} 
    </AuthContext.Provider>
  );
}


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};