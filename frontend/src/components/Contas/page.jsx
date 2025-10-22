"use client";

import { useState, useEffect } from "react";

export default function Contas() {
    const estadoInicialConta = {
        id: "",
        nomeConta: "",
        dataPostada: "",
        dataVencimento: "",
        valor: "",
        status: true, // true para Pendente, false para Pago
        conta_pdf: ""
    };

    const [abrirModal, setAbrirModal] = useState(false);
    const [conta, setConta] = useState([]);
    const [buscaConta, setBuscaConta] = useState("");
    const [novaConta, setNovaConta] = useState(estadoInicialConta);
    const [editarContaId, setEditarContaId] = useState(null);
    const [excluirContaId, setExcluirContaId] = useState(null);
    const [abrirModalExcluir, setAbrirModalExcluir] = useState(false);

    // Filtragem e Paginação
    const contaFiltrados = conta?.filter((f) =>
        f.nomeConta?.toLowerCase().includes(buscaConta.toLowerCase())
    ) || [];

    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 15;

    const indexUltimo = paginaAtual * itensPorPagina;
    const indexPrimeiro = indexUltimo - itensPorPagina;
    const contaPagina = contaFiltrados.slice(indexPrimeiro, indexUltimo);
    const totalPaginas = Math.ceil(contaFiltrados.length / itensPorPagina);

    const mudarPagina = (numero) => {
        if (numero < 1) numero = 1;
        if (numero > totalPaginas) numero = totalPaginas;
        setPaginaAtual(numero);
    };

    const API_URL = "http://localhost:8080/api/conta";

    useEffect(() => {
        fetchConta();
    }, []);

    const fetchConta = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setConta(data);
        } catch (error) {
            console.error("Erro ao carregar contas:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let novoValor;

        if (type === "checkbox") {
            novoValor = checked;
        } else if (name === "status") {
            // O valor do radio button é string ("true" ou "false"), converter para boolean
            novoValor = value === "true";
        } else {
            novoValor = value;
        }

        setNovaConta((prev) => ({ ...prev, [name]: novoValor }));

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const contaParaAPI = {
            ...novaConta
        };

        try {
            const method = editarContaId ? "PUT" : "POST";
            const url = editarContaId ? `${API_URL}/${editarContaId}` : API_URL;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contaParaAPI),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Erro na resposta do servidor:", res.status, errorText);
                throw new Error("Erro ao salvar conta");
            }

            alert(`Conta ${editarContaId ? "editada" : "cadastrada"} com sucesso!`);
            setAbrirModal(false);
            setNovaConta(estadoInicialConta);
            setEditarContaId(null);
            fetchConta();
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar conta.");
        }
    };

    const handleEditar = (conta) => {
        setEditarContaId(conta.id);
        setNovaConta({
            id: conta.id || "",
            nomeConta: conta.nomeConta || "",
            dataPostada: conta.dataPostada || "",
            dataVencimento: conta.dataVencimento || "",
            valor: conta.valor || "",
            // A lógica de status deve considerar true/false ou o valor da API (ex: "PENDENTE" é true, outro é false)
            status: conta.status === true || conta.status === "PENDENTE" || conta.status === "true", 
            conta_pdf: conta.conta_pdf || "",
        });
        setAbrirModal(true);
    };

    const handleExcluir = (id) => {
        setExcluirContaId(id);
        setAbrirModalExcluir(true);
    };

    const confirmarExcluir = async () => {
        try {
            const res = await fetch(`${API_URL}/${excluirContaId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Erro ao excluir conta:", res.status, errorText);
                throw new Error("Erro ao excluir conta");
            }

            alert("Conta excluída com sucesso!");
            setAbrirModalExcluir(false);
            setExcluirContaId(null);
            fetchConta();
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir conta.");
        }
    };

    return (
        <>
            <div>
                <h1>Contas a Pagar</h1>
            </div>

            <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                <input
                    type="text"
                    placeholder="Buscar conta por nome..."
                    value={buscaConta}
                    onChange={(e) => {
                        setBuscaConta(e.target.value);
                        setPaginaAtual(1); // Resetar para a primeira página na busca
                    }}
                    className="border rounded-md p-2 w-64"
                />

                <button
                    type="button"
                    onClick={() => {
                        setNovaConta(estadoInicialConta);
                        setEditarContaId(null);
                        setAbrirModal(true);
                    }}
                    className="cursor-pointer border p-2 rounded-md bg-blue-500 text-white"
                >
                    Nova Conta
                </button>
            </div>

            {/* Modal de Cadastro/Edição */}
            {abrirModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl mb-3 font-bold">
                            {editarContaId ? "Editar Conta" : "Nova Conta"}
                        </h2>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            {[
                                ["id", "ID", "text"],
                                ["nomeConta", "Nome da Conta", "text"],
                                ["dataPostada", "Data da Postagem", "date"],
                                ["dataVencimento", "Data do Vencimento", "date"],
                                ["valor", "Valor", "text"],
                                ["conta_pdf", "PDF (URL/Ref)", "text"],
                            ].map(([name, label, type]) => (
                                <div key={name}>
                                    <label htmlFor={name} className="block">{label}</label>
                                    <input
                                        id={name}
                                        type={type}
                                        name={name}
                                        value={novaConta[name]}
                                        onChange={handleChange}
                                        className="border rounded-md p-2 w-full"
                                        disabled={name === 'id' && editarContaId !== null}
                                        required
                                    />
                                </div>
                            ))}

                            {/* Campo de Status com Radio Buttons (Pendente/Pago) */}
                            <div className="flex flex-col gap-2 mt-2">
                                <label className="block font-medium text-gray-700">Status</label>
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="true"
                                            checked={novaConta.status === true}
                                            onChange={handleChange}
                                            className="w-4 h-4"
                                        />
                                        <span>Pendente</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="false"
                                            checked={novaConta.status === false}
                                            onChange={handleChange}
                                            className="w-4 h-4"
                                        />
                                        <span>Pago</span>
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
                                setEditarContaId(null);
                                setNovaConta(estadoInicialConta);
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
                        <p>Tem certeza que deseja excluir esta conta?</p>

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

            {/* Tabela de Contas */}
            <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse min-w-[900px]">
                    <thead>
                        <tr className="bg-[#245757] text-left text-white rounded-t-lg">
                            <th className="p-2">ID</th>
                            <th className="p-2">Nome da Conta</th>
                            <th className="p-2">Data da Postagem</th>
                            <th className="p-2">Data do Vencimento</th>
                            <th className="p-2">Valor</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">PDF</th>
                            <th className="p-2 rounded-tr-lg">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contaPagina.map((u) => (
                            <tr key={u.id} className="border-t hover:bg-gray-50">
                                <td className="p-2">{u.id}</td>
                                <td className="p-2">{u.nomeConta}</td>
                                <td className="p-2">{u.dataPostada}</td>
                                <td className="p-2">{u.dataVencimento}</td>
                                <td className="p-2">{u.valor}</td>
                                <td className="p-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            u.status === true || u.status === "PENDENTE"
                                                ? "bg-[#245757]/20 text-[#245757]"
                                                : "bg-gray-300 text-gray-700"
                                            }`}
                                    >
                                        {u.status === true || u.status === "PENDENTE" ? "Pendente" : "Pago"}
                                    </span>
                                </td>
                                <td className="p-2">
                                    {/* Exibe o valor do PDF ou uma mensagem se for um objeto BLOB */}
                                    {u.conta_pdf && typeof u.conta_pdf === 'object'
                                        ? <span className="text-red-500 text-xs">BLOB (Objeto)</span>
                                        : u.conta_pdf
                                    }
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
                {/* Paginação */}
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