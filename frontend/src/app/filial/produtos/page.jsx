'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";


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

  const API_URL = 'http://localhost:8080'

  const fetchProdutos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/produtos`);
      if (!res.ok) {
        throw new Error("Erro ao carregar a lista de produtos. Verifique o backend.");
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
    fetchProdutos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMensagemFeedback({ type: '', text: '' });

    const produtoData = {
      nome: nome,
      categoria: categoria,
      registroAnvisa: registroAnvisa,
      medida: medida,
      tarja: tarja,
      loteId: 'LOTE-DEFAULT-1',
      marcaId: marcaId,
      descricao: descricao,
    };

    try {
      const res = await fetch(`${API_URL}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produtoData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.mensagem || "Erro ao salvar produto")
      }

      setMensagemFeedback({ type: 'success', text: 'Produto criado com sucesso! A lista foi atualizada.' });
      await fetchProdutos();

      setNome('');
      setCategoria('');
      setRegistroAnvisa('');
      setMedida('');
      setTarja('');
      setDescricao('');
      setMarcaId('');

    } catch (err) {
      console.error(err);
      setMensagemFeedback({ type: 'error', text: err.message || 'Erro inesperado ao salvar produto.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {mensagemFeedback.text && (
        <div
          className={`p-4 mb-4 text-sm rounded-lg ${mensagemFeedback.type === 'success'
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
            }`}
          role="alert"
        >
          <span className="font-medium">
            {mensagemFeedback.type === 'success' ? 'Sucesso! ' : 'Atenção! '}
          </span>
          {mensagemFeedback.text}
        </div>
      )}

      <Dialog>
        <form onSubmit={handleSubmit}>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar novo produto'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar um novo produto ao sistema</DialogTitle>
              <DialogDescription>
                registre um novo produto no sistema anchieta
              </DialogDescription>
            </DialogHeader>
            {/* O restante do formulário de cadastro (inputs) foi mantido inalterado */}
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">

              <div className="grid gap-3">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="registro_anvisa">Registro ANVISA</Label>
                <Input
                  id="registro_anvisa"
                  name="registro_anvisa"
                  value={registroAnvisa}
                  onChange={(e) => setRegistroAnvisa(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="picture">Foto do Produto</Label>
                <Input id="picture" name="picture" type="file" />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="medida_id">Medida (ID)</Label>
                <Input
                  id="medida_id"
                  name="medida_id"
                  value={medida}
                  onChange={(e) => setMedida(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tarja">Tarja</Label>
                <Select onValueChange={setTarja} value={tarja}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="selecione" />
                  </SelectTrigger>
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
              <div className="grid gap-3">
                <Label htmlFor="categoria_id">Categoria (ID)</Label>
                <Input
                  id="categoria_id"
                  name="categoria_id"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="marca_id">Marca (ID)</Label>
                <Input
                  id="marca_id"
                  name="marca_id"
                  value={marcaId}
                  onChange={(e) => setMarcaId(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="descricao">Descrição do produto</Label>
                <Input
                  id="descricao"
                  name="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>
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

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4 mt-8">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-green-300 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Nome</th>
              <th scope="col" className="px-6 py-3">Registro na anvisa</th>
              <th scope="col" className="px-6 py-3">Medida</th>
              <th scope="col" className="px-6 py-3">Categoria</th>
              <th scope="col" className="px-6 py-3"> Action </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-900 dark:text-white">
                  Carregando produtos...
                </td>
              </tr>
            ) : produtos.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-900 dark:text-white">
                  Nenhum produto cadastrado.
                </td>
              </tr>
            ) : (
              produtos.map((produto) => (
                <tr
                  key={produto.id}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                >
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {produto.nome}
                  </th>
                  <td className="px-6 py-4">{produto.registroAnvisa}</td>
                  <td className="px-6 py-4">{produto.medida}</td>
                  <td className="px-6 py-4">{produto.categoria}</td>
                  <td className="px-6 py-4">
                    <a href={`/produtos/editar/${produto.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline"> Editar </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </>

  )
}