'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any; data?: { user: User | null; session: Session | null } }>;
  signOut: () => Promise<void>;
  isPremium: boolean;
  refreshPremiumStatus: () => Promise<void>;
  refreshAuth: () => Promise<void>;
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

  // Fonction publique pour rafraîchir l'état d'authentification complet
  const refreshAuth = async () => {
    console.log('🔄 [AuthProvider] Rafraîchissement de l\'état auth...');
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ [AuthProvider] Erreur lors du rafraîchissement:', error);
        setSession(null);
        setUser(null);
        setIsPremium(false);
        return;
      }

      if (session?.user) {
        console.log('✅ [AuthProvider] Session trouvée lors du rafraîchissement:', session.user.id);
        setSession(session);
        setUser(session.user);
        await fetchUserProfile(session.user.id);
      } else {
        console.log('👤 [AuthProvider] Aucune session trouvée lors du rafraîchissement');
        setSession(null);
        setUser(null);
        setIsPremium(false);
      }
    } catch (error) {
      console.error('❌ [AuthProvider] Exception lors du rafraîchissement:', error);
      setSession(null);
      setUser(null);
      setIsPremium(false);
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
      if (signInData.user && signInData.session) {
        // Forcer la session immédiatement
        console.log('✅ [Auth] Connexion réussie, définition de la session...');
        await supabase.auth.setSession({
          access_token: signInData.session.access_token,
          refresh_token: signInData.session.refresh_token,
        });

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

        // Mettre à jour l'état local
        setSession(signInData.session);
        setUser(signInData.user);
        await fetchUserProfile(signInData.user.id);

        // Retourner un succès car l'utilisateur est maintenant connecté
        return { error: null, data: { user: signInData.user, session: signInData.session } };
      }
    }

    // Si l'inscription a réussi et qu'une session est présente, la forcer immédiatement
    if (!error && data.user && data.session) {
      console.log('✅ [Auth] Inscription réussie avec session, userId:', data.user.id);
      console.log('📧 [Auth] Email confirmé:', data.user.email_confirmed_at ? 'Oui' : 'Non');
      console.log('🔑 [Auth] Session présente dans la réponse, définition immédiate...');
      
      // Forcer la session immédiatement
      const { error: setSessionError } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });

      if (setSessionError) {
        console.error('❌ [Auth] Erreur lors de la définition de la session:', setSessionError);
      } else {
        console.log('✅ [Auth] Session définie avec succès');
        // Mettre à jour l'état local
        setSession(data.session);
        setUser(data.user);
        await fetchUserProfile(data.user.id);
      }
    } else if (!error && data.user) {
      console.log('✅ [Auth] Inscription réussie, userId:', data.user.id);
      console.log('📧 [Auth] Email confirmé:', data.user.email_confirmed_at ? 'Oui' : 'Non');
      
      // Si l'email est confirmé mais pas de session, attendre un peu et réessayer
      if (data.user.email_confirmed_at) {
        console.log('⏳ [Auth] Email confirmé mais pas de session, attente...');
        // Attendre un peu pour que Supabase crée la session
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Essayer de récupérer la session
        const { data: { session: newSession } } = await supabase.auth.getSession();
        if (newSession) {
          console.log('✅ [Auth] Session récupérée après attente');
          setSession(newSession);
          setUser(newSession.user);
          await fetchUserProfile(newSession.user.id);
          return { error: null, data: { user: data.user, session: newSession } };
        } else {
          console.log('⚠️ [Auth] Pas de session après attente, le profil sera créé par onAuthStateChange');
        }
      } else {
        console.log('📧 [Auth] Email non confirmé, le profil sera créé après confirmation');
      }
    }

    return { error, data: data ? { user: data.user, session: data.session || null } : undefined };
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
      refreshAuth,
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
