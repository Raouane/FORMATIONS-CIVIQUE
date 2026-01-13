'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any; data?: { user: User | null } }>;
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
  const isInitializingRef = useRef(true); // Ref pour éviter les conflits entre initializeSession et onAuthStateChange

  useEffect(() => {
    let mounted = true;

    // Fonction pour initialiser la session
    const initializeSession = async () => {
      try {
        console.log('🔄 [AuthProvider] Initialisation de la session...');
        isInitializingRef.current = true;
        
        // Récupérer la session depuis le storage
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ [AuthProvider] Erreur lors de la récupération de la session:', error);
          if (mounted) {
            setLoading(false);
            isInitializingRef.current = false;
          }
          return;
        }

        console.log('📦 [AuthProvider] Session récupérée:', session ? 'Oui' : 'Non');
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('👤 [AuthProvider] Utilisateur trouvé:', session.user.id);
            // ATTENDRE que le profil soit chargé avant de mettre loading à false
            await fetchUserProfile(session.user.id);
            console.log('✅ [AuthProvider] initializeSession - Profil chargé');
          } else {
            console.log('👤 [AuthProvider] Aucun utilisateur connecté');
            setIsPremium(false);
          }
          
          if (mounted) {
            setLoading(false);
            isInitializingRef.current = false;
            console.log('🏁 [AuthProvider] initializeSession - loading mis à false');
          }
        }
      } catch (error) {
        console.error('❌ [AuthProvider] Erreur lors de l\'initialisation:', error);
        if (mounted) {
          setLoading(false);
          isInitializingRef.current = false;
        }
      }
    };

    // Initialiser la session
    initializeSession();

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 [AuthProvider] Changement d\'état auth:', event, session ? 'Session présente' : 'Session absente', 'isInitializing:', isInitializingRef.current);
      
      // Si on est encore en train d'initialiser, ne pas interférer
      if (isInitializingRef.current && event === 'SIGNED_IN') {
        console.log('⏸️ [AuthProvider] onAuthStateChange ignoré car initializeSession est en cours');
        return;
      }
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 [AuthProvider] onAuthStateChange - Chargement du profil pour:', session.user.id);
          // ATTENDRE que le profil soit chargé avant de mettre loading à false
          await fetchUserProfile(session.user.id);
          console.log('✅ [AuthProvider] onAuthStateChange - Profil chargé, isPremium devrait être à jour');
        } else {
          console.log('👤 [AuthProvider] onAuthStateChange - Aucun utilisateur, isPremium = false');
          setIsPremium(false);
        }
        
        if (mounted) {
          setLoading(false);
          console.log('🏁 [AuthProvider] onAuthStateChange - loading mis à false');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('🔍 [AuthProvider] fetchUserProfile DÉBUT pour userId:', userId);
      const { data, error } = await supabase
        .from('fc_profiles')
        .select('is_premium') // Colonne SQL avec underscore
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ [AuthProvider] Erreur lors de la récupération du profil:', error);
        console.error('❌ [AuthProvider] Détails erreur:', error.message, error.code);
        setIsPremium(false);
        return; // Ne pas throw, juste retourner
      }
      
      console.log('📊 [AuthProvider] Données récupérées complètes:', JSON.stringify(data, null, 2));
      console.log('📊 [AuthProvider] Type de data:', typeof data);
      console.log('📊 [AuthProvider] data?.is_premium (avec underscore):', data?.is_premium);
      console.log('📊 [AuthProvider] Type de is_premium:', typeof data?.is_premium);
      
      // Transformation CRITIQUE : is_premium (SQL) → isPremium (React)
      // Vérifier explicitement que la colonne existe avec l'underscore
      const premiumStatus = data?.is_premium === true || data?.is_premium === 'true';
      console.log('✅ [AuthProvider] Transformation: is_premium (DB) =', data?.is_premium, '→ isPremium (React) =', premiumStatus);
      
      // Mettre à jour l'état
      console.log('🔄 [AuthProvider] setIsPremium appelé avec:', premiumStatus);
      setIsPremium(premiumStatus);
      console.log('✅ [AuthProvider] fetchUserProfile FIN - isPremium mis à jour à:', premiumStatus);
    } catch (error) {
      console.error('❌ [AuthProvider] Error fetching user profile:', error);
      console.error('❌ [AuthProvider] Stack:', error instanceof Error ? error.stack : 'N/A');
      setIsPremium(false);
      console.log('⚠️ [AuthProvider] fetchUserProfile FIN avec erreur - isPremium = false');
    }
  };

  // Fonction publique pour rafraîchir le statut premium
  const refreshPremiumStatus = async () => {
    if (user) {
      console.log('🔄 [AuthProvider] Rafraîchissement du statut premium pour:', user.id);
      await fetchUserProfile(user.id);
    } else {
      console.warn('⚠️ [AuthProvider] Pas d\'utilisateur connecté, impossible de rafraîchir le statut premium');
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Mettre à jour le profil immédiatement après la connexion
    // (onAuthStateChange devrait aussi le faire, mais on veut être sûr)
    if (!error && data?.user) {
      await fetchUserProfile(data.user.id);
    }
    
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
        return { error: null, data: { user: signInData.user } };
      }
    }

    // Si l'inscription a réussi, le profil sera créé par le trigger SQL
    // On ne tente pas de créer le profil manuellement car :
    // 1. Si l'email n'est pas confirmé, l'utilisateur n'a pas de session → erreur 401 (RLS)
    // 2. Le trigger SQL le fera automatiquement quand l'utilisateur confirmera son email
    // 3. Si l'email est confirmé, onAuthStateChange créera le profil
    if (!error && data.user) {
      console.log('✅ [Auth] Inscription réussie, userId:', data.user.id);
      console.log('📧 [Auth] Email confirmé:', data.user.email_confirmed_at ? 'Oui' : 'Non');
      
      // Si l'email est confirmé, onAuthStateChange devrait se déclencher et créer le profil
      // Si l'email n'est pas confirmé, l'utilisateur devra confirmer avant d'avoir une session
      if (data.user.email_confirmed_at) {
        console.log('✅ [Auth] Email confirmé, le profil sera créé par onAuthStateChange');
      } else {
        console.log('📧 [Auth] Email non confirmé, le profil sera créé après confirmation');
      }
    }

    return { error, data: data ? { user: data.user } : undefined };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsPremium(false);
  };

  // Mémoriser l'objet value pour garantir que React détecte bien les changements
  // On ne met dans les dépendances que les valeurs qui changent vraiment
  // Les fonctions sont stables et n'ont pas besoin d'être dans les dépendances
  const contextValue = useMemo(
    () => ({
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      isPremium,
      refreshPremiumStatus,
    }),
    // Seules les valeurs primitives/objets qui changent vraiment
    [user, session, loading, isPremium]
  );

  // Debug: Log quand isPremium change
  useEffect(() => {
    if (user) {
      console.log('🔄 [AuthProvider] isPremium a changé:', isPremium, 'pour user:', user.id);
    }
  }, [isPremium, user]);

  return (
    <AuthContext.Provider value={contextValue}>
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
