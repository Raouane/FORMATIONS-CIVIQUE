import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { Header } from '@/components/features/home/Header';
import { Footer } from '@/components/features/home/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CGVPage() {
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
            <CardTitle className="text-3xl font-bold">Conditions Générales de Vente</CardTitle>
            <p className="text-muted-foreground mt-2">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </CardHeader>
          <CardContent className="space-y-6 prose max-w-none">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Objet</h2>
              <p>
                Les présentes Conditions Générales de Vente (CGV) régissent la vente d'abonnements Premium 
                pour l'accès à la plateforme de formation civique <strong>formations-civiques.fr</strong>.
              </p>
              <p>
                L'acceptation des présentes CGV vaut acceptation sans réserve de toutes leurs dispositions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Produits et prix</h2>
              <p>
                La plateforme propose deux formules d'abonnement Premium :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Accès Mensuel :</strong> 9€ TTC par mois (renouvelable automatiquement)</li>
                <li><strong>Accès Illimité :</strong> 29€ TTC (paiement unique, accès à vie)</li>
              </ul>
              <p className="mt-4">
                <strong>Tous les prix sont indiqués en euros TTC (Toutes Taxes Comprises).</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Modalités de paiement</h2>
              <p>
                Le paiement s'effectue par carte bancaire via la plateforme sécurisée <strong>Stripe</strong>.
              </p>
              <p>
                Les cartes bancaires acceptées sont : Visa, Mastercard, American Express.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Droit de rétractation</h2>
              <p>
                Conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation 
                ne peut être exercé pour les contrats de fourniture de contenu numérique qui ne sont pas 
                fournis sur un support matériel, dont l'exécution a commencé après accord préalable 
                exprès du consommateur et renonciation expresse à son droit de rétractation.
              </p>
              <p className="mt-4">
                <strong>En acceptant ces CGV et en procédant au paiement, vous reconnaissez avoir 
                expressément demandé l'exécution immédiate du service et renoncé à votre droit de 
                rétractation.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Modalités de remboursement</h2>
              <p>
                En raison de l'accès immédiat au contenu numérique après paiement, aucun remboursement 
                ne pourra être effectué sauf en cas d'erreur technique empêchant l'accès au service.
              </p>
              <p className="mt-4">
                En cas de problème technique, contactez-nous à <strong>support@formations-civiques.fr</strong> 
                dans un délai de 48 heures suivant l'achat.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Accès au service</h2>
              <p>
                L'accès au service Premium est immédiat après validation du paiement. Vous recevrez 
                un email de confirmation avec vos identifiants de connexion.
              </p>
              <p>
                L'accès Premium comprend :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Simulations illimitées de 40 questions</li>
                <li>Correction détaillée avec explications</li>
                <li>Statistiques par thème</li>
                <li>Accès à toute la banque de données</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Résiliation</h2>
              <p>
                <strong>Abonnement mensuel :</strong> Vous pouvez résilier votre abonnement à tout moment 
                depuis votre espace membre. La résiliation prend effet à la fin de la période en cours.
              </p>
              <p className="mt-4">
                <strong>Accès Illimité :</strong> Aucune résiliation n'est nécessaire, l'accès est à vie.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Contact</h2>
              <p>
                Pour toute question concernant ces CGV, vous pouvez nous contacter à :
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
