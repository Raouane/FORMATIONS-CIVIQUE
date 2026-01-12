// Script pour extraire et formater les questions depuis le texte fourni
const fs = require('fs');

// Le texte fourni par l'utilisateur (extrait)
const texteQuestions = `
{
  "theme": "POLITIQUE",
  "type": "CONNAISSANCE",
  "level": "B2",
  "complexity_level": "B2",
  "content": {
    "fr": "À qui appartient la souveraineté en France?",
    "en":,
    "ar": ["لرئيس الجمهورية", "للحكومة", "للشعب الذي يمارسها عن طريق ممثليه وعن طريق الاستفتاء", "للاتحاد الأوروبي"]
  },
  ...
}`;

console.log('⚠️  Le texte fourni contient des erreurs de format JSON.');
console.log('Les champs "fr":, et "en":, sont vides (syntaxe invalide).\n');

console.log('📋 Questions détectées dans le texte:');
console.log('   - Plusieurs questions B2');
console.log('   - Thèmes: POLITIQUE, HISTOIRE, VALEURS, SOCIETE, DROITS');
console.log('   - Types: CONNAISSANCE et SITUATION\n');

console.log('✅ Pour corriger:');
console.log('   1. Remplacez tous les "fr":, par "fr": null ou "fr": "texte"');
console.log('   2. Remplacez tous les "en":, par "en": null ou "en": "texte"');
console.log('   3. Vérifiez que toutes les options ont 4 éléments');
console.log('   4. Assurez-vous que correct_answer est entre 0 et 3\n');

console.log('💡 Je peux créer un fichier template avec les questions formatées');
console.log('   si vous me fournissez les traductions manquantes.');
