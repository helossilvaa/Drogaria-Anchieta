"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Minus, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function NovaVendaPage() {
  // --- ESTADOS PRINCIPAIS ---
  const [produtos, setProdutos] = useState([]);
  const [codigoBarras, setCodigoBarras] = useState("");
  const [desconto, setDesconto] = useState(0);
  const [codigoDesconto, setCodigoDesconto] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [formaPagamento, setFormaPagamento] = useState("");
  const [alerta, setAlerta] = useState(null);
  const [mostrarNota, setMostrarNota] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemFeedback, setMensagemFeedback] = useState({ type: "", text: "" });

  const itensPorPagina = 5;
  const totalPaginas = Math.max(1, Math.ceil(produtos.length / itensPorPagina));
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const produtosExibidos = produtos.slice(inicio, fim);

  const API_PRODUTOS = "http://localhost:8080/produtos";
  const API_URL = "http://localhost:8080/api/filiados";


  const fetchProdutos = async () => {
    const userToken = localStorage.getItem("authToken");
    if (!userToken) {
      setMensagemFeedback({
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_PRODUTOS}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401 || res.status === 403) {
        throw new Error("Não autorizado. Verifique seu token de acesso.");
      }

      if (!res.ok) {
        throw new Error("Erro ao carregar a lista de produtos. Status: " + res.status);
      }

      const data = await res.json();
      // Adiciona quantidade inicial
      const produtosComQuantidade = data.map((p, i) => ({
        id: p.id ?? i,
        nome: p.nome ?? p.descricao ?? "Produto sem nome",
        preco: Number(p.preco ?? p.preco_unitario ?? 0),
        quantidade: 1,
      }));
      setProdutos(produtosComQuantidade);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setMensagemFeedback({
        type: "error",
        text: err.message || "Erro de rede ao carregar a lista.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  // --- FUNÇÕES AUXILIARES ---
  const alterarQuantidade = (id, delta) => {
    setProdutos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantidade: Math.max(1, p.quantidade + delta) } : p
      )
    );
  };

  const calcularSubtotal = (preco, quantidade) => preco * quantidade;
  const subtotalGeral = produtos.reduce(
    (acc, p) => acc + calcularSubtotal(p.preco, p.quantidade),
    0
  );
  const total = subtotalGeral - Number(desconto);

  const mostrarAlerta = (mensagem, tipo = "info") => {
    setAlerta({ mensagem, tipo });
    setTimeout(() => setAlerta(null), 3000);
  };

  const paginaAnterior = () => paginaAtual > 1 && setPaginaAtual(paginaAtual - 1);
  const proximaPagina = () =>
    paginaAtual < totalPaginas && setPaginaAtual(paginaAtual + 1);

  const handleProsseguir = () => {
    if (!formaPagamento) {
      mostrarAlerta("Selecione uma forma de pagamento antes de prosseguir!", "erro");
      return;
    }
    setMostrarNota(true);
  };

  const aplicarDescontoCodigo = () => {
    if (!codigoDesconto.trim()) {
      mostrarAlerta("Insira um código ou CPF válido.", "erro");
      return;
    }
    if (codigoDesconto.length >= 5) {
      const valorDesconto = subtotalGeral * 0.1;
      setDesconto(valorDesconto);
      mostrarAlerta("Desconto de 10% aplicado com sucesso!", "sucesso");
    } else {
      mostrarAlerta("Código inválido ou não elegível para desconto.", "erro");
    }
  };

  const imprimirNota = () => {
    window.print();
  };

  // --- FILIADO ---
  const [novoFiliado, setNovoFiliado] = useState({
    nome: "",
    cpf: "",
    data_nascimento: "",
    email: "",
    telefone: "",
    cep: "",
    cidade: "",
    estado: "",
    bairro: "",
    logradouro: "",
    numero: "",
    tipodesconto: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoFiliado((prev) => ({ ...prev, [name]: value }));
  };

  const buscarEndereco = async () => {
    const cepLimpo = novoFiliado.cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (data.erro) {
        mostrarAlerta("CEP não encontrado!", "erro");
        return;
      }
      setNovoFiliado((prev) => ({
        ...prev,
        cidade: data.localidade || "",
        estado: data.uf || "",
        bairro: data.bairro || "",
        logradouro: data.logradouro || "",
      }));
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagemFeedback({ type: "", text: "" });

    const userToken = localStorage.getItem("authToken");
    if (!userToken) {
      setMensagemFeedback({
        type: "error",
        text: "Você precisa estar logado para cadastrar filiado.",
      });
      return;
    }

    const cpfLimpo = novoFiliado.cpf.replace(/\D/g, "");
    const telefoneLimpo = novoFiliado.telefone.replace(/\D/g, "");
    const cepLimpo = novoFiliado.cep.replace(/\D/g, "");

    if (cpfLimpo.length !== 11) {
      mostrarAlerta("CPF deve conter exatamente 11 dígitos.", "erro");
      return;
    }
    if (telefoneLimpo.length < 8) {
      mostrarAlerta("Telefone deve conter pelo menos 8 dígitos.", "erro");
      return;
    }
    if (cepLimpo.length !== 8) {
      mostrarAlerta("CEP deve conter exatamente 8 dígitos.", "erro");
      return;
    }
    if (novoFiliado.estado.length !== 2) {
      mostrarAlerta("Estado deve ser uma sigla de 2 caracteres.", "erro");
      return;
    }

    const filiadoEnvio = {
      ...novoFiliado,
      cpf: cpfLimpo,
      telefone: telefoneLimpo,
      cep: cepLimpo,
      tipodesconto: Number(novoFiliado.tipodesconto),
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(filiadoEnvio),
      });

      if (!res.ok) {
        let erroMsg = "Erro ao salvar usuário";
        try {
          const erro = await res.json();
          erroMsg = erro.message || JSON.stringify(erro) || erroMsg;
        } catch {
          const texto = await res.text();
          erroMsg = texto || erroMsg;
        }
        throw new Error(erroMsg);
      }

      mostrarAlerta("Filiado cadastrado com sucesso!", "sucesso");
      setNovoFiliado({
        nome: "",
        cpf: "",
        data_nascimento: "",
        email: "",
        telefone: "",
        cep: "",
        cidade: "",
        estado: "",
        bairro: "",
        logradouro: "",
        numero: "",
        tipodesconto: "",
      });
    } catch (erro) {
      console.error("Erro ao salvar filiado:", erro);
      mostrarAlerta(erro.message || "Erro ao salvar filiado.", "erro");
    }
  };

  // --- BUSCA PRODUTO POR CÓDIGO ---
  const parseProduto = (raw) => {
    if (!raw) return null;
    if (Array.isArray(raw)) raw = raw[0] ?? null;
    if (!raw) return null;

    const id = raw.id ?? raw.product_id ?? raw.codigo ?? raw.codigo_barras ?? null;
    const nome = raw.nome ?? raw.name ?? raw.descricao ?? raw.description ?? raw.title ?? "";
    const preco =
      raw.preco_unitario ?? raw.preco ?? raw.price ?? raw.valor ?? raw.unit_price ?? 0;

    if (id == null) {
      console.error("ID não encontrado na resposta do produto:", raw);
      return null;
    }
    return { id, nome, preco: Number(preco) };
  };

  const fetchTentativa = async (url) => {
    try {
      const r = await fetch(url);
      if (!r.ok) return null;
      const json = await r.json();
      return parseProduto(json);
    } catch (e) {
      return null;
    }
  };

  const buscarProdutoPorCodigo = async (codigo) => {
    const code = String(codigo ?? codigoBarras ?? "").trim();
    if (!code) {
      mostrarAlerta("Digite um código de barras válido.", "erro");
      return;
    }

    let produto = await fetchTentativa(`${API_PRODUTOS}/${code}`);

    if (!produto) {
      mostrarAlerta("Produto não encontrado!", "erro");
      return;
    }

    setProdutos((prev) => {
      const existe = prev.find((p) => String(p.id) === String(produto.id));
      if (existe) {
        return prev.map((p) =>
          String(p.id) === String(produto.id) ? { ...p, quantidade: p.quantidade + 1 } : p
        );
      } else {
        return [
          ...prev,
          { id: produto.id, nome: produto.nome, preco: Number(produto.preco), quantidade: 1 },
        ];
      }
    });

    setCodigoBarras("");
    setPaginaAtual(1);
    mostrarAlerta("Produto adicionado à venda!", "sucesso");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-10 relative">
      {alerta && (
        <div
          className={`fixed top-6 right-6 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 text-white transition-all duration-500 ${
            alerta.tipo === "sucesso"
              ? "bg-green-500"
              : alerta.tipo === "erro"
              ? "bg-pink-500"
              : "bg-gray-600"
          }`}
        >
          {alerta.tipo === "sucesso" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{alerta.mensagem}</span>
        </div>
      )}

      {mensagemFeedback.text && (
        <div
          className={`fixed top-20 right-6 px-5 py-3 rounded-xl shadow-lg text-white ${
            mensagemFeedback.type === "error" ? "bg-pink-500" : "bg-green-500"
          }`}
        >
          {mensagemFeedback.text}
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
        <div className="md:col-span-2">
     
          <div className="flex gap-2">
            <Input
              placeholder="Insira o código do produto (ou escaneie) e pressione Enter"
              value={codigoBarras}
              onChange={(e) => setCodigoBarras(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  buscarProdutoPorCodigo(e.target.value || codigoBarras);
                }
              }}
              className="bg-white border-pink-300 text-gray-800 placeholder:text-gray-500 rounded-full px-5 py-6"
            />
            <Button
              onClick={() => buscarProdutoPorCodigo(codigoBarras)}
              className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6"
            >
              Buscar
            </Button>
          </div>

          <Card className="mt-6">
            <CardContent className="p-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-pink-600 font-semibold">
                    <th>Produto</th>
                    <th>Preço</th>
                    <th className="text-center">Quantidade</th>
                    <th className="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosExibidos.map((produto) => (
                    <tr key={produto.id} className="border-t border-pink-100">
                      <td className="py-3">{produto.nome}</td>
                      <td className="py-3">R$ {produto.preco.toFixed(2)}</td>
                      <td className="py-3 flex justify-center items-center gap-2 text-pink-500">
                        <button
                          onClick={() => alterarQuantidade(produto.id, -1)}
                          className="rounded-full bg-pink-50 p-1 border border-pink-200"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-medium text-gray-700">{produto.quantidade}</span>
                        <button
                          onClick={() => alterarQuantidade(produto.id, 1)}
                          className="rounded-full bg-pink-50 p-1 border border-pink-200"
                        >
                          <Plus size={14} />
                        </button>
                      </td>
                      <td className="py-3 text-right font-medium text-gray-700">
                        R$ {calcularSubtotal(produto.preco, produto.quantidade).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPaginas > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <Button
                    onClick={paginaAnterior}
                    disabled={paginaAtual === 1}
                    className="rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 disabled:opacity-50"
                  >
                    Anterior
                  </Button>
                  <span className="text-gray-600">
                    Página {paginaAtual} de {totalPaginas}
                  </span>
                  <Button
                    onClick={proximaPagina}
                    disabled={paginaAtual === totalPaginas}
                    className="rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 disabled:opacity-50"
                  >
                    Próximo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-pink-100">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 mb-1">Subtotal</p>
                <p className="font-medium text-gray-700">R$ {subtotalGeral.toFixed(2)}</p>
                <Separator className="my-1" />
              </div>

              <div>
                <p className="text-gray-500 mb-1">Desconto</p>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Código ou CPF"
                    value={codigoDesconto}
                    onChange={(e) => setCodigoDesconto(e.target.value)}
                    className="border-pink-200 rounded-full w-full text-center"
                  />
                  <Button
                    onClick={aplicarDescontoCodigo}
                    className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-4"
                  >
                    Adicionar
                  </Button>
                </div>
                <Separator className="my-1" />
              </div>

              <div>
                <p className="text-pink-600 font-semibold text-lg mb-1">Total</p>
                <p className="text-gray-800 font-bold text-xl">R$ {total.toFixed(2)}</p>
                <Separator className="my-1" />
              </div>
            </div>

            <div className="mt-6">
              <p className="text-gray-500 mb-3">Forma de pagamento</p>
              <div className="flex flex-wrap gap-2">
                {["PIX", "Crédito", "Débito"].map((forma) => (
                  <Button
                    key={forma}
                    variant="secondary"
                    onClick={() => setFormaPagamento(forma)}
                    className={`rounded-full ${
                      formaPagamento === forma
                        ? "bg-pink-500 text-white"
                        : "bg-pink-100 text-pink-700 hover:bg-pink-200"
                    }`}
                  >
                    {forma}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="text-pink-600 hover:text-pink-700 font-medium underline underline-offset-4 transition-all duration-200">
                    Cadastrar-se como filiado
                  </button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-[420px] sm:w-[480px] bg-gradient-to-br from-pink-50 to-white shadow-2xl border-l-4 border-pink-300"
                >
                  <div className="px-6 py-4">
                    <SheetHeader className="space-y-1 text-center mt-2">
                      <SheetTitle className="text-pink-600 text-2xl font-bold flex justify-center items-center gap-2">
                        <CheckCircle2 size={24} className="text-pink-500" />
                        Cadastro de Filiado
                      </SheetTitle>
                      <p className="text-gray-500 text-sm">
                        Faça parte do nosso programa de fidelidade e receba descontos exclusivos
                      </p>
                    </SheetHeader>

                    <form onSubmit={handleSubmit} className="space-y-2">
                      <Input
                        name="nome"
                        placeholder="Nome completo"
                        value={novoFiliado.nome}
                        onChange={handleChange}
                      />
                      <Input
                        name="data_nascimento"
                        type="date"
                        value={novoFiliado.data_nascimento}
                        onChange={handleChange}
                      />
                      <Input
                        name="cpf"
                        placeholder="CPF"
                        value={novoFiliado.cpf}
                        onChange={handleChange}
                      />
                      <Input
                        name="email"
                        type="email"
                        placeholder="E-mail"
                        value={novoFiliado.email}
                        onChange={handleChange}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          name="telefone"
                          placeholder="Telefone (com DDD)"
                          value={novoFiliado.telefone}
                          onChange={handleChange}
                        />
                        <Select
                          onValueChange={(value) =>
                            setNovoFiliado((prev) => ({ ...prev, tipodesconto: value }))
                          }
                          defaultValue={novoFiliado.tipodesconto}
                        >
                          <SelectTrigger className="w-full rounded-full border border-pink-200 px-3 py-2">
                            <SelectValue placeholder="Tipo de desconto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Descontos</SelectLabel>
                              <SelectItem value="1">Convênio</SelectItem>
                              <SelectItem value="2">Cupom</SelectItem>
                              <SelectItem value="3">Programa de fidelidade</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator className="my-4" />

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          name="cep"
                          placeholder="CEP"
                          value={novoFiliado.cep}
                          onChange={handleChange}
                          onBlur={buscarEndereco}
                        />
                        <Input
                          name="cidade"
                          placeholder="Cidade"
                          value={novoFiliado.cidade}
                          onChange={handleChange}
                        />
                        <Input
                          name="estado"
                          placeholder="Estado"
                          value={novoFiliado.estado}
                          onChange={handleChange}
                        />
                        <Input
                          name="bairro"
                          placeholder="Bairro"
                          value={novoFiliado.bairro}
                          onChange={handleChange}
                        />
                        <Input
                          name="logradouro"
                          placeholder="Rua"
                          value={novoFiliado.logradouro}
                          onChange={handleChange}
                        />
                        <Input
                          name="numero"
                          placeholder="Número"
                          value={novoFiliado.numero}
                          onChange={handleChange}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full mt-2 py-2 shadow-md transition-all"
                      >
                        Enviar cadastro
                      </Button>

                      <p className="text-xs text-gray-500 text-center ">
                        Seus dados são protegidos e utilizados apenas para benefícios do programa.
                      </p>
                    </form>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                className="border-pink-200 text-pink-600 rounded-full hover:bg-pink-100 px-6"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleProsseguir}
                className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6"
              >
                Finalizar venda
              </Button>
            </div>

            {/* --- MODAL DA NOTA FISCAL --- */}
            <Dialog open={mostrarNota} onOpenChange={setMostrarNota}>
              <DialogContent className="max-w-2xl bg-white">
                <DialogHeader>
                  <DialogTitle className="text-pink-600 text-xl font-bold">
                    Nota Fiscal da Compra
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Confira os detalhes da sua compra antes de imprimir.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                  <table className="w-full text-sm border border-gray-200">
                    <thead className="bg-pink-50">
                      <tr>
                        <th className="p-2 text-left">Produto</th>
                        <th className="p-2">Qtd</th>
                        <th className="p-2 text-right">Preço</th>
                        <th className="p-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produtos.map((p) => (
                        <tr key={p.id} className="border-t">
                          <td className="p-2">{p.nome}</td>
                          <td className="p-2 text-center">{p.quantidade}</td>
                          <td className="p-2 text-right">R$ {p.preco.toFixed(2)}</td>
                          <td className="p-2 text-right">
                            R$ {(p.preco * p.quantidade).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-4 text-right text-gray-700 space-y-1">
                    <p>Subtotal: R$ {subtotalGeral.toFixed(2)}</p>
                    <p>Desconto: R$ {desconto.toFixed(2)}</p>
                    <p className="font-bold text-lg text-pink-600">Total: R$ {total.toFixed(2)}</p>
                    <p>Forma de pagamento: {formaPagamento}</p>
                  </div>
                </div>

                <DialogFooter className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setMostrarNota(false)}
                    className="border-pink-300 text-pink-600 rounded-full hover:bg-pink-100"
                  >
                    Fechar
                  </Button>
                  <Button onClick={imprimirNota} className="bg-pink-500 hover:bg-pink-600 text-white rounded-full">
                    Imprimir nota fiscal
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
