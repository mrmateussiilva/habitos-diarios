# 📦 Guia de Instalação - Hábitos Diários PWA

Este guia contém instruções detalhadas para instalar, configurar e executar o aplicativo.

## 🚀 Início Rápido

### 1. Instalar pnpm (se ainda não tiver)

```bash
# Via npm
npm install -g pnpm

# Ou via curl (Linux/Mac)
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Ou via PowerShell (Windows)
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

### 2. Instalar Dependências

```bash
cd habitosDiarios
pnpm install
```

### 3. Executar em Desenvolvimento

```bash
pnpm dev
```

O app estará disponível em `http://localhost:5173`

## 🎨 Gerar Ícones do PWA

Para que o PWA funcione completamente, você precisa dos ícones. Existem duas opções:

### Opção 1: Usar o Gerador HTML (Recomendado)

1. Abra o arquivo `generate-icons.html` no navegador
2. Clique em "Gerar Ícone Padrão"
3. Clique em "Baixar Todos os Ícones"
4. Salve os arquivos na pasta `public/icons/`

Os arquivos devem ter os nomes:
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

### Opção 2: Criar Manualmente

Você pode usar qualquer editor de imagens (Figma, Photoshop, GIMP, etc.) para criar os ícones:

1. Crie um ícone 512x512px (tamanho base)
2. Exporte/Redimensione para todos os tamanhos necessários
3. Salve na pasta `public/icons/` com os nomes corretos

**Dica**: Use cores vibrantes e um ícone simples que funcione bem em tamanhos pequenos.

## 🔧 Configuração Avançada

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto se precisar configurar:

```env
# Exemplo (atualmente não usado, mas pode ser adicionado)
VITE_APP_NAME="Hábitos Diários"
VITE_APP_VERSION="1.0.0"
```

### Personalizar Cores do Tema

Edite `src/styles/style.css` e modifique as variáveis CSS:

```css
:root {
  --primary-color: #6366f1;  /* Sua cor primária */
  --success-color: #10b981;  /* Cor de sucesso */
  /* ... outras cores */
}
```

### Personalizar Manifest do PWA

Edite `vite.config.js` na seção `manifest`:

```js
manifest: {
  name: 'Seu Nome do App',
  short_name: 'Seu Short Name',
  theme_color: '#6366f1',
  // ... outras configurações
}
```

## 🏗️ Build para Produção

### Build Padrão

```bash
pnpm build
```

Os arquivos estarão na pasta `dist/`

### Build com Análise

```bash
# Para ver o tamanho dos arquivos
pnpm build --mode analyze
```

### Preview do Build

```bash
pnpm preview
```

Isso iniciará um servidor local servindo os arquivos da pasta `dist/`

## 📱 Testando Funcionalidades PWA

### 1. Testar Offline

1. Abra o app no navegador
2. Abra DevTools (F12)
3. Vá na aba "Network"
4. Marque "Offline"
5. Recarregue a página - deve funcionar normalmente

### 2. Testar Instalação

#### Chrome/Edge Desktop:
- Procure pelo ícone de instalação (➕) na barra de endereços
- Ou vá em Menu (⋮) > Instalar "Hábitos Diários"

#### Android:
- Abra no Chrome
- Menu (⋮) > "Adicionar à tela inicial"

#### iOS Safari:
- Abra no Safari
- Botão Compartilhar (□↑) > "Adicionar à Tela de Início"

### 3. Lighthouse Audit

1. Abra DevTools (F12)
2. Vá na aba "Lighthouse"
3. Marque "Progressive Web App"
4. Clique em "Generate report"
5. Deve passar em todos os critérios de PWA

**Critérios esperados:**
- ✅ Service Worker registrado
- ✅ Manifest válido
- ✅ Ícones corretos
- ✅ HTTPS (ou localhost)
- ✅ Viewport configurado
- ✅ Responsivo

## 🐛 Troubleshooting

### Erro: "Cannot find module"

```bash
# Limpe node_modules e reinstale
rm -rf node_modules
pnpm install
```

### Service Worker não registra

1. Verifique se está usando HTTPS ou localhost
2. Limpe o cache do navegador (Ctrl+Shift+Del)
3. Verifique o console para erros
4. Desregistre service workers antigos:
   - DevTools > Application > Service Workers > Unregister

### Ícones não aparecem

1. Verifique se os arquivos estão em `public/icons/`
2. Verifique se os nomes estão corretos (case-sensitive)
3. Verifique se os tamanhos estão corretos
4. Limpe o cache do navegador

### Dados não persistem

1. Verifique se localStorage está habilitado
2. Verifique se há espaço suficiente
3. Abra DevTools > Application > Local Storage
4. Verifique se a chave `habitos-diarios-data` existe

### App não instala

1. Verifique se o manifest.json está acessível
2. Verifique se os ícones existem
3. Verifique se o Service Worker está ativo
4. Execute Lighthouse audit para ver erros específicos

## 📚 Recursos Adicionais

- [Documentação do Vite](https://vitejs.dev/)
- [Vite Plugin PWA](https://vite-pwa-org.netlify.app/)
- [MDN - Progressive Web Apps](https://developer.mozilla.org/pt-BR/docs/Web/Progressive_web_apps)
- [Web.dev - PWA Checklist](https://web.dev/pwa-checklist/)

## 💡 Dicas

1. **Desenvolvimento**: Use `pnpm dev` para desenvolvimento rápido
2. **Build**: Sempre teste o build de produção antes de fazer deploy
3. **Cache**: Limpe o cache do navegador regularmente durante desenvolvimento
4. **Ícones**: Mantenha os ícones simples e reconhecíveis em tamanhos pequenos
5. **Manifest**: Atualize o manifest sempre que mudar cores ou nome do app

## 🆘 Precisa de Ajuda?

- Verifique o README.md principal
- Abra uma issue no repositório
- Consulte a documentação das tecnologias usadas

---

**Boa sorte com seu PWA! 🚀**

