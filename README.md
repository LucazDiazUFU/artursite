# 🎵 Bot do Telegram - Artur Almeida

Bot para gerenciar a agenda de shows do Artur Almeida, integrado com o site oficial.

## 📋 Funcionalidades

- **📅 Visualizar Agenda**: Ver todos os shows agendados
- **➕ Adicionar Shows**: Processo passo a passo intuitivo
- **🗑️ Remover Shows**: Remover eventos por ID
- **📸 Upload de Fotos**: Até 5 fotos por evento
- **🔄 Sincronização**: API REST para integração com o site
- **❓ Sistema de Ajuda**: Comandos e instruções detalhadas

## 🚀 Instalação Local

### Pré-requisitos
- Node.js 16+ instalado
- Token do bot do Telegram

### Passos

1. **Clone e navegue para a pasta:**
```bash
cd telegram-bot
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

4. **Edite o arquivo `.env` com suas configurações:**
```env
TELEGRAM_BOT_TOKEN=seu_token_aqui
PORT=3001
NODE_ENV=development
```

5. **Execute o bot:**
```bash
npm run dev
```

## 🌐 Deploy no Render

### 1. Preparação

1. Faça commit de todos os arquivos no Git
2. Suba para um repositório no GitHub

### 2. Configuração no Render

1. Acesse [render.com](https://render.com)
2. Conecte sua conta GitHub
3. Clique em "New" → "Web Service"
4. Selecione seu repositório
5. Configure:
   - **Name**: `artur-almeida-bot`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `telegram-bot`

### 3. Variáveis de Ambiente no Render

Adicione as seguintes variáveis:

```
TELEGRAM_BOT_TOKEN=8123378032:AAFS1JYqn7itIgBec3dXgYzbzddNkABfTwU
PORT=10000
NODE_ENV=production
CORS_ORIGIN=https://seusite.com
```

### 4. Deploy

1. Clique em "Create Web Service"
2. Aguarde o deploy (5-10 minutos)
3. Anote a URL gerada (ex: `https://artur-almeida-bot.onrender.com`)

## 🔗 Integração com o Site

### API Endpoints

- **GET** `/api/eventos` - Lista todos os eventos
- **GET** `/health` - Status do servidor

### Exemplo de Integração

```javascript
// No seu site (React/JavaScript)
const API_URL = 'https://artur-almeida-bot.onrender.com';

async function buscarEventos() {
  try {
    const response = await fetch(`${API_URL}/api/eventos`);
    const eventos = await response.json();
    return eventos;
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return [];
  }
}
```

### Estrutura dos Dados

```json
{
  "id": 1,
  "titulo": "Show Acústico no Bar Central",
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
  "descricao": "Show acústico com repertório de MPB",
  "criadoEm": "2024-01-15T10:30:00.000Z"
}
```

## 🤖 Comandos do Bot

### Comandos Principais

- `/start` - Iniciar o bot e ver boas-vindas
- `/help` - Ver todos os comandos disponíveis
- `/agenda` - Visualizar agenda completa
- `/add` - Adicionar novo show (6 passos)
- `/remove [ID]` - Remover show específico
- `/cancel` - Cancelar operação atual

### Processo de Adição (6 Passos)

1. **Nome do Evento**: Título do show
2. **Data**: Formato DD/MM/AAAA (data futura)
3. **Horário**: Formato HH:MM (24h)
4. **Local**: Nome e endereço do local
5. **Fotos**: Até 5 fotos do ambiente (opcional)
6. **Descrição**: Detalhes adicionais (opcional)

### Comandos Durante Upload

- `"pronto"` - Finalizar upload de fotos
- `"pular"` - Pular etapa de fotos ou descrição

## 📁 Estrutura de Arquivos

```
telegram-bot/
├── server.js          # Código principal do bot
├── package.json       # Dependências e scripts
├── .env              # Variáveis de ambiente (local)
├── .env.example      # Exemplo de configuração
├── eventos.json      # Banco de dados dos eventos
└── README.md         # Esta documentação
```

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
npm start     # Produção
npm run dev   # Desenvolvimento com nodemon
```

### Logs e Debugging

O bot gera logs detalhados:

```
🎵 Bot do Artur Almeida iniciado!
🚀 Servidor rodando na porta 3001
📡 API disponível em http://localhost:3001/api/eventos
💚 Health check em http://localhost:3001/health
```

### Estrutura do Estado

O bot mantém estado por usuário durante a adição:

```javascript
{
  estado: 'waiting_title',
  evento: {
    titulo: '',
    data: '',
    horario: '',
    local: '',
    fotos: [],
    descricao: ''
  }
}
```

## 🛡️ Segurança

- Token do bot protegido por variáveis de ambiente
- Validação de dados de entrada
- Rate limiting automático do Telegram
- CORS configurável
- Tratamento de erros robusto

## 📱 Compatibilidade

- ✅ Telegram Web
- ✅ Telegram Mobile (iOS/Android)
- ✅ Telegram Desktop
- ✅ Todos os tipos de chat (privado, grupo)

## 🐛 Troubleshooting

### Bot não responde
1. Verifique se o token está correto
2. Confirme se o bot está rodando
3. Verifique os logs do servidor

### Fotos não carregam
1. Verifique conexão com a API do Telegram
2. Confirme se as URLs das fotos estão acessíveis
3. Verifique se o token tem permissões

### API não retorna dados
1. Verifique se o arquivo `eventos.json` existe
2. Confirme se o servidor está rodando
3. Teste o endpoint `/health`

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs do servidor
2. Teste os endpoints da API
3. Confirme as configurações do Render

---

**Desenvolvido para Artur Almeida** 🎵

*Bot criado para facilitar o gerenciamento da agenda de shows e integração com o site oficial.*