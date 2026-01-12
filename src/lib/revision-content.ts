import { QuestionTheme, UserLevel } from '@/types/database';

export interface RevisionChapter {
  id: string;
  title: string;
  theme: QuestionTheme;
  level: UserLevel;
  content: string; // Markdown ou HTML
  order: number;
}

// Contenu de révision structuré par thème et niveau
// Note: Ce contenu sera migré vers des fichiers de traduction i18n
export const REVISION_CONTENT: RevisionChapter[] = [
  // PRINCIPES ET VALEURS
  {
    id: 'devise',
    title: 'La Devise de la République',
    theme: QuestionTheme.VALEURS,
    level: UserLevel.A2,
    content: `# La Devise de la République

La devise de la République française est **"Liberté, Égalité, Fraternité"**.

## Liberté
La liberté est le droit de faire tout ce qui ne nuit pas à autrui. Elle comprend :
- La liberté d'expression
- La liberté de religion
- La liberté de réunion
- La liberté de circulation

## Égalité
L'égalité signifie que tous les citoyens sont égaux devant la loi, sans distinction d'origine, de race ou de religion.

## Fraternité
La fraternité exprime la solidarité entre les citoyens et l'engagement envers le bien commun.`,
    order: 1,
  },
  {
    id: 'laicite',
    title: 'La Laïcité',
    theme: QuestionTheme.VALEURS,
    level: UserLevel.A2,
    content: `# La Laïcité

La laïcité est un principe fondamental de la République française, établi par la loi de 1905.

## Définition
La laïcité garantit la liberté de conscience et assure la séparation des Églises et de l'État.

## Principes
- Neutralité de l'État en matière religieuse
- Liberté de croire ou de ne pas croire
- Égalité de traitement de toutes les religions
- Respect de toutes les croyances`,
    order: 2,
  },
  // DROITS ET DEVOIRS
  {
    id: 'droits-citoyen',
    title: 'Les Droits du Citoyen',
    theme: QuestionTheme.DROITS,
    level: UserLevel.A2,
    content: `# Les Droits du Citoyen

Les citoyens français disposent de droits fondamentaux garantis par la Constitution et la Déclaration des Droits de l'Homme et du Citoyen de 1789.

## Droits civils
- Droit de vote
- Liberté d'expression
- Droit à la propriété
- Droit à la sûreté

## Droits sociaux
- Droit à l'éducation
- Droit à la santé
- Droit au travail
- Droit à la protection sociale`,
    order: 1,
  },
  // HISTOIRE
  {
    id: 'revolution-1789',
    title: 'La Révolution française de 1789',
    theme: QuestionTheme.HISTOIRE,
    level: UserLevel.B1,
    content: `# La Révolution française de 1789

La Révolution française est un événement majeur de l'histoire de France qui a mis fin à l'Ancien Régime.

## Dates clés
- **14 juillet 1789** : Prise de la Bastille
- **26 août 1789** : Déclaration des Droits de l'Homme et du Citoyen
- **1792** : Proclamation de la République

## Conséquences
- Abolition de la monarchie absolue
- Établissement de la République
- Déclaration des droits fondamentaux`,
    order: 1,
  },
  // POLITIQUE ET INSTITUTIONS
  {
    id: 'president',
    title: 'Le Président de la République',
    theme: QuestionTheme.POLITIQUE,
    level: UserLevel.B1,
    content: `# Le Président de la République

Le Président de la République est le chef de l'État français.

## Élection
- Élu au suffrage universel direct
- Mandat de 5 ans (quinquennat)
- Maximum 2 mandats consécutifs

## Rôles
- Garant de la Constitution
- Chef des armées
- Nomme le Premier ministre
- Peut dissoudre l'Assemblée nationale`,
    order: 1,
  },
  // SOCIÉTÉ FRANÇAISE
  {
    id: 'education',
    title: 'Le Système Éducatif',
    theme: QuestionTheme.SOCIETE,
    level: UserLevel.A2,
    content: `# Le Système Éducatif Français

L'éducation est gratuite, laïque et obligatoire de 3 à 16 ans.

## Structure
- **École maternelle** : 3-6 ans
- **École élémentaire** : 6-11 ans
- **Collège** : 11-15 ans
- **Lycée** : 15-18 ans
- **Enseignement supérieur** : Universités, grandes écoles`,
    order: 1,
  },
];
