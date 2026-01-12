'use client';

import { useRouter } from 'next/router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle2, Trophy } from 'lucide-react';

interface PremiumGuardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PremiumGuard({ open, onOpenChange }: PremiumGuardProps) {
  const router = useRouter();

  const handleGoToPricing = () => {
    onOpenChange(false);
    router.push('/pricing');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3 animate-in zoom-in-95 duration-300">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Bravo ! 🎉
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Vous avez terminé votre quiz gratuit de 10 questions.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <p className="text-center text-muted-foreground">
            Pour accéder aux <strong>40 questions officielles</strong> et aux{' '}
            <strong>12 mises en situation</strong> de la réforme 2026, passez au mode Premium.
          </p>

          <div className="space-y-2 pt-2">
            {[
              'Simulations illimitées de 40 questions',
              'Correction détaillée avec explications',
              'Statistiques par thème',
              'Quotas officiels 2026 respectés',
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-2 animate-in slide-in-from-left-4 duration-300">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Continuer en gratuit
          </Button>
          <Button
            onClick={handleGoToPricing}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Devenir Premium
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
