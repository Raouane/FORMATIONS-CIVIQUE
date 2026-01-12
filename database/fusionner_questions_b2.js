// Script pour fusionner les questions B2 avec le fichier principal
const fs = require('fs');
const path = require('path');

const mainJsonPath = path.join(__dirname, 'questions_40_complete.json');
const b2TemplatePath = path.join(__dirname, 'questions_b2_template.json');

try {
  // Lire le fichier principal
  const mainContent = fs.readFileSync(mainJsonPath, 'utf8');
  const mainQuestions = JSON.parse(mainContent);
  console.log(`✅ Fichier principal lu: ${mainQuestions.length} questions`);

  // Lire le template B2
  const b2Content = fs.readFileSync(b2TemplatePath, 'utf8');
  const b2Questions = JSON.parse(b2Content);
  console.log(`✅ Template B2 lu: ${b2Questions.length} questions`);

  // Compter les questions B2 existantes
  const existingB2 = mainQuestions.filter(q => q.level === 'B2');
  console.log(`📊 Questions B2 existantes dans le fichier principal: ${existingB2.length}`);

  // Filtrer les questions B2 qui ne sont pas déjà dans le fichier principal
  // (comparaison basée sur le contenu français)
  const existingB2Content = new Set(
    existingB2.map(q => q.content?.fr || q.content)
  );

  const newB2Questions = b2Questions.filter(q => {
    const contentFr = q.content?.fr || q.content;
    return !existingB2Content.has(contentFr);
  });

  console.log(`📝 Nouvelles questions B2 à ajouter: ${newB2Questions.length}`);

  // Fusionner
  const mergedQuestions = [...mainQuestions, ...newB2Questions];

  // Sauvegarder dans un nouveau fichier (pour ne pas écraser l'original)
  const outputPath = path.join(__dirname, 'questions_40_complete_avec_b2.json');
  fs.writeFileSync(outputPath, JSON.stringify(mergedQuestions, null, 2), 'utf8');

  console.log(`\n✅ Fichier fusionné créé: ${outputPath}`);
  console.log(`📊 Total de questions: ${mergedQuestions.length}`);

  // Statistiques par niveau
  const stats = {
    A2: mergedQuestions.filter(q => q.level === 'A2').length,
    B1: mergedQuestions.filter(q => q.level === 'B1').length,
    B2: mergedQuestions.filter(q => q.level === 'B2').length,
  };

  console.log('\n📋 Répartition par niveau:');
  console.log(`   A2: ${stats.A2} questions`);
  console.log(`   B1: ${stats.B1} questions`);
  console.log(`   B2: ${stats.B2} questions`);

  // Vérifier les besoins
  const besoinB2 = 40 - stats.B2;
  const besoinB2Connaissance = 28 - mergedQuestions.filter(q => q.level === 'B2' && q.type === 'CONNAISSANCE').length;
  const besoinB2Situation = 12 - mergedQuestions.filter(q => q.level === 'B2' && q.type === 'SITUATION').length;

  if (besoinB2 > 0) {
    console.log(`\n⚠️  Il manque encore ${besoinB2} questions B2:`);
    console.log(`   - ${besoinB2Connaissance} CONNAISSANCE`);
    console.log(`   - ${besoinB2Situation} SITUATION`);
  } else {
    console.log('\n✅ Toutes les questions B2 sont présentes !');
  }

  console.log('\n💡 Pour utiliser le fichier fusionné:');
  console.log(`   1. Vérifiez le fichier: ${outputPath}`);
  console.log(`   2. Si tout est correct, remplacez questions_40_complete.json`);
  console.log(`   3. Exécutez le script de seeding`);

} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}
