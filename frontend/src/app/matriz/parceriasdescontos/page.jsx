"use client";

import { useState, useRef, useEffect } from "react";

export default function ParceriasDescontos() {
  // Constantes e estados
  const [abrirModalParceria, setAbrirModalParceria] = useState(false);
  const [abrirModalDesconto, setAbrirModalDesconto] = useState(false);
  const [activeTab, setActiveTab] = useState("parcerias");
  const [lineStyle, setLineStyle] = useState({});
  const [parcerias, setParcerias] = useState([]);
  const [descontos, setDescontos] = useState([]);
  const [parceiro, setParceiro] = useState("");
  const [porcentagem, setPorcentagem] = useState("");
  const [tipodescontoId, setTipoDescontoId] = useState("");
  const [nomeDesconto, setNomeDesconto] = useState("");
  const [valorDesconto, setValorDesconto] = useState("");
  const [erro, setErro] = useState("");
  const refs = {
    parcerias: useRef(null),
    descontos: useRef(null),
  };

  const API_URL = "http://localhost:8080";

  // Buscar as parcerias e descontos da API
  useEffect(() => {
    const fetchParcerias = async () => {
      try {
        const res = await fetch(`${API_URL}/api/parcerias`);
        const data = await res.json();
        setParcerias(data);
      } catch (error) {
        console.error("Erro ao carregar parcerias:", error);
      }
    };

    const fetchDescontos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/descontos`);
        const data = await res.json();
        setDescontos(data);
      } catch (error) {
        console.error("Erro ao carregar descontos:", error);
      }
    };

    fetchParcerias();
    fetchDescontos();
  }, []);

  // Atualizar a linha ativa com base na aba selecionada
  useEffect(() => {
    const current = refs[activeTab]?.current;
    if (current) {
      setLineStyle({
        width: current.offsetWidth + "px",
        left: current.offsetLeft + "px",
        top: "calc(100% + 5px)",
        transition: "left 0.3s ease, width 0.3s ease, top 0.3s ease",
      });
    }
  }, [activeTab]);

  // Função para criar uma nova parceria
  const criarParceria = async () => {
    if (!parceiro || !porcentagem) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/parcerias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ parceiro, porcentagem }),
      });

      const data = await res.json();
      if (res.ok) {
        const resParcerias = await fetch(`${API_URL}/api/parcerias`);
        const parceriasData = await resParcerias.json();
        setParcerias(parceriasData);
        setAbrirModalParceria(false);
        setParceiro("");
        setPorcentagem("");
        setErro("");
      } else {
        setErro(data.message || "Erro ao criar parceria");
      }
    } catch (error) {
      console.error("Erro ao criar parceria:", error);
      setErro("Erro ao criar parceria.");
    }
  };

  //Criar desconto
  const criarDesconto = async () => {
  if (!tipodescontoId || !nomeDesconto || !valorDesconto) {
    alert("Preencha todos os campos");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/descontos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tipodesconto_id: tipodescontoId, nome: nomeDesconto, desconto: valorDesconto }),
    });

    if (!res.ok) {
      const errorText = await res.json();
      let errorMessage = errorText.message || "Erro ao criar desconto.";

      if (res.status === 400) {
        errorMessage = errorText.message || "Já existe um desconto com esse nome.";
      }

      throw new Error(errorMessage);
    }

    const data = await res.json();

    const resDescontos = await fetch(`${API_URL}/api/descontos`);
    const descontosData = await resDescontos.json();
    setDescontos(descontosData);
    setAbrirModalDesconto(false);
    setTipoDescontoId("");
    setNomeDesconto("");
    setValorDesconto("");
    setErro("");

  } catch (error) {
    console.error("Erro ao criar desconto:", error);
    setErro(error.message || "Erro ao criar desconto.");
  }
};

  return (
    <>
      {/* Título da página */}
      <h1 className="text-xl font-bold mb-4">PARCERIAS E DESCONTOS</h1>

      {/* Barra de navegação */}
      <div className="flex gap-6 mb-6 relative">
        <button
          ref={refs.parcerias}
          onClick={() => setActiveTab("parcerias")}
          className={`${activeTab === "parcerias" ? "text-pink-500" : "text-gray-700"
            } hover:text-pink-500 focus:outline-none transition-colors duration-300 ease-in-out`}
        >
          Parcerias
        </button>
        <button
          ref={refs.descontos}
          onClick={() => setActiveTab("descontos")}
          className={`${activeTab === "descontos" ? "text-pink-500" : "text-gray-700"
            } hover:text-pink-500 focus:outline-none transition-colors duration-300 ease-in-out`}
        >
          Descontos
        </button>

        {/* Linha cinza de fundo */}
        <div className="absolute h-1 bg-gray-300 w-full" style={{ top: "calc(100% + 5px)", left: 0 }}></div>

        {/* Linha ativa */}
        <div className="absolute h-1 bg-pink-500" style={lineStyle}></div>
      </div>

      {/* Seção de Parcerias */}
      <div className="mt-6">
        {activeTab === "parcerias" && (
          <section>
            {/* Botão de criar parceria */}
            <button
              onClick={() => setAbrirModalParceria(true)}
              className="border p-2 rounded-md bg-blue-500 text-white mt-2"
            >
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" />
              </svg>
              Novo Parceiro
            </button>

            {/* Modal para criar nova parceria */}
            {abrirModalParceria && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50">
                <div className="bg-white p-6 rounded-md relative">
                  {/* Fechar o modal com o "X" */}
                  <button
                    onClick={() => setAbrirModalParceria(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                  >
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <h2 className="text-lg font-bold mb-4">Cadastrar Nova Parceria</h2>
                  <input
                    type="text"
                    value={parceiro}
                    onChange={(e) => setParceiro(e.target.value)}
                    placeholder="Nome do Parceiro"
                    className="p-2 mb-4 w-full border rounded"
                  />
                  <input
                    type="number"
                    value={porcentagem}
                    onChange={(e) => setPorcentagem(e.target.value)}
                    placeholder="Porcentagem"
                    className="p-2 mb-4 w-full border rounded"
                  />
                  {/* Exibindo mensagem de erro se existir */}
                  {erro && <p className="text-red-500 mt-2">{erro}</p>}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={criarParceria}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Criar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tabela de Parcerias */}
            {parcerias.length === 0 ? (
              <p className="text-center text-gray-500 mt-6 text-lg">Nenhuma parceria encontrada</p>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-red-300">
                    <tr>
                      <th className="p-2">ID</th>
                      <th className="p-2">Parceiro</th>
                      <th className="p-2">Porcentagem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parcerias.map((p) => (
                      <tr key={p.id} className="border-t">
                        <td className="p-2">{p.id}</td>
                        <td className="p-2">{p.parceiro}</td>
                        <td className="p-2">{p.porcentagem}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Seção de Descontos */}
        {activeTab === "descontos" && (
          <section>
            {/* Botão de criar desconto */}
            <button
              onClick={() => setAbrirModalDesconto(true)}
              className="border p-2 rounded-md bg-blue-500 text-white mt-2"
            >
              Novo Desconto
            </button>

            {/* Modal para criar novo desconto */}
            {abrirModalDesconto && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50">
                <div className="bg-white p-6 rounded-md relative">
                  <button
                    onClick={() => setAbrirModalDesconto(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                  >
                    X
                  </button>

                  <h2 className="text-lg font-bold mb-4">Cadastrar Novo Desconto</h2>
                  <input
                    type="number"
                    value={tipodescontoId}
                    onChange={(e) => setTipoDescontoId(e.target.value)}
                    placeholder="ID Tipo de Desconto"
                    className="p-2 mb-4 w-full border rounded"
                  />
                  <input
                    type="text"
                    value={nomeDesconto}
                    onChange={(e) => setNomeDesconto(e.target.value)}
                    placeholder="Nome do Desconto"
                    className="p-2 mb-4 w-full border rounded"
                  />
                  <input
                    type="number"
                    value={valorDesconto}
                    onChange={(e) => setValorDesconto(e.target.value)}
                    placeholder="Valor do Desconto"
                    className="p-2 mb-4 w-full border rounded"
                  />
                  {erro && <p className="text-red-500 mt-2">{erro}</p>}
                  <div className="flex justify-end gap-2">
                    <button onClick={criarDesconto} className="bg-blue-500 text-white px-4 py-2 rounded">
                      Criar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tabela de Descontos */}
            {descontos.length === 0 ? (
              <p className="text-center text-gray-500 mt-6 text-lg">Nenhum desconto encontrado</p>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-red-300">
                    <tr>
                      <th className="p-2">ID</th>
                      <th className="p-2">ID Tipo de Desconto</th>
                      <th className="p-2">Nome</th>
                      <th className="p-2">Desconto</th>
                      <th className="p-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {descontos.map((d) => (
                      <tr key={d.id} className="border-t">
                        <td className="p-2">{d.id}</td>
                        <td className="p-2">{d.tipodesconto_id}</td>
                        <td className="p-2">{d.nome}</td>
                        <td className="p-2">{d.desconto}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}