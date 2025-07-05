const mysql = require('mysql2/promise');

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: '-03:00' // Horário de Brasília
    });
  }

  async testarConexao() {
    try {
      const connection = await this.pool.getConnection();
      console.log('✅ Conectado ao MySQL Hostinger');
      connection.release();
      return true;
    } catch (error) {
      console.error('❌ Erro ao conectar MySQL:', error);
      return false;
    }
  }

  async criarEvento(evento) {
    try {
      const query = `
        INSERT INTO eventos (titulo, data, horario, local, fotos, descricao)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await this.pool.execute(query, [
        evento.titulo,
        evento.data,
        evento.horario,
        evento.local,
        JSON.stringify(evento.fotos || []),
        evento.descricao
      ]);
      
      return result.insertId;
    } catch (error) {
      console.error('❌ Erro ao criar evento:', error);
      throw error;
    }
  }

  async listarEventos() {
    try {
      const query = `
        SELECT 
          id,
          titulo,
          DATE_FORMAT(data, '%d/%m/%Y') as data,
          TIME_FORMAT(horario, '%H:%i') as horario,
          local,
          fotos,
          descricao,
          status,
          criado_em
        FROM eventos 
        WHERE status = 'ativo'
        ORDER BY data ASC, horario ASC
      `;
      
      const [rows] = await this.pool.execute(query);
      
      return rows.map(row => ({
        ...row,
        fotos: JSON.parse(row.fotos || '[]')
      }));
    } catch (error) {
      console.error('❌ Erro ao listar eventos:', error);
      return [];
    }
  }

  async removerEvento(id) {
    try {
      const query = 'UPDATE eventos SET status = "cancelado" WHERE id = ?';
      const [result] = await this.pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('❌ Erro ao remover evento:', error);
      return false;
    }
  }

  async buscarEventoPorId(id) {
    try {
      const query = 'SELECT * FROM eventos WHERE id = ? AND status = "ativo"';
      const [rows] = await this.pool.execute(query, [id]);
      
      if (rows.length > 0) {
        const evento = rows[0];
        evento.fotos = JSON.parse(evento.fotos || '[]');
        return evento;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar evento:', error);
      return null;
    }
  }

  async gerarProximoId() {
    try {
      const query = 'SELECT MAX(id) as max_id FROM eventos';
      const [rows] = await this.pool.execute(query);
      return (rows[0].max_id || 0) + 1;
    } catch (error) {
      console.error('❌ Erro ao gerar próximo ID:', error);
      return 1;
    }
  }

  // Função para converter data DD/MM/YYYY para formato MySQL YYYY-MM-DD
  formatarDataParaMySQL(dataString) {
    const [dia, mes, ano] = dataString.split('/');
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }

  // Função para converter horário HH:MM para formato MySQL TIME
  formatarHorarioParaMySQL(horarioString) {
    return horarioString + ':00'; // Adiciona segundos
  }

  async fecharConexoes() {
    try {
      await this.pool.end();
      console.log('🔌 Conexões MySQL fechadas');
    } catch (error) {
      console.error('❌ Erro ao fechar conexões:', error);
    }
  }
}

module.exports = new Database();