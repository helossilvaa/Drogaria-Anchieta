"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, CircleDollarSign} from "lucide-react"; 
import { Users, Package, DollarSign, ShoppingCart, ArrowUp, ArrowDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts";
// Dados
const salesData = {
  hoje: [{ dia: "Hoje", vendas: 200, clientes: 60 }],
  semana: [
    { dia: "Seg", vendas: 120, clientes: 35 },
    { dia: "Ter", vendas: 90, clientes: 28 },
    { dia: "Qua", vendas: 150, clientes: 50 },
    { dia: "Qui", vendas: 80, clientes: 22 },
    { dia: "Sex", vendas: 200, clientes: 60 },
    { dia: "Sáb", vendas: 170, clientes: 55 },
    { dia: "Dom", vendas: 140, clientes: 45 },
  ],
  mes: [
    { dia: "Semana 1", vendas: 550, clientes: 150 },
    { dia: "Semana 2", vendas: 620, clientes: 170 },
    { dia: "Semana 3", vendas: 700, clientes: 190 },
    { dia: "Semana 4", vendas: 680, clientes: 180 },
  ],
};

function KPICard({ label, value, icon, variation, onClick }) {
  return (
   
    <Card onClick={onClick} className="cursor-pointer hover:shadow-lg transition-all">
      <CardContent className="flex justify-between items-center gap-4">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-2xl font-bold text-pink-600">{value}</p>
          {variation !== undefined && (
            <p className={`text-xs flex items-center gap-1 ${variation >= 0 ? "text-green-600" : "text-red-600"}`}>
              {variation >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              {Math.abs(variation)}% em relação ao período anterior
            </p>
          )}
        </div>
        {icon}
      </CardContent>
    </Card>
  );
}


function ChartArea({ data, dataKey, title }) {
  const chartConfig = {
    [dataKey]: {
      label: dataKey === "vendas" ? "Vendas" : "Clientes",
      color: dataKey === "vendas" ? "var(--chart-3)" : "var(--chart-2)",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Dados do período selecionado</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="dia" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Area
              type="natural" 
              dataKey={dataKey}
              fill={`var(--color-${dataKey})`}
              fillOpacity={0.4}
              stroke={`var(--color-${dataKey})`}
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">Visualização do período selecionado</p>
      </CardFooter>
    </Card>
  );
}


export default function Dashboard() {
  const router = useRouter();
  const [activePage, setActivePage] = useState("produtos");
  const [activePeriod, setActivePeriod] = useState("semana");


  const pages = [
    { label: "Nova venda", path: "nova venda" },
    { label: "Produtos", path: "produtos" },
    { label: "Programa de Fidelidade", path: "fidelidade" },
  ];

  const periods = ["hoje", "semana", "mes"];

  const kpis = [
    {
      label: "Vendas",
      value: `R$ ${salesData[activePeriod].reduce((acc, item) => acc + item.vendas, 0)}`,
      icon: <CircleDollarSign size={28} className="text-pink-400" />,
      variation: 12,
      onClick: () => alert("Detalhes das vendas"),
    },
    {
      label: "Clientes Atendidos",
      value: salesData[activePeriod].reduce((acc, item) => acc + item.clientes, 0),
      icon: <Users size={28} className="text-pink-400" />,
      variation: -5,
      onClick: () => alert("Detalhes dos clientes"),
    },
    {
      label: "Produtos Vendidos",
      value: "120",
      icon: <Box size={28} className="text-pink-400" />,
      onClick: () => alert("Detalhes dos produtos"),
    },
    {
      label: "Transações",
      value: "67",
      icon: <ShoppingCart size={28} className="text-pink-400" />,
      onClick: () => alert("Detalhes das transações"),
    },
  ];

  return ( 
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Navegação */}
      <div className="flex flex-wrap gap-4 mb-6">
        {pages.map((page) => {
          const isActive = activePage === page.path;
          return (
            <button
              key={page.label}
              onClick={() => { setActivePage(page.path); router.push(`/pdv/${page.path}`); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all ${
                isActive ? "bg-pink-600 text-white shadow-lg" : "bg-pink-100 text-pink-600 hover:bg-pink-200"
              }`}
            >
              {page.path === "produtos" && <Package size={20} />}
              {page.path === "caixa" && <DollarSign size={20} />}
              {page.path === "usuarios" && <Users size={20} />}
              {page.label}
            </button>
          );
        })}
      </div>

      {/* Selector de período */}
      <div className="flex gap-6 border-b border-gray-300 mb-6">
        {periods.map((period) => (
          <button
            key={period}
            onClick={() => setActivePeriod(period)}
            className={`pb-2 font-medium ${
              activePeriod === period ? "text-pink-600 border-b-2 border-pink-600" : "text-gray-500 hover:text-pink-600"
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {kpis.map((kpi) => <KPICard key={kpi.label} {...kpi} />)}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartArea data={salesData[activePeriod]} dataKey="vendas" title="Vendas" />
        <ChartArea data={salesData[activePeriod]} dataKey="clientes" title="Clientes Atendidos" />
      </div>
    </div>
  );
}
