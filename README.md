# 📊 Hábitos Diários - PWA

Um aplicativo web progressivo (PWA) completo para acompanhar seus hábitos diários, ajudar a construir uma rotina saudável e visualizar seu progresso ao longo do tempo.

## ✨ Funcionalidades

- ✅ Criar hábitos personalizados (nome, ícone/emoji, cor)
- ✅ Marcar hábitos como completos por dia
- ✅ Visualizar streak (sequência de dias consecutivos)
- ✅ Calendário visual mostrando histórico do mês
- ✅ Estatísticas: taxa de conclusão, melhor streak, total de dias
- ✅ Resetar à meia-noite automaticamente
- ✅ Editar e deletar hábitos
- ✅ Opção de tema claro/escuro
- ✅ Funciona completamente offline
- ✅ Instalável no celular/desktop

## 🚀 Tecnologias

- **Vite** - Bundler e dev server rápido
- **JavaScript Vanilla** - Sem frameworks, código puro
- **PWA** - Service Worker e Manifest para funcionalidade offline
- **localStorage** - Armazenamento local persistente
- **CSS3** - Design moderno com gradientes e animações

## 📋 Pré-requisitos

- Node.js 18+ instalado
- pnpm instalado globalmente

## 🛠️ Instalação

1. Clone ou baixe o projeto
2. Instale as dependências:

```bash
pnpm install
```

3. Execute o servidor de desenvolvimento:

```bash
pnpm dev
```

4. Acesse `http://localhost:5173` no navegador

## 🏗️ Build para Produção

```bash
pnpm build
```

Os arquivos otimizados estarão na pasta `dist/`.

Para pré-visualizar o build:

```bash
pnpm preview
```

## 📱 Como Instalar como PWA

### Desktop (Chrome/Edge):
1. Abra o app no navegador
2. Clique no ícone de instalação na barra de endereços
3. Ou vá em Menu > Instalar app

### Mobile (Android):
1. Abra o app no Chrome
2. Toque no menu (3 pontos)
3. Selecione "Adicionar à tela inicial"

### Mobile (iOS/Safari):
1. Abra o app no Safari
2. Toque no botão Compartilhar
3. Selecione "Adicionar à Tela de Início"

## 🎨 Estrutura do Projeto

```
habitosDiarios/
├── index.html              # HTML principal
├── vite.config.js          # Configuração do Vite e PWA
├── package.json            # Dependências do projeto
├── src/
│   ├── main.js            # Ponto de entrada da aplicação
│   ├── styles/
│   │   └── style.css      # Estilos principais
│   └── modules/
│       ├── storage.js     # Gerenciamento de localStorage
│       ├── habits.js      # Lógica dos hábitos
│       └── ui.js          # Manipulação do DOM
├── public/
│   ├── manifest.json      # Manifest do PWA
│   ├── sw.js              # Service Worker (fallback)
│   └── icons/             # Ícones do PWA
└── README.md              # Este arquivo
```

## 📚 Conceitos de PWA Implementados

### 1. Service Worker
O Service Worker é um script que roda em background, permitindo:
- **Cache de recursos**: Armazena arquivos para uso offline
- **Estratégia Network First**: Tenta buscar da rede primeiro, cai no cache se falhar
- **Atualização automática**: Atualiza o cache quando há nova versão

### 2. Web App Manifest
Arquivo `manifest.json` que define:
- **Nome e descrição** do app
- **Ícones** em vários tamanhos
- **Cores do tema** e da barra de status
- **Modo de exibição**: standalone (sem barra do navegador)
- **Orientação**: portrait (retrato)

### 3. Estratégias de Cache
- **Cache First**: Para ícones e imagens estáticas
- **Network First**: Para HTML, CSS e JS (sempre tenta atualizar)
- **Runtime Caching**: Cache de recursos conforme são solicitados

### 4. Funcionalidade Offline
- Todos os recursos essenciais são cacheados
- O app funciona completamente sem conexão
- Dados são salvos no localStorage (persistente)

## 🌐 Deploy

### Vercel

1. Instale a CLI do Vercel:
```bash
npm i -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Para produção:
```bash
vercel --prod
```

### Netlify

1. Instale a CLI do Netlify:
```bash
npm i -g netlify-cli
```

2. Build do projeto:
```bash
pnpm build
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist
```

### GitHub Pages

1. Instale o plugin do GitHub Pages:
```bash
pnpm add -D gh-pages
```

2. Adicione ao `package.json`:
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

3. Build e deploy:
```bash
pnpm build
pnpm deploy
```

⚠️ **Importante**: Para GitHub Pages, você precisará ajustar o `base` no `vite.config.js`:
```js
export default defineConfig({
  base: '/nome-do-repositorio/',
  // ... resto da config
})
```

## 🔧 Configuração do Service Worker

O Vite Plugin PWA gera automaticamente o Service Worker durante o build usando Workbox. A configuração está em `vite.config.js`:

- **globPatterns**: Arquivos a serem cacheados
- **runtimeCaching**: Estratégias de cache para diferentes tipos de recursos
- **registerType**: 'autoUpdate' para atualização automática

## 💾 Armazenamento de Dados

Os dados são armazenados localmente usando `localStorage`:
- **Chave**: `habitos-diarios-data`
- **Estrutura**:
  ```json
  {
    "habits": [
      {
        "id": "habit-xxx",
        "name": "Beber água",
        "emoji": "💧",
        "color": "#06b6d4",
        "createdAt": "2024-01-15"
      }
    ],
    "history": {
      "2024-01-15": {
        "habit-xxx": true,
        "habit-yyy": false
      }
    }
  }
  ```

## 🎯 Dados de Exemplo

O app vem com 3 hábitos pré-cadastrados:
- 💧 Beber 2L de água
- 📚 Ler 30 minutos
- 🏃 Exercício físico

## 🔄 Reset Automático

O app verifica periodicamente se mudou o dia e reseta automaticamente:
- Verifica a cada minuto
- Compara a data atual com a última verificação
- Mantém histórico para visualização no calendário

## 🎨 Personalização

### Cores
Você pode personalizar as cores no arquivo `src/styles/style.css`:
- Variáveis CSS para tema claro/escuro
- Gradientes customizáveis
- Cores de destaque (primária, sucesso, erro)

### Hábitos
- Escolha qualquer emoji como ícone
- Selecione cor personalizada
- Nome livre

## 📱 Testes

### Teste Offline:
1. Abra o DevTools (F12)
2. Vá em Network > Offline
3. Recarregue a página - deve funcionar normalmente

### Teste de Instalação:
1. Verifique se o manifest.json está correto
2. Service Worker deve estar registrado
3. Ícones devem estar acessíveis

### Lighthouse (Chrome DevTools):
1. Abra DevTools > Lighthouse
2. Execute audit para PWA
3. Deve passar em todos os critérios de PWA

## 🐛 Troubleshooting

### Service Worker não registra:
- Verifique se está usando HTTPS (ou localhost)
- Limpe o cache do navegador
- Verifique o console para erros

### Dados não persistem:
- Verifique se localStorage está habilitado
- Verifique se há espaço suficiente
- Limpe dados antigos se necessário

### App não instala:
- Verifique se o manifest.json está acessível
- Ícones devem estar no tamanho correto
- Service Worker deve estar ativo

## 📝 Licença

Este projeto é de código aberto e está disponível para uso livre.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

**Desenvolvido com ❤️ usando tecnologias web modernas**

