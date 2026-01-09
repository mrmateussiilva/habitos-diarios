import fs from 'fs';
import { createCanvas } from 'canvas';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

// Cria o diretório se não existir
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Fundo com gradiente roxo/azul
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Emoji central
  const emojiSize = Math.floor(size * 0.5);
  ctx.font = `bold ${emojiSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';
  ctx.fillText('📊', size / 2, size * 0.5);

  // Texto (apenas para tamanhos maiores)
  if (size >= 192) {
    const textSize = Math.floor(size * 0.1);
    ctx.font = `bold ${textSize}px Arial`;
    ctx.fillText('HÁBITOS', size / 2, size * 0.75);
  }

  // Salva o arquivo
  const buffer = canvas.toBuffer('image/png');
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);
  fs.writeFileSync(filepath, buffer);
  console.log(`✅ Gerado: ${filename}`);
}

console.log('🎨 Gerando ícones PWA...\n');

sizes.forEach(size => {
  try {
    generateIcon(size);
  } catch (error) {
    console.error(`❌ Erro ao gerar ícone ${size}x${size}:`, error.message);
  }
});

console.log('\n✨ Todos os ícones foram gerados com sucesso!');
console.log(`📁 Localização: ${iconsDir}`);

