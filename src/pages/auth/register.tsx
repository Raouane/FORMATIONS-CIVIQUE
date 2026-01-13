import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/features/home/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation('auth');
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailSent(false);

    if (password.length < 6) {
      setError(t('errors.weakPassword'));
      return;
    }

    setLoading(true);

    try {
      const { error, data } = await signUp(email, password, fullName);
      
      if (error) {
        setError(error.message || t('errors.emailExists'));
        setLoading(false);
        return;
      }

      // Vérifier si l'utilisateur est vérifié (email confirmé)
      const user = data?.user;
      const session = data?.session;
      
      // email_confirmed_at est null ou undefined si l'email n'est pas confirmé
      // Il faut vérifier qu'il existe ET qu'il n'est pas null/undefined
      const isEmailConfirmed = !!user?.email_confirmed_at;
      
      console.log('📧 [Register] Statut vérification email:', {
        userId: user?.id,
        email: user?.email,
        emailConfirmed: isEmailConfirmed,
        emailConfirmedAt: user?.email_confirmed_at,
        hasSession: !!session,
        sessionUserId: session?.user?.id
      });

      // Si une session est présente dans la réponse, l'utiliser directement
      if (session?.user) {
        console.log('✅ [Register] Session présente dans la réponse, redirection immédiate...');
        // Attendre un peu pour que le profil soit chargé
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Récupérer le redirect depuis la query string avec valeur par défaut
        const redirect = (router.query.redirect as string) || '/profile';
        console.log('🔄 [Register] Redirection vers:', redirect);
        router.push(redirect);
        setLoading(false);
        return;
      }

      if (!isEmailConfirmed) {
        // L'utilisateur doit confirmer son email
        console.log('📧 [Register] Email non confirmé, affichage du message de confirmation');
        setEmailSent(true);
        setLoading(false);
        return;
      }

      // Si l'email est confirmé mais pas de session dans la réponse, attendre que la session soit créée
      console.log('✅ [Register] Email confirmé, attente de la session...');
      
      // Attendre que la session soit créée (jusqu'à 5 secondes)
      let sessionCreated = false;
      let attempts = 0;
      const maxAttempts = 10; // 5 secondes max
      
      while (!sessionCreated && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
        
        // Vérifier si une session existe maintenant
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.user) {
          console.log('✅ [Register] Session créée après', attempts, 'tentatives');
          sessionCreated = true;
          break;
        }
        
        console.log(`⏳ [Register] Tentative ${attempts}/${maxAttempts} - Session pas encore créée...`);
      }
      
      if (!sessionCreated) {
        // Si la session n'est pas créée après 5 secondes, c'est probablement que l'email n'est pas confirmé
        // ou que la confirmation d'email est activée dans Supabase
        console.warn('⚠️ [Register] Session non créée après attente, redirection quand même...');
        
        // Rediriger quand même vers pricing si c'était la destination
        const redirect = (router.query.redirect as string) || '/profile';
        console.log('🔄 [Register] Redirection vers:', redirect);
        router.push(redirect);
        setLoading(false);
        return;
      }
      
      // Attendre encore un peu pour que le profil soit chargé
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Récupérer le redirect depuis la query string avec valeur par défaut
      const redirect = (router.query.redirect as string) || '/profile';
      console.log('🔄 [Register] Redirection vers:', redirect);
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || t('errors.emailExists'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {t('register.title')}
            </CardTitle>
            <CardDescription className="text-center">
              Créez votre compte pour commencer
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <div className="space-y-4">
                <Alert className="border-green-500 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Email de confirmation envoyé !</strong>
                    <p className="mt-2 text-sm">
                      Nous avons envoyé un email de confirmation à <strong>{email}</strong>.
                      Veuillez cliquer sur le lien dans l'email pour vérifier votre compte et continuer vers le paiement.
                    </p>
                    <p className="mt-3 text-xs text-green-700">
                      💡 <strong>Astuce :</strong> Vérifiez aussi vos spams si vous ne voyez pas l'email.
                    </p>
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                    setPassword('');
                    setFullName('');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Créer un autre compte
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Déjà un compte ? Se connecter
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

              <div className="space-y-2">
                <Label htmlFor="fullName">{t('register.fullName')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Jean Dupont"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('register.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('register.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum 6 caractères
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                <UserPlus className="h-4 w-4 mr-2" />
                {loading ? 'Inscription...' : t('register.submit')}
              </Button>

                <div className="text-center text-sm text-muted-foreground">
                  {t('register.hasAccount')}{' '}
                  <Link href="/auth/login" className="text-primary hover:underline">
                    {t('register.login')}
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'fr', ['common', 'auth'])),
    },
  };
};
