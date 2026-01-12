# 🔧 Correction : Synthèse Vocale pour l'Arabe

## ❌ Problème Identifié

La synthèse vocale fonctionne en français et en anglais, mais pas correctement en arabe.

**Cause** : Le navigateur n'a pas de voix arabe installée par défaut.

Les logs montrent :
```
Language ar-SA may not be fully supported. Available voices: fr-FR, en-US, de-DE, en-GB, es-ES, es-US, hi-IN, id-ID, it-IT, ja-JP, ko-KR, nl-NL, pl-PL, pt-BR, ru-RU, zh-CN, zh-HK, zh-TW
No voice found for language ar-SA, using default voice
```

## ✅ Solutions Appliquées

### 1. Détection du Support de Langue
- Ajout d'une fonction `checkLanguageSupport()` pour vérifier si une voix est disponible
- Le hook retourne maintenant `isLanguageSupported` pour indiquer si la langue est supportée

### 2. Amélioration de la Gestion des Voix
- Le système détecte automatiquement si une voix arabe est disponible
- Si non disponible, un avertissement est affiché dans la console
- Le texte est quand même lu avec la voix par défaut (mais la prononciation peut être incorrecte)

### 3. Interface Utilisateur
- Le bouton de synthèse vocale affiche une opacité réduite si la langue n'est pas supportée
- Un tooltip informe l'utilisateur que la voix spécifique n'est pas disponible

## 🔍 Comment Vérifier les Voix Disponibles

Dans la console du navigateur, vous pouvez voir :
- Les voix disponibles
- Un avertissement si la langue n'est pas supportée
- Le nom de la voix utilisée (si trouvée)

## 💡 Solutions pour l'Utilisateur

### Option 1 : Installer une Voix Arabe (Recommandé)

**Chrome/Edge (Windows)** :
1. Ouvrir les Paramètres Windows
2. Aller dans "Heure et langue" → "Parole"
3. Ajouter une langue arabe
4. Télécharger les voix de synthèse vocale

**Firefox** :
- Utilise les voix du système d'exploitation
- Installer une voix arabe dans les paramètres Windows/Mac

**Safari (Mac)** :
1. Préférences Système → Accessibilité → Parole
2. Ajouter une voix arabe

### Option 2 : Utiliser un Navigateur avec Support Arabe

Certains navigateurs ont un meilleur support des langues :
- **Chrome** : Bon support après installation des voix
- **Edge** : Utilise les voix Windows
- **Firefox** : Utilise les voix du système

### Option 3 : Accepter la Limitation

Le texte sera lu avec la voix par défaut, mais la prononciation de l'arabe ne sera pas correcte.

## 📝 Code Modifié

### `src/hooks/useTextToSpeech.ts`
- Ajout de `isLanguageSupported` dans le retour du hook
- Fonction `checkLanguageSupport()` pour vérifier la disponibilité
- Détection automatique au chargement des voix

### `src/components/features/exam/QuestionCard.tsx`
- Utilisation de `isLanguageSupported` pour afficher un état visuel
- Tooltip informatif si la langue n'est pas supportée
- La lecture fonctionne quand même (avec voix par défaut)

### `public/locales/*/exam.json`
- Ajout de la clé de traduction `speech.notSupported` dans les trois langues (fr, ar, en)
- Messages traduits pour informer l'utilisateur lorsque la voix spécifique n'est pas disponible

## ✅ Résultat

1. ✅ **Français** : Fonctionne (voix `fr-FR` disponible)
2. ✅ **Anglais** : Fonctionne (voix `en-US` disponible)
3. ⚠️ **Arabe** : Fonctionne partiellement (pas de voix `ar-SA`, utilise la voix par défaut)

## 🚀 Prochaines Étapes Possibles

1. **Détection automatique** : Le système détecte maintenant si une voix est disponible
2. **Message utilisateur** : Avertissement clair dans l'interface
3. **Fallback intelligent** : Le système essaie quand même de lire le texte

## 📌 Note Importante

La synthèse vocale dépend des voix installées sur le système de l'utilisateur. Si aucune voix arabe n'est installée, la prononciation sera incorrecte. C'est une limitation du navigateur, pas du code.
