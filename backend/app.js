import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import usuarioRotas from './routes/usuarioRotas.js';
import vendasRotas from './routes/vendasRotas.js';
import tipoPagamentoRotas from './routes/tipoPagamentoRotas.js';
import itens_vendaRotas from './routes/itens_vendaRotas.js'
import abrirFechar_CaixaRotas from './routes/abrirFechar_CaixaRotas.js';
import categoriaRotas from './routes/categoriaRotas.js';

dotenv.config();

const app = express();
const porta = process.env.PORT || 8080;

try {
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }));
  app.use(express.json());

  app.use(session({
    secret: 'sJYMmuCB2Z187XneUuaOVYTVUlxEOb2K94tFZy370HjOY7T7aiCKvwhNQpQBYL9e',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));


} catch (err) {
  console.error('Erro na configuração inicial:', err);
  process.exit(1);
}

app.use('/usuarios', usuarioRotas);
app.use('/vendas', vendasRotas);
app.use('/pagamento', tipoPagamentoRotas);
app.use('/itens', itens_vendaRotas);
app.use('/caixa', abrirFechar_CaixaRotas);
app.use('/categoria', categoriaRotas);



app.get('/health', (req, res) => {
  res.status(200).json({ status: 'online' });
});


process.on('unhandledRejection', (reason, promise) => {
  console.error('Rejeição não tratada em:', promise, 'motivo:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Exceção não capturada:', err);
  process.exit(1);
});

const server = app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
}).on('error', (err) => {
  console.error('Erro ao iniciar:', err);
});


process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Servidor encerrado');
  });
});

app.get('/', (req, res) => {
  res.send('Backend funcionando!');
});
