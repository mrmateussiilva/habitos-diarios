# 🚀 Guia de Deploy - Hábitos Diários PWA

Este guia explica como fazer deploy do PWA em diferentes plataformas.

## 📋 Pré-requisitos

Antes de fazer deploy, certifique-se de:

1. ✅ Fazer build do projeto: `pnpm build`
2. ✅ Testar localmente: `pnpm preview`
3. ✅ Verificar que os ícones existem na pasta `public/icons/`
4. ✅ Testar funcionamento offline
5. ✅ Executar Lighthouse audit

## 🌐 Vercel (Recomendado)

Vercel é uma das plataformas mais populares para deploy de sites estáticos.

### Via CLI:

1. **Instalar Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login:**
```bash
vercel login
```

3. **Deploy:**
```bash
cd habitosDiarios
pnpm build
vercel
```

4. **Deploy em Produção:**
```bash
vercel --prod
```

### Via Interface Web:

1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub/GitLab
3. Configure:
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`
4. Deploy automático a cada push

### Vantagens:
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Deploy automático via Git
- ✅ Preview deployments
- ✅ Grátis para projetos pessoais

## 🌐 Netlify

Netlify é outra excelente opção para PWAs.

### Via CLI:

1. **Instalar Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Login:**
```bash
netlify login
```

3. **Build e Deploy:**
```bash
pnpm build
netlify deploy --prod --dir=dist
```

### Via Interface Web:

1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta `dist` para a área de deploy
3. Ou conecte repositório Git

### Configurar Build (netlify.toml):

Crie um arquivo `netlify.toml` na raiz:

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Vantagens:
- ✅ HTTPS automático
- ✅ Formulários e funções serverless
- ✅ Deploy automático
- ✅ Grátis para projetos pessoais

## 📦 GitHub Pages

Ideal se você já usa GitHub.

### Método 1: Via gh-pages

1. **Instalar gh-pages:**
```bash
pnpm add -d gh-pages
```

2. **Adicionar script ao package.json:**
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Ajustar vite.config.js:**
```javascript
export default defineConfig({
  base: '/nome-do-repositorio/', // Nome do seu repositório
  // ... resto da config
})
```

4. **Build e Deploy:**
```bash
pnpm build
pnpm deploy
```

### Método 2: Via GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Setup pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Build
      run: pnpm build
    
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Configurar no GitHub:

1. Repositório > Settings > Pages
2. Source: `gh-pages` branch
3. Acesse em: `https://seu-usuario.github.io/nome-do-repo`

### Vantagens:
- ✅ Grátis
- ✅ Integrado ao GitHub
- ✅ Deploy automático via Actions

### ⚠️ Limitação:
- ❌ HTTPS mas sem certificado customizado
- ❌ Sem servidor (apenas estático)

## 🔵 Azure Static Web Apps

Para projetos empresariais.

### Via CLI:

1. **Instalar Azure CLI:**
```bash
# Windows
winget install -e --id Microsoft.AzureCLI

# Mac
brew install azure-cli

# Linux
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

2. **Login:**
```bash
az login
```

3. **Criar Static Web App:**
```bash
az staticwebapp create \
  --name habitos-diarios \
  --resource-group myResourceGroup \
  --source . \
  --location "East US" \
  --branch main \
  --app-location "/" \
  --output-location "dist"
```

## 🔶 Firebase Hosting

Ótimo para integração com outros serviços Firebase.

### Setup:

1. **Instalar Firebase CLI:**
```bash
npm install -g firebase-tools
```

2. **Login:**
```bash
firebase login
```

3. **Inicializar:**
```bash
firebase init hosting
```

4. **Configurar (firebase.json):**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/service-worker.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ]
  }
}
```

5. **Deploy:**
```bash
pnpm build
firebase deploy --only hosting
```

## 📝 Checklist de Deploy

Antes de fazer deploy, verifique:

- [ ] Build executado com sucesso
- [ ] Arquivos em `dist/` estão corretos
- [ ] Ícones existem e estão acessíveis
- [ ] Manifest.json está correto
- [ ] Service Worker está registrado
- [ ] Testado localmente (`pnpm preview`)
- [ ] HTTPS configurado (obrigatório para PWA)
- [ ] Domínio customizado (opcional mas recomendado)
- [ ] Redirects configurados (SPA routing)
- [ ] Cache headers configurados

## 🔧 Configurações Pós-Deploy

### 1. Verificar Service Worker

Após o deploy:
1. Abra o app no navegador
2. DevTools > Application > Service Workers
3. Deve mostrar "activated and running"

### 2. Testar Instalação

1. Verifique se aparece opção de instalar
2. Teste em diferentes dispositivos
3. Verifique se os ícones aparecem corretamente

### 3. Lighthouse Audit

1. Execute Lighthouse audit no ambiente de produção
2. Deve passar em todos os critérios de PWA
3. Score deve ser > 90

### 4. Monitorar Erros

- Verifique console do navegador
- Monitore erros de Service Worker
- Verifique logs de deploy

## 🌍 Configurar Domínio Customizado

### Vercel:

1. Project > Settings > Domains
2. Adicione seu domínio
3. Configure DNS conforme instruções

### Netlify:

1. Site > Domain settings
2. Add custom domain
3. Configure DNS

### Firebase:

1. Hosting > Add custom domain
2. Configure DNS
3. Aguarde verificação SSL

## 📊 Monitoramento

### Google Analytics (Opcional):

Adicione ao `index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Vercel Analytics:

Já integrado se usar Vercel.

## 🔄 Atualizações Automáticas

O Service Worker atualiza automaticamente quando há nova versão. Para forçar atualização:

1. **Opção 1**: Aguardar usuário fechar todas as abas
2. **Opção 2**: Implementar prompt de atualização no código

Exemplo:

```javascript
// Em main.js
navigator.serviceWorker.addEventListener('controllerchange', () => {
  if (confirm('Nova versão disponível! Recarregar?')) {
    window.location.reload();
  }
});
```

## ⚡ Performance

Após deploy, verifique:

1. **PageSpeed Insights**: https://pagespeed.web.dev/
2. **WebPageTest**: https://www.webpagetest.org/
3. **Lighthouse CI**: Automatize testes de performance

## 🐛 Troubleshooting Pós-Deploy

### Service Worker não atualiza:

1. Limpe cache do navegador
2. Desregistre Service Worker antigo
3. Force atualização (Ctrl+Shift+R)

### Ícones não aparecem:

1. Verifique caminhos (devem ser relativos)
2. Verifique se arquivos existem em produção
3. Verifique permissões de arquivo

### App não funciona offline:

1. Verifique se Service Worker está registrado
2. Verifique Cache Storage no DevTools
3. Verifique se recursos estão sendo cacheados

## 📚 Recursos Úteis

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [GitHub Pages](https://pages.github.com/)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/)

---

**Boa sorte com o deploy! 🚀**

