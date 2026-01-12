// Script pour vérifier l'état final des questions
const fs = require('fs');

const questions = JSON.parse(fs.readFileSync('database/questions_40_complete_final.json', 'utf8'));

console.log('📊 RÉSUMÉ FINAL DES QUESTIONS\n');

['A2', 'B1', 'B2'].forEach(level => {
  const levelQuestions = questions.filter(x => x.level === level);
  const connaissance = levelQuestions.filter(x => x.type === 'CONNAISSANCE');
  const situation = levelQuestions.filter(x => x.type === 'SITUATION');
  
  const connaissanceNonPremium = connaissance.filter(x => !x.is_premium).length;
  const situationNonPremium = situation.filter(x => !x.is_premium).length;
  
  const peutCharger40 = connaissanceNonPremium >= 28 && situationNonPremium >= 12;
  
  console.log(`${level}: ${levelQuestions.length}/40 questions`);
  console.log(`  CONNAISSANCE: ${connaissance.length}/28 (non-premium: ${connaissanceNonPremium})`);
  console.log(`  SITUATION: ${situation.length}/12 (non-premium: ${situationNonPremium})`);
  console.log(`  ${peutCharger40 ? '✅' : '❌'} Peut charger 40 questions: ${peutCharger40 ? 'OUI' : 'NON'}\n`);
});

console.log(`📊 Total: ${questions.length} questions`);
