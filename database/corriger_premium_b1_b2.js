// Script pour corriger les questions premium B1 et B2
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'questions_40_complete_final.json');
const questions = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('🔧 Correction des questions premium B1 et B2\n');

// B1 : Mettre 28 CONNAISSANCE en non-premium
const b1Connaissance = questions.filter(q => q.level === 'B1' && q.type === 'CONNAISSANCE');
const b1ConnaissancePremium = b1Connaissance.filter(q => q.is_premium);
const b1ConnaissanceNonPremium = b1Connaissance.filter(q => !q.is_premium);

console.log(`B1 CONNAISSANCE:`);
console.log(`  Total: ${b1Connaissance.length}`);
console.log(`  Non-premium: ${b1ConnaissanceNonPremium.length}/28`);
console.log(`  Premium: ${b1ConnaissancePremium.length}`);

let b1Count = 0;
const b1Needed = 28 - b1ConnaissanceNonPremium.length;
if (b1Needed > 0) {
  questions.forEach(q => {
    if (q.level === 'B1' && q.type === 'CONNAISSANCE' && q.is_premium && b1Count < b1Needed) {
      q.is_premium = false;
      b1Count++;
    }
  });
  console.log(`  ✅ ${b1Count} questions mises en non-premium`);
}

// B1 : Mettre 12 SITUATION en non-premium
const b1Situation = questions.filter(q => q.level === 'B1' && q.type === 'SITUATION');
const b1SituationNonPremium = b1Situation.filter(q => !q.is_premium);

console.log(`\nB1 SITUATION:`);
console.log(`  Total: ${b1Situation.length}`);
console.log(`  Non-premium: ${b1SituationNonPremium.length}/12`);

let b1SitCount = 0;
const b1SitNeeded = 12 - b1SituationNonPremium.length;
if (b1SitNeeded > 0) {
  questions.forEach(q => {
    if (q.level === 'B1' && q.type === 'SITUATION' && q.is_premium && b1SitCount < b1SitNeeded) {
      q.is_premium = false;
      b1SitCount++;
    }
  });
  console.log(`  ✅ ${b1SitCount} questions mises en non-premium`);
}

// B2 : Mettre 28 CONNAISSANCE en non-premium
const b2Connaissance = questions.filter(q => q.level === 'B2' && q.type === 'CONNAISSANCE');
const b2ConnaissanceNonPremium = b2Connaissance.filter(q => !q.is_premium);

console.log(`\nB2 CONNAISSANCE:`);
console.log(`  Total: ${b2Connaissance.length}`);
console.log(`  Non-premium: ${b2ConnaissanceNonPremium.length}/28`);

let b2Count = 0;
const b2Needed = 28 - b2ConnaissanceNonPremium.length;
if (b2Needed > 0) {
  questions.forEach(q => {
    if (q.level === 'B2' && q.type === 'CONNAISSANCE' && q.is_premium && b2Count < b2Needed) {
      q.is_premium = false;
      b2Count++;
    }
  });
  console.log(`  ✅ ${b2Count} questions mises en non-premium`);
}

// Sauvegarder
fs.writeFileSync(jsonPath, JSON.stringify(questions, null, 2), 'utf8');

console.log('\n✅ Corrections appliquées !');
console.log('\n📊 Vérification finale:');

const finalB1Connaissance = questions.filter(q => q.level === 'B1' && q.type === 'CONNAISSANCE' && !q.is_premium).length;
const finalB1Situation = questions.filter(q => q.level === 'B1' && q.type === 'SITUATION' && !q.is_premium).length;
const finalB2Connaissance = questions.filter(q => q.level === 'B2' && q.type === 'CONNAISSANCE' && !q.is_premium).length;
const finalB2Situation = questions.filter(q => q.level === 'B2' && q.type === 'SITUATION' && !q.is_premium).length;

console.log(`B1: ${finalB1Connaissance}/28 CONNAISSANCE non-premium, ${finalB1Situation}/12 SITUATION non-premium`);
console.log(`B2: ${finalB2Connaissance}/28 CONNAISSANCE non-premium, ${finalB2Situation}/12 SITUATION non-premium`);

const b1Ok = finalB1Connaissance >= 28 && finalB1Situation >= 12;
const b2Ok = finalB2Connaissance >= 28 && finalB2Situation >= 12;

console.log(`\n${b1Ok ? '✅' : '❌'} B1 peut charger 40 questions: ${b1Ok ? 'OUI' : 'NON'}`);
console.log(`${b2Ok ? '✅' : '❌'} B2 peut charger 40 questions: ${b2Ok ? 'OUI' : 'NON'}`);
