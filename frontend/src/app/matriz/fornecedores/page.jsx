"use client";

import { useState, useEffect } from "react";

export default function CadastroFornecedores() {
  const [abrirModal, setAbrirModal] = useState(false);
  const [fornecedores, setFornecedores] = useState([]);
  
  const [novoFornecedor, setNovoFornecedor] = useState({
    fornecedor: "", 
    email: "",
    telefone: "",
    cnpj: "", 
    cep: "",
    cidade: "",
    estado: "",
    endereco: "", 
    status: true, 
  });

  const API_URL = "http://localhost:8080/api/filiados";

  // Buscar usuários do backend
  useEffect(() => {
    fetchFornecedores();
  }, []);

const fetchFornecedores = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setFornecedores(data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  // 2. FUNÇÃO handleChange AJUSTADA
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Se for checkbox, usa 'checked' (boolean), senão usa 'value'
    const novoValor = type === "checkbox" ? checked : value;
    
    setNovoFornecedor({ ...novoFornecedor, [name]: novoValor });
  };

  // Enviar usuário novo ao backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const fornecedorParaAPI = {
      ...novoFornecedor,
      status: novoFornecedor.status ? "ATIVO" : "INATIVO",
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Envia o objeto com o status como string (se o backend exigir)
        body: JSON.stringify(fornecedorParaAPI), 
      });

      if (!res.ok) throw new Error("Erro ao salvar fornecedor");

      alert("Fornecedor cadastrado com sucesso!");
      setAbrirModal(false);
      // Reset do estado
      setNovoFornecedor({
        fornecedor: "",
        email: "",
        telefone: "",
        cnpj: "",
        cep: "",
        cidade: "",
        estado: "",
        endereco: "",
        status: true, // Reset para ATIVO
      });
      fetchFornecedores();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar fornecedor.");
    }
  };

  return (
    <>
      <div>
        <h1>Fornecedores</h1>
      </div>

      <button
        type="button"
        onClick={() => setAbrirModal(true)}
        className="cursor-pointer border p-2 rounded-md bg-blue-500 text-white mt-2"
      >
        Novo Fornecedor
      </button>

      {/* Modal */}
      {abrirModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl mb-3 font-bold">Novo Fornecedor</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {[
                // 3. ARRAY DE CAMPOS AJUSTADO PARA OS NOMES DA TABELA/ESTADO
                ["fornecedor", "Fornecedor / Razão Social", "text"],
                ["email", "Email", "email"], 
                ["telefone", "Telefone", "tel"], // 'tel' é mais semântico que 'number'
                ["cnpj", "CNPJ/CPF", "text"], 
                ["cep", "CEP", "text"],
                ["cidade", "Cidade", "text"],
                ["estado", "Estado", "text"],
                ["endereco", "Endereço Completo", "text"], // Campo único para endereço
                ["status", "Status", "checkbox"], // Checkbox
              ].map(([name, label, type]) => (
                
                <div key={name} className={type === "checkbox" ? "flex items-center gap-2" : ""}>
                  <label htmlFor={name} className={type !== "checkbox" ? "block" : ""}>
                    {label}
                  </label>
                  
                  <input
                    id={name}
                    type={type}
                    name={name}
                    // Para checkbox, usa 'checked' e o valor booleano
                    {...(type === "checkbox"
                      ? { checked: novoFornecedor[name] }
                      // Para outros inputs, usa 'value' e o valor string
                      : { value: novoFornecedor[name] })} 
                    onChange={handleChange}
                    className={
                      type === "checkbox"
                        ? "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        : "border rounded-md p-2 w-full"
                    }
                    // Checkbox não precisa de 'required' se já inicializado
                    required={type !== "checkbox"} 
                  />
                  {/* Exibe se está Ativo ou Inativo ao lado do checkbox */}
                  {type === "checkbox" && (
                     <span className="text-sm text-gray-700 font-medium">
                        {novoFornecedor.status ? "Ativo" : "Inativo"}
                     </span>
                  )}
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

      {/* Tabela (Mantida a mesma lógica, presumindo que u.status é booleano ou conversível) */}
      <div className="mt-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-red-300 text-left">
              <th className="p-2">Fornecedor</th>
              <th className="p-2">E-mail</th>
              <th className="p-2">Telefone</th>
              <th className="p-2">CNPJ</th>
              <th className="p-2">CEP</th>
              <th className="p-2">Cidade</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Endereço</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {fornecedores.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.fornecedor}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.telefone}</td>
                <td className="p-2">{u.cnpj}</td>
                <td className="p-2">{u.cep}</td>
                <td className="p-2">{u.cidade}</td>
                <td className="p-2">{u.estado}</td>
                <td className="p-2">{u.endereco}</td> 
                {/* Renderiza o Status na Tabela como Checkbox */}
                <td className="p-2">
                  <input
                    type="checkbox"
                    // Assume que o valor retornado pela API (u.status) é um booleano (true/false)
                    // Se for string ("ATIVO"/"INATIVO"), você precisará de uma conversão: u.status === "ATIVO"
                    checked={u.status} 
                    readOnly
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-sm">
                    {u.status ? "Ativo" : "Inativo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}