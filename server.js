require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

// Configurações
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PORT = process.env.PORT || 3001;
const EVENTOS_FILE = path.join(__dirname, 'eventos.json');

// Validação do token
if (!BOT_TOKEN) {
  console.error('❌ ERRO: Token do bot não encontrado!');
  console.error('Configure a variável TELEGRAM_BOT_TOKEN no arquivo .env');
  process.exit(1);
}

// Inicializar bot e servidor
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const app = express();

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Estados da conversa
const ESTADOS = {
  IDLE: 'idle',
  WAITING_TITLE: 'waiting_title',
  WAITING_DATE: 'waiting_date',
  WAITING_TIME: 'waiting_time',
  WAITING_LOCATION: 'waiting_location',
  WAITING_PHOTOS: 'waiting_photos',
  WAITING_DESCRIPTION: 'waiting_description'
};

// Armazenar estado dos usuários
const userStates = new Map();

// Função para carregar eventos
async function carregarEventos() {
  try {
    const data = await fs.readFile(EVENTOS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('📁 Criando arquivo de eventos...');
    await salvarEventos([]);
    return [];
  }
}

// Função para salvar eventos
async function salvarEventos(eventos) {
  try {
    await fs.writeFile(EVENTOS_FILE, JSON.stringify(eventos, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar eventos:', error);
    return false;
  }
}

// Função para gerar próximo ID
async function gerarProximoId() {
  const eventos = await carregarEventos();
  return eventos.length > 0 ? Math.max(...eventos.map(e => e.id)) + 1 : 1;
}

// Função para formatar data
function formatarData(dataString) {
  const [dia, mes, ano] = dataString.split('/');
  const data = new Date(ano, mes - 1, dia);
  const opcoes = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return data.toLocaleDateString('pt-BR', opcoes);
}

// Função para validar data
function validarData(dataString) {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(dataString)) return false;
  
  const [, dia, mes, ano] = dataString.match(regex);
  const data = new Date(ano, mes - 1, dia);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  return data >= hoje && 
         data.getDate() == dia && 
         data.getMonth() == mes - 1 && 
         data.getFullYear() == ano;
}

// Função para validar horário
function validarHorario(horarioString) {
  const regex = /^([01]?\d|2[0-3]):([0-5]\d)$/;
  return regex.test(horarioString);
}

// Comando /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const nomeUsuario = msg.from.first_name || 'Usuário';
  
  const mensagemBemVindo = `🎵 Olá, ${nomeUsuario}! Bem-vindo ao Bot de Agenda do Artur Almeida!

` +
    `Eu posso ajudar você a gerenciar a agenda de shows. Aqui estão os comandos disponíveis:

` +
    `📅 /agenda - Ver todos os shows agendados
` +
    `➕ /add - Adicionar um novo show
` +
    `🗑️ /remove [ID] - Remover um show específico
` +
    `❓ /help - Ver todos os comandos
` +
    `❌ /cancel - Cancelar operação atual

` +
    `Digite um comando para começar! 🚀`;
  
  await bot.sendMessage(chatId, mensagemBemVindo);
});

// Comando /help
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  
  const mensagemAjuda = `🎵 *Comandos do Bot - Artur Almeida*

` +
    `📅 */agenda* - Visualizar todos os shows agendados
` +
    `   Mostra lista completa com datas, locais e detalhes

` +
    `➕ */add* - Adicionar novo show (6 passos)
` +
    `   1️⃣ Nome do evento
` +
    `   2️⃣ Data (DD/MM/AAAA)
` +
    `   3️⃣ Horário (HH:MM)
` +
    `   4️⃣ Local do evento
` +
    `   5️⃣ Fotos do ambiente (até 5 fotos)
` +
    `   6️⃣ Descrição (opcional)

` +
    `🗑️ */remove [ID]* - Remover show específico
` +
    `   Exemplo: /remove 3

` +
    `❌ */cancel* - Cancelar operação atual
` +
    `   Use quando quiser parar um processo

` +
    `💡 *Dicas:*
` +
    `• Durante o upload de fotos, digite "pronto" para finalizar
` +
    `• Digite "pular" para pular o envio de fotos
` +
    `• Use datas futuras no formato DD/MM/AAAA
` +
    `• Horários no formato 24h (HH:MM)`;
  
  await bot.sendMessage(chatId, mensagemAjuda, { parse_mode: 'Markdown' });
});

// Comando /agenda
bot.onText(/\/agenda/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    const eventos = await carregarEventos();
    
    if (eventos.length === 0) {
      await bot.sendMessage(chatId, 
        `📅 *Agenda de Shows - Artur Almeida*

` +
        `Nenhum show agendado no momento.

` +
        `Use /add para adicionar um novo show! 🎵`,
        { parse_mode: 'Markdown' }
      );
      return;
    }
    
    // Ordenar eventos por data
    eventos.sort((a, b) => {
      const [diaA, mesA, anoA] = a.data.split('/');
      const [diaB, mesB, anoB] = b.data.split('/');
      const dataA = new Date(anoA, mesA - 1, diaA);
      const dataB = new Date(anoB, mesB - 1, diaB);
      return dataA - dataB;
    });
    
    let mensagem = `📅 *Agenda de Shows - Artur Almeida*

`;
    
    eventos.forEach((evento, index) => {
      const dataFormatada = formatarData(evento.data);
      const totalFotos = evento.fotos ? evento.fotos.length : 0;
      
      mensagem += `🎵 *${evento.titulo}*
`;
      mensagem += `📅 ${dataFormatada} às ${evento.horario}
`;
      mensagem += `📍 ${evento.local}
`;
      if (totalFotos > 0) {
        mensagem += `📸 ${totalFotos} foto${totalFotos > 1 ? 's' : ''} do ambiente
`;
      }
      if (evento.descricao) {
        mensagem += `📝 ${evento.descricao}
`;
      }
      mensagem += `🆔 ID: ${evento.id}
`;
      
      if (index < eventos.length - 1) {
        mensagem += `
${'─'.repeat(30)}

`;
      }
    });
    
    mensagem += `

💡 Use /remove [ID] para remover um show`;
    
    await bot.sendMessage(chatId, mensagem, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('❌ Erro ao buscar agenda:', error);
    await bot.sendMessage(chatId, '❌ Erro ao carregar agenda. Tente novamente.');
  }
});

// Comando /add
bot.onText(/\/add/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Inicializar estado do usuário
  userStates.set(userId, {
    estado: ESTADOS.WAITING_TITLE,
    evento: {
      fotos: []
    }
  });
  
  await bot.sendMessage(chatId, 
    `🎵 *Adicionar Novo Show - Passo 1 de 6*

` +
    `Digite o *nome do evento*:

` +
    `Exemplo: "Show Acústico no Bar Central"

` +
    `❌ Digite /cancel para cancelar`,
    { parse_mode: 'Markdown' }
  );
});

// Comando /remove
bot.onText(/\/remove (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const eventoId = parseInt(match[1]);
  
  try {
    const eventos = await carregarEventos();
    const eventoIndex = eventos.findIndex(e => e.id === eventoId);
    
    if (eventoIndex === -1) {
      await bot.sendMessage(chatId, `❌ Show com ID ${eventoId} não encontrado.`);
      return;
    }
    
    const eventoRemovido = eventos[eventoIndex];
    eventos.splice(eventoIndex, 1);
    
    const sucesso = await salvarEventos(eventos);
    
    if (sucesso) {
      await bot.sendMessage(chatId, 
        `✅ *Show removido com sucesso!*

` +
        `🎵 ${eventoRemovido.titulo}
` +
        `📅 ${eventoRemovido.data} às ${eventoRemovido.horario}
` +
        `📍 ${eventoRemovido.local}`,
        { parse_mode: 'Markdown' }
      );
    } else {
      await bot.sendMessage(chatId, '❌ Erro ao remover show. Tente novamente.');
    }
    
  } catch (error) {
    console.error('❌ Erro ao remover evento:', error);
    await bot.sendMessage(chatId, '❌ Erro ao remover show. Tente novamente.');
  }
});

// Comando /cancel
bot.onText(/\/cancel/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (userStates.has(userId)) {
    userStates.delete(userId);
    await bot.sendMessage(chatId, '❌ Operação cancelada. Use /help para ver os comandos disponíveis.');
  } else {
    await bot.sendMessage(chatId, '💡 Nenhuma operação em andamento para cancelar.');
  }
});

// Handler para fotos
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userState = userStates.get(userId);
  
  if (!userState || userState.estado !== ESTADOS.WAITING_PHOTOS) {
    await bot.sendMessage(chatId, '💡 Envie fotos apenas durante o processo de adição de shows. Use /add para começar.');
    return;
  }
  
  // Verificar limite de fotos
  if (userState.evento.fotos.length >= 5) {
    await bot.sendMessage(chatId, '📸 Limite máximo de 5 fotos atingido. Digite "pronto" para continuar.');
    return;
  }
  
  try {
    // Pegar a foto de maior resolução
    const foto = msg.photo[msg.photo.length - 1];
    const fileInfo = await bot.getFile(foto.file_id);
    const fotoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileInfo.file_path}`;
    
    // Armazenar informações da foto
    userState.evento.fotos.push({
      file_id: foto.file_id,
      url: fotoUrl,
      width: foto.width,
      height: foto.height
    });
    
    const totalFotos = userState.evento.fotos.length;
    await bot.sendMessage(chatId, 
      `📸 Foto ${totalFotos}/5 recebida com sucesso!

` +
      `${totalFotos < 5 ? 'Envie mais fotos ou ' : ''}Digite "pronto" para continuar.`
    );
    
  } catch (error) {
    console.error('❌ Erro ao processar foto:', error);
    await bot.sendMessage(chatId, '❌ Erro ao processar foto. Tente enviar novamente.');
  }
});

// Handler principal para mensagens de texto
bot.on('message', async (msg) => {
  // Ignorar comandos e fotos (já tratados)
  if (msg.text && msg.text.startsWith('/')) return;
  if (msg.photo) return;
  
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const texto = msg.text;
  const userState = userStates.get(userId);
  
  if (!userState || userState.estado === ESTADOS.IDLE) {
    await bot.sendMessage(chatId, '💡 Use /help para ver os comandos disponíveis.');
    return;
  }
  
  // Processar baseado no estado atual
  switch (userState.estado) {
    case ESTADOS.WAITING_TITLE:
      await handleTitleInput(chatId, userId, texto, userState);
      break;
    case ESTADOS.WAITING_DATE:
      await handleDateInput(chatId, userId, texto, userState);
      break;
    case ESTADOS.WAITING_TIME:
      await handleTimeInput(chatId, userId, texto, userState);
      break;
    case ESTADOS.WAITING_LOCATION:
      await handleLocationInput(chatId, userId, texto, userState);
      break;
    case ESTADOS.WAITING_PHOTOS:
      await handlePhotosInput(chatId, userId, texto, userState);
      break;
    case ESTADOS.WAITING_DESCRIPTION:
      await handleDescriptionInput(chatId, userId, texto, userState);
      break;
  }
});

// Função para tratar entrada do título
async function handleTitleInput(chatId, userId, texto, userState) {
  if (texto.length < 3) {
    await bot.sendMessage(chatId, '❌ O nome do evento deve ter pelo menos 3 caracteres. Tente novamente:');
    return;
  }
  
  userState.evento.titulo = texto;
  userState.estado = ESTADOS.WAITING_DATE;
  
  await bot.sendMessage(chatId, 
    `✅ Nome salvo: "${texto}"

` +
    `📅 *Passo 2 de 6 - Data do Evento*

` +
    `Digite a data no formato DD/MM/AAAA:

` +
    `Exemplo: 25/12/2024

` +
    `⚠️ A data deve ser futura`,
    { parse_mode: 'Markdown' }
  );
}

// Função para tratar entrada da data
async function handleDateInput(chatId, userId, texto, userState) {
  if (!validarData(texto)) {
    await bot.sendMessage(chatId, 
      `❌ Data inválida ou no passado.

` +
      `Use o formato DD/MM/AAAA com uma data futura.
` +
      `Exemplo: 25/12/2024

` +
      `Tente novamente:`
    );
    return;
  }
  
  userState.evento.data = texto;
  userState.estado = ESTADOS.WAITING_TIME;
  
  const dataFormatada = formatarData(texto);
  
  await bot.sendMessage(chatId, 
    `✅ Data salva: ${dataFormatada}

` +
    `🕐 *Passo 3 de 6 - Horário do Evento*

` +
    `Digite o horário no formato HH:MM:

` +
    `Exemplo: 20:30`,
    { parse_mode: 'Markdown' }
  );
}

// Função para tratar entrada do horário
async function handleTimeInput(chatId, userId, texto, userState) {
  if (!validarHorario(texto)) {
    await bot.sendMessage(chatId, 
      `❌ Horário inválido.

` +
      `Use o formato HH:MM (24 horas).
` +
      `Exemplo: 20:30

` +
      `Tente novamente:`
    );
    return;
  }
  
  userState.evento.horario = texto;
  userState.estado = ESTADOS.WAITING_LOCATION;
  
  await bot.sendMessage(chatId, 
    `✅ Horário salvo: ${texto}

` +
    `📍 *Passo 4 de 6 - Local do Evento*

` +
    `Digite o local onde será o show:

` +
    `Exemplo: "Bar Central - Uberlândia, MG"`,
    { parse_mode: 'Markdown' }
  );
}

// Função para tratar entrada do local
async function handleLocationInput(chatId, userId, texto, userState) {
  if (texto.length < 3) {
    await bot.sendMessage(chatId, '❌ O local deve ter pelo menos 3 caracteres. Tente novamente:');
    return;
  }
  
  userState.evento.local = texto;
  userState.estado = ESTADOS.WAITING_PHOTOS;
  
  await bot.sendMessage(chatId, 
    `✅ Local salvo: "${texto}"

` +
    `📸 *Passo 5 de 6 - Fotos do Ambiente*

` +
    `Envie até 5 fotos do local do evento.

` +
    `💡 *Comandos:*
` +
    `• Envie fotos uma por vez
` +
    `• Digite "pronto" quando terminar
` +
    `• Digite "pular" para não enviar fotos`,
    { parse_mode: 'Markdown' }
  );
}

// Função para tratar entrada de fotos
async function handlePhotosInput(chatId, userId, texto, userState) {
  const textoLower = texto.toLowerCase().trim();
  
  if (textoLower === 'pronto' || textoLower === 'finalizar') {
    const totalFotos = userState.evento.fotos.length;
    userState.estado = ESTADOS.WAITING_DESCRIPTION;
    
    await bot.sendMessage(chatId, 
      `✅ ${totalFotos} foto${totalFotos !== 1 ? 's' : ''} salva${totalFotos !== 1 ? 's' : ''}!

` +
      `📝 *Passo 6 de 6 - Descrição (Opcional)*

` +
      `Digite uma descrição para o evento ou "pular" para finalizar:

` +
      `Exemplo: "Show acústico com repertório de MPB e sertanejo"`,
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  if (textoLower === 'pular') {
    userState.estado = ESTADOS.WAITING_DESCRIPTION;
    
    await bot.sendMessage(chatId, 
      `⏭️ Fotos puladas.

` +
      `📝 *Passo 6 de 6 - Descrição (Opcional)*

` +
      `Digite uma descrição para o evento ou "pular" para finalizar:

` +
      `Exemplo: "Show acústico com repertório de MPB e sertanejo"`,
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  await bot.sendMessage(chatId, 
    `📸 Envie fotos do ambiente ou digite:
` +
    `• "pronto" para continuar
` +
    `• "pular" para não enviar fotos`
  );
}

// Função para tratar entrada da descrição
async function handleDescriptionInput(chatId, userId, texto, userState) {
  const textoLower = texto.toLowerCase().trim();
  
  if (textoLower !== 'pular') {
    userState.evento.descricao = texto;
  }
  
  // Finalizar criação do evento
  try {
    const eventos = await carregarEventos();
    const novoId = await gerarProximoId();
    
    const novoEvento = {
      id: novoId,
      titulo: userState.evento.titulo,
      data: userState.evento.data,
      horario: userState.evento.horario,
      local: userState.evento.local,
      fotos: userState.evento.fotos,
      descricao: userState.evento.descricao || null,
      criadoEm: new Date().toISOString()
    };
    
    eventos.push(novoEvento);
    const sucesso = await salvarEventos(eventos);
    
    if (sucesso) {
      const dataFormatada = formatarData(novoEvento.data);
      const totalFotos = novoEvento.fotos.length;
      
      await bot.sendMessage(chatId, 
        `🎉 *Show adicionado com sucesso!*

` +
        `🎵 *${novoEvento.titulo}*
` +
        `📅 ${dataFormatada} às ${novoEvento.horario}
` +
        `📍 ${novoEvento.local}
` +
        `📸 ${totalFotos} foto${totalFotos !== 1 ? 's' : ''} do ambiente
` +
        `${novoEvento.descricao ? `📝 ${novoEvento.descricao}
` : ''}` +
        `🆔 ID: ${novoEvento.id}

` +
        `✨ O show já está disponível na agenda do site!`,
        { parse_mode: 'Markdown' }
      );
    } else {
      await bot.sendMessage(chatId, '❌ Erro ao salvar evento. Tente novamente.');
    }
    
  } catch (error) {
    console.error('❌ Erro ao criar evento:', error);
    await bot.sendMessage(chatId, '❌ Erro ao criar evento. Tente novamente.');
  }
  
  // Limpar estado do usuário
  userStates.delete(userId);
}

// API REST para o site
app.get('/api/eventos', async (req, res) => {
  try {
    const eventos = await carregarEventos();
    res.json(eventos);
  } catch (error) {
    console.error('❌ Erro na API:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    bot: 'Artur Almeida Bot',
    version: '1.0.0'
  });
});

// Inicializar servidor
app.listen(PORT, () => {
  console.log('🎵 Bot do Artur Almeida iniciado!');
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}/api/eventos`);
  console.log(`💚 Health check em http://localhost:${PORT}/health`);
});

// Tratamento de erros
bot.on('error', (error) => {
  console.error('❌ Erro no bot:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});