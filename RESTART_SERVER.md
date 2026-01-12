# 🚨 URGENT : Redémarrer le serveur Next.js

## ⚠️ Problème actuel

Vous avez des erreurs 404 répétées sur `/en/simulation` car **le serveur Next.js n'a pas été redémarré** après les modifications de configuration i18n.

## ✅ Solution immédiate

### Étape 1 : Arrêter tous les processus Node.js

```powershell
# Windows PowerShell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Étape 2 : Nettoyer le cache

```powershell
# Supprimer le cache Next.js
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Write-Host "Cache .next supprimé"
```

### Étape 3 : Redémarrer le serveur

```bash
npm run dev
```

## 🔍 Vérification

Après le redémarrage, vous devriez voir dans la console :

```
✓ Ready in X ms
○ Compiling /en/simulation ...
✓ Compiled /en/simulation in X ms
```

## 📝 Routes valides

Une fois le serveur redémarré, ces routes fonctionneront :

- ✅ `http://localhost:3000/fr/simulation`
- ✅ `http://localhost:3000/en/simulation`
- ✅ `http://localhost:3000/ar/simulation`

## ⚠️ Si le problème persiste

1. **Vérifier que le port 3000 est libre** :
   ```powershell
   Get-NetTCPConnection -LocalPort 3000
   ```

2. **Vérifier les logs du serveur** pour des erreurs de compilation

3. **Vérifier que tous les fichiers de traduction existent** dans `public/locales/`

## 🎯 Test rapide

1. Redémarrer le serveur : `npm run dev`
2. Ouvrir : `http://localhost:3000/fr`
3. Cliquer sur "Commencer un test gratuit"
4. Vérifier que la navigation vers `/fr/simulation` fonctionne
5. Changer la langue vers "English"
6. Vérifier que la route devient `/en/simulation`

**Le serveur DOIT être redémarré pour que les changements prennent effet !**
