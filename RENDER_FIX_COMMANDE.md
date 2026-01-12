# 🔧 CORRECTION : Commande Build Erronée

## ❌ Problème détecté

Votre commande de build sur Render contient une erreur :
```
npm install; npmnpm install && npm run build run build
```

Cette commande est incorrecte et cause l'erreur : `bash: line 1: npmnpm: command not found`

## ✅ Solution

### Commande Build CORRECTE à copier dans Render :

```
npm install && npm run build
```

**⚠️ IMPORTANT** : 
- Copiez EXACTEMENT cette commande
- Pas d'espaces supplémentaires
- Pas de caractères supplémentaires
- Utilisez `&&` (et non `;`)

### Commande Start CORRECTE :

```
npm run start
```

---

## 📝 Instructions pour corriger dans Render

1. **Allez dans votre service Render** → Dashboard
2. **Cliquez sur votre service** "FORMATIONS-CIVIQUE"
3. **Allez dans l'onglet "Settings"** (ou "Environment")
4. **Trouvez le champ "Build Command"**
5. **Supprimez tout le contenu actuel**
6. **Copiez-collez EXACTEMENT** :
   ```
   npm install && npm run build
   ```
7. **Vérifiez le champ "Start Command"** contient :
   ```
   npm run start
   ```
8. **Sauvegardez** les modifications
9. **Redéployez** votre service

---

## ✅ Vérification

Après correction, votre configuration Render devrait être :

- **Build Command** : `npm install && npm run build`
- **Start Command** : `npm run start`

---

## 🚨 Erreurs courantes à éviter

❌ **MAUVAIS** :
- `npm install; npm run build` (utilise `;` au lieu de `&&`)
- `npm install &&npm run build` (pas d'espace après `&&`)
- `npm install && npm run build ` (espace à la fin)
- `npm install && npm run build && npm run start` (trop de commandes)

✅ **BON** :
- `npm install && npm run build` (exactement comme ça)

---

## 📋 Checklist de correction

- [ ] Build Command corrigé : `npm install && npm run build`
- [ ] Start Command vérifié : `npm run start`
- [ ] Modifications sauvegardées
- [ ] Service redéployé
- [ ] Build réussi (vérifier les logs)
