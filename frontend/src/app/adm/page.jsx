'use client';
import { useState, useEffect } from 'react';

export default function TesteCaixa() {
  const [caixas, setCaixas] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  // 👉 Carrega todos os caixas ao abrir a página
  useEffect(() => {
    buscarCaixas();
  }, []);

  const buscarCaixas = async () => {
    try {
      setCarregando(true);
      const resposta = await fetch('http://localhost:8080/caixa');
      const dados = await resposta.json();
      setCaixas(dados);
    } catch (erro) {
      setMensagem('Erro ao carregar caixas: ' + erro.message);
    } finally {
      setCarregando(false);
    }
  };

  // 👉 Função para mudar status (abrir/fechar)
  const mudarStatus = async (id, novoStatus) => {
    try {
      setCarregando(true);
      setMensagem('Atualizando status...');

      const resposta = await fetch(`http://localhost:8080/caixa/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus }),
      });

      const dados = await resposta.json();
      setMensagem(dados.mensagem);
      buscarCaixas(); // atualiza a lista depois da mudança
    } catch (erro) {
      setMensagem('Erro ao atualizar status: ' + erro.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 40, fontFamily: 'Arial' }}>
      <h1>🧾 Teste de Abrir e Fechar Caixa</h1>
      {carregando && <p>Carregando...</p>}
      {mensagem && <p style={{ color: 'blue' }}>{mensagem}</p>}

      {caixas.length === 0 ? (
        <p>Nenhum caixa encontrado.</p>
      ) : (
        <table
          style={{
            margin: '20px auto',
            borderCollapse: 'collapse',
            width: '80%',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#eee' }}>
              <th style={{ padding: 10, border: '1px solid #ccc' }}>ID</th>
              <th style={{ padding: 10, border: '1px solid #ccc' }}>Status</th>
              <th style={{ padding: 10, border: '1px solid #ccc' }}>Usuário</th>
              <th style={{ padding: 10, border: '1px solid #ccc' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {caixas.map((cx) => (
              <tr key={cx.id}>
                <td style={{ padding: 10, border: '1px solid #ccc' }}>{cx.id}</td>
                <td style={{ padding: 10, border: '1px solid #ccc' }}>{cx.status}</td>
                <td style={{ padding: 10, border: '1px solid #ccc' }}>{cx.usuario_id}</td>
                <td style={{ padding: 10, border: '1px solid #ccc' }}>
                  {cx.status === 'aberto' ? (
                    <button
                      onClick={() => mudarStatus(cx.id, 'fechado')}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      Fechar
                    </button>
                  ) : (
                    <button
                      onClick={() => mudarStatus(cx.id, 'aberto')}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      Abrir
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={buscarCaixas}
        style={{
          marginTop: 20,
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Recarregar
      </button>
    </div>
  );
}
