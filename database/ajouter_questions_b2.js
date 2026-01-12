// Script pour ajouter les questions B2 au fichier JSON
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'questions_40_complete.json');

// Lire le fichier JSON actuel
let questions = [];
try {
  const content = fs.readFileSync(jsonPath, 'utf8');
  questions = JSON.parse(content);
  console.log(`✅ Fichier lu: ${questions.length} questions existantes`);
} catch (error) {
  console.error('❌ Erreur lors de la lecture:', error.message);
  process.exit(1);
}

// Compter les questions B2 existantes
const b2Count = questions.filter(q => q.level === 'B2').length;
console.log(`📊 Questions B2 existantes: ${b2Count}`);

// Les questions que vous avez fournies (extrait du texte)
// Note: Je vais créer un fichier séparé avec les questions formatées correctement
// car le texte fourni a des champs vides qui doivent être complétés

console.log('\n⚠️  Les questions que vous avez fournies contiennent des champs vides (fr:, en:).');
console.log('Il faut compléter ces champs avant de les ajouter.\n');

console.log('📝 Questions B2 détectées dans votre texte:');
console.log('   - Plusieurs questions POLITIQUE, HISTOIRE, VALEURS, SOCIETE, DROITS');
console.log('   - Type: CONNAISSANCE et SITUATION');
console.log('   - Problème: Champs "fr" et "en" vides dans les options\n');

console.log('💡 Solution:');
console.log('   1. Complétez les champs vides dans votre texte');
console.log('   2. Ou créez un fichier questions_b2_completes.json avec les questions formatées');
console.log('   3. Ensuite, exécutez ce script pour les fusionner\n');

// Vérifier combien de questions B2 il faut
const requiredB2 = 40; // 28 CONNAISSANCE + 12 SITUATION
const neededB2 = requiredB2 - b2Count;

console.log(`📊 Besoin: ${neededB2} questions B2 supplémentaires`);
console.log(`   - ${28 - questions.filter(q => q.level === 'B2' && q.type === 'CONNAISSANCE').length} CONNAISSANCE`);
console.log(`   - ${12 - questions.filter(q => q.level === 'B2' && q.type === 'SITUATION').length} SITUATION`);
