# 🌐 Guide : Ajouter les Traductions AR aux Chapitres de Révision

## 🎯 Objectif

Une fois la table `fc_revision_chapters` créée et les chapitres migrés, vous devez ajouter les traductions AR pour chaque chapitre.

## 📋 Étapes

### Étape 1 : Créer la Table (si pas encore fait)

Exécutez `database/migration_add_revision_chapters_table.sql` dans Supabase SQL Editor.

### Étape 2 : Migrer les Chapitres (si pas encore fait)

```bash
npm run migrate:revision
```

Cela crée les chapitres avec seulement les traductions FR (EN et AR identiques au FR pour l'instant).

### Étape 3 : Ajouter les Traductions AR

#### Option A : Via Supabase Dashboard (Recommandé)

1. **Ouvrir Supabase Dashboard** → Table Editor → `fc_revision_chapters`
2. **Pour chaque chapitre**, cliquer sur "Edit"
3. **Mettre à jour le champ `title`** :
   ```json
   {
     "fr": "La Devise de la République",
     "en": "The Motto of the Republic",
     "ar": "شعار الجمهورية"
   }
   ```
4. **Mettre à jour le champ `content`** :
   ```json
   {
     "fr": "# La Devise de la République\n\nLa devise...",
     "en": "# The Motto of the Republic\n\nThe motto...",
     "ar": "# شعار الجمهورية\n\nشعار الجمهورية الفرنسية..."
   }
   ```
5. **Sauvegarder**

#### Option B : Via SQL Direct

```sql
-- Exemple : Mettre à jour le chapitre "devise" avec la traduction AR
UPDATE fc_revision_chapters
SET 
  title = jsonb_set(title, '{ar}', '"شعار الجمهورية"'),
  content = jsonb_set(
    content, 
    '{ar}', 
    '"# شعار الجمهورية\n\nشعار الجمهورية الفرنسية هو \"الحرية، المساواة، الأخوة\".\n\n## الحرية\nالحرية هي الحق في فعل كل ما لا يضر بالآخرين..."'
  )
WHERE id = 'devise';
```

## 📝 Exemple de Traduction Complète

### Chapitre "devise" (La Devise de la République)

**Title AR** : `شعار الجمهورية`

**Content AR** (Markdown) :
```markdown
# شعار الجمهورية

شعار الجمهورية الفرنسية هو **"الحرية، المساواة، الأخوة"**.

## الحرية
الحرية هي الحق في فعل كل ما لا يضر بالآخرين. وتشمل:
- حرية التعبير
- حرية الدين
- حرية التجمع
- حرية التنقل

## المساواة
المساواة تعني أن جميع المواطنين متساوون أمام القانون، دون تمييز على أساس الأصل أو العرق أو الدين.

## الأخوة
الأخوة تعبر عن التضامن بين المواطنين والالتزام بالصالح العام.
```

## 🚀 Script Automatique (À Créer)

Je peux créer un script pour ajouter automatiquement les traductions AR depuis un fichier JSON. Souhaitez-vous que je le crée ?

## ✅ Vérification

Après avoir ajouté les traductions AR, vérifiez :

```sql
-- Vérifier que les traductions AR existent
SELECT id, title->>'ar' as title_ar, 
       CASE WHEN content ? 'ar' THEN 'Oui' ELSE 'Non' END as has_ar_content
FROM fc_revision_chapters;
```

## 📌 Note

Une fois les traductions AR ajoutées dans la BD, la page `/revision` affichera automatiquement le contenu en arabe quand la locale est `ar`.
