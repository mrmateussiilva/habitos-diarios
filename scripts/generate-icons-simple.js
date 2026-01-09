import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

// Cria o diretório se não existir
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Cria um SVG simples e depois podemos converter
function createSVGIcon(size) {
  const emojiSize = size * 0.5;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.1}"/>
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="${emojiSize}" 
        text-anchor="middle" dominant-baseline="middle" fill="white">📊</text>
  ${size >= 192 ? `<text x="50%" y="80%" font-family="Arial, sans-serif" font-size="${size * 0.12}" 
        font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">HÁBITOS</text>` : ''}
</svg>`;
}

console.log('🎨 Gerando ícones PWA usando método alternativo...\n');
console.log('⚠️  Este script cria SVGs. Para PNGs, use o gerador HTML no navegador.\n');

// Primeiro, vamos tentar usar ImageMagick ou convert se disponível
async function generateWithImageMagick() {
  try {
    await execAsync('which convert');
    console.log('✅ ImageMagick encontrado, gerando PNGs...\n');
    
    for (const size of sizes) {
      const svgContent = createSVGIcon(size);
      const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
      fs.writeFileSync(svgPath, svgContent);
      
      const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      await execAsync(`convert "${svgPath}" -background none "${pngPath}"`);
      fs.unlinkSync(svgPath); // Remove o SVG temporário
      console.log(`✅ Gerado: icon-${size}x${size}.png`);
    }
    return true;
  } catch (error) {
    return false;
  }
}

// Se ImageMagick não estiver disponível, vamos criar usando uma solução baseada em browser
async function generateWithBrowser() {
  console.log('📝 Criando script HTML para gerar ícones no navegador...\n');
  
  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gerador de Ícones - Executar</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    button {
      background: #6366f1;
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      margin: 10px 5px;
      display: block;
      width: 100%;
    }
    button:hover {
      background: #4f46e5;
    }
    .info {
      background: #f0f9ff;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
      border-left: 4px solid #6366f1;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎨 Gerador de Ícones PWA</h1>
    <div class="info">
      <p><strong>Instruções:</strong></p>
      <ol>
        <li>Clique no botão abaixo para gerar todos os ícones</li>
        <li>Os arquivos serão baixados automaticamente</li>
        <li>Salve todos os arquivos na pasta: <code>public/icons/</code></li>
      </ol>
    </div>
    <button onclick="generateAllIcons()">📥 Gerar e Baixar Todos os Ícones</button>
  </div>

  <script>
    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

    function generateIcon(size) {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      // Gradiente de fundo
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      // Emoji central
      const emojiSize = Math.floor(size * 0.5);
      ctx.font = \`bold \${emojiSize}px Arial\`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.fillText('📊', size / 2, size * 0.5);

      // Texto para tamanhos maiores
      if (size >= 192) {
        const textSize = Math.floor(size * 0.1);
        ctx.font = \`bold \${textSize}px Arial\`;
        ctx.fillText('HÁBITOS', size / 2, size * 0.75);
      }

      // Download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`icon-\${size}x\${size}.png\`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
    }

    function generateAllIcons() {
      sizes.forEach((size, index) => {
        setTimeout(() => {
          generateIcon(size);
        }, index * 300);
      });
      alert('✅ Todos os ícones foram gerados! Verifique sua pasta de downloads e mova para public/icons/');
    }
  </script>
</body>
</html>`;

  const htmlPath = path.join(__dirname, '../generate-icons-browser.html');
  fs.writeFileSync(htmlPath, htmlContent);
  console.log(`✅ Arquivo criado: generate-icons-browser.html`);
  console.log(`📝 Abra este arquivo no navegador e clique no botão para gerar os ícones\n`);
}

// Tenta primeiro com ImageMagick
const success = await generateWithImageMagick();

if (!success) {
  await generateWithBrowser();
  console.log('\n💡 Alternativa: Use o arquivo generate-icons.html que já existe no projeto\n');
}

