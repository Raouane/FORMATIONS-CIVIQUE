# 🔧 Correction : Script de Migration des Traductions

## ❌ Problème

L'erreur `Missing Supabase environment variables` se produit car :
1. Le script importe `translationService` qui importe `supabase.ts`
2. `supabase.ts` vérifie les variables d'environnement au moment de l'import (top-level)
3. `dotenv/config` était importé APRÈS les autres imports

## ✅ Solution

Charger `dotenv` **AVANT** d'importer les modules qui utilisent les variables d'environnement.

### Correction Appliquée

```typescript
// ✅ AVANT (dans le script)
import * as translationService from '@/services/translationService';
import 'dotenv/config'; // ❌ Trop tard !

// ✅ APRÈS (corrigé)
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') }); // ✅ Chargé en premier

import * as translationService from '@/services/translationService';
```

## 🚀 Utilisation

Maintenant, le script devrait fonctionner :

```bash
npm run migrate:translations
```

## 📋 Vérification

Assurez-vous que votre fichier `.env.local` contient :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

## ✅ Test

Le script devrait maintenant :
1. ✅ Charger les variables d'environnement
2. ✅ Se connecter à Supabase
3. ✅ Migrer les traductions depuis les fichiers JSON vers la BD
