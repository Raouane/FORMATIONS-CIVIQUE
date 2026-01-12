// Script pour corriger les questions SITUATION A2 : mettre 12 en non-premium
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'questions_40_complete_final.json');
const questions = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Trouver toutes les questions SITUATION A2
const a2Situation = questions.filter(q => q.level === 'A2' && q.type === 'SITUATION');

console.log(`Questions SITUATION A2 trouvées: ${a2Situation.length}`);
console.log(`Questions premium: ${a2Situation.filter(q => q.is_premium).length}`);
console.log(`Questions non-premium: ${a2Situation.filter(q => !q.is_premium).length}\n`);

// Mettre les 12 premières en non-premium (pour l'examen standard)
let count = 0;
questions.forEach(q => {
  if (q.level === 'A2' && q.type === 'SITUATION' && q.is_premium) {
    if (count < 12) {
      q.is_premium = false;
      count++;
      console.log(`✅ Question ${count}/12 mise en non-premium: ${q.content.fr.substring(0, 50)}...`);
    }
  }
});

// Sauvegarder
fs.writeFileSync(jsonPath, JSON.stringify(questions, null, 2), 'utf8');

console.log(`\n✅ ${count} questions SITUATION A2 mises en non-premium`);
console.log(`📊 Vérification finale:`);
const finalA2Situation = questions.filter(q => q.level === 'A2' && q.type === 'SITUATION');
console.log(`   Total: ${finalA2Situation.length}`);
console.log(`   Non-premium: ${finalA2Situation.filter(q => !q.is_premium).length}/12`);
console.log(`   Premium: ${finalA2Situation.filter(q => q.is_premium).length}`);
