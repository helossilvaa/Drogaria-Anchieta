drop database drogaria;
create database drogaria;
use drogaria;


CREATE TABLE setor (
	id INT AUTO_INCREMENT PRIMARY KEY,
    setor VARCHAR(250) NOT NULL
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registro INT NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    telefone VARCHAR(9) NOT NULL, 
    data_nascimento DATE NOT NULL, 
    genero enum('masculino', 'feminino', 'nao-binario') DEFAULT NULL,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    setor_id INT NOT NULL,
    logradouro VARCHAR(250) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    cep VARCHAR(9) NOT NULL,
    numero INT NOT NULL,
    foto BLOB,
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (setor_id) REFERENCES setor(id)
);

CREATE TABLE unidade (
	id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('matriz', 'franquia' ) DEFAULT NULL,
    nome VARCHAR(250) NOT NULL,
    cnpj VARCHAR(14) NOT NULL,
    logradouro VARCHAR(250) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    cep VARCHAR(9) NOT NULL,
    numero INT NOT NULL,
    telefone VARCHAR(9) NOT NULL,
    email VARCHAR(100) NOT NULL,
    data_abertura DATE NOT NULL,
	status ENUM('ativa','inativa') DEFAULT 'ativa'
);

ALTER TABLE usuarios ADD COLUMN unidade_id INT NULL;
ALTER TABLE usuarios ADD CONSTRAINT fk_usuario_unidade FOREIGN KEY (unidade_id) REFERENCES unidade(id);

ALTER TABLE unidade ADD COLUMN dono_usuario_id INT NULL;
ALTER TABLE unidade ADD CONSTRAINT fk_unidade_usuario FOREIGN KEY (dono_usuario_id) REFERENCES usuarios(id);


CREATE TABLE abrirFechar_caixa (
	id INT PRIMARY KEY AUTO_INCREMENT,
    status ENUM('aberto', 'fechado') DEFAULT 'fechado',
    usuario_id INT NOT NULL,
    saldo_inicial INT NULL, 
    unidade_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (unidade_id) REFERENCES unidade(id)
);

CREATE TABLE tipos_pagamento (
	id INT PRIMARY KEY AUTO_INCREMENT, 
    tipo ENUM('pix', 'credito', 'debito', 'dinheiro') DEFAULT NULL
);


CREATE TABLE tipo_medicamento (
	id INT PRIMARY KEY AUTO_INCREMENT,
    tarja ENUM('preta', 'vermelha', 'amarela', 'sem tarja') default 'sem tarja'
);

CREATE TABLE categorias (
	id INT PRIMARY KEY AUTO_INCREMENT,
    categoria VARCHAR(250) NOT NULL
);

insert into categorias (categoria) values
('medicamento'),
('cosmetico'),
('higiene'),
('alimentacao'),
('conveniencia');

CREATE TABLE marcas (
	id INT PRIMARY KEY AUTO_INCREMENT,
    marca VARCHAR(200) NOT NULL
);

CREATE TABLE unidade_medida (
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    sigla VARCHAR(150) NOT NULL
);

CREATE TABLE fornecedores (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fornecedor VARCHAR(400) NOT NULL,
    cnpj INT (20) NOT NULL,
    logradouro VARCHAR(250) NOT NULL,
    cidade VARCHAR(100),
    estado CHAR(2),
    cep VARCHAR(9),
    telefone VARCHAR(15),
    email VARCHAR(100),
    status ENUM('ativa','inativa') DEFAULT 'ativa',
    bairro VARCHAR(100) NOT NULL,
    numero INT (5) NOT NULL
);

CREATE TABLE produtos (
	id INT PRIMARY KEY NOT NULL,
    registro_anvisa INT NOT NULL,
    nome VARCHAR(400) NOT NULL,
    foto LONGBLOB NULL,
    medida_id INT NOT NULL,
    tarja_id INT NOT NULL,
    categoria_id INT NOT NULL,
    marca_id INT NOT NULL,
    codigo_barras INT NOT NULL,
	descricao VARCHAR(400) NOT NULL,
    preco_unitario INT NOT NULL,
    validade DATE NOT NULL,
    fornecedor_id INT NOT NULL,
    lote_id INT NOT NULL,
    armazenamento VARCHAR(250) NOT NULL,
	 FOREIGN KEY (medida_id) REFERENCES unidade_medida(id),
     FOREIGN KEY (tarja_id) REFERENCES tipo_medicamento(id),
     FOREIGN KEY (categoria_id) REFERENCES categorias(id),
     FOREIGN KEY (marca_id) REFERENCES marcas(id),
     FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
);

CREATE TABLE lotes_matriz (
	id INT NOT NULL PRIMARY KEY,
    produto_id INT NOT NULL,
    numero_lote INT NOT NULL,
    data_validade DATE NOT NULL,
    quantidade INT NOT NULL,
    data_entrada DATE NOT NULL,
    fornecedor_id INT NOT NULL,
	FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
);

CREATE TABLE estoque_matriz (
	id INT PRIMARY KEY NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    estoque_minimo INT NOT NULL,
    estoque_maximo INT NOT NULL,
    localizacao VARCHAR(200) NOT NULL,
	lote_id INT NOT NULL,
    data_atualizacao DATE NOT NULL,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (lote_id) REFERENCES lotes_matriz(id)
);


CREATE TABLE estoque_franquia (
	id INT PRIMARY KEY NOT NULL,
    quantidade INT NOT NULL,
	produto_id INT NOT NULL,
    estoque_minimo INT NOT NULL,
    estoque_maximo INT NOT NULL,
    estoque_matriz_id INT NOT NULL,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (estoque_matriz_id) REFERENCES estoque_matriz(id)
);

CREATE TABLE parcerias (
	id INT NOT NULL PRIMARY KEY auto_increment,
    parceiro VARCHAR(250) NOT NULL,
    porcentagem decimal (2, 2),
    CHECK (porcentagem >= 0 AND porcentagem <= 100 )
);

CREATE TABLE tiposdescontos (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(250) NOT NULL
);

CREATE TABLE descontos (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    tipodesconto_id INT NOT NULL,
    nome VARCHAR(50) NOT NULL,
	desconto DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (tipodesconto_id) REFERENCES tiposdescontos (id)
);

CREATE TABLE filiados (
	id INT NOT NULL PRIMARY KEY auto_increment,
    nome VARCHAR(250) NOT NULL,
    cpf VARCHAR(11)  NOT NULL,
    data_nascimento DATE NOT NULL,
    email VARCHAR(250) NOT NULL,
    telefone VARCHAR(9) NOT NULL,
    cep VARCHAR(9) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    numero INT NOT NULL,
    logradouro VARCHAR(200) NOT NULL,
    bairro VARCHAR(200) NOT NULL,
    tipodesconto INT NOT NULL,
    FOREIGN KEY (tipodesconto) REFERENCES tiposdescontos (id)
);

CREATE TABLE servicos (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    servico VARCHAR(250) NOT NULL
);

CREATE TABLE contas (
	id INT NOT NULL PRIMARY KEY auto_increment,
    nomeConta VARCHAR(200) NOT NULL,
    conta_pdf LONGBLOB not null,
    status enum('paga', 'pendente') DEFAULT 'pendente',
    dataVencimento DATE NOT NULL,
    dataPostada DATE NOT NULL,
    valor DECIMAL (10,2)
);

CREATE TABLE salarios (
	id INT NOT NULL PRIMARY KEY auto_increment,
    id_funcionario INT NOT NULL,
    setor_id INT NOT NULL,
    unidade_id INT NOT NULL,
    FOREIGN KEY (unidade_id) REFERENCES unidade(id),
    foreign key (setor_id) REFERENCES setor(id)
);

CREATE TABLE tiporelatorio (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    tiporelatorio VARCHAR(250) NOT NULL
);

CREATE TABLE relatorios (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    tipoRelatorio_id INT NOT NULL,
    relatorio LONGBLOB not null,
    FOREIGN KEY (tipoRelatorio_id) REFERENCES tiporelatorio(id)
);


-- Tabela de Vendas 
CREATE TABLE vendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NULL,
    usuario_id INT NOT NULL,
    unidade_id INT NOT NULL,
    tipo_pagamento_id INT NULL,
    desconto_id INT NULL,
    total DECIMAL(10,2) NOT NULL,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES filiados(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (unidade_id) REFERENCES unidade(id),
    FOREIGN KEY (tipo_pagamento_id) REFERENCES tipos_pagamento(id),
    FOREIGN KEY (desconto_id) REFERENCES descontos(id)
);

-- Tabela de Itens de Venda (um registro por produto da venda)
CREATE TABLE itens_venda (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venda_id INT NOT NULL,
    produto_id INT NOT NULL,
    lote_id INT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) AS (quantidade * preco_unitario) STORED,
    FOREIGN KEY (venda_id) REFERENCES vendas(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (lote_id) REFERENCES lotes_matriz(id)
);

-- Tabela de Movimentações de Estoque (entradas, saídas, perdas, transferências)
CREATE TABLE movimentacoes_estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    lote_id INT NULL,
    unidade_id INT NOT NULL,
    tipo_movimento ENUM('entrada','saida','transferencia','perda','roubo') NOT NULL,
    quantidade INT NOT NULL,
    data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NOT NULL,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (lote_id) REFERENCES lotes_matriz(id),
    FOREIGN KEY (unidade_id) REFERENCES unidade(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

INSERT INTO tipos_pagamento (tipo) VALUES 
('debito'), ('credito'), ('pix');

INSERT INTO unidade_medida (sigla) VALUES 
('ml'), ('l'), ('g'), ('mg'), ('unidade'); 

INSERT INTO setor (setor) VALUES 
('matriz'), ('gerente'), ('pdv'); 

INSERT INTO usuarios (registro, cpf, telefone, data_nascimento, genero, nome,
 senha, email, setor_id, logradouro, cidade, estado, cep, numero) VALUES 
('12345678', '54470206941', '1192222222', '09-12-2007', 'feminino', 
'heloise', '$2b$10$dgYjcImDdSpbgQD/7BBRre.fGZohwfG24FwQW9jfg86MKCmnRSx5.', 'heloise@gmail.com', '1', 'rua joao bosco', 
'sao bernardo do campo', 'sp', '09730480', '12');

insert into produtos (registro_anvisa, nome, medida_id, tarja_id, categoria_id, marca_id, codigo_barras, descricao, preco_unitario, validade, fornecedor_id, lote_id, armazenamento)  

VALUES  

(102340125, 'Paracetamol 500mg - 20 Comprimidos', 1, 2, 1, 1, 7891058001523, 'Analgésico e antipirético indicado para dores leves e febre.', 12.90, '2026-04-15', 1, 1, 'Armazenar em local seco e fresco, entre 15°C e 30°C'), (104987655, 'Dipirona Sódica 1g - 10 Comprimidos', 1, 2, 1, 2, 7896004711210, 'Medicamento analgésico e antitérmico de uso oral.', 9.75, '2026-03-20', 2, 2, 'Conservar ao abrigo da luz e umidade'), ( 120567832, 'Amoxicilina 500mg - 16 Comprimidos', 1, 3, 1, 3, 7896074301452, 'Antibiótico indicado para infecções bacterianas.', 23.50, '2025-12-10', 3, 3, 'Conservar em temperatura ambiente, longe da umidade'), ( 130987654, 'Ibuprofeno 400mg - 12 Comprimidos', 1, 2, 1, 4, 7896074312563, 'Anti-inflamatório e analgésico para dores leves a moderadas.', 15.20, '2026-05-30', 4, 4, 'Evitar exposição ao calor e luz direta'), ( 140123987, 'Vitamina C 500mg - 30 Comprimidos', 2, 5, 2, 5, 7896034512345, 'Suplemento vitamínico para reforço imunológico.', 18.90, '2027-01-15', 5, 5, 'Manter em local seco e fresco'), (150987321, 'Cetirizina 10mg - 10 Comprimidos', 1, 2, 1, 6, 7896074321123, 'Antialérgico para rinite e urticária.', 11.50, '2026-09-10', 6, 6, 'Conservar em temperatura ambiente'), (160567890, 'Losartana 50mg - 30 Comprimidos', 1, 4, 1, 7, 7896084322567, 'Antihipertensivo indicado para controle da pressão arterial.', 35.00, '2026-11-20', 7, 7, 'Evitar exposição a umidade e calor'), ( 170987123, 'Dorzolamida + Timolol 20ml', 3, 3, 1, 8, 7896098712345, 'Colírio indicado para glaucoma.', 42.30, '2025-12-31', 8, 8, 'Armazenar ao abrigo da luz'), (180123456, 'Xarope Infantil Paracetamol 120ml', 3, 2, 1, 9, 7896054321789, 'Alívio de febre e dor em crianças.', 14.75, '2026-02-28', 9, 9, 'Manter em local fresco e agitar antes de usar'), ( 190987654, 'Creme Hidratante (Bepantol Genérico) 30g', 4, 5, 4, 10, 7896043219876, 'Hidratação e regeneração da pele.', 25.90, '2027-03-15', 10, 10, 'Armazenar em local seco e fresco'), ( 200123987, 'Omeprazol 20mg - 14 Comprimidos', 1, 3, 1, 1, 7896074321999, 'Redutor de acidez gástrica e tratamento de úlceras.', 28.50, '2026-07-10', 1, 1, 'Conservar ao abrigo da luz'), (210987321, 'Ranitidina 150mg - 14 Comprimidos', 1, 3, 1, 2, 7896084321456, 'Redutor de acidez estomacal.', 21.90, '2025-11-30', 2, 2, 'Manter em temperatura ambiente'), ( 220567890, 'Metformina 500mg - 30 Comprimidos', 1, 4, 1, 3, 7896094321987, 'Tratamento de diabetes tipo 2.', 33.50, '2026-08-25', 3, 3, 'Armazenar em local seco e fresco'), ( 230987123, 'Vitamina D3 1000UI - 30 Comprimidos', 2, 5, 2, 4, 7896012345678, 'Suplemento vitamínico para saúde óssea.', 19.90, '2027-05-10', 4, 4, 'Conservar em local seco e fresco'), ( 240123456, 'Amoxicilina + Clavulanato 875mg - 14 Comprimidos', 1, 3, 1, 5, 7896023456789, 'Antibiótico de amplo espectro.', 45.75, '2026-06-20', 5, 5, 'Evitar calor e umidade'), ( 250987654, 'Loratadina 10mg - 10 Comprimidos', 1, 2, 1, 6, 7896034567890, 'Antialérgico de uso oral.', 12.80, '2026-09-15', 6, 6, 'Conservar em temperatura ambiente'), (260123987, 'Cetoconazol Creme 20g', 4, 3, 1, 7, 7896045678901, 'Tratamento de infecções fúngicas na pele.', 22.50, '2027-01-05', 7, 7, 'Armazenar em local seco e fresco'), ( 270987321, 'Ibuprofeno 600mg - 20 Comprimidos', 1, 2, 1, 8, 7896056789012, 'Anti-inflamatório e analgésico.', 18.90, '2026-03-30', 8, 8, 'Evitar calor e luz direta'), ( 280567890, 'Naproxeno 250mg - 20 Comprimidos', 1, 2, 1, 9, 7896067890123, 'Anti-inflamatório para dores e inflamações.', 20.50, '2026-10-15', 9, 9, 'Conservar ao abrigo da luz'), ( 290987123, 'Xarope Infantil Ibuprofeno 100ml', 3, 2, 1, 10, 7896078901234, 'Alívio de febre e dor em crianças.', 16.90, '2026-02-28', 10, 10, 'Manter em local fresco e agitar antes de usar'), ( 300123456, 'Cloridrato de Sertralina 50mg - 30 Comprimidos', 1, 4, 1, 1, 7896089012345, 'Antidepressivo (ISRS).', 42.50, '2026-12-30', 1, 1, 'Conservar em temperatura ambiente'), (310987654, 'Esomeprazol 20mg - 14 Comprimidos', 1, 3, 1, 2, 7896090123456, 'Tratamento de úlceras e refluxo gástrico.', 30.75, '2026-11-15', 2, 2, 'Manter em local seco e fresco'), (320567890, 'Multivitamínico Adulto - 60 Comprimidos', 2, 5, 2, 3, 7896012345890, 'Suplemento vitamínico completo para adultos.', 28.90, '2027-04-10', 3, 3, 'Armazenar em local seco e fresco'), ( 330987123, 'Cloreto de Sódio 0,9% 100ml', 3, 5, 3, 4, 7896023456781, 'Solução isotônica para hidratação e limpeza.', 8.50, '2027-02-25', 4, 4, 'Conservar em local fresco e seco'), ( 340123456, 'Benzetacil 1.200.000 UI - 1 Frasco', 1, 3, 1, 5, 7896034567892, 'Antibiótico de ação prolongada.', 55.90, '2026-08-30', 5, 5, 'Conservar sob refrigeração'), (350987654, 'Fluconazol 150mg - 1 Comprimido', 1, 3, 1, 6, 7896045678903, 'Tratamento de infecções fúngicas.', 12.80, '2026-09-25', 6, 6, 'Manter em temperatura ambiente'), (360123987, 'Vitamina B12 1000mcg - 10 Comprimidos', 2, 5, 2, 7, 7896056789014, 'Suplemento vitamínico para anemia e saúde neural.', 24.50, '2027-03-20', 7, 7, 'Armazenar em local seco e fresco'), ( 370987321, 'Loperamida 2mg - 20 Comprimidos', 1, 2, 1, 8, 7896067890125, 'Controle de diarreia aguda e crônica.', 11.90, '2026-06-15', 8, 8, 'Conservar em local fresco e seco'), ( 380567890, 'Protetor Solar FPS 50 100ml', 4, 5, 4, 9, 7896078901235, 'Proteção solar para pele sensível.', 32.50, '2027-01-30', 9, 9, 'Manter em local seco e fresco, longe do calor'), ( 390987123, 'Captopril 25mg - 30 Comprimidos', 1, 4, 1, 10, 7896089012346, 'Antihipertensivo indicado para pressão alta.', 27.50, '2026-12-10', 10, 10, 'Conservar em temperatura ambiente'), ( 400123456, 'Aspirina 100mg - 30 Comprimidos', 1, 2, 1, 1, 7896090123457, 'Antiagregante plaquetário e analgésico.', 15.60, '2026-10-01', 1, 1, 'Conservar em local fresco e seco'), (410987654, 'Sinvastatina 20mg - 30 Comprimidos', 1, 3, 1, 2, 7896012345679, 'Redutor de colesterol.', 38.90, '2026-07-25', 2, 2, 'Proteger da luz e umidade'), ( 420567890, 'Gliclazida 60mg - 30 Comprimidos', 1, 4, 1, 3, 7896023456790, 'Hipoglicemiante oral para diabetes.', 45.00, '2026-04-05', 3, 3, 'Armazenar em temperatura ambiente'), ( 430987123, 'Dexametasona Colírio 5ml', 3, 3, 1, 4, 7896034567891, 'Anti-inflamatório oftálmico.', 29.90, '2025-11-01', 4, 4, 'Manter em local fresco'), ( 440123456, 'Fralda Descartável G - Pacote 40 Unidades', 5, 5, 4, 5, 7896045678902, 'Higiene e cuidado para bebês.', 45.99, '2028-05-01', 5, 5, 'Armazenar em local seco'), ( 450987654, 'Neosaldina - 20 Comprimidos', 1, 2, 1, 6, 7896056789013, 'Analgésico e relaxante muscular.', 19.50, '2026-03-10', 6, 6, 'Conservar em local seco e fresco'), ( 460123987, 'Probiótico Infantil Sachê - 10 Unidades', 2, 5, 2, 7, 7896067890124, 'Probiótico para saúde intestinal.', 35.50, '2027-02-14', 7, 7, 'Manter sob refrigeração'), ( 470987321, 'Histamin Xarope 120ml', 3, 2, 1, 8, 7896078901236, 'Antialérgico para rinite e urticária.', 17.20, '2026-05-20', 8, 8, 'Conservar em temperatura ambiente'), ( 480567890, 'Buscopan Composto - 20 Drágeas', 1, 2, 1, 9, 7896089012347, 'Antiespasmódico e analgésico.', 13.90, '2026-11-05', 9, 9, 'Evitar calor excessivo'), ( 490987123, 'Óleo de Prímula Cápsulas - 60 Unidades', 2, 5, 2, 10, 7896090123458, 'Suplemento para saúde feminina.', 49.90, '2027-06-01', 10, 10, 'Manter em local fresco'), ( 500123456, 'Clonazepam 2mg - 20 Comprimidos', 1, 4, 1, 1, 7896012345680, 'Ansiolítico e anticonvulsivante.', 24.80, '2026-09-01', 1, 1, 'Proteger da luz e umidade'), ( 510987654, 'Hidroclorotiazida 25mg - 30 Comprimidos', 1, 4, 1, 2, 7896023456791, 'Diurético e anti-hipertensivo.', 10.50, '2026-12-15', 2, 2, 'Conservar em temperatura ambiente'), ( 520567890, 'Prednisona 20mg - 10 Comprimidos', 1, 3, 1, 3, 7896034567892, 'Corticosteroide com ação anti-inflamatória.', 18.70, '2026-07-01', 3, 3, 'Manter em local seco'), ( 530987123, 'Soro Fisiológico 500ml', 3, 5, 3, 4, 7896045678903, 'Solução para limpeza e hidratação.', 6.50, '2027-04-20', 4, 4, 'Conservar em local fresco'), ( 540123456, 'Escova Dental Macia', 5, 5, 4, 5, 7896056789014, 'Higiene oral.', 7.90, '2028-01-01', 5, 5, 'Armazenar em local seco'), ( 550987654, 'Nimesulida 100mg - 12 Comprimidos', 1, 3, 1, 6, 7896067890125, 'Anti-inflamatório com ação analgésica.', 16.90, '2026-08-10', 6, 6, 'Evitar calor e umidade'), ( 560123987, 'Pantoprazol 40mg - 28 Comprimidos', 1, 3, 1, 7, 7896078901237, 'Inibidor de bomba de prótons para úlceras.', 32.90, '2026-06-25', 7, 7, 'Conservar ao abrigo da luz'), ( 570987321, 'Metronidazol 400mg - 20 Comprimidos', 1, 3, 1, 8, 7896089012348, 'Antimicrobiano e antiparasitário.', 21.50, '2025-10-30', 8, 8, 'Manter em temperatura ambiente'), ( 580567890, 'Gel Dental Infantil 50g', 4, 5, 4, 9, 7896090123459, 'Higiene oral infantil com flúor.', 11.20, '2027-09-15', 9, 9, 'Armazenar em local fresco e seco'), ( 590987123, 'Cloridrato de Fluoxetina 20mg - 30 Cápsulas', 1, 4, 1, 10, 7896012345681, 'Antidepressivo (ISRS).', 39.90, '2026-11-20', 10, 10, 'Conservar em local seco e fresco'), ( 600123456, 'Dipirona Gotas 20ml', 3, 2, 1, 1, 7896023456792, 'Analgésico e antitérmico em gotas.', 8.90, '2026-05-15', 1, 1, 'Proteger da luz'), ( 610987654, 'Enalapril 10mg - 30 Comprimidos', 1, 4, 1, 2, 7896034567893, 'Anti-hipertensivo (Inibidor da ECA).', 26.50, '2026-10-25', 2, 2, 'Conservar em temperatura ambiente'), ( 620567890, 'AAS 500mg - 10 Comprimidos', 1, 2, 1, 3, 7896045678904, 'Analgésico e anti-inflamatório.', 9.50, '2027-01-01', 3, 3, 'Manter em local seco e fresco'), ( 630987123, 'Água Oxigenada 10 volumes 100ml', 3, 5, 3, 4, 7896056789015, 'Antisséptico tópico.', 5.20, '2027-03-30', 4, 4, 'Manter em local fresco e ao abrigo da luz'), ( 640123456, 'Curativo Adesivo (Band-Aid) - 10 Unidades', 5, 5, 3, 5, 7896067890126, 'Proteção de pequenos ferimentos.', 6.90, '2028-02-01', 5, 5, 'Armazenar em local seco'), ( 650987654, 'Claritromicina 500mg - 10 Comprimidos', 1, 3, 1, 6, 7896078901238, 'Antibiótico macrolídeo.', 38.00, '2025-12-05', 6, 6, 'Conservar em temperatura ambiente'), ( 660123987, 'Suplemento de Cálcio + Vitamina D - 60 Cápsulas', 2, 5, 2, 7, 7896089012349, 'Para saúde óssea e prevenção de osteoporose.', 29.90, '2027-05-20', 7, 7, 'Manter em local seco e fresco'), ( 670987321, 'Nebulizador Portátil', 5, 5, 3, 8, 7896090123460, 'Dispositivo para terapia respiratória.', 120.00, '2030-12-31', 8, 8, 'Limpar e guardar em local seco'), ( 680567890, 'Sabonete Líquido Antisséptico 250ml', 3, 5, 4, 9, 7896012345682, 'Limpeza e desinfecção da pele.', 14.50, '2027-08-15', 9, 9, 'Evitar calor excessivo'), ( 690987123, 'Xarope para Tosse (Bromidrato de Dextrometorfano) 120ml', 3, 2, 1, 10, 7896023456793, 'Supressor da tosse seca.', 18.20, '2026-04-10', 10, 10, 'Armazenar em temperatura ambiente'), ( 700123456, 'Pílula Anticoncepcional (Genérico) - 21 Comprimidos', 1, 4, 1, 1, 7896034567894, 'Controle de natalidade.', 22.50, '2026-09-05', 1, 1, 'Proteger da luz'), ( 710987654, 'Dipropionato de Betametasona Creme 30g', 4, 3, 1, 2, 7896045678905, 'Corticosteroide tópico para inflamações na pele.', 15.90, '2027-01-25', 2, 2, 'Manter em local fresco'), ( 720567890, 'Sais de Rehidratação Oral (SRO) - 4 Envelopes', 5, 5, 3, 3, 7896056789016, 'Prevenção e tratamento de desidratação.', 7.50, '2027-10-01', 3, 3, 'Conservar em local seco'), ( 730987123, 'Fio Dental 50m', 5, 5, 4, 4, 7896067890127, 'Higiene oral complementar.', 5.90, '2028-03-01', 4, 4, 'Armazenar em local seco'), ( 740123456, 'Anel Vaginal Contraceptivo - 1 Unidade', 5, 4, 1, 5, 7896078901239, 'Controle de natalidade hormonal.', 65.00, '2026-07-15', 5, 5, 'Conservar sob refrigeração'), ( 750987654, 'Pomada para Assaduras 60g', 4, 5, 4, 6, 7896089012350, 'Proteção e tratamento de assaduras em bebês.', 13.50, '2027-04-05', 6, 6, 'Manter em local fresco e seco'), ( 760123987, 'Complexo B Injetável - 3 Ampolas', 3, 3, 1, 7, 7896090123461, 'Suplemento de vitaminas do Complexo B.', 48.90, '2026-11-01', 7, 7, 'Proteger da luz'), ( 770987321, 'Laxante Bisacodil 5mg - 20 Comprimidos', 1, 2, 1, 8, 7896012345683, 'Alívio da prisão de ventre.', 10.90, '2026-03-20', 8, 8, 'Conservar em temperatura ambiente'), ( 780567890, 'Protetor Labial FPS 30', 4, 5, 4, 9, 7896023456794, 'Hidratação e proteção solar labial.', 12.50, '2027-12-31', 9, 9, 'Evitar calor excessivo'), ( 790987123, 'Insulina NPH 100 UI/ml - 1 Frasco', 3, 4, 1, 10, 7896034567895, 'Tratamento de diabetes.', 75.00, '2026-01-10', 10, 10, 'Conservar sob refrigeração (2°C a 8°C)'), ( 800123456, 'Dorflex - 36 Comprimidos', 1, 2, 1, 1, 7896045678906, 'Analgésico e relaxante muscular.', 22.90, '2026-08-01', 1, 1, 'Manter em local seco e fresco'), ( 810987654, 'Minoxidil 5% Solução Tópica 50ml', 3, 5, 4, 2, 7896056789017, 'Tratamento de queda de cabelo.', 49.90, '2027-02-10', 2, 2, 'Armazenar em temperatura ambiente'), ( 820567890, 'Compressa de Gaze Estéril 10x10cm - 10 Unidades', 5, 5, 3, 3, 7896067890128, 'Material para curativos.', 9.20, '2028-06-01', 3, 3, 'Manter o envelope intacto e em local seco'), ( 830987123, 'Acetaminofeno 500mg - 50 Comprimidos', 1, 2, 1, 4, 7896078901240, 'Analgésico e antipirético.', 17.50, '2026-11-10', 4, 4, 'Conservar ao abrigo da luz e umidade'), ( 840123456, 'Sabonete em Barra Neutro 90g', 5, 5, 4, 5, 7896089012351, 'Higiene pessoal diária.', 4.50, '2027-09-01', 5, 5, 'Armazenar em local seco'), ( 850987654, 'Ciprofloxacino 500mg - 10 Comprimidos', 1, 3, 1, 6, 7896090123462, 'Antibiótico de amplo espectro.', 27.90, '2026-04-20', 6, 6, 'Conservar em temperatura ambiente'), ( 860123987, 'Polivitamínico Pediátrico Xarope 150ml', 3, 5, 2, 7, 7896012345684, 'Suplemento vitamínico para crianças.', 21.50, '2027-03-05', 7, 7, 'Agitar antes de usar e proteger da luz'), ( 870987321, 'Gel de Massagem Relaxante 120g', 4, 5, 4, 8, 7896023456795, 'Alívio de dores musculares e cansaço.', 16.90, '2028-01-05', 8, 8, 'Manter em local fresco'), ( 880567890, 'Colírio Lubrificante Ocular 15ml', 3, 5, 1, 9, 7896034567896, 'Alívio da secura e irritação ocular.', 19.50, '2026-12-01', 9, 9, 'Armazenar em temperatura ambiente'), ( 890987123, 'Álcool em Gel 70% 500ml', 3, 5, 4, 10, 7896045678907, 'Antisséptico para as mãos.', 14.90, '2027-10-20', 10, 10, 'Manter afastado do fogo e calor'), ( 900123456, 'Fluconazol 150mg - 2 Cápsulas', 1, 3, 1, 1, 7896056789018, 'Tratamento de infecções fúngicas.', 19.90, '2026-05-30', 1, 1, 'Conservar em temperatura ambiente'), ( 910987654, 'Sulfato Ferroso Xarope 100ml', 3, 5, 2, 2, 7896067890129, 'Suplemento para anemia ferropriva.', 13.90, '2027-01-15', 2, 2, 'Proteger da luz e calor'), ( 920567890, 'Protetor Solar Facial FPS 30 50g', 4, 5, 4, 3, 7896078901241, 'Proteção diária contra raios UVA/UVB.', 30.50, '2027-08-25', 3, 3, 'Manter em local seco e fresco'), ( 930987123, 'Kit Primeiros Socorros (Caixa)', 5, 5, 3, 4, 7896089012352, 'Itens essenciais para emergências.', 55.00, '2030-01-01', 4, 4, 'Guardar em local acessível'), ( 940123456, 'Cloridrato de Propranolol 40mg - 30 Comprimidos', 1, 4, 1, 5, 7896090123463, 'Betabloqueador para hipertensão e ansiedade.', 25.50, '2026-10-10', 5, 5, 'Conservar ao abrigo da luz'), ( 950987654, 'Permanganato de Potássio 100mg - 10 Comprimidos', 1, 5, 3, 6, 7896012345685, 'Antisséptico e adstringente para uso tópico.', 7.90, '2027-04-15', 6, 6, 'Manter em local seco'), ( 960123987, 'Ômega 3 Cápsulas - 60 Unidades', 2, 5, 2, 7, 7896023456796, 'Suplemento de ácidos graxos essenciais.', 39.90, '2027-11-20', 7, 7, 'Proteger da luz e umidade'), ( 970987321, 'Pomada para Queimaduras 30g', 4, 5, 3, 8, 7896034567897, 'Alívio e tratamento de queimaduras leves.', 17.50, '2026-09-05', 8, 8, 'Armazenar em local fresco'), ( 980567890, 'Glicerina Líquida 100ml', 3, 5, 4, 9, 7896045678908, 'Uso farmacêutico e cosmético.', 10.50, '2027-06-25', 9, 9, 'Conservar em temperatura ambiente'), ( 990987123, 'Acetilcisteína Xarope 20mg/ml 120ml', 3, 2, 1, 10, 7896056789019, 'Mucolítico para tosse com catarro.', 16.50, '2026-03-01', 10, 10, 'Agitar antes de usar'), ( 100123456, 'Creme Hidratante Corporal 200ml', 4, 5, 4, 1, 7896067890130, 'Hidratação intensa para a pele.', 25.00, '2027-10-10', 1, 1, 'Manter em local seco e fresco'), ( 101987654, 'Descongestionante Nasal Solução 10ml', 3, 2, 1, 2, 7896078901242, 'Alívio da congestão nasal.', 8.50, '2026-08-20', 2, 2, 'Conservar em temperatura ambiente'), ( 102567890, 'Agulha para Insulina - 100 Unidades', 5, 5, 3, 3, 7896089012353, 'Material para aplicação de insulina.', 40.00, '2029-01-01', 3, 3, 'Descartar em coletor adequado'), ( 103987123, 'Vitamina A+D Gotas 20ml', 3, 5, 2, 4, 7896090123464, 'Suplemento vitamínico (A e D).', 15.20, '2027-04-25', 4, 4, 'Proteger da luz'), ( 104012345, 'Lenços Umedecidos (Pacote) - 50 Unidades', 5, 5, 4, 5, 7896012345686, 'Higiene do bebê e uso geral.', 9.50, '2027-12-15', 5, 5, 'Manter o pacote bem fechado'), ( 105987654, 'Espinheira Santa Cápsulas - 60 Unidades', 1, 5, 2, 6, 7896023456797, 'Fitoterápico para problemas estomacais.', 21.00, '2027-06-10', 6, 6, 'Conservar em local seco e fresco'), (106012398, 'Balança Digital para Banheiro', 5, 5, 3, 7, 7896034567898, 'Monitoramento de peso.', 89.90, '2030-05-01', 7, 7, 'Guardar em local seco'), ( 107987321, 'Pomada Geriátrica Anti-inflamatória 40g', 4, 2, 1, 8, 7896045678909, 'Alívio de dores em articulações e músculos.', 23.90, '2026-11-30', 8, 8, 'Manter em temperatura ambiente'), ( 108567890, 'Termômetro Digital Clínico', 5, 5, 3, 9, 7896056789020, 'Medição de temperatura corporal.', 18.90, '2030-03-01', 9, 9, 'Limpar com álcool e guardar na embalagem'), ( 109987123, 'Creme Dental Anticáries 90g', 4, 5, 4, 10, 7896099999999, 'Higiene oral diária com flúor.', 8.50, '2027-08-10', 10, 10, 'Armazenar em local fresco e seco'), ( 110012345, 'Dipirona Sódica Xarope Infantil 100ml', 3, 2, 1, 1, 7896001234560, 'Antitérmico e analgésico para crianças.', 11.50, '2026-07-20', 1, 1, 'Proteger da luz'), ( 111987654, 'Ácido Fólico 5mg - 30 Comprimidos', 1, 5, 2, 2, 7896001234561, 'Suplemento para gestantes e anemia.', 9.90, '2027-05-10', 2, 2, 'Manter em local seco'), ( 112567890, 'Tiras Reagentes para Glicemia - 50 Unidades', 5, 5, 3, 3, 7896001234562, 'Monitoramento de glicose.', 65.00, '2028-02-01', 3, 3, 'Conservar em ambiente fresco'), ( 113987123, 'Shampoo Anticaspa 200ml', 3, 5, 4, 4, 7896001234563, 'Tratamento e prevenção de caspa.', 28.50, '2027-11-15', 4, 4, 'Evitar contato com os olhos'), ( 114012345, 'Cloridrato de Ondansetrona 8mg - 10 Comprimidos', 1, 3, 1, 5, 7896001234564, 'Antiemético para náuseas e vômitos.', 35.50, '2026-06-01', 5, 5, 'Conservar em temperatura ambiente'), ( 115987654, 'Probiótico Lactobacillus - 30 Cápsulas', 2, 5, 2, 6, 7896001234565, 'Saúde digestiva e flora intestinal.', 39.90, '2027-09-05', 6, 6, 'Manter refrigerado (opcional)'), ( 116012398, 'Bota Ortopédica Imobilizadora', 5, 5, 3, 7, 7896001234566, 'Suporte para lesões no pé/tornozelo.', 150.00, '2030-10-01', 7, 7, 'Armazenar em local limpo'), ( 117987321, 'Pomada para Herpes Labial 5g', 4, 2, 1, 8, 7896001234567, 'Tratamento de lesões herpéticas.', 19.90, '2027-02-28', 8, 8, 'Uso tópico'), ( 118567890, 'Loção Pós-Barba 100ml', 3, 5, 4, 9, 7896001234568, 'Acalma e hidrata a pele após o barbear.', 22.50, '2027-11-01', 9, 9, 'Conservar em local fresco'), ( 119987123, 'Desloratadina Xarope 100ml', 3, 2, 1, 10, 7896001234569, 'Antialérgico não sedante.', 20.50, '2026-10-15', 10, 10, 'Proteger da luz'), ( 120012345, 'Cloridrato de Tramadol 50mg - 10 Cápsulas', 1, 4, 1, 1, 7896001234570, 'Analgésico potente (Opioide fraco).', 31.90, '2026-04-01', 1, 1, 'Manter em local seco'), ( 121987654, 'Colágeno Hidrolisado em Pó 250g', 2, 5, 2, 2, 7896001234571, 'Suporte para pele e articulações.', 55.00, '2027-12-30', 2, 2, 'Misturar em água ou suco'), ( 122567890, 'Luvas de Procedimento Não Estéreis (Caixa c/ 100)', 5, 5, 3, 3, 7896001234572, 'Proteção para procedimentos.', 29.90, '2028-09-01', 3, 3, 'Manter em local seco'), ( 123987123, 'Sérum Facial Vitamina C 30ml', 3, 5, 4, 4, 7896001234573, 'Antioxidante e clareador de pele.', 68.90, '2027-07-25', 4, 4, 'Conservar em local fresco e escuro'), ( 124012345, 'Metoclopramida 10mg - 20 Comprimidos', 1, 2, 1, 5, 7896001234574, 'Antiemético e procinético.', 10.50, '2026-05-15', 5, 5, 'Conservar em temperatura ambiente'), ( 125987654, 'Creatina Monohidratada 300g', 2, 5, 2, 6, 7896001234575, 'Suplemento para ganho de massa muscular.', 89.90, '2027-10-01', 6, 6, 'Consumir com água'), ( 126012398, 'Máscara Cirúrgica Descartável (Caixa c/ 50)', 5, 5, 3, 7, 7896001234576, 'Proteção respiratória.', 15.00, '2028-05-20', 7, 7, 'Armazenar longe da umidade'), ( 127987321, 'Pomada para Hemorroidas 20g', 4, 2, 1, 8, 7896001234577, 'Alívio da dor e inflamação local.', 25.90, '2026-12-05', 8, 8, 'Uso externo'), ( 128567890, 'Lenço de Papel (Caixa)', 5, 5, 4, 9, 7896001234578, 'Higiene pessoal.', 4.90, '2030-01-01', 9, 9, 'Manter em local seco'), ( 129987123, 'Escitalopram 10mg - 30 Comprimidos', 1, 4, 1, 10, 7896001234579, 'Antidepressivo (ISRS).', 48.50, '2026-11-20', 10, 10, 'Proteger da luz e umidade'), ( 130012345, 'Diclofenaco Sódico 50mg - 20 Comprimidos', 1, 2, 1, 1, 7896001234580, 'Anti-inflamatório e analgésico.', 14.90, '2026-08-15', 1, 1, 'Manter em local seco e fresco'), ( 131987654, 'Whey Protein Concentrado 900g', 2, 5, 2, 2, 7896001234581, 'Suplemento proteico.', 110.00, '2027-07-01', 2, 2, 'Conservar o pote bem fechado'), (132567890, 'Seringa Descartável 3ml c/ Agulha - 10 Unidades', 5, 5, 3, 3, 7896001234582, 'Material para injeção.', 18.00, '2028-11-10', 3, 3, 'Manter em embalagem estéril'), ( 133987123, 'Desodorante Aerossol Sem Perfume 150ml', 3, 5, 4, 4, 7896001234583, 'Higiene pessoal.', 17.50, '2027-09-30', 4, 4, 'Proteger do sol e calor'), ( 134012345, 'Furosemida 40mg - 20 Comprimidos', 1, 3, 1, 5, 7896001234584, 'Diurético de alça.', 12.50, '2026-03-25', 5, 5, 'Conservar em temperatura ambiente'), ( 135987654, 'Ginkgo Biloba Cápsulas - 60 Unidades', 2, 5, 2, 6, 7896001234585, 'Fitoterápico para circulação e memória.', 29.90, '2027-05-10', 6, 6, 'Conservar em local fresco'), ( 136012398, 'Fita Microporosa 25mm x 10m', 5, 5, 3, 7, 7896001234586, 'Fixação de curativos.', 8.90, '2029-02-01', 7, 7, 'Armazenar em local seco'), ( 137987321, 'Pomada Nebacetin 15g', 4, 2, 1, 8, 7896001234587, 'Antibiótico tópico.', 28.00, '2026-10-30', 8, 8, 'Uso externo'), ( 138567890, 'Esmalte Base Fortalecedora 10ml', 3, 5, 4, 9, 7896001234588, 'Cuidado com as unhas.', 7.50, '2027-11-01', 9, 9, 'Manter longe do calor'), ( 139987123, 'Rivotril (Clonazepam) Gotas 2,5mg/ml 20ml', 3, 4, 1, 10, 7896001234589, 'Ansiolítico e anticonvulsivante.', 45.90, '2026-09-15', 10, 10, 'Proteger da luz'), ( 140012345, 'Losartana Potássica 50mg - 60 Comprimidos', 1, 4, 1, 1, 7896001234590, 'Antihipertensivo.', 50.00, '2027-01-10', 1, 1, 'Evitar exposição a umidade'), (141987654, 'Creatina Cápsulas 120 Unidades', 2, 5, 2, 2, 7896001234591, 'Suplemento de força e explosão.', 79.90, '2027-08-01', 2, 2, 'Manter o pote bem fechado'), ( 142567890, 'Vitamina K Injetável 10mg/ml - 3 Ampolas', 3, 3, 1, 3, 7896001234592, 'Uso hospitalar para coagulação.', 55.00, '2026-04-05', 3, 3, 'Proteger da luz'), ( 143987123, 'Loção Hidratante Pós-Sol 200ml', 4, 5, 4, 4, 7896001234593, 'Alívio e hidratação da pele após exposição solar.', 19.90, '2027-09-01', 4, 4, 'Conservar em local fresco'), ( 144012345, 'Clavulanato de Potássio 125mg + Amoxicilina 875mg - 14 Comprimidos', 1, 3, 1, 5, 7896001234594, 'Antibiótico de amplo espectro.', 48.75, '2026-06-20', 5, 5, 'Evitar calor e umidade'), ( 145987654, 'Óleo de Coco Extra Virgem 500ml', 3, 5, 2, 6, 7896001234595, 'Alimento funcional.', 25.50, '2027-10-15', 6, 6, 'Solidifica abaixo de 25°C'), ( 146012398, 'Esparadrapo 5cm x 4,5m', 5, 5, 3, 7, 7896001234596, 'Fixação de curativos pesados.', 11.50, '2029-03-01', 7, 7, 'Armazenar em local seco'), ( 147987321, 'Pomada para Dores Musculares 50g', 4, 2, 1, 8, 7896001234597, 'Alívio tópico de dores musculares.', 17.90, '2027-01-20', 8, 8, 'Uso externo'), ( 148567890, 'Protetor Diário sem Perfume - 40 Unidades', 5, 5, 4, 9, 7896001234598, 'Higiene íntima feminina.', 8.50, '2028-04-01', 9, 9, 'Manter em local seco'), ( 149987123, 'Sinvastatina 40mg - 30 Comprimidos', 1, 3, 1, 10, 7896001234599, 'Redutor de colesterol.', 45.90, '2026-12-10', 10, 10, 'Proteger da luz e umidade'), ( 150012345, 'Ivermectina 6mg - 4 Comprimidos', 1, 2, 1, 1, 7896001234600, 'Antiparasitário.', 15.00, '2026-05-01', 1, 1, 'Conservar em local seco e fresco'), ( 151987654, 'Zinco Quelato Cápsulas - 60 Unidades', 2, 5, 2, 2, 7896001234601, 'Suplemento mineral para imunidade e pele.', 23.50, '2027-11-05', 2, 2, 'Manter em local seco'), ( 152567890, 'Aparelho de Pressão Digital de Pulso', 5, 5, 3, 3, 7896001234602, 'Monitoramento da pressão arterial.', 99.90, '2030-07-01', 3, 3, 'Guardar em estojo protetor'), ( 153987123, 'Álcool Isopropílico 100ml', 3, 5, 3, 4, 7896001234603, 'Limpeza de eletrônicos e superfícies.', 7.90, '2027-03-20', 4, 4, 'Líquido inflamável'), ( 154012345, 'Metildopa 250mg - 30 Comprimidos', 1, 4, 1, 5, 7896001234604, 'Anti-hipertensivo para gestantes.', 30.50, '2026-07-15', 5, 5, 'Conservar em temperatura ambiente'), ( 155987654, 'Vitamina K2 + D3 Cápsulas - 30 Unidades', 2, 5, 2, 6, 7896001234605, 'Suporte para saúde óssea e cardiovascular.', 41.90, '2027-12-01', 6, 6, 'Proteger da luz e umidade'), ( 156012398, 'Atadura de Crepe 10cm x 4,5m', 5, 5, 3, 7, 7896001234606, 'Compressão e suporte.', 5.50, '2029-05-10', 7, 7, 'Armazenar em local seco'), ( 157987321, 'Pomada Neomicina + Bacitracina 15g', 4, 2, 1, 8, 7896001234607, 'Antibiótico tópico (Genérico de Nebacetin).', 21.50, '2026-11-05', 8, 8, 'Uso externo'), ( 158567890, 'Máscara Facial Hidratante Sache 15g', 4, 5, 4, 9, 7896001234608, 'Cuidado com a pele.', 14.90, '2027-08-20', 9, 9, 'Aplicar e remover após 15 minutos'), ( 159987123, 'Quetiapina 25mg - 30 Comprimidos', 1, 4, 1, 10, 7896001234609, 'Antipsicótico (Controlado).', 65.90, '2026-06-30', 10, 10, 'Armazenar em temperatura ambiente'), ( 160012345, 'Dramin B6 (Dimenidrinato + Piridoxina) - 20 Comprimidos', 1, 2, 1, 1, 7896001234610, 'Antiemético para enjoo e vômito.', 11.90, '2026-09-01', 1, 1, 'Pode causar sonolência'), ( 161987654, 'Suplemento Alimentar para Imunidade (Cápsulas) - 30 Unidades', 2, 5, 2, 2, 7896001234611, 'Vitaminas e minerais para o sistema imune.', 35.00, '2027-05-01', 2, 2, 'Manter em local seco e fresco'), ( 162567890, 'Glicose 5% Solução Injetável 500ml', 3, 3, 3, 3, 7896001234612, 'Hidratação e fonte de energia.', 8.50, '2026-11-25', 3, 3, 'Uso hospitalar, manter em temperatura controlada'), ( 163987123, 'Talco para Pés Antisséptico 100g', 5, 5, 4, 4, 7896001234613, 'Prevenção de odores e umidade nos pés.', 12.50, '2027-10-10', 4, 4, 'Agitar antes de usar'), ( 164012345, 'Dipirona Gotas 500mg/ml 10ml', 3, 2, 1, 5, 7896001234614, 'Analgésico e antitérmico.', 7.90, '2026-04-15', 5, 5, 'Proteger da luz'), ( 165987654, 'Maca Peruana em Pó 150g', 2, 5, 2, 6, 7896001234615, 'Energético natural e vitalidade.', 28.90, '2027-09-01', 6, 6, 'Adicionar a vitaminas ou iogurte'), ( 166012398, 'Termômetro de Testa Infravermelho', 5, 5, 3, 7, 7896001234616, 'Medição de temperatura sem contato.', 79.90, '2030-11-01', 7, 7, 'Manter as lentes limpas'), ( 167987321, 'Pomada Fenergan (Prometazina) 30g', 4, 2, 1, 8, 7896001234617, 'Antialérgico tópico.', 16.50, '2027-01-05', 8, 8, 'Evitar exposição solar após aplicação'), ( 168567890, 'Creme para Pés Rachados 60g', 4, 5, 4, 9, 7896001234618, 'Hidratação e reparação de pés secos.', 21.00, '2027-12-01', 9, 9, 'Uso noturno recomendado'), ( 169987123, 'Buscopan Composto Injetável - 3 Ampolas', 3, 3, 1, 10, 7896001234619, 'Antiespasmódico e analgésico.', 19.50, '2026-08-01', 10, 10, 'Uso profissional'), ( 170012345, 'Pílula do Dia Seguinte (Levonorgestrel) - 1 Comprimido', 1, 3, 1, 1, 7896001234620, 'Contracepção de emergência.', 18.50, '2026-10-20', 1, 1, 'Uso pontual e de emergência'), ( 171987654, 'Óleo de Peixe (EPA/DHA) Cápsulas - 90 Unidades', 2, 5, 2, 2, 7896001234621, 'Fonte de Ômega 3.', 49.90, '2027-09-15', 2, 2, 'Proteger da luz'), ( 172567890, 'Aspirador Nasal Manual Infantil', 5, 5, 3, 3, 7896001234622, 'Desobstrução nasal para bebês.', 24.50, '2030-01-01', 3, 3, 'Limpar após o uso'), ( 173987123, 'Escova de Cabelo Desembaraçadora', 5, 5, 4, 4, 7896001234623, 'Cuidado com os cabelos.', 15.90, '2030-05-01', 4, 4, 'Manter limpa'), ( 174012345, 'Novalgina (Dipirona) 1g - 10 Comprimidos', 1, 2, 1, 5, 7896001234624, 'Analgésico e antitérmico.', 12.90, '2026-05-10', 5, 5, 'Conservar em local seco'), ( 175987654, 'Cloreto de Magnésio PA Cápsulas - 60 Unidades', 2, 5, 2, 6, 7896001234625, 'Suplemento mineral.', 22.50, '2027-11-01', 6, 6, 'Tomar com água'), ( 176012398, 'Bolsa de Água Quente (Tamanho Grande)', 5, 5, 3, 7, 7896001234626, 'Alívio de dores e cólicas (calor).', 29.90, '2030-04-01', 7, 7, 'Não encher com água fervente'), ( 177987321, 'Pomada para Micose (Miconazol) 20g', 4, 2, 1, 8, 7896001234627, 'Antifúngico tópico.', 18.00, '2027-02-15', 8, 8, 'Aplicar na área afetada'), ( 178567890, 'Creme Depilatório Corporal 100g', 4, 5, 4, 9, 7896001234628, 'Remoção de pelos.', 27.90, '2027-10-01', 9, 9, 'Fazer teste de alergia'), ( 179987123, 'Diazepam 5mg - 20 Comprimidos', 1, 4, 1, 10, 7896001234629, 'Ansiolítico e sedativo.', 19.90, '2026-07-25', 10, 10, 'Controlado, evitar álcool'), ( 180012345, 'Fluconazol 150mg (Genérico) - 1 Comprimido', 1, 3, 1, 1, 7896001234630, 'Tratamento de candidíase.', 10.50, '2026-09-10', 1, 1, 'Manter em temperatura ambiente'), ( 181987654, 'Tribulus Terrestris Cápsulas - 60 Unidades', 2, 5, 2, 2, 7896001234631, 'Suplemento para performance e libido.', 42.90, '2027-03-30', 2, 2, 'Consultar médico/nutricionista'), ( 182567890, 'Gaze Não Estéril (Pacote) - 500 Unidades', 5, 5, 3, 3, 7896001234632, 'Uso geral em curativos e limpeza.', 25.00, '2029-11-01', 3, 3, 'Manter em local seco e limpo'), (183987123, 'Enxaguante Bucal Sem Álcool 500ml', 3, 5, 4, 4, 7896001234633, 'Higiene oral e hálito fresco.', 16.50, '2027-12-05', 4, 4, 'Não ingerir'), ( 184012345, 'Cloridrato de Amantadina 100mg - 30 Comprimidos', 1, 4, 1, 5, 7896001234634, 'Antiviral e antiparkinsoniano.', 38.90, '2026-11-15', 5, 5, 'Conservar em temperatura ambiente'), ( 185987654, 'Protetor Solar Infantil FPS 60 120ml', 4, 5, 4, 6, 7896001234635, 'Alta proteção solar para crianças.', 45.90, '2028-01-25', 6, 6, 'Reaplicar a cada 2h'), ( 186012398, 'Óleo de Copaíba 30ml', 3, 5, 2, 7, 7896001234636, 'Fitoterápico anti-inflamatório (uso oral e tópico).', 33.50, '2027-04-10', 7, 7, 'Proteger da luz e calor'), ( 187987321, 'Pomada para Picadas de Inseto 20g', 4, 2, 1, 8, 7896001234637, 'Alívio imediato de coceira e irritação.', 14.90, '2027-01-10', 8, 8, 'Uso externo'), ( 188567890, 'Pente Fino para Piolhos', 5, 5, 4, 9, 7896001234638, 'Remoção de piolhos e lêndeas.', 9.90, '2030-01-01', 9, 9, 'Lavar após o uso'), ( 189987123, 'Ritalina (Metilfenidato) 10mg - 30 Comprimidos', 1, 4, 1, 10, 7896001234639, 'Estimulante do SNC (Controlado).', 95.00, '2026-06-01', 10, 10, 'Venda sob prescrição especial (amarela)'), ( 190012345, 'Ibuprofeno Suspensão Oral Infantil 20mg/ml 100ml', 3, 2, 1, 1, 7896001234640, 'Antitérmico e analgésico infantil.', 18.90, '2026-11-05', 1, 1, 'Agitar antes de usar'), ( 191987654, 'Picolinato de Cromo Cápsulas - 60 Unidades', 2, 5, 2, 2, 7896001234641, 'Auxilia no metabolismo de carboidratos.', 26.90, '2027-05-20', 2, 2, 'Manter em local seco'), (92567890, 'Balança de Cozinha Digital (Medir Suplementos)', 5, 5, 3, 3, 7896001234642, 'Precisão para dosagem de suplementos.', 49.90, '2030-03-01', 3, 3, 'Limpar com pano úmido'), ( 193987123, 'Escova de Dente Elétrica (Recarregável)', 5, 5, 4, 4, 7896001234643, 'Higiene oral avançada.', 130.00, '2030-01-01', 4, 4, 'Carregar totalmente antes do primeiro uso'), ( 194012345, 'Sinvastatina 10mg - 30 Comprimidos', 1, 3, 1, 5, 7896001234644, 'Redutor de colesterol.', 28.90, '2027-01-10', 5, 5, 'Proteger da luz e umidade'), ( 195987654, 'Chá de Camomila (Filtro) - 10 Sachês', 5, 5, 2, 6, 7896001234645, 'Fitoterápico relaxante.', 5.50, '2027-10-01', 6, 6, 'Conservar em local seco'), ( 196012398, 'Vitamina C Efervescente 1g - 10 Comprimidos', 1, 5, 2, 7, 7896001234646, 'Reforço imunológico.', 14.50, '2026-12-15', 7, 7, 'Dissolver em água'), ( 197987321, 'Pomada Dexpantenol 30g', 4, 5, 4, 8, 7896001234647, 'Hidratação e regeneração da pele (Genérico).', 18.90, '2027-03-01', 8, 8, 'Uso tópico'), ( 198567890, 'Máscara para Cílios Preto 8ml', 3, 5, 4, 9, 7896001234648, 'Cosmético para maquiagem.', 22.00, '2027-09-05', 9, 9, 'Manter a embalagem fechada'), ( 199987123, 'Pregabalina 75mg - 30 Cápsulas', 1, 4, 1, 10, 7896001234649, 'Anticonvulsivante e para dor neuropática.', 55.00, '2026-08-01', 10, 10, 'Venda sob prescrição'), ( 200012345, 'Paracetamol Gotas Infantil 200mg/ml 15ml', 3, 2, 1, 1, 7896001234650, 'Analgésico e antitérmico para bebês.', 9.90, '2026-04-10', 1, 1, 'Proteger da luz'), ( 201987654, 'Suplemento de Biotina Cápsulas - 60 Unidades', 2, 5, 2, 2, 7896001234651, 'Saúde dos cabelos, pele e unhas.', 27.50, '2027-11-15', 2, 2, 'Manter em local seco'), ( 202567890, 'Compressa Quente/Fria Reutilizável', 5, 5, 3, 3, 7896001234652, 'Alívio de dores e inchaços.', 15.90, '2030-01-01', 3, 3, 'Aquecer em água ou micro-ondas'), ( 203987123, 'Gel Higienizante para Mãos (Pocket) 60ml', 3, 5, 4, 4, 7896001234653, 'Antisséptico portátil.', 6.50, '2027-10-05', 4, 4, 'Evitar calor'), ( 204012345, 'Tramadol Cloridrato 50mg - 10 Cápsulas', 1, 4, 1, 5, 7896001234654, 'Analgésico forte.', 29.50, '2026-07-20', 5, 5, 'Venda sob prescrição (B1)'), ( 205987654, 'Melatonina Gotas 20ml', 3, 5, 2, 6, 7896001234655, 'Hormônio do sono.', 33.90, '2027-09-01', 6, 6, 'Tomar antes de dormir'), ( 206012398, 'Cadeira de Rodas Dobrável', 5, 5, 3, 7, 7896001234656, 'Mobilidade para pacientes.', 650.00, '2040-01-01', 7, 7, 'Manter partes móveis lubrificadas'), ( 207987321, 'Pomada para Assadura Infantil com Nistatina 60g', 4, 3, 1, 8, 7896001234657, 'Tratamento de assaduras com fungos.', 25.50, '2027-02-10', 8, 8, 'Uso pediátrico'), ( 208567890, 'Esmalte Base Top Coat Brilho 10ml', 3, 5, 4, 9, 7896001234658, 'Finalizador para unhas.', 9.50, '2028-01-01', 9, 9, 'Secagem rápida'), ( 209987123, 'Valerato de Betametasona Creme 30g', 4, 2, 1, 10, 7896001234659, 'Corticosteroide tópico.', 14.90, '2027-03-25', 10, 10, 'Conservar em local fresco'); 

 

