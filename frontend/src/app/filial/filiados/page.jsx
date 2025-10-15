"use client";

import { useState, useEffect } from "react";

export default function Filiados() {
  const [abrirModal, setAbrirModal] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;
  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    data_nascimento: "",
    cep: "",
    cidade: "",
    estado: "",
    bairro: "",
    logradouro: "",
    numero: "",
  });

  const API_URL = "http://localhost:8080/api/filiados";

  // Buscar usuários do backend
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

 // Cálculo dos usuários que vão aparecer na página atual
  const indexUltimo = paginaAtual * itensPorPagina;
  const indexPrimeiro = indexUltimo - itensPorPagina;
  const usuariosPagina = usuarios.slice(indexPrimeiro, indexUltimo);

  // Calcular total de páginas
  const totalPaginas = Math.ceil(usuarios.length / itensPorPagina);

  // Função para mudar página
  const mudarPagina = (numero) => {
    if (numero < 1) numero = 1;
    if (numero > totalPaginas) numero = totalPaginas;
    setPaginaAtual(numero);
  };

  // Atualizar estado dos inputs e ligar com a API
  const handleChange = async (e) => {
  const { name, value } = e.target;

  // Atualiza o valor do input normalmente
  setNovoUsuario((prev) => ({
    ...prev,
    [name]: name === "estado" ? value.toUpperCase() : value,
  }));

  // Se o campo alterado for o CEP e tiver 8 dígitos, chama o ViaCEP
  if (name === "cep" && value.length === 8) {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${value}/json/`);
      const data = await res.json();

      if (!data.erro) {
        // Atualiza os campos complementares com os dados retornados
        setNovoUsuario((prev) => ({
          ...prev,
          cidade: data.localidade || "",
          estado: data.uf || "",
          bairro: data.bairro || "",
          logradouro: data.logradouro || "",
        }));
      } else {
        alert("CEP não encontrado.");
        // Limpa os campos complementares caso o CEP não exista
        setNovoUsuario((prev) => ({
          ...prev,
          cidade: "",
          estado: "",
          bairro: "",
          logradouro: "",
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  }
};

  // Enviar usuário novo ao backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações no frontend
    if (novoUsuario.cpf.length !== 11) {
      alert("CPF deve conter exatamente 11 dígitos.");
      return;
    }
    if (novoUsuario.telefone.length !== 9) {
      alert("Telefone deve conter exatamente 9 dígitos.");
      return;
    }
    if (novoUsuario.cep.length !== 8) {
      alert("CEP deve conter exatamente 8 dígitos.");
      return;
    }
    if (novoUsuario.estado.length !== 2) {
      alert("Estado deve ser uma sigla de 2 caracteres.");
      return;
    }

    // Verificar se já existe usuário com mesmo CPF localmente (opcional, ajuda a evitar chamada desnecessária)
    const existe = usuarios.find(u => u.cpf === novoUsuario.cpf);
    if (existe) {
      alert("Usuário com este CPF já está cadastrado.");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario),
      });

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.message || "Erro ao salvar usuário");
      }

      alert("Usuário cadastrado com sucesso!");
      setAbrirModal(false);
      setNovoUsuario({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        data_nascimento: "",
        cep: "",
        cidade: "",
        estado: "",
        bairro: "",
        logradouro: "",
        numero: "",
      });
      fetchUsuarios();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <>
      <div>
        <h1>USUÁRIOS DO PROGRAMA DE FIDELIDADE</h1>
      </div>

      <button
        type="button"
        onClick={() => setAbrirModal(true)}
        className="cursor-pointer border p-2 rounded-md bg-blue-500 text-white mt-2"
      >
        Novo Usuário
      </button>

      {/* Modal */}
      {abrirModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl mb-3 font-bold">Novo Usuário</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {[
                ["nome", "Nome", "text"],
                ["email", "E-mail", "email"],
                ["telefone", "Telefone", "text"],
                ["cpf", "CPF", "text"],
                ["data_nascimento", "Data de nascimento", "date"],
                ["cep", "CEP", "text"],
                ["cidade", "Cidade", "text"],
                ["estado", "Estado", "text"],
                ["bairro", "Bairro", "text"],
                ["logradouro", "Logradouro", "text"],
                ["numero", "Número", "number"],
              ].map(([name, label, type]) => (
                <div key={name}>
                  <label>{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={novoUsuario[name]}
                    onChange={handleChange}
                    className="border rounded-md p-2 w-full"
                    required
                  />
                </div>
              ))}

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
              onClick={() => setAbrirModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="mt-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-amber-800">
              <th className="p-2">Nome</th>
              <th className="p-2">E-mail</th>
              <th className="p-2">Telefone</th>
              <th className="p-2">CPF</th>
              <th className="p-2">Data de nascimento</th>
              <th className="p-2">CEP</th>
              <th className="p-2">Cidade</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Bairro</th>
              <th className="p-2">Logradouro</th>
              <th className="p-2">Número</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosPagina.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.nome}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.telefone}</td>
                <td className="p-2">{u.cpf}</td>
                <td className="p-2">{new Date(u.data_nascimento).toLocaleDateString()}</td>
                <td className="p-2">{u.cep}</td>
                <td className="p-2">{u.cidade}</td>
                <td className="p-2">{u.estado}</td>
                <td className="p-2">{u.bairro}</td>
                <td className="p-2">{u.logradouro}</td>
                <td className="p-2">{u.numero}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* Paginação */}
      <div className="flex justify-center items-center gap-2 mt-4 select-none">
        <button
          onClick={() => mudarPagina(paginaAtual - 1)}
          disabled={paginaAtual === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
        >
          &lt; Anterior
        </button>

        {/* Mostrar os números das páginas: 1, 2, 3 ... totalPaginas */}
        {[...Array(totalPaginas)].map((_, i) => {
          const numeroPagina = i + 1;
          return (
            <button
              key={numeroPagina}
              onClick={() => mudarPagina(numeroPagina)}
              className={`px-3 py-1 border rounded ${
                paginaAtual === numeroPagina ? "bg-red-300" : ""
              }`}
            >
              {numeroPagina}
            </button>
          );
        })}

        <button
          onClick={() => mudarPagina(paginaAtual + 1)}
          disabled={paginaAtual === totalPaginas}
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
        >
          Próxima &gt;
        </button>
      </div>
    </>
  );
}