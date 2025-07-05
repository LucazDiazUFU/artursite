-- Script SQL para criar a tabela de eventos no MySQL da Hostinger
-- Execute este script no phpMyAdmin ou cliente MySQL da Hostinger

CREATE TABLE IF NOT EXISTS eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    local VARCHAR(500) NOT NULL,
    fotos JSON,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX idx_data ON eventos(data);
CREATE INDEX idx_titulo ON eventos(titulo);

-- Inserir alguns dados de exemplo (opcional)
INSERT INTO eventos (titulo, data, horario, local, fotos, descricao) VALUES
('Show Acústico - MPB', '2024-12-25', '20:30:00', 'Bar do João - Centro', '[]', 'Repertório especial de Natal com clássicos da MPB'),
('Sertanejo Universitário', '2024-12-31', '23:00:00', 'Clube Recreativo - Vila Nova', '[]', 'Festa de Réveillon com os maiores sucessos do sertanejo'),
('Rock Nacional', '2025-01-15', '21:00:00', 'Casa de Shows Rock City', '[]', 'Uma noite dedicada aos clássicos do rock brasileiro');

-- Verificar se a tabela foi criada corretamente
SELECT * FROM eventos ORDER BY data ASC;