// Script pour fusionner toutes les questions (A2, B1, B2) dans un fichier complet
const fs = require('fs');
const path = require('path');

const mainJsonPath = path.join(__dirname, 'questions_40_complete.json');
const b2TemplatePath = path.join(__dirname, 'questions_b2_template.json');
const b1SupplementPath = path.join(__dirname, 'questions_b1_supplementaires.json');
const b1Lot12Path = path.join(__dirname, 'questions_b1_lot12.json');
const a2Lot13Path = path.join(__dirname, 'questions_a2_lot13.json');
const a2FinalesPath = path.join(__dirname, 'questions_a2_finales.json');
const b1ManquantesPath = path.join(__dirname, 'questions_b1_manquantes.json');
const b2ManquantesPath = path.join(__dirname, 'questions_b2_manquantes.json');

try {
  // Lire le fichier principal
  const mainContent = fs.readFileSync(mainJsonPath, 'utf8');
  const mainQuestions = JSON.parse(mainContent);
  console.log(`✅ Fichier principal lu: ${mainQuestions.length} questions`);

  // Lire les questions B2
  let b2Questions = [];
  if (fs.existsSync(b2TemplatePath)) {
    const b2Content = fs.readFileSync(b2TemplatePath, 'utf8');
    b2Questions = JSON.parse(b2Content);
    console.log(`✅ Questions B2 lues: ${b2Questions.length} questions`);
  }

  // Lire les questions B1 supplémentaires
  let b1SupplementQuestions = [];
  if (fs.existsSync(b1SupplementPath)) {
    const b1Content = fs.readFileSync(b1SupplementPath, 'utf8');
    b1SupplementQuestions = JSON.parse(b1Content);
    console.log(`✅ Questions B1 supplémentaires lues: ${b1SupplementQuestions.length} questions`);
  }

  // Lire les questions B1 Lot 12
  let b1Lot12Questions = [];
  if (fs.existsSync(b1Lot12Path)) {
    const b1Lot12Content = fs.readFileSync(b1Lot12Path, 'utf8');
    b1Lot12Questions = JSON.parse(b1Lot12Content);
    console.log(`✅ Questions B1 Lot 12 lues: ${b1Lot12Questions.length} questions`);
  }

  // Lire les questions A2 Lot 13
  let a2Lot13Questions = [];
  if (fs.existsSync(a2Lot13Path)) {
    const a2Lot13Content = fs.readFileSync(a2Lot13Path, 'utf8');
    a2Lot13Questions = JSON.parse(a2Lot13Content);
    console.log(`✅ Questions A2 Lot 13 lues: ${a2Lot13Questions.length} questions`);
  }

  // Lire les questions A2 finales
  let a2FinalesQuestions = [];
  if (fs.existsSync(a2FinalesPath)) {
    const a2FinalesContent = fs.readFileSync(a2FinalesPath, 'utf8');
    a2FinalesQuestions = JSON.parse(a2FinalesContent);
    console.log(`✅ Questions A2 finales lues: ${a2FinalesQuestions.length} questions`);
  }

  // Lire les questions B1 manquantes
  let b1ManquantesQuestions = [];
  if (fs.existsSync(b1ManquantesPath)) {
    const b1ManquantesContent = fs.readFileSync(b1ManquantesPath, 'utf8');
    b1ManquantesQuestions = JSON.parse(b1ManquantesContent);
    console.log(`✅ Questions B1 manquantes lues: ${b1ManquantesQuestions.length} questions`);
  }

  // Lire les questions B2 manquantes
  let b2ManquantesQuestions = [];
  if (fs.existsSync(b2ManquantesPath)) {
    const b2ManquantesContent = fs.readFileSync(b2ManquantesPath, 'utf8');
    b2ManquantesQuestions = JSON.parse(b2ManquantesContent);
    console.log(`✅ Questions B2 manquantes lues: ${b2ManquantesQuestions.length} questions`);
  }

  // Créer un Set des contenus existants pour éviter les doublons
  const existingContent = new Set(
    mainQuestions.map(q => q.content?.fr || q.content)
  );

  // Filtrer les nouvelles questions (celles qui ne sont pas déjà présentes)
  const newB2Questions = b2Questions.filter(q => {
    const contentFr = q.content?.fr || q.content;
    return !existingContent.has(contentFr);
  });

  const newB1Questions = b1SupplementQuestions.filter(q => {
    const contentFr = q.content?.fr || q.content;
    return !existingContent.has(contentFr);
  });

  const newB1Lot12Questions = b1Lot12Questions.filter(q => {
    const contentFr = q.content?.fr || q.content;
    return !existingContent.has(contentFr);
  });

  const newA2Lot13Questions = a2Lot13Questions.filter(q => {
    const contentFr = q.content?.fr || q.content;
    return !existingContent.has(contentFr);
  });

  const newA2FinalesQuestions = a2FinalesQuestions.filter(q => {
    const contentFr = q.content?.fr || q.content;
    return !existingContent.has(contentFr);
  });

  const newB1ManquantesQuestions = b1ManquantesQuestions.filter(q => {
    const contentFr = q.content?.fr || q.content;
    return !existingContent.has(contentFr);
  });

  const newB2ManquantesQuestions = b2ManquantesQuestions.filter(q => {
    const contentFr = q.content?.fr || q.content;
    return !existingContent.has(contentFr);
  });

  console.log(`📝 Nouvelles questions B2 à ajouter: ${newB2Questions.length}`);
  console.log(`📝 Nouvelles questions B1 à ajouter: ${newB1Questions.length}`);
  console.log(`📝 Nouvelles questions B1 Lot 12 à ajouter: ${newB1Lot12Questions.length}`);
  console.log(`📝 Nouvelles questions A2 Lot 13 à ajouter: ${newA2Lot13Questions.length}`);
  console.log(`📝 Nouvelles questions A2 finales à ajouter: ${newA2FinalesQuestions.length}`);
  console.log(`📝 Nouvelles questions B1 manquantes à ajouter: ${newB1ManquantesQuestions.length}`);
  console.log(`📝 Nouvelles questions B2 manquantes à ajouter: ${newB2ManquantesQuestions.length}`);

  // Fusionner toutes les questions
  const mergedQuestions = [...mainQuestions, ...newA2Lot13Questions, ...newA2FinalesQuestions, ...newB1Questions, ...newB1Lot12Questions, ...newB1ManquantesQuestions, ...newB2Questions, ...newB2ManquantesQuestions];

  // Sauvegarder
  const outputPath = path.join(__dirname, 'questions_40_complete_final.json');
  fs.writeFileSync(outputPath, JSON.stringify(mergedQuestions, null, 2), 'utf8');

  console.log(`\n✅ Fichier fusionné créé: ${outputPath}`);
  console.log(`📊 Total de questions: ${mergedQuestions.length}`);

  // Statistiques détaillées
  const stats = {
    A2: {
      total: mergedQuestions.filter(q => q.level === 'A2').length,
      connaissance: mergedQuestions.filter(q => q.level === 'A2' && q.type === 'CONNAISSANCE').length,
      situation: mergedQuestions.filter(q => q.level === 'A2' && q.type === 'SITUATION').length,
    },
    B1: {
      total: mergedQuestions.filter(q => q.level === 'B1').length,
      connaissance: mergedQuestions.filter(q => q.level === 'B1' && q.type === 'CONNAISSANCE').length,
      situation: mergedQuestions.filter(q => q.level === 'B1' && q.type === 'SITUATION').length,
    },
    B2: {
      total: mergedQuestions.filter(q => q.level === 'B2').length,
      connaissance: mergedQuestions.filter(q => q.level === 'B2' && q.type === 'CONNAISSANCE').length,
      situation: mergedQuestions.filter(q => q.level === 'B2' && q.type === 'SITUATION').length,
    },
  };

  console.log('\n📋 Répartition détaillée:');
  ['A2', 'B1', 'B2'].forEach(level => {
    const s = stats[level];
    console.log(`\n   ${level}:`);
    console.log(`      Total: ${s.total}/40`);
    console.log(`      CONNAISSANCE: ${s.connaissance}/28 (manque ${28 - s.connaissance})`);
    console.log(`      SITUATION: ${s.situation}/12 (manque ${12 - s.situation})`);
    
    const peutCharger40 = s.connaissance >= 28 && s.situation >= 12;
    console.log(`      ${peutCharger40 ? '✅' : '❌'} Peut charger 40 questions: ${peutCharger40 ? 'OUI' : 'NON'}`);
  });

  console.log('\n💡 Pour utiliser le fichier fusionné:');
  console.log(`   1. Vérifiez: ${outputPath}`);
  console.log(`   2. Si correct, remplacez questions_40_complete.json`);
  console.log(`   3. Exécutez: npm run seed:jsonb -- --json database/questions_40_complete_final.json`);

} catch (error) {
  console.error('❌ Erreur:', error.message);
  console.error(error.stack);
  process.exit(1);
}
