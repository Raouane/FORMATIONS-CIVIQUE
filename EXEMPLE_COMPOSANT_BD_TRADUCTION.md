# Exemple d'utilisation du hook useDBTranslation

Ce fichier montre comment remplacer `useTranslation` de next-i18next par `useDBTranslation` pour charger les traductions depuis la base de données.

## ❌ AVANT (avec next-i18next)

```tsx
import { useTranslation } from 'next-i18next';

export default function RevisionPage() {
  const { t } = useTranslation('revision');
  
  return <h1>{t('title')}</h1>;
}
```

## ✅ APRÈS (avec useDBTranslation)

```tsx
import { useDBTranslation } from '@/hooks/useDBTranslation';
import { useRouter } from 'next/router';

export default function RevisionPage() {
  const router = useRouter();
  const { t, ready } = useDBTranslation('revision');

  // Afficher un loader pendant le chargement
  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des traductions...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
      <p className="text-gray-600 mb-8">{t('description')}</p>
      
      {/* Exemple avec interpolation */}
      <p>{t('welcome', { name: 'Utilisateur' })}</p>
      
      {/* Exemple avec clés imbriquées */}
      <h2>{t('themes.valeurs.name')}</h2>
      <p>{t('themes.valeurs.description')}</p>
    </div>
  );
}
```

## 🔄 MIGRATION PROGRESSIVE (Hybride)

Vous pouvez utiliser les deux systèmes en parallèle pendant la migration :

```tsx
import { useTranslation } from 'next-i18next';
import { useDBTranslation } from '@/hooks/useDBTranslation';

export function HybridRevisionPage() {
  const { t: tFile } = useTranslation('revision'); // Fichiers JSON
  const { t: tDB, ready } = useDBTranslation('revision'); // Base de données

  // Utiliser la BD si prête, sinon fallback sur fichiers
  const t = ready ? tDB : tFile;

  return <h1>{t('title')}</h1>;
}
```

## 📝 NOTES IMPORTANTES

1. **Le hook useDBTranslation charge les traductions de manière asynchrone**
   → Toujours vérifier `ready` avant d'utiliser `t()`

2. **Les traductions sont mises en cache (5 min TTL)**
   → Les appels suivants sont instantanés

3. **Fallback automatique sur 'fr' si la traduction demandée n'existe pas**

4. **Compatible avec next-i18next**
   → Vous pouvez migrer progressivement, composant par composant

5. **Support des interpolations**
   → `t('message', { name: 'John' })` remplace `{{name}}` dans la traduction
