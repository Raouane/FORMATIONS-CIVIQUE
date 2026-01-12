const fs = require('fs');
const path = require('path');

const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxZGZpb3B0Y3B0aW5ueHFzaHJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODAyOCwiZXhwIjoyMDgzMzk0MDI4fQ.66x4iNocWcP8WUn6Cl3jIXaC0DrCUqt5nrqb9Qr4dZs';

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ Le fichier .env.local n\'existe pas.');
  console.error('   Exécutez d\'abord: npm run create-env');
  process.exit(1);
}

let envContent = fs.readFileSync(envPath, 'utf8');

// Vérifier si la clé existe déjà
if (envContent.includes('SUPABASE_SERVICE_ROLE_KEY=')) {
  // Remplacer la ligne existante
  envContent = envContent.replace(
    /SUPABASE_SERVICE_ROLE_KEY=.*/g,
    `SUPABASE_SERVICE_ROLE_KEY=${serviceKey}`
  );
  console.log('✅ SERVICE_ROLE_KEY mise à jour dans .env.local');
} else {
  // Ajouter la clé après NEXT_PUBLIC_SUPABASE_ANON_KEY
  envContent = envContent.replace(
    /(NEXT_PUBLIC_SUPABASE_ANON_KEY=.*)/,
    `$1\n\n# Supabase Service Role Key (requis pour le seeding)\nSUPABASE_SERVICE_ROLE_KEY=${serviceKey}`
  );
  console.log('✅ SERVICE_ROLE_KEY ajoutée dans .env.local');
}

fs.writeFileSync(envPath, envContent, 'utf8');
console.log('\n✅ Configuration terminée !');
console.log('   Vous pouvez maintenant exécuter: npm run seed');
