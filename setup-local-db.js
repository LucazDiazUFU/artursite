require('dotenv').config();
const mysql = require('mysql2/promise');

async function configurarBancoLocal() {
    try {
        console.log('🔄 Configurando banco de dados local para desenvolvimento...');
        
        // Conectar ao MySQL sem especificar database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '', // Senha vazia para XAMPP/WAMP padrão
            port: 3306
        });
        
        console.log('✅ Conectado ao MySQL local!');
        
        // Criar database se não existir
        await connection.execute('CREATE DATABASE IF NOT EXISTS artur_eventos');
        console.log('✅ Database "artur_eventos" criado/verificado!');
        
        // Usar o database
        await connection.execute('USE artur_eventos');
        
        // Criar tabela eventos
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS eventos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titulo VARCHAR(255) NOT NULL,
                data DATE NOT NULL,
                horario TIME NOT NULL,
                local VARCHAR(255) NOT NULL,
                fotos JSON,
                descricao TEXT,
                status ENUM('ativo', 'cancelado', 'concluido') DEFAULT 'ativo',
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela "eventos" criada/verificada!');
        
        // Inserir alguns eventos de exemplo
        const eventosExemplo = [
            {
                titulo: 'Show em Uberlândia',
                data: '2024-08-15',
                horario: '20:00:00',
                local: 'Bar do Zé - Uberlândia, MG',
                descricao: 'Show acústico com repertório variado de MPB e sertanejo.',
                fotos: JSON.stringify([])
            },
            {
                titulo: 'Festival de Música',
                data: '2024-08-22',
                horario: '19:30:00',
                local: 'Praça Central - Uberaba, MG',
                descricao: 'Participação especial no Festival de Inverno com apresentação de 1 hora.',
                fotos: JSON.stringify([])
            },
            {
                titulo: 'Show Beneficente',
                data: '2024-09-05',
                horario: '21:00:00',
                local: 'Teatro Municipal - Araguari, MG',
                descricao: 'Show beneficente em prol da Casa de Apoio. Entrada: 1kg de alimento não-perecível.',
                fotos: JSON.stringify([])
            }
        ];
        
        // Verificar se já existem eventos
        const [existingEvents] = await connection.execute('SELECT COUNT(*) as count FROM eventos');
        
        if (existingEvents[0].count === 0) {
            console.log('🔄 Inserindo eventos de exemplo...');
            
            for (const evento of eventosExemplo) {
                await connection.execute(
                    'INSERT INTO eventos (titulo, data, horario, local, descricao, fotos) VALUES (?, ?, ?, ?, ?, ?)',
                    [evento.titulo, evento.data, evento.horario, evento.local, evento.descricao, evento.fotos]
                );
            }
            
            console.log('✅ Eventos de exemplo inseridos!');
        } else {
            console.log('ℹ️  Eventos já existem na base de dados.');
        }
        
        // Listar eventos
        const [eventos] = await connection.execute('SELECT * FROM eventos ORDER BY data ASC');
        console.log(`\n📊 Total de eventos: ${eventos.length}`);
        
        eventos.forEach((evento, index) => {
            console.log(`\n${index + 1}. ${evento.titulo}`);
            console.log(`   📅 Data: ${evento.data.toISOString().split('T')[0]}`);
            console.log(`   🕐 Horário: ${evento.horario}`);
            console.log(`   📍 Local: ${evento.local}`);
            console.log(`   📋 Status: ${evento.status}`);
        });
        
        await connection.end();
        console.log('\n✅ Configuração do banco local concluída!');
        console.log('\n💡 Agora você pode executar o bot localmente com: npm start');
        
    } catch (error) {
        console.error('❌ Erro ao configurar banco local:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Dicas para resolver:');
            console.log('1. Certifique-se de que o MySQL está rodando (XAMPP, WAMP, ou MySQL Server)');
            console.log('2. Verifique se a porta 3306 está disponível');
            console.log('3. Confirme as credenciais no arquivo .env');
        }
    } finally {
        process.exit(0);
    }
}

configurarBancoLocal();