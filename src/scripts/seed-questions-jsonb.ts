/**
 * Script de seeding pour importer des questions au format JSONB localisé
 * 
 * Usage:
 *   npm run seed:questions
 * 
 * Ou avec un fichier CSV:
 *   npm run seed:questions -- --csv database/questions.csv
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import { QuestionTheme, QuestionType, UserLevel, ComplexityLevel } from '@/types/database';

// Charger les variables d'environnement
config({ path: resolve(process.cwd(), '.env.local') });

// Configuration Supabase
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variables d\'environnement manquantes:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_KEY ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface CSVQuestionRow {
  theme: string;
  type: string;
  level: string;
  complexity_level: string;
  content_fr: string;
  content_en?: string;
  content_ar?: string;
  scenario_context_fr?: string;
  scenario_context_en?: string;
  scenario_context_ar?: string;
  option1_fr: string;
  option1_en?: string;
  option1_ar?: string;
  option2_fr: string;
  option2_en?: string;
  option2_ar?: string;
  option3_fr: string;
  option3_en?: string;
  option3_ar?: string;
  option4_fr: string;
  option4_en?: string;
  option4_ar?: string;
  correct_answer: string;
  explanation_fr: string;
  explanation_en?: string;
  explanation_ar?: string;
  is_premium: string;
}

/**
 * Convertit une ligne CSV en objet JSONB localisé
 */
function csvRowToQuestion(row: CSVQuestionRow) {
  // Construire les objets JSONB pour chaque champ localisé
  const content: { [key: string]: string } = { fr: row.content_fr };
  if (row.content_en) content.en = row.content_en;
  if (row.content_ar) content.ar = row.content_ar;

  const scenario_context: { [key: string]: string } | null = 
    row.scenario_context_fr 
      ? { fr: row.scenario_context_fr }
      : null;
  if (scenario_context && row.scenario_context_en) scenario_context.en = row.scenario_context_en;
  if (scenario_context && row.scenario_context_ar) scenario_context.ar = row.scenario_context_ar;

  const options: { [key: string]: string[] } = {
    fr: [row.option1_fr, row.option2_fr, row.option3_fr, row.option4_fr],
  };
  if (row.option1_en && row.option2_en && row.option3_en && row.option4_en) {
    options.en = [row.option1_en, row.option2_en, row.option3_en, row.option4_en];
  }
  if (row.option1_ar && row.option2_ar && row.option3_ar && row.option4_ar) {
    options.ar = [row.option1_ar, row.option2_ar, row.option3_ar, row.option4_ar];
  }

  const explanation: { [key: string]: string } = { fr: row.explanation_fr };
  if (row.explanation_en) explanation.en = row.explanation_en;
  if (row.explanation_ar) explanation.ar = row.explanation_ar;

  return {
    theme: row.theme as QuestionTheme,
    type: row.type as QuestionType,
    level: row.level as UserLevel,
    complexity_level: row.complexity_level as ComplexityLevel,
    content,
    scenario_context,
    options,
    correct_answer: parseInt(row.correct_answer, 10),
    explanation,
    is_premium: row.is_premium.toLowerCase() === 'true',
  };
}

/**
 * Parse un fichier CSV avec gestion des guillemets et virgules dans les valeurs
 */
function parseCSV(csvContent: string): CSVQuestionRow[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  // Fonction pour parser une ligne CSV en tenant compte des guillemets
  function parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Guillemet échappé
          current += '"';
          i++; // Skip le prochain guillemet
        } else {
          // Toggle inQuotes
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Fin de valeur
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    // Ajouter la dernière valeur
    values.push(current.trim());
    return values;
  }

  // Parser la première ligne comme en-têtes
  const headers = parseCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, ''));
  
  // Parser les lignes de données
  const records: CSVQuestionRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]).map(v => v.replace(/^"|"$/g, ''));
    if (values.length !== headers.length) {
      console.warn(`⚠️  Ligne ${i + 1}: Nombre de colonnes incorrect (${values.length} au lieu de ${headers.length})`);
      continue;
    }
    
    const record: any = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    records.push(record as CSVQuestionRow);
  }
  
  return records;
}

/**
 * Importe les questions depuis un fichier CSV
 */
async function importFromCSV(csvPath: string) {
  console.log(`📖 Lecture du fichier CSV: ${csvPath}`);
  
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parseCSV(fileContent);

  console.log(`✅ ${records.length} questions trouvées dans le CSV`);

  const questions = records.map(csvRowToQuestion);
  
  console.log('\n📝 Exemple de question convertie:');
  console.log(JSON.stringify(questions[0], null, 2));

  // Insérer les questions dans Supabase
  console.log('\n💾 Insertion dans Supabase...');
  
  const { data, error } = await supabase
    .from('fc_questions')
    .insert(questions)
    .select();

  if (error) {
    console.error('❌ Erreur lors de l\'insertion:', error);
    throw error;
  }

  console.log(`✅ ${data?.length || 0} questions insérées avec succès!`);
  return data;
}

/**
 * Importe les questions depuis un fichier JSON
 */
async function importFromJSON(jsonPath: string) {
  console.log(`📖 Lecture du fichier JSON: ${jsonPath}`);
  
  const fileContent = fs.readFileSync(jsonPath, 'utf-8');
  const questions = JSON.parse(fileContent);

  console.log(`✅ ${questions.length} questions trouvées dans le JSON`);

  // Vérifier que les questions ont le bon format JSONB
  const validatedQuestions = questions.map((q: any) => {
    // S'assurer que les champs localisés sont des objets
    if (typeof q.content === 'string') {
      q.content = { fr: q.content };
    }
    if (q.scenario_context && typeof q.scenario_context === 'string') {
      q.scenario_context = { fr: q.scenario_context };
    }
    if (Array.isArray(q.options)) {
      q.options = { fr: q.options };
    }
    if (typeof q.explanation === 'string') {
      q.explanation = { fr: q.explanation };
    }
    return q;
  });

  console.log('\n💾 Insertion dans Supabase...');
  
  const { data, error } = await supabase
    .from('fc_questions')
    .insert(validatedQuestions)
    .select();

  if (error) {
    console.error('❌ Erreur lors de l\'insertion:', error);
    throw error;
  }

  console.log(`✅ ${data?.length || 0} questions insérées avec succès!`);
  return data;
}

/**
 * Fonction principale
 */
async function main() {
  const args = process.argv.slice(2);
  const csvArg = args.find(arg => arg.startsWith('--csv='));
  const jsonArg = args.find(arg => arg.startsWith('--json='));
  
  // Chercher aussi un argument direct qui ressemble à un fichier JSON
  const jsonFileArg = args.find(arg => 
    !arg.startsWith('--') && 
    (arg.endsWith('.json') || arg.endsWith('.jsonb'))
  );

  try {
    if (csvArg) {
      const csvPath = csvArg.split('=')[1];
      await importFromCSV(csvPath);
    } else if (jsonArg) {
      const jsonPath = jsonArg.split('=')[1];
      await importFromJSON(jsonPath);
    } else if (jsonFileArg) {
      // Argument direct : fichier JSON
      await importFromJSON(jsonFileArg);
    } else {
      console.log('📋 Usage:');
      console.log('   npm run seed:questions -- --csv=database/questions.csv');
      console.log('   npm run seed:questions -- --json=database/questions.json');
      console.log('   npm run seed:questions -- database/questions.json');
      console.log('\n💡 Exemple de fichier CSV: database/questions_template.csv');
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  main();
}

export { importFromCSV, importFromJSON, csvRowToQuestion };
