# ✅ Checklist de Tests Avant Push en Production

## 🎯 Tests Critiques (OBLIGATOIRES)

### 1. Authentification
- [ ] **Inscription** : Créer un nouveau compte avec un email valide
  - Vérifier que l'utilisateur est bien connecté après inscription
  - Vérifier que la redirection vers `/pricing` fonctionne
- [ ] **Connexion** : Se connecter avec un compte existant
  - Vérifier que la session persiste après rechargement de page
- [ ] **Déconnexion** : Cliquer sur "Déconnexion"
  - Vérifier que l'utilisateur est bien déconnecté
  - Vérifier que les boutons "Connexion" et "Inscription" réapparaissent

### 2. Paiement Stripe (TEST MODE)
- [ ] **Paiement unique (29€)** :
  - Cliquer sur "Acheter maintenant" pour le plan 29€
  - Utiliser la carte de test : `4242 4242 4242 4242`
  - Date d'expiration : n'importe quelle date future (ex: 12/25)
  - CVC : n'importe quel 3 chiffres (ex: 123)
  - Vérifier que la redirection vers Stripe fonctionne
  - Vérifier que le paiement est accepté
  - Vérifier que la page de félicitations s'affiche (6 secondes minimum)
  - Vérifier que le badge "Premium" apparaît dans le Header après retour
- [ ] **Abonnement mensuel (9€)** :
  - Cliquer sur "S'abonner" pour le plan mensuel
  - Utiliser la même carte de test
  - Vérifier que l'abonnement est créé
  - Vérifier que le statut Premium est activé

### 3. Statut Premium
- [ ] **Utilisateur Premium** :
  - Vérifier que le badge "Premium" apparaît dans le Header
  - Vérifier que le bouton "Commencer un test gratuit" est remplacé par "Lancer un entraînement" dans le Hero
  - Vérifier que le bouton "Passer Premium" disparaît dans le Hero
  - Vérifier que la page `/pricing` affiche "Vous êtes déjà membre Premium"
  - Vérifier que les boutons d'achat sont masqués sur `/pricing`
  - Vérifier que l'utilisateur peut accéder à toutes les simulations (pas de limite à 10 questions)

### 4. Simulations d'Examen
- [ ] **Utilisateur Gratuit** :
  - Lancer une simulation
  - Vérifier que seulement 10 questions sont affichées
  - Vérifier que le timer est de 15 minutes (quiz rapide)
  - Vérifier que le message "Passer Premium pour accéder à 40 questions" apparaît
- [ ] **Utilisateur Premium** :
  - Lancer une simulation
  - Vérifier que 40 questions sont affichées
  - Vérifier que le timer est de 45 minutes
  - Vérifier qu'il n'y a pas de limite

### 5. Feedback Immédiat (Réponses)
- [ ] **Sélection de réponse** :
  - Cliquer sur une réponse correcte → Vérifier que le fond devient vert
  - Cliquer sur une réponse incorrecte → Vérifier que le fond devient rouge
  - Vérifier que les couleurs s'affichent immédiatement (pas après soumission)

### 6. Pages Légales
- [ ] **Mentions Légales** (`/mentions-legales`) :
  - Vérifier que la page s'affiche correctement
  - Vérifier que les informations (nom, adresse, téléphone, email) sont correctes
  - Vérifier que le lien dans le Footer fonctionne
- [ ] **CGV** (`/cgv`) :
  - Vérifier que la page s'affiche correctement
  - Vérifier que les prix (9€ et 29€) sont corrects
  - Vérifier que le lien dans le Footer fonctionne
- [ ] **Politique de Confidentialité** (`/politique-confidentialite`) :
  - Vérifier que la page s'affiche correctement
  - Vérifier que le lien dans le Footer fonctionne

### 7. Navigation
- [ ] **Header Desktop** :
  - Vérifier que le logo "FC" s'affiche (pas "RF")
  - Vérifier que les boutons "Connexion"/"Déconnexion" alternent correctement
  - Vérifier que le badge Premium apparaît pour les utilisateurs premium
- [ ] **Menu Mobile** :
  - Ouvrir le menu mobile
  - Vérifier que le logo "FC" s'affiche (pas "RF")
  - Vérifier que le bouton "Déconnexion" apparaît pour les utilisateurs connectés
  - Vérifier que le bouton "Mon Espace" apparaît pour les utilisateurs premium (au lieu de "Commencer gratuitement")

### 8. Footer
- [ ] **Vérifications** :
  - Vérifier que le copyright affiche "© 2026 RAOUANE MOHAMED - Formations Civiques"
  - Vérifier que la mention "Ce site n'est pas un site officiel du gouvernement français" est présente
  - Vérifier que les logos de paiement (VISA, Mastercard, CB) sont visibles
  - Vérifier que tous les liens légaux fonctionnent

## 🔍 Tests de Performance

### 9. Console du Navigateur
- [ ] **Vérifier qu'il n'y a pas d'erreurs** :
  - Ouvrir la console (F12)
  - Vérifier qu'il n'y a pas d'erreurs rouges
  - Vérifier qu'il n'y a pas d'erreurs "signal is aborted" (elles doivent être silencieuses)
  - Vérifier qu'il n'y a pas d'erreurs "uncontrolled to controlled"

### 10. Responsive Design
- [ ] **Mobile** (< 768px) :
  - Vérifier que le menu mobile fonctionne
  - Vérifier que les cartes de prix s'empilent correctement
  - Vérifier que les textes sont lisibles
- [ ] **Tablette** (768px - 1024px) :
  - Vérifier que la mise en page est correcte
- [ ] **Desktop** (> 1024px) :
  - Vérifier que tous les éléments sont bien alignés

## 🚨 Tests de Sécurité

### 11. Protection Premium
- [ ] **Utilisateur Premium ne peut pas repayer** :
  - Se connecter avec un compte Premium
  - Aller sur `/pricing`
  - Vérifier que les boutons "Acheter" sont masqués
  - Vérifier que le message "Vous êtes déjà membre Premium" s'affiche
  - Essayer de forcer l'appel à `handleCheckout` (si possible) → Vérifier que ça bloque

### 12. Routes Protégées
- [ ] **Accès sans authentification** :
  - Se déconnecter
  - Essayer d'accéder à `/simulation` → Vérifier que ça fonctionne (page publique)
  - Essayer d'accéder à `/profile` → Vérifier la redirection si nécessaire

## 📱 Tests Multi-langues (si applicable)

### 13. Internationalisation
- [ ] **Changement de langue** :
  - Tester le sélecteur de langue dans le Header
  - Vérifier que les textes changent correctement
  - Vérifier que la direction RTL fonctionne pour l'arabe

## ✅ Checklist Finale Avant Push

- [ ] Tous les tests ci-dessus sont passés
- [ ] Aucune erreur dans la console
- [ ] Les variables d'environnement sont configurées sur Render
- [ ] Le webhook Stripe est configuré sur Render (URL de production)
- [ ] Les clés Stripe LIVE sont prêtes (mais pas encore utilisées en test)
- [ ] Le fichier `.env.local` n'est pas commité (vérifier `.gitignore`)
- [ ] Les logs de debug sont supprimés
- [ ] Le code est propre et commenté si nécessaire

## 🎯 Test de Paiement Stripe en Mode TEST

### Carte de Test à Utiliser :
- **Numéro** : `4242 4242 4242 4242`
- **Date d'expiration** : `12/25` (ou toute date future)
- **CVC** : `123` (ou n'importe quel 3 chiffres)
- **Code postal** : `75001` (ou n'importe quel code postal)

### Scénario de Test Complet :
1. Créer un nouveau compte avec un email de test
2. Aller sur `/pricing`
3. Cliquer sur "Acheter maintenant" (29€)
4. Compléter le formulaire Stripe avec la carte de test
5. Vérifier que la page de félicitations s'affiche (6 secondes)
6. Vérifier que le badge Premium apparaît
7. Lancer une simulation et vérifier qu'il y a 40 questions

---

## ⚠️ Points d'Attention

1. **Ne pas utiliser de vraies cartes bancaires** en mode test
2. **Vérifier que les clés Stripe sont en mode TEST** (`sk_test_...`)
3. **Ne pas commit les clés** dans le code
4. **Tester sur plusieurs navigateurs** (Chrome, Firefox, Safari)
5. **Vérifier la compatibilité mobile** sur un vrai appareil si possible

---

**Une fois tous ces tests passés, vous pouvez faire le PUSH en toute confiance ! 🚀**
