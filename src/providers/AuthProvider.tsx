'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isPremium: boolean;
  refreshPremiumStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setIsPremium(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('fc_profiles')
        .select('is_premium')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setIsPremium(data?.is_premium ?? false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setIsPremium(false);
    }
  };

  // Fonction publique pour rafraîchir le statut premium
  const refreshPremiumStatus = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    // Essayer d'abord de créer le compte
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          objective: 'A2',
        },
      },
    });

    // Si l'erreur indique que l'email existe déjà, essayer de se connecter
    if (error && error.message.includes('already registered')) {
      console.log('⚠️ [Auth] Email déjà enregistré, tentative de connexion...');
      
      // Essayer de se connecter avec ce compte
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Si la connexion échoue, retourner l'erreur originale
        return { error };
      }

      // Si la connexion réussit, vérifier si le profil fc_profiles existe
      if (signInData.user) {
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from('fc_profiles')
          .select('id')
          .eq('id', signInData.user.id)
          .single();

        // Si le profil n'existe pas, le créer
        if (profileCheckError || !existingProfile) {
          console.log('📝 [Auth] Création du profil fc_profiles pour utilisateur existant...');
          const { error: profileError } = await supabase
            .from('fc_profiles')
            .insert({
              id: signInData.user.id,
              email: signInData.user.email!,
              full_name: fullName,
              objective: 'A2',
              is_premium: false,
            })
            .select()
            .single();

          if (profileError) {
            // Si l'insertion échoue (peut-être à cause d'un trigger), ignorer l'erreur
            // car le trigger SQL peut avoir déjà créé le profil
            console.warn('⚠️ [Auth] Erreur lors de la création du profil (peut être normal si trigger existe):', profileError.message);
          } else {
            console.log('✅ [Auth] Profil fc_profiles créé avec succès');
          }
        } else {
          console.log('✅ [Auth] Profil fc_profiles existe déjà');
        }

        // Retourner un succès car l'utilisateur est maintenant connecté
        return { error: null };
      }
    }

    // Si l'inscription a réussi, créer le profil (le trigger SQL peut aussi le faire)
    if (!error && data.user) {
      // Vérifier d'abord si le profil existe déjà (créé par le trigger)
      const { data: existingProfile } = await supabase
        .from('fc_profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();

      // Si le profil n'existe pas, le créer manuellement
      if (!existingProfile) {
        console.log('📝 [Auth] Création manuelle du profil fc_profiles...');
        const { error: profileError } = await supabase
          .from('fc_profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: fullName,
            objective: 'A2',
            is_premium: false,
          });

        if (profileError) {
          console.error('❌ [Auth] Erreur lors de la création du profil:', profileError);
        } else {
          console.log('✅ [Auth] Profil fc_profiles créé avec succès');
        }
      } else {
        console.log('✅ [Auth] Profil fc_profiles déjà créé par le trigger SQL');
      }
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsPremium(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        isPremium,
        refreshPremiumStatus,
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
