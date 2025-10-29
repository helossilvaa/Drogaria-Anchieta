import React from "react";
import {
  ChartNoAxesCombined,
  Box,
  CircleDollarSign,
  PackageOpen,
  Users,
} from "lucide-react";
import Link from "next/link";

const menuItems = [
  { label: "Dashboard", icon: <ChartNoAxesCombined />, href: "/" },
  { label: "Produtos", icon: <Box />, href: "/perfil" },
  { label: "Financeiro", icon: <CircleDollarSign />, href: "/config" },
  { label: "Estoque", icon: <PackageOpen />, href: "/config" },
  { label: "Funcionários", icon: <Users />, href: "/config" },
];

export default function Sidebar() {
  return (
    <aside className="w-55 h-screen p-2 flex flex-col">
      {/* Logo */}
      <Link href="/matriz">
        <div className="logo flex items-center gap-1 mb-10 mt-2">
          <img src="/icon.png" width={50} height={50} alt="" />
          <div className="flex flex-col justify-center">
            <p className="italic leading-[0.3] text-teal-800 text-xs">Drogaria</p>
            <h5 className="font-bold text-3xl text-teal-800">NCHIETA</h5>
          </div>
        </div>
      </Link>

      <nav className="flex flex-col gap-2 w-full">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex gap-3 p-2 rounded transition group relative duration-300 w-40 justify-start"
          >
            <div className="w-6 flex justify-center">{item.icon}</div>
            <p className="text-left">{item.label}</p>
            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-teal-300 to-red-300 transition-all duration-300 group-hover:w-full" />
          </a>
        ))}
      </nav>
    </aside>
  );
}
