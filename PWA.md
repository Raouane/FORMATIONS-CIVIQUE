# Configuration PWA (Progressive Web App)

## ✅ Fonctionnalités PWA

Cette application est configurée comme une **Progressive Web App (PWA)** avec :

- ✅ **Installation** : Peut être installée sur mobile et desktop
- ✅ **Mode hors ligne** : Cache des ressources pour utilisation sans connexion
- ✅ **Service Worker** : Gestion du cache et des mises à jour
- ✅ **Manifest** : Configuration pour l'installation

## 📱 Installation

### Sur Mobile (Android/iOS)

1. Ouvrir l'application dans Chrome/Safari
2. Un prompt d'installation apparaîtra automatiquement
3. Ou utiliser le menu du navigateur : **"Ajouter à l'écran d'accueil"**

### Sur Desktop

1. Ouvrir l'application dans Chrome/Edge
2. Cliquer sur l'icône d'installation dans la barre d'adresse
3. Ou utiliser le menu : **"Installer l'application"**

## 🔧 Configuration Technique

### Service Worker (next-pwa)

Le service worker est configuré avec **next-pwa** :

- **Cache First** : Fichiers statiques (fonts, images, locales)
- **Network First** : Pages et API (données dynamiques)
- **Stale While Revalidate** : Assets CSS/JS pour performance

### Stratégies de Cache

1. **Fichiers de cours** : Cache First (révision hors ligne)
2. **Images** : Stale While Revalidate (30 jours)
3. **Pages** : Network First (24 heures)
4. **API** : Network First (24 heures, timeout 10s)
5. **Traductions i18n** : Cache First (365 jours)

## 📝 Fichiers PWA

- `public/manifest.json` : Manifest PWA
- `public/sw.js` : Service Worker (généré automatiquement par next-pwa)
- `src/components/InstallPrompt.tsx` : Prompt d'installation
- `src/pages/_document.tsx` : Meta tags PWA
- `next.config.js` : Configuration PWA avec next-pwa

## 🎨 Icônes PWA

Créez les icônes suivantes dans `public/` :

- `icon-192.png` : 192x192px (requis)
- `icon-512.png` : 512x512px (requis)

### Générer les icônes

Vous pouvez utiliser un outil en ligne comme [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator) ou créer manuellement les icônes.

## 🧪 Tester la PWA

### En développement

```bash
npm run build
npm run start
```

Le service worker est **désactivé en mode développement** pour faciliter le debug.

### Vérifier l'installation

1. Ouvrir Chrome DevTools → **Application**
2. Vérifier **Service Workers** : Le worker doit être actif
3. Vérifier **Manifest** : Le manifest doit être valide
4. Vérifier **Cache Storage** : Les caches doivent être créés

## 🔄 Mise à jour

Le service worker se met à jour automatiquement :

1. Lors d'un nouveau déploiement
2. Le navigateur télécharge le nouveau service worker
3. L'utilisateur est notifié d'une mise à jour disponible
4. La mise à jour s'applique au prochain rechargement

## 📊 Performance

La PWA améliore les performances grâce à :

- **Cache des assets** : Chargement instantané des ressources
- **Mode hors ligne** : Consultation des cours sans connexion
- **Installation native** : Expérience similaire à une app native

## ⚠️ Limitations

- Le service worker ne fonctionne qu'en **HTTPS** (ou localhost)
- Certaines fonctionnalités nécessitent une connexion (authentification, sauvegarde résultats)
- Le cache peut nécessiter un nettoyage manuel dans certains cas

## 🛠️ Dépannage

### Le service worker ne se charge pas

1. Vérifier que vous êtes en **production** (`npm run build && npm run start`)
2. Vérifier la console pour les erreurs
3. Vérifier que le fichier `public/sw.js` existe après le build

### Le prompt d'installation n'apparaît pas

1. Vérifier que le manifest est valide
2. Vérifier que les icônes existent
3. Vérifier que l'application est servie en HTTPS

### Le cache ne se met pas à jour

1. Vider le cache du navigateur
2. Désinscrire le service worker dans DevTools → Application → Service Workers
3. Recharger la page
