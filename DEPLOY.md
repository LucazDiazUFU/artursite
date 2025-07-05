# 🚀 Deploy no Render - Bot Artur Almeida

Guia passo a passo para fazer deploy do bot no Render e integrar com o site.

## 📋 Pré-requisitos

- [ ] Conta no [Render.com](https://render.com)
- [ ] Repositório no GitHub com o código do bot
- [ ] Token do bot do Telegram: `8123378032:AAFS1JYqn7itIgBec3dXgYzbzddNkABfTwU`

## 🔧 Preparação do Código

### 1. Commit e Push para GitHub

```bash
# Na pasta telegram-bot
git add .
git commit -m "feat: Bot do Telegram para agenda do Artur Almeida"
git push origin main
```

### 2. Estrutura Final dos Arquivos

```
telegram-bot/
├── server.js          # ✅ Código principal
├── package.json       # ✅ Dependências
├── .env.example       # ✅ Exemplo de config
├── README.md          # ✅ Documentação
└── DEPLOY.md          # ✅ Este arquivo
```

## 🌐 Configuração no Render

### Passo 1: Criar Web Service

1. Acesse [render.com](https://render.com)
2. Faça login/cadastro
3. Clique em **"New"** → **"Web Service"
4. Conecte sua conta GitHub
5. Selecione o repositório do projeto

### Passo 2: Configurações Básicas

```
Name: artur-almeida-bot
Environment: Node
Region: Oregon (US West)
Branch: main
Root Directory: telegram-bot
Runtime: Node
```

### Passo 3: Build & Deploy Settings

```
Build Command: npm install
Start Command: npm start
```

### Passo 4: Variáveis de Ambiente

Adicione estas variáveis na seção **Environment**:

```env
TELEGRAM_BOT_TOKEN=8123378032:AAFS1JYqn7itIgBec3dXgYzbzddNkABfTwU
PORT=10000
NODE_ENV=production
CORS_ORIGIN=*
MAX_PHOTOS=5
MAX_FILE_SIZE=20971520
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### Passo 5: Deploy

1. Clique em **"Create Web Service"**
2. Aguarde o build (5-10 minutos)
3. Anote a URL gerada (ex: `https://artur-almeida-bot.onrender.com`)

## 🔗 Integração com o Site

### Atualizar o Site (Hostinger)

No arquivo onde você busca os eventos, substitua a URL da API:

```javascript
// Antes (dados locais)
const eventos = await import('./dados/eventos.json');

// Depois (API do bot)
const API_URL = 'https://artur-almeida-bot.onrender.com';

async function buscarEventos() {
  try {
    const response = await fetch(`${API_URL}/api/eventos`);
    if (!response.ok) throw new Error('Erro na API');
    const eventos = await response.json();
    return eventos;
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    // Fallback para dados locais se necessário
    return [];
  }
}
```

### Exemplo de Integração Completa

```javascript
// No componente Agenda.jsx
import { useState, useEffect } from 'react';

const API_URL = 'https://artur-almeida-bot.onrender.com';

function PaginaAgenda() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarEventos() {
      try {
        setCarregando(true);
        const response = await fetch(`${API_URL}/api/eventos`);
        
        if (!response.ok) {
          throw new Error('Erro ao carregar eventos');
        }
        
        const dadosEventos = await response.json();
        setEventos(dadosEventos);
        setErro(null);
      } catch (error) {
        console.error('Erro:', error);
        setErro('Erro ao carregar agenda');
        // Fallback para dados locais se necessário
        setEventos([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarEventos();
  }, []);

  // Resto do componente...
}
```

## 🧪 Testes Pós-Deploy

### 1. Testar API

```bash
# Health check
curl https://artur-almeida-bot.onrender.com/health

# Listar eventos
curl https://artur-almeida-bot.onrender.com/api/eventos
```

### 2. Testar Bot no Telegram

1. Abra o Telegram
2. Procure pelo bot: `@seu_bot_username`
3. Teste os comandos:
   - `/start`
   - `/help`
   - `/agenda`
   - `/add`

### 3. Testar Integração

1. Adicione um evento pelo bot
2. Verifique se aparece no site
3. Teste as fotos nos cards

## 🔧 Configurações Avançadas

### Auto-Deploy

O Render fará deploy automático a cada push para `main`.

### Logs e Monitoramento

1. Acesse o dashboard do Render
2. Clique no seu serviço
3. Vá em **"Logs"** para ver os logs em tempo real

### Backup dos Dados

Os eventos ficam em `eventos.json`. Para backup:

```bash
# Baixar backup via API
curl https://artur-almeida-bot.onrender.com/api/eventos > backup-eventos.json
```

## 🚨 Troubleshooting

### Bot não responde

1. **Verifique os logs no Render**
2. **Confirme o token**: Deve estar correto nas variáveis de ambiente
3. **Teste a API**: `curl https://seu-bot.onrender.com/health`

### Site não carrega eventos

1. **CORS**: Verifique se `CORS_ORIGIN=*` está configurado
2. **URL da API**: Confirme se está usando a URL correta do Render
3. **Network**: Verifique no DevTools se há erros de rede

### Deploy falha

1. **Build logs**: Verifique os logs de build no Render
2. **package.json**: Confirme se está na pasta `telegram-bot`
3. **Node version**: Render usa Node 18+ por padrão

### Fotos não aparecem

1. **URLs das fotos**: Devem ser acessíveis publicamente
2. **Token do bot**: Deve ter permissões para acessar arquivos
3. **HTTPS**: Certifique-se que as URLs são HTTPS

## 📱 URLs Importantes

```
🌐 Site: https://seusite.hostinger.com
🤖 Bot API: https://artur-almeida-bot.onrender.com
📊 Health: https://artur-almeida-bot.onrender.com/health
📅 Eventos: https://artur-almeida-bot.onrender.com/api/eventos
🔧 Dashboard: https://dashboard.render.com
```

## ✅ Checklist Final

- [ ] Bot respondendo no Telegram
- [ ] API retornando dados
- [ ] Site carregando eventos da API
- [ ] Fotos aparecendo nos cards
- [ ] Comandos funcionando
- [ ] Deploy automático configurado

---

**🎵 Bot pronto para uso!**

*Agora você pode gerenciar a agenda do Artur Almeida diretamente pelo Telegram!*