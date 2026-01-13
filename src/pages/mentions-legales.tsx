import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { Header } from '@/components/features/home/Header';
import { Footer } from '@/components/features/home/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MentionsLegalesPage() {
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
            <CardTitle className="text-3xl font-bold">Mentions Légales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 prose max-w-none">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Éditeur du site</h2>
              <p>
                Le site <strong>formations-civiques.fr</strong> est édité par :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Nom / Raison sociale :</strong> RAOUANE MOHAMED (Auto-entrepreneur)</li>
                <li><strong>Adresse :</strong> 6 Place de l'Abbaye, 94000 Créteil, France</li>
                <li><strong>Téléphone :</strong> 07 83 69 85 09</li>
                <li><strong>Email :</strong> support@formations-civiques.fr</li>
                <li><strong>SIRET :</strong> [À compléter avec votre numéro SIRET si disponible]</li>
                <li><strong>Directeur de publication :</strong> RAOUANE MOHAMED</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Hébergement</h2>
              <p>
                Le site est hébergé par :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>Supabase Inc.</strong> - Base de données et authentification<br />
                  Adresse : 970 Toa Payoh North, #07-04, Singapore 318992
                </li>
                <li>
                  <strong>Render Inc.</strong> - Hébergement de l'application<br />
                  Adresse : 548 Market St #97404, San Francisco, CA 94104, États-Unis
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Protection des données</h2>
              <p>
                Conformément à la loi « Informatique et Libertés » et au RGPD, vous disposez d'un droit d'accès, 
                de rectification, de suppression et d'opposition aux données personnelles vous concernant.
              </p>
              <p>
                Pour exercer ces droits, vous pouvez nous contacter à : <strong>support@formations-civiques.fr</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Propriété intellectuelle</h2>
              <p>
                L'ensemble du contenu de ce site (textes, images, logos, etc.) est la propriété de 
                RAOUANE MOHAMED et est protégé par les lois françaises et internationales 
                relatives à la propriété intellectuelle.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Cookies</h2>
              <p>
                Ce site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. 
                En continuant à naviguer sur ce site, vous acceptez l'utilisation de cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
              <p>
                Pour toute question concernant ces mentions légales, vous pouvez nous contacter à :
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
