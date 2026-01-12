# 🔍 Diagnostic de Performance - Latence des Boutons

## ✅ Logs de Performance Ajoutés

J'ai ajouté des logs de performance détaillés dans plusieurs composants pour identifier la source de la latence :

### 1. **Composant Button** (`src/components/ui/button.tsx`)
- ✅ Mesure le temps entre le clic et l'exécution du handler
- ✅ Affiche un avertissement si la latence dépasse 50ms
- ✅ Log le texte du bouton cliqué

### 2. **Hook useNavigation** (`src/hooks/useNavigation.ts`)
- ✅ Mesure le temps total de `startPath`
- ✅ Mesure séparément :
  - `examService.startExamSession`
  - `router.push`

### 3. **Service ExamService** (`src/services/examService.ts`)
- ✅ Mesure le temps de `startExamSession`
- ✅ Mesure séparément :
  - `supabase.auth.getUser`
  - Récupération du profil utilisateur
  - `questionService.getQuestionsForExam`

### 4. **Service QuestionService** (`src/services/questionService.ts`)
- ✅ Mesure le temps de `getQuestionsForExam`
- ✅ Mesure séparément :
  - Requête CONNAISSANCE (Supabase)
  - Requête SITUATION (Supabase)
  - Extraction des traductions
  - Mélange des questions

### 5. **Composant AnswerOptions** (`src/components/features/exam/AnswerOptions.tsx`)
- ✅ Mesure le temps de sélection d'une option
- ✅ Affiche un avertissement si > 10ms

## 🔍 Comment Utiliser

1. **Ouvrez la console du navigateur** (F12)
2. **Cliquez sur n'importe quel bouton**
3. **Observez les logs** qui commencent par :
   - `[BUTTON]` - Performance du bouton
   - `[USE_NAVIGATION]` - Navigation
   - `[EXAM_SERVICE]` - Service d'examen
   - `[QUESTION_SERVICE]` - Service de questions
   - `[PERF]` - Performance générale

## 📊 Interprétation des Logs

### Latence Normale
- **< 50ms** : ✅ Normal
- **50-100ms** : ⚠️ Acceptable mais à surveiller
- **> 100ms** : ❌ Problématique

### Sources Probables de Latence

1. **Requêtes Supabase** (le plus probable)
   - Si `[QUESTION_SERVICE] Requête CONNAISSANCE` > 200ms
   - Si `[QUESTION_SERVICE] Requête SITUATION` > 200ms
   - **Solution** : Vérifier la connexion réseau, indexer la base de données

2. **Extraction des traductions**
   - Si `[QUESTION_SERVICE] Extraction` > 50ms
   - **Solution** : Optimiser `extractLocalizedQuestion`

3. **Navigation Next.js**
   - Si `[USE_NAVIGATION] router.push` > 100ms
   - **Solution** : Utiliser `router.prefetch` pour précharger

4. **Authentification Supabase**
   - Si `[EXAM_SERVICE] supabase.auth.getUser` > 200ms
   - **Solution** : Mettre en cache le statut utilisateur

## 🚀 Prochaines Étapes

1. **Tester l'application** et observer les logs
2. **Identifier l'opération la plus lente** (généralement les requêtes Supabase)
3. **Optimiser** selon les résultats :
   - Ajouter des index en base de données
   - Mettre en cache les questions
   - Précharger les routes
   - Optimiser les requêtes Supabase

## 📝 Exemple de Logs Attendus

```
[BUTTON] Clic détecté sur: "Commencer l'examen"
[USE_NAVIGATION] startPath appelé pour niveau: A2
[EXAM_SERVICE] startExamSession appelé pour niveau: A2
[EXAM_SERVICE] supabase.auth.getUser: 45.23ms
[EXAM_SERVICE] Récupération profil: 12.45ms
[QUESTION_SERVICE] getQuestionsForExam: level=A2, isPremium=false
[QUESTION_SERVICE] Requête CONNAISSANCE: 234.56ms, 28 questions
[QUESTION_SERVICE] Requête SITUATION: 198.34ms, 12 questions
[QUESTION_SERVICE] Extraction 40 questions: 15.23ms
[QUESTION_SERVICE] Mélange: 2.45ms
[QUESTION_SERVICE] ✅ getQuestionsForExam terminé en 450.58ms (40 questions)
[EXAM_SERVICE] ✅ startExamSession terminé en 468.26ms
[USE_NAVIGATION] router.push: 12.34ms
[USE_NAVIGATION] ✅ startPath terminé en 480.60ms
[BUTTON] ⚠️ Latence élevée: 480.60ms pour "Commencer l'examen"
```

Dans cet exemple, la latence principale vient des **requêtes Supabase** (234ms + 198ms = 432ms).
