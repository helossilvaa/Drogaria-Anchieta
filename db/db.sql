drop database drogaria;
create database drogaria;
use drogaria;


CREATE TABLE setor (
	id INT AUTO_INCREMENT PRIMARY KEY,
    setor VARCHAR(250) NOT NULL
);

CREATE TABLE departamento (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  setor_id INT NOT NULL,
  FOREIGN KEY (setor_id) REFERENCES setor(id)
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
	id INT AUTO_INCREMENT PRIMARY KEY,
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
	id INT AUTO_INCREMENT PRIMARY KEY,
    numero_lote INT NOT NULL,
    data_validade DATE NOT NULL,
    quantidade INT NOT NULL,
    data_entrada DATE NOT NULL,
    fornecedor_id INT NOT NULL,
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
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  nomeConta VARCHAR(200) NOT NULL UNIQUE,
  categoria VARCHAR(100) NOT NULL,
  conta_pdf LONGBLOB NOT NULL,
  status ENUM('paga', 'pendente') DEFAULT 'pendente',
  dataVencimento DATE NOT NULL,
  dataPostada DATE NOT NULL,
  valor DECIMAL(10,2) NOT NULL
);


CREATE TABLE IF NOT EXISTS salarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_funcionario INT NOT NULL,
  setor_id INT NOT NULL,
  departamento_id INT NOT NULL,
  unidade_id INT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  status_pagamento ENUM('pendente', 'pago') DEFAULT 'pendente',
  data_atualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_funcionario) REFERENCES usuarios(id),
  FOREIGN KEY (setor_id) REFERENCES setor(id),
  FOREIGN KEY (departamento_id) REFERENCES departamento(id),
  FOREIGN KEY (unidade_id) REFERENCES unidade(id)
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


 

