# 🎵 Bot do Telegram - Artur Almeida

## ✅ Status Atual

**Bot criado com sucesso e funcionando!** 🎉

- ✅ Código completo implementado
- ✅ Dependências instaladas
- ✅ Servidor rodando na porta 3001
- ✅ API REST funcionando
- ✅ Token configurado
- ✅ Pronto para deploy

## 🤖 Como Usar o Bot

### 1. Encontrar o Bot no Telegram

1. Abra o Telegram
2. Procure pelo seu bot (você precisa configurar o username)
3. Inicie uma conversa

### 2. Comandos Disponíveis

```
/start    - Iniciar o bot e ver boas-vindas
/help     - Ver todos os comandos
/agenda   - Ver agenda completa de shows
/add      - Adicionar novo show (6 passos)
/remove 3 - Remover show com ID 3
/cancel   - Cancelar operação atual
```

### 3. Processo de Adicionar Show

O bot guia você através de 6 passos:

1. **Nome do evento**: "Show Acústico no Bar Central"
2. **Data**: 25/12/2024 (formato DD/MM/AAAA)
3. **Horário**: 20:30 (formato HH:MM)
4. **Local**: "Bar Central - Uberlândia, MG"
5. **Fotos**: Envie até 5 fotos (digite "pronto" ou "pular")
6. **Descrição**: Opcional (digite "pular" se não quiser)

## 🚀 Deploy no Render

### Passo 1: Preparar Repositório

```bash
# Na pasta do projeto principal
git add .
git commit -m "feat: Bot do Telegram para agenda"
git push origin main
```

### Passo 2: Configurar no Render

1. Acesse [render.com](https://render.com)
2. Crie conta/faça login
3. **New** → **Web Service**
4. Conecte GitHub e selecione seu repositório

### Passo 3: Configurações

```
Name: artur-almeida-bot
Environment: Node
Root Directory: telegram-bot
Build Command: npm install
Start Command: npm start
```

### Passo 4: Variáveis de Ambiente

```env
TELEGRAM_BOT_TOKEN=8123378032:AAFS1JYqn7itIgBec3dXgYzbzddNkABfTwU
PORT=10000
NODE_ENV=production
CORS_ORIGIN=*
```

### Passo 5: Deploy

Clique em **"Create Web Service"** e aguarde 5-10 minutos.

## 🔗 Integrar com o Site

### Atualizar Código do Site

No arquivo onde você busca eventos (provavelmente `Agenda.jsx`):

```javascript
// Substitua a URL da API
const API_URL = 'https://seu-bot.onrender.com'; // URL do Render

async function buscarEventos() {
  try {
    const response = await fetch(`${API_URL}/api/eventos`);
    const eventos = await response.json();
    return eventos;
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return []; // Fallback
  }
}
```

### Estrutura dos Dados

Cada evento terá esta estrutura:

```json
{
  "id": 1,
  "titulo": "Show Acústico",
  "data": "25/12/2024",
  "horario": "20:30",
  "local": "Bar Central - Uberlândia, MG",
  "fotos": [
    {
      "file_id": "AgACAgIAAxkBAAI...",
      "url": "https://api.telegram.org/file/bot.../photo.jpg",
      "width": 1280,
      "height": 720
    }
  ],
  "descricao": "Show acústico com MPB",
  "criadoEm": "2024-01-15T10:30:00.000Z"
}
```

## 📱 Testando o Bot

### 1. Teste Local (Agora)

O bot está rodando em `http://localhost:3001`

- Health check: `http://localhost:3001/health`
- API eventos: `http://localhost:3001/api/eventos`

### 2. Teste no Telegram

1. Procure seu bot no Telegram
2. Digite `/start`
3. Teste `/help`
4. Teste `/add` para adicionar um evento
5. Teste `/agenda` para ver o evento

### 3. Teste Pós-Deploy

```bash
# Substitua pela URL do Render
curl https://seu-bot.onrender.com/health
curl https://seu-bot.onrender.com/api/eventos
```

## 📁 Arquivos Criados

```
telegram-bot/
├── server.js          # 🤖 Código principal do bot
├── package.json       # 📦 Dependências
├── .env              # 🔐 Configurações locais
├── .env.example      # 📋 Exemplo de config
├── README.md         # 📖 Documentação completa
├── DEPLOY.md         # 🚀 Guia de deploy
├── INSTRUCOES.md     # 📝 Este arquivo
└── test-api.js       # 🧪 Teste da API
```

## 🎯 Próximos Passos

### Imediato
1. ✅ **Testar bot localmente** (já funcionando)
2. 🔄 **Fazer deploy no Render**
3. 🔗 **Integrar com o site**
4. 📱 **Testar no Telegram**

### Futuro
1. 🔔 **Notificações automáticas**
2. 📊 **Dashboard de estatísticas**
3. 🎫 **Sistema de ingressos**
4. 📧 **Newsletter automática**

## 🆘 Suporte

### Problemas Comuns

**Bot não responde:**
- Verifique se o token está correto
- Confirme se o servidor está rodando
- Veja os logs no Render

**Site não carrega eventos:**
- Verifique a URL da API
- Confirme CORS no Render
- Teste a API diretamente

**Deploy falha:**
- Verifique se está na pasta `telegram-bot`
- Confirme se o `package.json` está correto
- Veja os logs de build no Render

### Logs Úteis

```bash
# Ver logs do Render
# Acesse dashboard.render.com → seu serviço → Logs

# Testar API local
node test-api.js

# Ver eventos salvos
cat eventos.json
```

## 🎉 Conclusão

**Seu bot está pronto!** 🚀

Você agora tem:
- ✅ Bot completo funcionando
- ✅ API REST para o site
- ✅ Sistema de fotos
- ✅ Comandos intuitivos
- ✅ Pronto para deploy

**Próximo passo:** Fazer o deploy no Render e integrar com seu site!

---

**🎵 Bot do Artur Almeida - Criado com sucesso!**