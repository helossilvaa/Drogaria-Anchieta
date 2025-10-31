'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/layout";

const ABAS = {
  ATIVOS: 'ativos',
  ESTOQUE_BAIXO: 'estoque_baixo',
  VENCIDOS: 'vencidos',
};

const useIsSubmitting = () => useState(false);

export default function Produtos() {
  const [registroAnvisa, setRegistroAnvisa] = useState('');
  const [nome, setNome] = useState('');
  const [medida, setMedida] = useState('');
  const [tarja, setTarja] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [marcaId, setMarcaId] = useState('');
  const [isSubmitting, setIsSubmitting] = useIsSubmitting();
  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mensagemFeedback, setMensagemFeedback] = useState({ type: '', text: '' });
  const [abaAtiva, setAbaAtiva] = useState(ABAS.ATIVOS);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const API_URL = 'http://localhost:8080'

  const fetchProdutos = async () => {
    const token = localStorage.getItem('authToken');
    if (!isAuthenticated || !token) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/produtos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 401 || res.status === 403) {
        throw new Error("Não autorizado. Sua sessão pode ter sido revogada.");
      }
      if (!res.ok) {
        throw new Error("Erro ao carregar a lista de produtos. Status: " + res.status);
      }
      const data = await res.json();
      setProdutos(data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setMensagemFeedback({ type: 'error', text: err.message || 'Erro de rede ao carregar a lista.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProdutos();
    }
  }, [isAuthenticated]); 

  const isProdutoVencido = (produto) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const validade = produto.validade ? new Date(produto.validade) : null;
    if (validade) validade.setHours(0, 0, 0, 0);
    return validade && validade < hoje;
  };

  const produtosFiltrados = produtos.filter(produto => {
    switch (abaAtiva) {
      case ABAS.VENCIDOS:
        return isProdutoVencido(produto);
      case ABAS.ESTOQUE_BAIXO:
        return false;
      case ABAS.ATIVOS:
      default:
        return !isProdutoVencido(produto);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMensagemFeedback({ type: '', text: '' });

    const userToken = localStorage.getItem('authToken');

    if (!userToken) {
      setMensagemFeedback({ type: 'error', text: 'Você precisa estar logado para cadastrar produtos.' });
      setIsSubmitting(false);
      return;
    }
    const produtoData = {
      registro_anvisa: registroAnvisa,
      nome: nome,
      medida_id: medida,
      tarja_id: tarja,
      categoria_id: categoria,
      marca_id: marcaId,
      descricao: descricao,
      preco_unitario: 0,
      validade: new Date().toISOString().split('T')[0], 
      lote_id: 'LOTE-DEFAULT-1',
    };
    try {
      const res = await fetch(`${API_URL}/produtos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(produtoData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.mensagem || "Erro ao salvar produto")
      }

      setMensagemFeedback({ type: 'success', text: 'Produto criado com sucesso! A lista foi atualizada.' });
      await fetchProdutos(); // Recarrega a lista dos produto
      setNome(''); setCategoria(''); setRegistroAnvisa(''); setMedida(''); setTarja(''); setDescricao(''); setMarcaId('');

    } catch (err) {
      console.error(err);
      setMensagemFeedback({ type: 'error', text: err.message || 'Erro inesperado ao salvar produto.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAbaClasses = (aba) =>
    abaAtiva === aba
      ? "inline-block p-4 text-[#1b5143] border-b-2 border-[#4b9c86] rounded-t-lg active dark:text-[#4b9c86] dark:border-[#4b9c86] cursor-pointer"
      : "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-800 hover:border-gray-300 dark:hover:text-gray-300 cursor-pointer";

  return (
  <Layout>
      <div className="p-6">
        {mensagemFeedback.text && (
          <div
            className={`p-4 mb-4 text-sm rounded-lg ${mensagemFeedback.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
              }`}
            role="alert"
          >
            <span className="font-medium">
              {mensagemFeedback.type === 'success' ? 'Sucesso! ' : 'Atenção! '}
            </span>
            {mensagemFeedback.text}
          </div>
        )}

        {/* AÇÕES E BOTÃO DE NOVO PRODUTO */}
        <div className="flex justify-between items-end mb-4">
          {/* NAVEGAÇÃO POR ABAS (Esquerda) */}
          <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 flex-grow">
            <ul className="flex flex-wrap -mb-px">
              <li className="me-2">
                <a onClick={() => setAbaAtiva(ABAS.ATIVOS)} className={getAbaClasses(ABAS.ATIVOS)}>
                  Produtos Ativos ({produtos.filter(p => !isProdutoVencido(p)).length})
                </a>
              </li>
              <li className="me-2">
                <a onClick={() => setAbaAtiva(ABAS.ESTOQUE_BAIXO)} className={getAbaClasses(ABAS.ESTOQUE_BAIXO)}>
                  Estoque Baixo (0)
                </a>
              </li>
              <li className="me-2">
                <a onClick={() => setAbaAtiva(ABAS.VENCIDOS)} className={getAbaClasses(ABAS.VENCIDOS)}>
                  Vencidos ({produtos.filter(isProdutoVencido).length})
                </a>
              </li>
            </ul>
          </div>

          {/* BOTÃO NOVO PRODUTO (Direita) */}
          <div className="pb-2">
            <Dialog>
              <form onSubmit={handleSubmit}>
                <DialogTrigger asChild>
                  <Button variant="default" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : 'Criar novo produto +'}
                  </Button>
                </DialogTrigger>
                {/* Diálogo do Formulário (MANTIDO INALTERADO) */}
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar um novo produto ao sistema</DialogTitle>
                    <DialogDescription>
                      Registre um novo produto no sistema Anchieta
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid gap-3"><Label htmlFor="nome">Nome</Label><Input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} /></div>
                    <div className="grid gap-3"><Label htmlFor="registro_anvisa">Registro ANVISA</Label><Input id="registro_anvisa" name="registro_anvisa" value={registroAnvisa} onChange={(e) => setRegistroAnvisa(e.target.value)} /></div>
                    <div className="grid w-full max-w-sm items-center gap-3"><Label htmlFor="picture">Foto do Produto</Label><Input id="picture" name="picture" type="file" /></div>
                    <div className="grid gap-3"><Label htmlFor="medida_id">Medida (ID)</Label><Input id="medida_id" name="medida_id" value={medida} onChange={(e) => setMedida(e.target.value)} /></div>
                    <div className="grid gap-3">
                      <Label htmlFor="tarja">Tarja</Label>
                      <Select onValueChange={setTarja} value={tarja}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Tarja</SelectLabel>
                            <SelectItem value="amarela">amarela</SelectItem>
                            <SelectItem value="preta">preta</SelectItem>
                            <SelectItem value="vermelha">vermelha</SelectItem>
                            <SelectItem value="nenhuma">Sem tarja</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-3"><Label htmlFor="categoria_id">Categoria (ID)</Label><Input id="categoria_id" name="categoria_id" value={categoria} onChange={(e) => setCategoria(e.target.value)} /></div>
                    <div className="grid gap-3"><Label htmlFor="marca_id">Marca (ID)</Label><Input id="marca_id" name="marca_id" value={marcaId} onChange={(e) => setMarcaId(e.target.value)} /></div>
                    <div className="grid gap-3"><Label htmlFor="descricao">Descrição do produto</Label><Input id="descricao" name="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} /></div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>Salvar produto</Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </div>
        </div>

        {/* --- CONTEÚDO DA TABELA --- */}
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-3">
            {abaAtiva === ABAS.ATIVOS && "Lista de Produtos Ativos"}
            {abaAtiva === ABAS.VENCIDOS && "Produtos Vencidos"}
            {abaAtiva === ABAS.ESTOQUE_BAIXO && "Produtos com Estoque Baixo"}
          </h3>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
              {/* CABEÇALHO DA TABELA (AJUSTADO PARA CORRESPONDER AOS DADOS) */}
              <thead className="text-center text-sm text-black uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="py-3 px-6">Nome</th>
                  <th scope="col" className="py-3 px-6">Registro ANVISA</th>
                  <th scope="col" className="py-3 px-6">Marca (ID)</th>
                  <th scope="col" className="py-3 px-6">Tarja (ID)</th>
                  <th scope="col" className="py-3 px-6">Medida (ID)</th>
                  <th scope="col" className="py-3 px-6">Categoria (ID)</th>
                  <th scope="col" className="py-3 px-6">Validade</th>
                  <th scope="col" className="py-3 px-6">Ação</th>
                </tr>
              </thead>
              <tbody>
                {/* ESTADOS DE CARREGAMENTO E VAZIO */}
                {isLoading ? (
                  <tr><td colSpan="8" className="px-6 py-4 text-center">Carregando produtos...</td></tr>
                ) : produtosFiltrados.length === 0 ? (
                  <tr><td colSpan="8" className="py-4 text-center text-gray-900">Nenhum produto encontrado nesta categoria.</td></tr>
                ) : (
                  /* RENDERIZAÇÃO DOS PRODUTOS FILTRADOS */
                  produtosFiltrados.map((produto) => (
                    <tr
                      key={produto.id}
                      className="odd:bg-white even:bg-gray-50 border-b"
                    >
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {produto.nome}
                      </th>
                      <td className="px-6 py-4">{produto.registro_anvisa}</td>
                      <td className="px-6 py-4">{produto.marca_id}</td>
                      <td className="px-6 py-4">{produto.tarja_id}</td>
                      <td className="px-6 py-4">{produto.medida_id}</td>
                      <td className="px-6 py-4">{produto.categoria_id}</td>
                      {/* Formata a data de validade */}
                      <td className="px-6 py-4">
                        {produto.validade ? new Date(produto.validade).toLocaleDateString('pt-BR') : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <a href={`/produtos/editar/${produto.id}`} className="font-medium text-[#1b5143] dark:text-[#4b9c86] hover:underline"> Editar </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </Layout>
  
  );
}