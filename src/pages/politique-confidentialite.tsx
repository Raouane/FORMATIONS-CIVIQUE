import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { Header } from '@/components/features/home/Header';
import { Footer } from '@/components/features/home/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PolitiqueConfidentialitePage() {
  const router = useRouter();

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

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Politique de Confidentialité</CardTitle>
            <p className="text-muted-foreground mt-2">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </CardHeader>
          <CardContent className="space-y-6 prose max-w-none">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Collecte des données</h2>
              <p>
                Dans le cadre de l'utilisation de la plateforme <strong>formations-civiques.fr</strong>, 
                nous collectons les données personnelles suivantes :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Données d'identification :</strong> Nom, prénom, adresse email</li>
                <li><strong>Données de connexion :</strong> Adresse IP, logs de connexion</li>
                <li><strong>Données de progression :</strong> Résultats d'examens, statistiques</li>
                <li><strong>Données de paiement :</strong> Gérées par Stripe (voir section 3)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Finalité de la collecte</h2>
              <p>
                Les données collectées sont utilisées pour :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Gérer votre compte utilisateur et votre accès Premium</li>
                <li>Enregistrer vos résultats et votre progression</li>
                <li>Vous envoyer des emails de confirmation et de réinitialisation de mot de passe</li>
                <li>Améliorer nos services et analyser l'utilisation de la plateforme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Services tiers</h2>
              <p>
                Nous utilisons les services suivants qui peuvent avoir accès à vos données :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>Supabase :</strong> Base de données et authentification. 
                  Vos données sont stockées de manière sécurisée. 
                  <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2">
                    Politique de confidentialité Supabase
                  </a>
                </li>
                <li>
                  <strong>Stripe :</strong> Traitement des paiements. 
                  Stripe collecte et traite vos données bancaires de manière sécurisée. 
                  Nous n'avons pas accès à vos informations bancaires complètes.
                  <a href="https://stripe.com/fr/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2">
                    Politique de confidentialité Stripe
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Conservation des données</h2>
              <p>
                Vos données personnelles sont conservées pendant toute la durée d'utilisation de votre compte, 
                et pendant une période de 3 ans après la fermeture de votre compte, conformément aux obligations légales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Vos droits (RGPD)</h2>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Droit d'accès :</strong> Vous pouvez demander une copie de vos données personnelles</li>
                <li><strong>Droit de rectification :</strong> Vous pouvez corriger vos données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> Vous pouvez demander la suppression de vos données</li>
                <li><strong>Droit à la portabilité :</strong> Vous pouvez récupérer vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> Vous pouvez vous opposer au traitement de vos données</li>
              </ul>
              <p className="mt-4">
                Pour exercer ces droits, contactez-nous à : <strong>support@formations-civiques.fr</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
              <p>
                Ce site utilise des cookies techniques nécessaires au fonctionnement du site (authentification, 
                session utilisateur). Ces cookies ne nécessitent pas votre consentement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Sécurité</h2>
              <p>
                Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour 
                protéger vos données personnelles contre tout accès non autorisé, perte, destruction ou altération.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Contact</h2>
              <p>
                Pour toute question concernant cette politique de confidentialité, vous pouvez nous contacter à :
              </p>
              <p>
                <strong>Email :</strong> support@formations-civiques.fr
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
      <Footer />
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
