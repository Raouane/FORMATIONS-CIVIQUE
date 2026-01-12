# 🔍 Débogage : Options manquantes en Arabe

## ⚠️ Problème

Les options de réponse ne s'affichent pas en arabe : "لا توجد خيارات متاحة لهذا السؤال."

## 🔍 Diagnostic

J'ai ajouté des logs de débogage dans :
- `src/lib/localization.ts` : `getLocalizedArray()` 
- `src/components/features/exam/AnswerOptions.tsx`

**Ouvrez la console du navigateur (F12)** et regardez les logs qui commencent par `[LOCALIZATION]` et `[AnswerOptions]`.

## ✅ Solutions possibles

### Solution 1 : Les questions n'ont pas de traductions AR

Si les logs montrent que `availableKeys` ne contient que `['fr']` ou `['fr', 'en']` sans `'ar'`, alors les questions n'ont pas été migrées avec les traductions arabes.

**Action :** Vérifier la structure JSONB dans Supabase :

```sql
-- Vérifier la structure d'une question
SELECT 
  id,
  content,
  options,
  jsonb_typeof(options) as options_type,
  options ? 'ar' as has_ar,
  options ? 'fr' as has_fr,
  options ? 'en' as has_en
FROM fc_questions
LIMIT 5;
```

### Solution 2 : Le fallback ne fonctionne pas

Si les logs montrent que `options` existe mais est vide après extraction, le problème vient de `getLocalizedArray`.

**Vérification :** Les logs devraient montrer :
```
[LOCALIZATION] getLocalizedArray: { locale: 'ar', fallbackLocale: 'fr', availableKeys: ['fr', 'en'], ... }
[LOCALIZATION] getLocalizedArray: Fallback sur fr [...]
```

### Solution 3 : Structure JSONB incorrecte

Si `options` n'est pas au format JSONB attendu, il faut corriger la structure.

**Format attendu :**
```json
{
  "fr": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "en": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "ar": ["الخيار 1", "الخيار 2", "الخيار 3", "الخيار 4"]
}
```

## 🛠️ Correction rapide

### Si les questions n'ont pas de traductions AR

Vous pouvez ajouter un fallback temporaire en modifiant `getLocalizedArray` pour toujours utiliser le français si l'arabe n'existe pas :

```typescript
// Dans src/lib/localization.ts
// Le fallback est déjà implémenté, mais vérifiez les logs
```

### Si vous voulez ajouter les traductions AR aux questions existantes

```sql
-- Exemple : Ajouter une traduction arabe à une question
UPDATE fc_questions
SET 
  content = content || '{"ar": "أي من هذه المعالم موجود في باريس؟"}'::jsonb,
  options = options || '{"ar": ["برج إيفل", "قوس النصر", "متحف اللوفر", "كاتدرائية نوتردام"]}'::jsonb,
  explanation = explanation || '{"ar": "برج إيفل هو أحد أشهر المعالم في باريس..."}'::jsonb
WHERE id = 'votre-question-id';
```

## 📝 Prochaines étapes

1. **Ouvrir la console du navigateur** (F12)
2. **Recharger la page** de simulation en arabe
3. **Regarder les logs** `[LOCALIZATION]` et `[AnswerOptions]`
4. **Partager les logs** pour que je puisse identifier le problème exact

Les logs vous diront exactement ce qui se passe avec les options !
