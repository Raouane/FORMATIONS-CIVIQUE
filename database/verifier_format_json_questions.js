// Script pour vérifier et corriger le format JSON des questions
const fs = require('fs');

const jsonPath = 'database/questions_40_complete.json';

try {
  const content = fs.readFileSync(jsonPath, 'utf8');
  
  // Détecter les erreurs de format (champs vides comme "fr":,)
  const errors = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Détecter les champs vides comme "fr":, ou "en":,
    if (line.match(/"(fr|en|ar)":\s*,/)) {
      errors.push({
        line: index + 1,
        content: line.trim(),
        issue: 'Champ vide détecté'
      });
    }
  });
  
  if (errors.length > 0) {
    console.log('❌ ERREURS DE FORMAT DÉTECTÉES:');
    console.log(`\n${errors.length} erreur(s) trouvée(s):\n`);
    errors.slice(0, 10).forEach(err => {
      console.log(`Ligne ${err.line}: ${err.content}`);
    });
    if (errors.length > 10) {
      console.log(`\n... et ${errors.length - 10} autres erreurs`);
    }
    console.log('\n⚠️  Le fichier JSON n\'est pas valide. Corrigez ces erreurs avant de l\'utiliser.');
  } else {
    // Essayer de parser le JSON
    try {
      const questions = JSON.parse(content);
      console.log('✅ Format JSON valide');
      console.log(`📊 Total de questions: ${questions.length}`);
      
      // Compter par niveau
      const byLevel = {};
      questions.forEach(q => {
        byLevel[q.level] = (byLevel[q.level] || 0) + 1;
      });
      console.log('\n📋 Répartition par niveau:');
      Object.entries(byLevel).forEach(([level, count]) => {
        console.log(`  ${level}: ${count} questions`);
      });
      
      // Vérifier les champs manquants
      const missingFields = [];
      questions.forEach((q, index) => {
        if (!q.content?.fr) missingFields.push(`Q${index + 1}: content.fr manquant`);
        if (!q.options?.fr || !Array.isArray(q.options.fr)) missingFields.push(`Q${index + 1}: options.fr manquant ou invalide`);
        if (!q.explanation?.fr) missingFields.push(`Q${index + 1}: explanation.fr manquant`);
      });
      
      if (missingFields.length > 0) {
        console.log('\n⚠️  Champs manquants détectés:');
        missingFields.slice(0, 10).forEach(field => console.log(`  - ${field}`));
        if (missingFields.length > 10) {
          console.log(`  ... et ${missingFields.length - 10} autres`);
        }
      } else {
        console.log('\n✅ Toutes les questions ont les champs requis (fr)');
      }
    } catch (parseError) {
      console.log('❌ ERREUR DE PARSING JSON:');
      console.log(parseError.message);
    }
  }
} catch (error) {
  console.error('❌ Erreur lors de la lecture du fichier:', error.message);
}
