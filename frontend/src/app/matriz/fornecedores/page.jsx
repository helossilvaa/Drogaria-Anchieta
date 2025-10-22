"use client";

import { useState, useEffect } from "react";

export default function CadastroFornecedores() {
  const estadoInicialFornecedor = {
    fornecedor: "",
    email: "",
    telefone: "",
    cnpj: "",
    cep: "",
    cidade: "",
    estado: "",
    bairro: "",
    logradouro: "",
    numero: "",
    status: true, // status padrão: ativo
  };

  const [abrirModal, setAbrirModal] = useState(false);
  const [fornecedores, setFornecedores] = useState([]);
  const [buscaFornecedor, setBuscaFornecedor] = useState("");
  const [novoFornecedor, setNovoFornecedor] = useState(estadoInicialFornecedor);
  const [editarFornecedorId, setEditarFornecedorId] = useState(null);
  const [excluirFornecedorId, setExcluirFornecedorId] = useState(null);
  const [abrirModalExcluir, setAbrirModalExcluir] = useState(false);

  const fornecedoresFiltrados = fornecedores.filter((f) =>
  f.fornecedor.toLowerCase().includes(buscaFornecedor.toLowerCase())
);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 15;

  const indexUltimo = paginaAtual * itensPorPagina;
  const indexPrimeiro = indexUltimo - itensPorPagina;
  const fornecedoresPagina = fornecedoresFiltrados.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(fornecedoresFiltrados.length / itensPorPagina);

  const mudarPagina = (numero) => {
  if (numero < 1) numero = 1;
  if (numero > totalPaginas) numero = totalPaginas;
  setPaginaAtual(numero);
};



  const API_URL = "http://localhost:8080/api/fornecedores";

  useEffect(() => {
    fetchFornecedores();
  }, []);

  const fetchFornecedores = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setFornecedores(data);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
    }
  };


  const aplicarMascara = (name, value) => {
    if (name === "telefone") {
      return value
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .slice(0, 15);
    }

    if (name === "cnpj") {
      return value
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .slice(0, 18);
    }

    if (name === "cep") {
      return value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);
    }

    return value;
  };

  const buscarEndereco = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setNovoFornecedor((prev) => ({
            ...prev,
            logradouro: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let novoValor;

    if (type === "checkbox") {
      novoValor = checked;
    } else if (name === "status") {
      novoValor = value === "true"; 
    } else {
      novoValor = aplicarMascara(name, value);
    }

    setNovoFornecedor((prev) => ({ ...prev, [name]: novoValor }));

    if (name === "cep") buscarEndereco(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fornecedorParaAPI = {
      ...novoFornecedor
    };

    try {
      const method = editarFornecedorId ? "PUT" : "POST";
      const url = editarFornecedorId ? `${API_URL}/${editarFornecedorId}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fornecedorParaAPI),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Erro na resposta do servidor:", res.status, errorText);
        throw new Error("Erro ao salvar fornecedor");
      }

      alert(`Fornecedor ${editarFornecedorId ? "editado" : "cadastrado"} com sucesso!`);
      setAbrirModal(false);
      setNovoFornecedor(estadoInicialFornecedor);
      setEditarFornecedorId(null);
      fetchFornecedores();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar fornecedor.");
    }
  };

  const handleEditar = (fornecedor) => {
    setEditarFornecedorId(fornecedor.id);
    setNovoFornecedor({
      fornecedor: fornecedor.fornecedor || "",
      email: fornecedor.email || "",
      telefone: fornecedor.telefone || "",
      cnpj: fornecedor.cnpj || "",
      cep: fornecedor.cep || "",
      cidade: fornecedor.cidade || "",
      estado: fornecedor.estado || "",
      bairro: fornecedor.bairro || "",
      logradouro: fornecedor.logradouro || "",
      numero: fornecedor.numero || "",
      status: fornecedor.status === "ATIVO" || fornecedor.status === true,
    });
    setAbrirModal(true);
  };

  const handleExcluir = (id) => {
    setExcluirFornecedorId(id);
    setAbrirModalExcluir(true);
  };

  const confirmarExcluir = async () => {
    try {
      const res = await fetch(`${API_URL}/${excluirFornecedorId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Erro ao excluir fornecedor:", res.status, errorText);
        throw new Error("Erro ao excluir fornecedor");
      }

      alert("Fornecedor excluído com sucesso!");
      setAbrirModalExcluir(false);
      setExcluirFornecedorId(null);
      fetchFornecedores();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir fornecedor.");
    }
  };

  return (
    <>
      <div>
        <h1>Fornecedores</h1>
      </div>

    <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
  <input
    type="text"
    placeholder="Buscar fornecedor por nome..."
    value={buscaFornecedor}
    onChange={(e) => {
    setBuscaFornecedor(e.target.value);
    setPaginaAtual(1); 
}}

    className="border rounded-md p-2 w-64"
  />

  <button
    type="button"
    onClick={() => {
      setNovoFornecedor(estadoInicialFornecedor);
      setEditarFornecedorId(null);
      setAbrirModal(true);
    }}
    className="cursor-pointer border p-2 rounded-md bg-blue-500 text-white"
  >
    Novo Fornecedor
  </button>
</div>

      {/* Modal de Cadastro/Edição */}
      {abrirModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl mb-3 font-bold">
              {editarFornecedorId ? "Editar Fornecedor" : "Novo Fornecedor"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {[ 
                ["fornecedor", "Fornecedor", "text"],
                ["email", "Email", "email"],
                ["telefone", "Telefone", "tel"],
                ["cnpj", "CNPJ", "text"],
                ["cep", "CEP", "text"],
                ["cidade", "Cidade", "text"],
                ["estado", "Estado", "text"],
                ["bairro", "Bairro", "text"],
                ["logradouro", "Rua", "text"],
                ["numero", "Número", "number"],
              ].map(([name, label, type]) => (
                <div key={name}>
                  <label htmlFor={name} className="block">
                    {label}
                  </label>
                  <input
                    id={name}
                    type={type}
                    name={name}
                    value={novoFornecedor[name]}
                    onChange={handleChange}
                    className="border rounded-md p-2 w-full"
                    required
                  />
                </div>
              ))}

              {/* Campo de Status com Radio Buttons */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="block font-medium text-gray-700">Status</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="true"
                      checked={novoFornecedor.status === true}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span>Ativo</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="false"
                      checked={novoFornecedor.status === false}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span>Inativo</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white rounded-md p-2"
                >
                  Salvar
                </button>
              </div>
            </form>

            <button
              onClick={() => {
                setAbrirModal(false);
                setEditarFornecedorId(null);
                setNovoFornecedor(estadoInicialFornecedor);
              }}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
              aria-label="Fechar modal"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Modal de Exclusão */}
      {abrirModalExcluir && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl mb-4 font-bold">Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir este fornecedor?</p>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setAbrirModalExcluir(false)}
                className="bg-gray-300 px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExcluir}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Fornecedores */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#245757] text-left text-white rounded-t-lg">
              <th className="p-2">Fornecedor</th>
              <th className="p-2">E-mail</th>
              <th className="p-2">Telefone</th>
              <th className="p-2">CNPJ</th>
              <th className="p-2">CEP</th>
              <th className="p-2">Cidade</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Bairro</th>
              <th className="p-2">Endereço</th>
              <th className="p-2">Número</th>
              <th className="p-2">Status</th>
              <th className="p-2 rounded-tr-lg">Ações</th>
            </tr>
          </thead>

          <tbody>
            {fornecedoresPagina.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{u.fornecedor}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.telefone}</td>
                <td className="p-2">{u.cnpj}</td>
                <td className="p-2">{u.cep}</td>
                <td className="p-2">{u.cidade}</td>
                <td className="p-2">{u.estado}</td>
                <td className="p-2">{u.bairro}</td>
                <td className="p-2">{u.logradouro}</td>
                <td className="p-2">{u.numero}</td>
                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      u.status === "ATIVO" || u.status === true
                        ? "bg-[#245757]/20 text-[#245757]"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {u.status === "ATIVO" || u.status === true ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="p-2 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => handleEditar(u)}
                    className="text-gray-700 hover:text-[#245757]"
                    title="Editar"
                  >
                    <svg
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleExcluir(u.id)}
                    className="text-red-700 hover:text-red-900"
                    title="Excluir"
                  >
                    <svg
                      className="w-6 h-6 text-red-600 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPaginas > 1 && (
  <div className="flex justify-center items-center gap-2 mt-4 select-none">
    <button
      onClick={() => mudarPagina(paginaAtual - 1)}
      disabled={paginaAtual === 1}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      &lt; Anterior
    </button>

    {[...Array(totalPaginas)].map((_, i) => {
      const numeroPagina = i + 1;
      return (
        <button
          key={numeroPagina}
          onClick={() => mudarPagina(numeroPagina)}
          className={`px-3 py-1 border rounded ${
            paginaAtual === numeroPagina ? "bg-blue-300" : ""
          }`}
        >
          {numeroPagina}
        </button>
      );
    })}

    <button
      onClick={() => mudarPagina(paginaAtual + 1)}
      disabled={paginaAtual === totalPaginas}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Próxima &gt;
    </button>
  </div>
)}
      </div>
    </>
  );
}
