import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

class EmailService {
  async sendWelcomeEmail(email: string, fullName: string): Promise<void> {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping welcome email');
      return;
    }

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@formations-civiques.fr',
        to: email,
        subject: 'Bienvenue sur Formations Civiques 2026',
        html: `
          <h1>Bienvenue ${fullName} !</h1>
          <p>Merci de vous être inscrit sur Formations Civiques 2026.</p>
          <p>Vous pouvez maintenant commencer votre parcours de préparation à l'examen de formation civique.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}">Commencer maintenant</a>
        `,
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  async sendExamReportEmail(
    email: string,
    fullName: string,
    score: number,
    percentage: number,
    passed: boolean,
    level: string
  ): Promise<void> {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping exam report email');
      return;
    }

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@formations-civiques.fr',
        to: email,
        subject: `Résultat de votre examen - ${passed ? 'Réussi' : 'À améliorer'}`,
        html: `
          <h1>Résultat de votre examen</h1>
          <p>Bonjour ${fullName},</p>
          <p>Vous avez obtenu un score de <strong>${score}/40 (${percentage}%)</strong> pour votre examen de niveau ${level}.</p>
          <p>Statut : <strong>${passed ? 'Réussi ✓' : 'À améliorer'}</strong></p>
          <p>${passed ? 'Félicitations ! Vous avez réussi l\'examen.' : 'Continuez vos révisions pour améliorer votre score.'}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/results">Voir le détail des résultats</a>
        `,
      });
    } catch (error) {
      console.error('Error sending exam report email:', error);
    }
  }
}

export const emailService = new EmailService();
