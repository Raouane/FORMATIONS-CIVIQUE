# 🚀 Commandes Build et Start pour Render

## ✅ Commandes à configurer dans Render

### Build Command
```
npm install && npm run build
```

**Explication** :
- `npm install` : Installe toutes les dépendances
- `npm run build` : Compile l'application Next.js pour la production
- Le `&&` garantit que le build ne s'exécute que si l'installation réussit

### Start Command
```
npm run start
```

**Explication** :
- `npm run start` : Lance le serveur Next.js en mode production
- Next.js utilise automatiquement la variable d'environnement `PORT` définie par Render
- Par défaut, Next.js écoute sur le port 3000, mais il utilisera `process.env.PORT` si disponible

---

## 📋 Configuration complète dans Render

### Dans l'interface Render :

1. **Build Command** :
   ```
   npm install && npm run build
   ```

2. **Start Command** :
   ```
   npm run start
   ```

3. **Root Directory** (optionnel) :
   - Laissez vide si votre projet est à la racine du repo
   - Si votre projet est dans un sous-dossier, indiquez le chemin (ex: `app`)

---

## 🔧 Scripts disponibles dans package.json

D'après votre `package.json`, voici les scripts disponibles :

- ✅ `npm run build` → Compile pour la production
- ✅ `npm run start` → Lance le serveur de production
- ✅ `npm run dev` → Mode développement (ne pas utiliser sur Render)

---

## ⚠️ Notes importantes

1. **Port** : Render définit automatiquement la variable `PORT`. Next.js l'utilisera automatiquement.

2. **Variables d'environnement** : Assurez-vous d'avoir configuré toutes les variables nécessaires (voir `RENDER_ENV_VARIABLES.md`)

3. **Node.js Version** : Votre projet nécessite Node.js >= 20.0.0 < 23.0.0 (défini dans `package.json` → `engines`)

4. **Build Time** : Le build peut prendre plusieurs minutes, surtout lors du premier déploiement

5. **Cache** : Render met en cache les `node_modules` entre les builds pour accélérer les déploiements suivants

---

## 🐛 Dépannage

### Si le build échoue :

1. **Vérifiez les logs** dans Render Dashboard → Logs
2. **Vérifiez les variables d'environnement** sont bien configurées
3. **Vérifiez la version de Node.js** (doit être >= 20.0.0)

### Si le serveur ne démarre pas :

1. **Vérifiez que le PORT est défini** (Render le fait automatiquement)
2. **Vérifiez les logs** pour voir les erreurs de démarrage
3. **Vérifiez que toutes les variables d'environnement sont présentes**

---

## ✅ Checklist avant déploiement

- [ ] Build Command configuré : `npm install && npm run build`
- [ ] Start Command configuré : `npm run start`
- [ ] Variables d'environnement configurées (voir `RENDER_ENV_VARIABLES.md`)
- [ ] Repository branch configuré (généralement `main`)
- [ ] Root Directory configuré (si nécessaire)

---

## 📝 Exemple de configuration complète Render

```
Name: FORMATIONS-CIVIQUE
Branch: main
Region: Frankfurt (EU Central)
Root Directory: (vide)
Build Command: npm install && npm run build
Start Command: npm run start
Instance Type: Free (ou Starter pour production)
```
