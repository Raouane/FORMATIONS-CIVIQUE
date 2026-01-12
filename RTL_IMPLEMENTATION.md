# 🌍 Implémentation RTL (Right-to-Left) pour l'Arabe

## ✅ Ce qui a été fait

### 1. Infrastructure RTL
- ✅ **`src/lib/rtl.ts`** : Utilitaires pour gérer la direction (RTL/LTR)
  - `isRTL(locale)` : Détermine si une locale est RTL
  - `getDirection(locale)` : Retourne 'rtl' ou 'ltr'
  - `getHTMLlang(locale)` : Retourne la langue HTML appropriée
  - `getFontFamily(locale)` : Retourne la police appropriée (Cairo pour l'arabe)

### 2. Configuration Document & App
- ✅ **`src/pages/_document.tsx`** :
  - Ajout de l'attribut `dir` dynamique sur `<Html>`
  - Ajout de l'attribut `lang` dynamique
  - Import de la police **Cairo** depuis Google Fonts pour l'arabe

- ✅ **`src/pages/_app.tsx`** :
  - Mise à jour dynamique de `dir` et `lang` sur `<html>` selon la locale
  - Application de la police appropriée selon la locale
  - Mise à jour du manifest PWA selon la locale

### 3. Styles CSS RTL
- ✅ **`src/styles/globals.css`** :
  - Styles RTL avec `[dir="rtl"]`
  - Classe `.rtl-flip` pour inverser les icônes de navigation
  - Taille de police augmentée (18px) pour l'arabe (meilleure lisibilité)
  - Police Cairo appliquée automatiquement en RTL

### 4. Composants adaptés pour RTL

#### Navigation
- ✅ **`MobileNav.tsx`** :
  - `SheetContent` vient de droite en RTL (`side="right"` pour `ar`)
  - Marges des icônes adaptées (`mr-3 rtl:mr-0 rtl:ml-3`)

#### Pages d'examen
- ✅ **`simulation.tsx`** :
  - Flèches de navigation inversées avec `rtl-flip`

- ✅ **`quiz-rapide.tsx`** :
  - Flèches de navigation inversées avec `rtl-flip`
  - Marges adaptées pour RTL

- ✅ **`revision/index.tsx`** :
  - Flèche de retour inversée avec `rtl-flip`
  - Marges adaptées pour RTL

#### Composants UI
- ✅ **`PathSelector.tsx`** :
  - Flèche "Commencer" inversée avec `rtl-flip`
  - Marges adaptées pour RTL

- ✅ **`AnswerOptions.tsx`** :
  - Espacement inversé avec `rtl:space-x-reverse`

### 5. Configuration Tailwind
- ✅ **`tailwind.config.js`** :
  - Ajout de la famille de polices `arabic` (Cairo)

## 🎨 Classes CSS RTL utilisées

### Marges et Paddings
- `mr-3 rtl:mr-0 rtl:ml-3` : Marge droite qui devient marge gauche en RTL
- `ml-2 rtl:ml-0 rtl:mr-2` : Marge gauche qui devient marge droite en RTL
- `rtl:space-x-reverse` : Inverse l'espacement horizontal

### Icônes
- `rtl-flip` : Inverse horizontalement les icônes (flèches, chevrons)

## 📝 Notes importantes

### 1. Chiffres
Les chiffres restent en **chiffres occidentaux** (1, 2, 3) pour la clarté administrative, conformément aux standards web français.

### 2. Composants Shadcn UI
Les composants Shadcn UI (Sheet, Select, RadioGroup, etc.) supportent généralement le RTL automatiquement grâce à Radix UI. Si des ajustements sont nécessaires, ils peuvent être ajoutés via les classes Tailwind RTL.

### 3. Chronomètre
Le chronomètre reste lisible et bien placé en haut de la page grâce aux classes flexbox qui s'adaptent automatiquement au RTL.

### 4. Polices
- **Français/Anglais** : Inter (par défaut)
- **Arabe** : Cairo (Google Fonts) - très lisible et moderne

## 🚀 Test du RTL

### Pour tester :
1. Redémarrer le serveur : `npm run dev`
2. Changer la langue vers "العربية" dans le sélecteur
3. Vérifier que :
   - Le menu mobile vient de droite
   - Les textes sont alignés à droite
   - Les flèches de navigation sont inversées
   - Les marges sont correctes
   - La police Cairo est appliquée

## 🔧 Ajustements futurs (si nécessaire)

### Si des composants ne s'adaptent pas bien :
1. Vérifier les classes `mr-`, `ml-`, `pr-`, `pl-` et les remplacer par des variantes RTL-safe
2. Utiliser `rtl:` prefix de Tailwind pour les styles spécifiques RTL
3. Ajouter `rtl-flip` aux icônes de navigation qui doivent être inversées

### Exemple d'ajustement :
```tsx
// Avant
<div className="ml-4 flex items-center">
  <Icon className="mr-2" />
</div>

// Après (RTL-safe)
<div className="ml-4 rtl:ml-0 rtl:mr-4 flex items-center">
  <Icon className="mr-2 rtl:mr-0 rtl:ml-2" />
</div>
```

## ✅ Checklist de vérification

- [x] Direction HTML (`dir="rtl"`) appliquée dynamiquement
- [x] Langue HTML (`lang="ar"`) appliquée dynamiquement
- [x] Police Cairo chargée pour l'arabe
- [x] Menu mobile adapté (vient de droite)
- [x] Flèches de navigation inversées
- [x] Marges et paddings adaptés
- [x] Espacement des composants adapté
- [x] Taille de police augmentée pour l'arabe
- [x] Manifest PWA mis à jour dynamiquement
- [x] Bouton de fermeture Sheet adapté (gauche en RTL)
- [x] Composants Hero, Footer, HowItWorks adaptés
- [x] Page Results adaptée
- [x] QuestionCard adapté (flex-row-reverse)
- [x] AnswerOptions adapté (space-x-reverse)

## 🎉 Résultat

L'application supporte maintenant le **RTL complet** pour l'arabe, avec :
- ✅ Layout inversé automatiquement
- ✅ Navigation adaptée
- ✅ Typographie optimisée
- ✅ Icônes inversées
- ✅ Expérience utilisateur native pour les arabophones

**Prêt à tester !** 🚀
