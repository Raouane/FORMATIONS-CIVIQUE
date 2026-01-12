const fs = require('fs');
const path = require('path');

// Créer un SVG simple pour l'icône
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <rect width="192" height="192" fill="#0050a1" rx="40"/>
  <text x="96" y="130" font-family="Arial, sans-serif" font-size="100" font-weight="bold" fill="white" text-anchor="middle">FC</text>
</svg>`;

const iconPath = path.join(process.cwd(), 'public', 'icon-192.png');
// Pour l'instant, créons un SVG et renommons-le (les navigateurs modernes acceptent SVG)
// En production, vous devrez créer de vrais PNG
fs.writeFileSync(iconPath.replace('.png', '.svg'), svgContent, 'utf8');
console.log('✅ Icône SVG créée (temporaire)');
console.log('   Pour la production, créez de vrais PNG 192x192 et 512x512');
