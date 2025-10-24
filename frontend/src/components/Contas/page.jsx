"use client";
import { useState, useEffect } from "react";

export default function Contas() {
    const estadoInicialConta = {
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

    // --- FUNÇÕES DE FORMATAÇÃO E UTILIDADE ---

    // Função auxiliar para retornar a data atual no formato YYYY-MM-DD
    const getHoje = () => {
        const data = new Date();
        const ano = data.getFullYear();
        // Mês e dia com zero à esquerda se menor que 10
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    };

    // Converte timestamp ISO (do back-end) ou YYYY-MM-DD (do input) para YYYY-MM-DD
    const toInputDate = (dataString) => {
        if (!dataString) return "";
        try {
            if (dataString.match(/^\d{4}-\d{2}-\d{2}$/)) return dataString;

            const data = new Date(dataString); 
            if (isNaN(data.getTime())) return "";

            // Formata para YYYY-MM-DD. Usa UTC para evitar problemas de fuso no dia
            const ano = data.getUTCFullYear();
            const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
            const dia = String(data.getUTCDate()).padStart(2, '0');
            return `${ano}-${mes}-${dia}`;
        } catch (error) {
            return "";
        }
    };

    // Converte data para "DD mês abreviado AAAA" (ex: 11 out 2025)
    const formatarData = (dataString) => {
        if (!dataString) return "";
        try {
            let data;
            if (dataString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                 // Trata como UTC para não subtrair fuso horário local e manter o dia correto
                const [ano, mes, dia] = dataString.split('-').map(Number);
                data = new Date(Date.UTC(ano, mes - 1, dia));
            } else {
                data = new Date(dataString);
            }

            if (isNaN(data.getTime())) return dataString; 

            const opcoes = { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
            };
            
            let dataFormatada = data.toLocaleDateString('pt-BR', opcoes);
            
            dataFormatada = dataFormatada.replace(/\./g, '').replace(/\//g, ' ');

            return dataFormatada;
        } catch (error) {
            return dataString;
        }
    };

    const formatarValor = (valorString) => {
        const valorLimpo = valorString?.toString().replace(/[^\d.,]/g, '').replace(',', '.') || '0';
        const valorNumerico = parseFloat(valorLimpo);
        
        if (isNaN(valorNumerico)) return valorString;

        return valorNumerico.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const getValorParaInput = (valorString) => {
        if (!valorString) return '';
        const valor = parseFloat(valorString.toString().replace(/,/g, '.').replace(/[^\d.]/g, ''));
        if (isNaN(valor)) return '';

        return valor.toFixed(2).replace('.', ',');
    };


    // --- FIM FUNÇÕES DE FORMATAÇÃO E UTILIDADE ---

    // Filtragem e Paginação
    const contaFiltrados = conta?.filter((f) => f.nomeConta?.toLowerCase().includes(buscaConta.toLowerCase()) ) || [];
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
        
        if (type === "file" && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                // Remove o prefixo "data:application/pdf;base64,"
                setNovaConta((prev) => ({ ...prev, conta_pdf: reader.result.split(",")[1] })); 
            };
            reader.readAsDataURL(file);
            return;
        }
        
        let novoValor;
        if (type === "checkbox") {
            novoValor = checked;
        } else if (name === "status") {
            novoValor = value === "true";
        } else {
            if (name === "valor") {
                novoValor = value.replace(/,/g, '.').replace(/[^\d.]/g, ''); 
                const partes = novoValor.split('.');
                if (partes.length > 2) {
                    novoValor = partes[0] + '.' + partes.slice(1).join('');
                }
            } else {
                novoValor = value;
            }
        }
        setNovaConta((prev) => ({ ...prev, [name]: novoValor }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const valorParaAPI = novaConta.valor ? parseFloat(novaConta.valor).toFixed(2) : "0.00";

        let contaParaAPI = { 
            ...novaConta,
            valor: valorParaAPI
        };

        const method = editarContaId ? "PUT" : "POST";
        const url = editarContaId ? `${API_URL}/${editarContaId}` : API_URL;
        
        // --- INÍCIO DA MUDANÇA: Injeta a data de postagem APENAS no POST ---
        if (method === "POST") {
            contaParaAPI = {
                ...contaParaAPI,
                dataPostada: getHoje() // Define a data de postagem como a data atual do envio
            }
        }
        // --- FIM DA MUDANÇA ---

        try {
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

    const handleNovaConta = () => {
        setNovaConta(estadoInicialConta); 
        setEditarContaId(null);
        setAbrirModal(true);
    };

    const handleEditar = (conta) => {
        setEditarContaId(conta.id);
        setNovaConta({
            nomeConta: conta.nomeConta || "",
            dataPostada: toInputDate(conta.dataPostada), // Valor original para edição
            dataVencimento: toInputDate(conta.dataVencimento),
            valor: getValorParaInput(conta.valor), 
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
                        setPaginaAtual(1);
                    }}
                    className="border rounded-md p-2 w-64"
                />
                <button
                    type="button"
                    onClick={handleNovaConta} 
                    className="cursor-pointer border p-2 rounded-md bg-blue-500 text-white"
                >
                    Nova Conta
                </button>
            </div>
            {/* Modal Cadastro/Edição */}
            {abrirModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl mb-3 font-bold">
                            {editarContaId ? "Editar Conta" : "Nova Conta"}
                        </h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            {[
                                ["nomeConta", "Nome da Conta", "text"],
                                ["dataVencimento", "Data do Vencimento", "date"],
                                ["valor", "Valor", "text"], 
                                ["conta_pdf", "PDF (Upload)", "file"],
                            ].map(([name, label, type]) => (
                                <div key={name}>
                                    <label htmlFor={name} className="block">{label}</label>
                                    <input
                                        id={name}
                                        type={type}
                                        name={name}
                                        onChange={handleChange}
                                        className="border rounded-md p-2 w-full"
                                        {...(type !== "file" ? { value: novaConta[name] } : {})}
                                        required
                                    />
                                </div>
                            ))}
                            {/* Status */}
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
            {/* Modal Exclusão */}
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
            {/* Tabela */}
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
                        {/* Compactado para evitar o erro de hidratação no Next.js */}
                        {contaPagina.map((u) => (
                            <tr key={u.id} className="border-t hover:bg-gray-50">
                                <td className="p-2">{u.id}</td><td className="p-2">{u.nomeConta}</td><td className="p-2">{formatarData(u.dataPostada)}</td><td className="p-2">{formatarData(u.dataVencimento)}</td><td className="p-2">{formatarValor(u.valor)}</td><td className="p-2">
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
                                {/* NOVO CÓDIGO PARA O LINK DO PDF */}
                                <td className="p-2">
                                    {u.conta_pdf && typeof u.conta_pdf === 'string' && u.conta_pdf.length > 0 ? (
                                        <a
                                            // Cria um data URL com a string Base64 do PDF
                                            href={`data:application/pdf;base64,${u.conta_pdf}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 underline"
                                            title="Abrir PDF em nova aba"
                                        >
                                            Visualizar PDF
                                        </a>
                                    ) : (
                                        <span className="text-gray-500 text-sm">
                                            Nenhum PDF
                                        </span>
                                    )}
                                </td>
                                {/* FIM NOVO CÓDIGO */}
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