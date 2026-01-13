import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Header } from '@/components/features/home/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PremiumBadge } from '@/components/features/premium/PremiumBadge';
import { ArrowLeft, User, Mail, Target, Trophy, BarChart3, Calendar } from 'lucide-react';
import { userService } from '@/services/userService';
import { useState } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { user, isPremium, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<{
    totalExams: number;
    passedExams: number;
    averageScore: number;
    bestScore: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Charger les statistiques
      userService.getUserStats()
        .then(setStats)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null; // Redirection en cours
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à l'accueil
        </Button>

        <div className="space-y-6">
          {/* Carte Profil */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Mon Profil
                </CardTitle>
                {isPremium && <PremiumBadge size="md" />}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <div className="flex items-center gap-2">
                    {isPremium ? (
                      <Badge className="bg-primary text-primary-foreground">
                        Membre Premium
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Membre Gratuit
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  Mes Statistiques
                </CardTitle>
                <CardDescription>
                  Vos performances sur les simulations d'examen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-primary">{stats.totalExams}</div>
                    <div className="text-sm text-muted-foreground mt-1">Simulations</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{stats.passedExams}</div>
                    <div className="text-sm text-muted-foreground mt-1">Réussies</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{stats.averageScore}%</div>
                    <div className="text-sm text-muted-foreground mt-1">Moyenne</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-amber-600">{stats.bestScore}%</div>
                    <div className="text-sm text-muted-foreground mt-1">Meilleur score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Trophy className="h-6 w-6" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => router.push('/simulation')}
                className="w-full"
                size="lg"
              >
                Commencer une simulation
              </Button>
              {!isPremium && (
                <Button
                  onClick={() => router.push('/pricing')}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Passer Premium
                </Button>
              )}
              <Button
                onClick={() => router.push('/results')}
                variant="ghost"
                className="w-full"
              >
                Voir mes résultats
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'fr', ['common'])),
    },
  };
};
