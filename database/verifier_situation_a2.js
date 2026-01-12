// Script pour vérifier les questions SITUATION A2
const fs = require('fs');

const questions = JSON.parse(fs.readFileSync('database/questions_40_complete_final.json', 'utf8'));

const a2Situation = questions.filter(q => q.level === 'A2' && q.type === 'SITUATION');

console.log(`Questions SITUATION A2: ${a2Situation.length}\n`);

a2Situation.forEach((q, i) => {
  console.log(`${i + 1}. ${q.content.fr.substring(0, 60)}...`);
  console.log(`   Premium: ${q.is_premium}`);
  console.log(`   Thème: ${q.theme}\n`);
});

const nonPremium = a2Situation.filter(q => !q.is_premium).length;
console.log(`\nTotal non-premium: ${nonPremium}/12 (besoin: 12)`);
