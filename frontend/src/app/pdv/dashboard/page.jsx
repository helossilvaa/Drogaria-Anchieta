"use client";

import React, { useState, memo } from "react";
import { useRouter } from "next/navigation";
import { Users, ShoppingCart, Package, DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Dados de exemplo por período
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
    <Card
      className="bg-white border rounded-2xl hover:shadow-xl transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6 gap-3">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-pink-600 mt-1">{value}</p>
          {variation !== undefined && (
            <p
              className={`text-xs mt-1 flex items-center gap-1 ${
                variation >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
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

// SalesChart
const SalesChart = memo(({ data, dataKey, title }) => (
  <Card className="bg-white border rounded-2xl p-6 hover:shadow-xl transition-all">
    <h2 className="text-lg font-semibold text-pink-600 mb-4">{title}</h2>
    <ResponsiveContainer width="100%" height={280}>
      {dataKey === "vendas" ? (
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f9e4ef" />
          <XAxis dataKey="dia" stroke="#ec4899" />
          <YAxis stroke="#ec4899" />
          <Tooltip contentStyle={{ backgroundColor: "#ffe4f0", borderRadius: 8, border: "none" }} />
          <Bar dataKey="vendas" fill="#ec4899" radius={[6, 6, 0, 0]} />
        </BarChart>
      ) : (
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f9e4ef" />
          <XAxis dataKey="dia" stroke="#ec4899" />
          <YAxis stroke="#ec4899" />
          <Tooltip contentStyle={{ backgroundColor: "#ffe4f0", borderRadius: 8, border: "none" }} />
          <Line type="monotone" dataKey="clientes" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      )}
    </ResponsiveContainer>
  </Card>
));

// NavigationButtons atualizado
function NavigationButtons({ pages, activePage, onNavigate }) {
  const icons = {
    produtos: <Package size={20} />,
    caixa: <DollarSign size={20} />,
    usuarios: <Users size={20} />,
  };

  return (
    <div className="flex flex-wrap gap-4">
      {pages.map((page) => {
        const isActive = activePage === page.path;
        return (
          <button
            key={page.label}
            onClick={() => onNavigate(page.path)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all 
              ${isActive ? "bg-pink-600 text-white shadow-lg" : "bg-pink-100 text-pink-600 hover:bg-pink-200"}
            `}
          >
            {icons[page.path]}
            <span>{page.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// PeriodSelector
function PeriodSelector({ periods, activePeriod, onSelect }) {
  return (
    <div className="flex gap-6 border-b border-gray-300 mb-6">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onSelect(period)}
          className={`pb-2 font-medium transition-all ${
            activePeriod === period
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-500 hover:text-pink-600"
          }`}
        >
          {period.charAt(0).toUpperCase() + period.slice(1)}
        </button>
      ))}
    </div>
  );
}

// Dashboard principal
export default function Dashboard() {
  const router = useRouter();
  const [activePage, setActivePage] = useState("produtos");
  const [activePeriod, setActivePeriod] = useState("semana");

  const pages = [
    { label: "Produtos", path: "produtos" },
    { label: "Caixa", path: "caixa" },
    { label: "Usuários", path: "usuarios" },
  ];

  const periods = ["hoje", "semana", "mes"];

  const kpis = [
    {
      label: "Vendas",
      value: `R$ ${salesData[activePeriod].reduce((acc, item) => acc + item.vendas, 0)}`,
      icon: <DollarSign size={28} className="text-pink-400" />,
      variation: 12,
      onClick: () => alert("Detalhes das vendas"),
    },
    {
      label: "Clientes Atendidos",
      value: `${salesData[activePeriod].reduce((acc, item) => acc + item.clientes, 0)}`,
      icon: <Users size={28} className="text-pink-400" />,
      variation: -5,
      onClick: () => alert("Detalhes dos clientes"),
    },
    {
      label: "Produtos Vendidos",
      value: "120",
      icon: <Package size={28} className="text-pink-400" />,
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
      {/* Header / Navegação */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <NavigationButtons
          pages={pages}
          activePage={activePage}
          onNavigate={(path) => {
            setActivePage(path);
            router.push(`/pdv/${path}`);
          }}
        />
      </div>

      {/* Selector de Período */}
      <PeriodSelector periods={periods} activePeriod={activePeriod} onSelect={setActivePeriod} />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={salesData[activePeriod]} dataKey="vendas" title="Vendas" />
        <SalesChart data={salesData[activePeriod]} dataKey="clientes" title="Clientes Atendidos" />
      </div>
    </div>
  );
}
