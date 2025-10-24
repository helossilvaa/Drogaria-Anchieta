import React from "react";
import { ChartNoAxesCombined, Box, CircleDollarSign, PackageOpen, Users} from "lucide-react"; 

const menuItems = [
  { label: "Dashboard", icon: <ChartNoAxesCombined />, href: "/" },
  { label: "Produtos", icon: <Box />, href: "/perfil" },
  { label: "Financeiro", icon: <CircleDollarSign />, href: "/config" },
  { label: "Estoque", icon: <PackageOpen />, href: "/config" },
  { label: "Funcionários", icon: <Users />, href: "/config" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen p-6 flex flex-col">
    <div className="logo flex flex-column ">
      <img src="/icon.png" width={60} height={50} alt="" />
        <div className="escritologo gap-0 flex flex-col align-center justify-center ">
      <p className="subtitulo italic leading-[0.6] text-teal-800 text-md">Drogaria</p>
      <h5 className="titulo font-bold text-4xl text-teal-800 ">NCHIETA</h5>
      </div>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-2 p-2 rounded hover:bg-accent hover:text-accent-foreground transition"
          >
            {item.icon}
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
