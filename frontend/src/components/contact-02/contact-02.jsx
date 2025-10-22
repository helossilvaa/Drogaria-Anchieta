"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, X, CheckCircle2, AlertCircle } from "lucide-react";

export default function NovaVendaPage() {
  const [produtos, setProdutos] = useState([
    { id: 1, nome: "Dipirona Monoidratada 50mg/ml", preco: 18.99, quantidade: 1 },
    { id: 2, nome: "Paracetamol 500mg", preco: 12.5, quantidade: 1 },
    { id: 3, nome: "Sabonete Facial 500mg", preco: 10.0, quantidade: 1 },
    { id: 4, nome: "Creme Corporal 500mg", preco: 25.5, quantidade: 1 },
    { id: 5, nome: "Escova de Dente", preco: 8.75, quantidade: 1 },
    { id: 6, nome: "Shampoo Anticaspa", preco: 19.99, quantidade: 1 },
    { id: 7, nome: "Protetor Solar FPS 50", preco: 42.0, quantidade: 1 },
  ]);

  const [desconto, setDesconto] = useState(0);
  const [codigoDesconto, setCodigoDesconto] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [formaPagamento, setFormaPagamento] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [alerta, setAlerta] = useState(null);

  const itensPorPagina = 5;

 
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
  const total = subtotalGeral - desconto;

  const totalPaginas = Math.ceil(produtos.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const produtosExibidos = produtos.slice(inicio, fim);

  const paginaAnterior = () => paginaAtual > 1 && setPaginaAtual(paginaAtual - 1);
  const proximaPagina = () =>
    paginaAtual < totalPaginas && setPaginaAtual(paginaAtual + 1);

 
  const mostrarAlerta = (mensagem, tipo = "info") => {
    setAlerta({ mensagem, tipo });
    setTimeout(() => setAlerta(null), 3000); // fecha em 3s
  };

  const handleProsseguir = () => {
    if (!formaPagamento) {
      mostrarAlerta("Selecione uma forma de pagamento antes de prosseguir!", "erro");
      return;
    }
    setModalAberto(true);
  };

  const aplicarDescontoCodigo = () => {
    if (!codigoDesconto.trim()) {
      mostrarAlerta("Insira um código ou CPF válido.", "erro");
      return;
    }

    if (codigoDesconto.length >= 5) {
      const valorDesconto = subtotalGeral * 0.1;
      setDesconto(valorDesconto.toFixed(2));
      mostrarAlerta("Desconto de 10% aplicado com sucesso!", "sucesso");
    } else {
      mostrarAlerta("Código inválido ou não elegível para desconto.", "erro");
    }
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
          {alerta.tipo === "sucesso" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="font-medium">{alerta.mensagem}</span>
        </div>
      )}


      <div className="w-full max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
   
        <div className="md:col-span-2">
          <Input
            placeholder="Insira o código do produto"
            className="bg-white border-pink-300 text-gray-800 placeholder:text-gray-500 rounded-full px-5 py-6"
          />

          <Card className="mt-6">
            <CardContent className="p-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-pink-600 font-semibold">
                    <th className="pb-2">Produto</th>
                    <th className="pb-2">Preço</th>
                    <th className="pb-2 text-center">Quantidade</th>
                    <th className="pb-2 text-right">Subtotal</th>
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
                        <span className="font-medium text-gray-700">
                          {produto.quantidade}
                        </span>
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
                <p className="font-medium text-gray-700">
                  R$ {subtotalGeral.toFixed(2)}
                </p>
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
                <p className="text-pink-600 font-semibold text-lg mb-1">
                  Total
                </p>
                <p className="text-gray-800 font-bold text-xl">
                  R$ {total.toFixed(2)}
                </p>
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
                Prosseguir
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

    
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative text-center">
            <button
              onClick={() => setModalAberto(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-semibold text-pink-600 mb-4">
              Imprimir nota fiscal?
            </h2>
            <p className="text-gray-600 mb-6">
              Forma de pagamento selecionada: <b>{formaPagamento}</b> <br />
              Total da venda: <b>R$ {total.toFixed(2)}</b>
            </p>

            <div className="flex justify-center gap-4">
              <Button
                onClick={() => window.print()}
                className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6"
              >
                Imprimir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
