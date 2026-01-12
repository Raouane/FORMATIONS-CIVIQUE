# 🚀 Utilisation Rapide : useDBTranslation

## ✅ Code Correct

```typescript
import { useDBTranslation } from '@/hooks/useDBTranslation';

export default function RevisionPage() {
  const { t, ready } = useDBTranslation('revision');
  
  // ⚠️ IMPORTANT : Toujours vérifier ready avant d'utiliser t()
  if (!ready) {
    return <div>Chargement...</div>;
  }
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

## 📋 Étapes pour Utiliser

### 1. Importer le hook
```typescript
import { useDBTranslation } from '@/hooks/useDBTranslation';
```

### 2. Utiliser dans votre composant
```typescript
const { t, ready } = useDBTranslation('revision');
```

### 3. Vérifier que les traductions sont chargées
```typescript
if (!ready) {
  return <div>Chargement...</div>;
}
```

### 4. Utiliser la fonction `t()`
```typescript
<h1>{t('title')}</h1>
```

## 🎯 Exemples Complets

### Exemple 1 : Page Simple
```typescript
import { useDBTranslation } from '@/hooks/useDBTranslation';

export default function HomePage() {
  const { t, ready } = useDBTranslation('home');
  
  if (!ready) return <div>Chargement...</div>;
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <button>{t('buttons.start')}</button>
    </div>
  );
}
```

### Exemple 2 : Avec Interpolation
```typescript
const { t, ready } = useDBTranslation('results');

if (!ready) return <div>Chargement...</div>;

// Si la traduction contient {{percentage}}
<p>{t('verdict.message', { percentage: 85 })}</p>
// Affiche: "Félicitations ! Vous avez obtenu 85%"
```

### Exemple 3 : Clés Imbriquées
```typescript
const { t, ready } = useDBTranslation('revision');

if (!ready) return <div>Chargement...</div>;

<h2>{t('themes.valeurs.name')}</h2>
<p>{t('themes.valeurs.description')}</p>
```

## ⚠️ Erreurs Courantes

### ❌ Erreur 1 : Oublier de vérifier `ready`
```typescript
// ❌ MAUVAIS
const { t } = useDBTranslation('revision');
return <h1>{t('title')}</h1>; // Peut retourner la clé si pas chargé
```

```typescript
// ✅ BON
const { t, ready } = useDBTranslation('revision');
if (!ready) return <div>Chargement...</div>;
return <h1>{t('title')}</h1>;
```

### ❌ Erreur 2 : Utiliser avant la migration
```typescript
// ❌ La table n'existe pas encore
const { t, ready } = useDBTranslation('revision');
// ready sera true mais t() retournera les clés
```

**Solution** : Exécuter d'abord la migration SQL et migrer les traductions.

## 🔄 Migration depuis next-i18next

### Avant
```typescript
import { useTranslation } from 'next-i18next';

const { t } = useTranslation('revision');
return <h1>{t('title')}</h1>;
```

### Après
```typescript
import { useDBTranslation } from '@/hooks/useDBTranslation';

const { t, ready } = useDBTranslation('revision');
if (!ready) return <div>Chargement...</div>;
return <h1>{t('title')}</h1>;
```

## 📝 Checklist

- [ ] Table `fc_translations` créée dans Supabase
- [ ] Traductions migrées : `npm run migrate:translations`
- [ ] Hook importé : `import { useDBTranslation } from '@/hooks/useDBTranslation'`
- [ ] `ready` vérifié avant utilisation
- [ ] Testé dans un composant

## 🎯 Prêt à Utiliser !

Votre code est maintenant correct :
```typescript
const { t, ready } = useDBTranslation('revision');
```

N'oubliez pas de vérifier `ready` avant d'utiliser `t()` ! 🚀
