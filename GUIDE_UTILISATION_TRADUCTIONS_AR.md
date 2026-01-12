# 🌐 Guide : Utiliser le Script de Traductions AR

## 🎯 Objectif

Ce guide explique comment utiliser le script automatique pour ajouter les traductions AR aux chapitres de révision.

## 📋 Prérequis

1. ✅ La table `fc_revision_chapters` doit exister dans Supabase
2. ✅ Les chapitres doivent être migrés (via `npm run migrate:revision`)
3. ✅ Le fichier `.env.local` doit contenir les variables Supabase

## 🚀 Utilisation

### Étape 1 : Vérifier que la table existe

Exécutez dans Supabase SQL Editor :
```sql
SELECT COUNT(*) FROM fc_revision_chapters;
```

Si la table n'existe pas, exécutez d'abord :
```sql
-- Exécuter database/migration_add_revision_chapters_table.sql
```

### Étape 2 : Migrer les chapitres (si pas encore fait)

```bash
npm run migrate:revision
```

Cela crée les chapitres avec les traductions FR (EN et AR identiques au FR pour l'instant).

### Étape 3 : Ajouter les traductions AR

```bash
npm run add:ar-translations
```

Le script va :
1. ✅ Charger les traductions AR depuis `database/revision_chapters_ar_translations.json`
2. ✅ Mettre à jour chaque chapitre dans la BD avec les traductions AR
3. ✅ Afficher un rapport de succès/erreurs

## 📝 Fichier de Traductions

Les traductions AR sont stockées dans :
```
database/revision_chapters_ar_translations.json
```

Structure :
```json
{
  "devise": {
    "title": {
      "ar": "شعار الجمهورية"
    },
    "content": {
      "ar": "# شعار الجمهورية\n\n..."
    }
  },
  ...
}
```

## ✅ Vérification

Après avoir exécuté le script, vérifiez dans Supabase :

```sql
-- Vérifier que les traductions AR existent
SELECT 
  id, 
  title->>'ar' as title_ar, 
  CASE WHEN content ? 'ar' THEN 'Oui' ELSE 'Non' END as has_ar_content,
  LENGTH(content->>'ar') as content_length_ar
FROM fc_revision_chapters
ORDER BY id;
```

## 🔄 Mettre à Jour les Traductions

Si vous modifiez `database/revision_chapters_ar_translations.json`, relancez simplement :

```bash
npm run add:ar-translations
```

Le script mettra à jour uniquement les chapitres présents dans le fichier JSON.

## 🐛 Dépannage

### Erreur : "Variables d'environnement manquantes"
- Vérifiez que `.env.local` existe
- Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont définis

### Erreur : "La table fc_revision_chapters est vide"
- Exécutez d'abord `npm run migrate:revision`

### Erreur : "Could not find the table"
- Exécutez `database/migration_add_revision_chapters_table.sql` dans Supabase SQL Editor

## 📌 Résultat

Une fois les traductions AR ajoutées, la page `/revision` affichera automatiquement le contenu en arabe quand la locale est `ar`.

Le service `revisionChapterService` extrait déjà les traductions selon la locale :
- `locale = 'ar'` → Affiche le contenu AR
- `locale = 'fr'` → Affiche le contenu FR
- `locale = 'en'` → Affiche le contenu EN

## 🎉 C'est tout !

Le script est prêt à l'emploi. Exécutez simplement `npm run add:ar-translations` après avoir migré les chapitres.
