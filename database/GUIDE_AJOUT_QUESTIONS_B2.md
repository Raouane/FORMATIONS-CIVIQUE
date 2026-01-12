# 📝 Guide pour Ajouter les Questions B2

## ⚠️ Problème détecté

Le texte que vous avez fourni contient des **erreurs de format JSON** :
- Des champs vides comme `"fr":,` et `"en":,` (syntaxe invalide)
- Certaines options n'ont que la traduction arabe

## ✅ Solution : Corriger le format

### Étape 1 : Corriger la syntaxe JSON

Remplacez tous les champs vides par :
- `"fr": null` si la traduction n'est pas disponible
- `"fr": "texte français"` si vous avez la traduction

**Exemple de correction :**

```json
// ❌ INCORRECT
"options": {
  "fr":,
  "en":,
  "ar": ["Option 1", "Option 2", "Option 3", "Option 4"]
}

// ✅ CORRECT
"options": {
  "fr": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "en": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "ar": ["الخيار 1", "الخيار 2", "الخيار 3", "الخيار 4"]
}
```

### Étape 2 : Vérifier le format complet

Chaque question doit avoir cette structure :

```json
{
  "theme": "VALEURS|DROITS|HISTOIRE|POLITIQUE|SOCIETE",
  "type": "CONNAISSANCE|SITUATION",
  "level": "B2",
  "complexity_level": "B2",
  "content": {
    "fr": "Question en français",
    "en": "Question in English",
    "ar": "السؤال بالعربية"
  },
  "scenario_context": null, // ou {"fr": "...", "en": "...", "ar": "..."} pour SITUATION
  "options": {
    "fr": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "en": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "ar": ["الخيار 1", "الخيار 2", "الخيار 3", "الخيار 4"]
  },
  "correct_answer": 0, // 0-3 (index de la bonne réponse)
  "explanation": {
    "fr": "Explication en français",
    "en": "Explanation in English",
    "ar": "شرح بالعربية"
  },
  "is_premium": false // false pour toutes les SITUATION
}
```

### Étape 3 : Besoins pour B2

Il faut **38 questions B2 supplémentaires** :
- **26 questions CONNAISSANCE** (il en existe déjà 2)
- **12 questions SITUATION** (il n'en existe aucune)

## 🔧 Options pour compléter

### Option A : Compléter manuellement

1. Copiez les questions que vous avez fournies
2. Corrigez les champs vides (`"fr":,` → `"fr": "texte"` ou `"fr": null`)
3. Ajoutez les traductions manquantes
4. Sauvegardez dans un fichier `questions_b2_completes.json`
5. Exécutez le script de fusion

### Option B : Utiliser les traductions arabes comme base

Si vous n'avez que les traductions arabes, je peux :
1. Créer un fichier avec les questions B2
2. Laisser `"fr": null` et `"en": null` temporairement
3. Vous pourrez compléter plus tard

**⚠️ Important :** Les questions avec `"fr": null` ne s'afficheront pas correctement dans l'application.

## 📋 Questions B2 détectées dans votre texte

D'après votre texte, j'ai identifié ces questions B2 :
- POLITIQUE/CONNAISSANCE : Souveraineté, Conseil constitutionnel, Députés, etc.
- HISTOIRE/CONNAISSANCE : Esclavage, Résistance, Panthéon, etc.
- VALEURS/CONNAISSANCE : Indivisibilité, Langue officielle, etc.
- VALEURS/SITUATION : Agent public et bijou religieux, etc.
- DROITS/SITUATION : Discrimination, Protection enfance, etc.
- SOCIETE/CONNAISSANCE : Temps de travail, Naissance, etc.
- SOCIETE/SITUATION : Réseaux sociaux, Médecin, etc.

## 🚀 Prochaines étapes

1. **Corrigez le format JSON** des questions fournies
2. **Complétez les traductions** manquantes (au minimum le français)
3. **Créez un fichier** `questions_b2_completes.json` avec toutes les questions B2
4. **Exécutez** le script de fusion pour les ajouter au fichier principal

Souhaitez-vous que je crée un fichier template avec les questions B2 que vous avez fournies, en laissant les champs vides à compléter ?
