"use client";
import { useState } from "react";
import {
  HomeIcon,
  ShoppingCartIcon,
  BoxIcon,
  GiftIcon,
  ChevronDownIcon,
} from "lucide-react";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const menuItems = [
    { name: "Dashboard", icon: <HomeIcon className="w-5 h-5" /> },
    { name: "Nova Venda", icon: <ShoppingCartIcon className="w-5 h-5" /> },
    { name: "Produtos", icon: <BoxIcon className="w-5 h-5" /> },
    { name: "Programa de Fidelidade", icon: <GiftIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="h-screen w-64 bg-white flex flex-col justify-between border-r shadow-lg">
      {/* Logo */}
      <div className="p-6 flex items-center justify-center border-b">
        <img src="/logo.png" alt="Logo" className="w-32" />
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveItem(item.name)}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors duration-200 ${
              activeItem === item.name
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {item.icon}
            <span className="truncate">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="p-6 flex items-center gap-3 border-t hover:bg-gray-50 cursor-pointer transition-colors duration-200">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
          N
        </div>
        <div className="flex-1 truncate">
          <p className="text-sm font-medium">Fulana</p>
          <p className="text-xs text-gray-500 truncate">Fulana@gmail.com</p>
        </div>
        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
}
