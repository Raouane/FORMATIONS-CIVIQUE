# 🔧 Résolution des erreurs 404 sur les routes avec locales

## Problème
```
GET http://localhost:3000/en/simulation 404 (Not Found)
GET http://localhost:3000/_next/static/chunks/main-app.js 404 (Not Found)
```

## ✅ Solution

### 1. Redémarrer le serveur de développement

Le cache Next.js a été nettoyé. **Vous devez redémarrer le serveur** :

```bash
# Arrêter le serveur actuel (Ctrl+C)
# Puis redémarrer :
npm run dev
```

### 2. Vérifier que le serveur écoute sur le bon port

Le serveur doit démarrer sur `http://localhost:3000`. Si un autre processus utilise le port 3000 :

```powershell
# Windows PowerShell - Trouver et tuer le processus sur le port 3000
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

### 3. Accéder aux routes avec la locale

Avec Next.js i18n, les routes doivent être accessibles avec le préfixe de locale :

- ✅ **Correct** : `http://localhost:3000/en/simulation`
- ✅ **Correct** : `http://localhost:3000/fr/simulation`
- ✅ **Correct** : `http://localhost:3000/ar/simulation`
- ❌ **Incorrect** : `http://localhost:3000/simulation` (sans locale)

### 4. Navigation programmatique

Dans votre code, utilisez toujours `router.push` avec la locale :

```tsx
// ✅ Correct
router.push('/simulation', '/simulation', { locale: 'en' });

// ✅ Correct (locale automatique)
router.push('/simulation', '/simulation', { locale: router.locale });
```

### 5. Si le problème persiste

#### Option A : Nettoyer complètement le cache

```powershell
# Supprimer le cache Next.js
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Supprimer le cache node_modules (optionnel, plus long)
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install

# Redémarrer
npm run dev
```

#### Option B : Vérifier la configuration

Vérifiez que `next.config.js` et `next-i18next.config.js` ont les mêmes locales :

```js
// next.config.js
i18n: {
  locales: ['fr', 'en', 'ar'],
  defaultLocale: 'fr',
}

// next-i18next.config.js
locales: ['fr', 'en', 'ar'],
```

### 6. Vérifier les fichiers de traduction

Assurez-vous que tous les fichiers de traduction existent :

```
public/locales/
├── fr/
│   ├── common.json
│   ├── exam.json
│   └── ...
├── en/
│   ├── common.json
│   ├── exam.json
│   └── ...
└── ar/
    ├── common.json
    ├── exam.json
    └── ...
```

## 🎯 Test rapide

1. Redémarrer le serveur : `npm run dev`
2. Accéder à : `http://localhost:3000/fr/simulation`
3. Changer la langue dans le sélecteur
4. Vérifier que la route change : `http://localhost:3000/en/simulation`

## ⚠️ Note importante

Si vous accédez directement à `/simulation` sans locale, Next.js devrait rediriger automatiquement vers `/fr/simulation` (locale par défaut). Si ce n'est pas le cas, vérifiez que `localeDetection` est bien configuré dans `next-i18next.config.js`.
