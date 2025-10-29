"use client";
import Sidebar from "@/components/sidebar/sidebar";
import { Search } from "lucide-react";
import { ComboboxDemo } from "../combobox/combobox";
import { PopoverNotificacoes } from "../notificacoes/notificacoes";

export default function Layout() {

  return (
    <div className="flex min-h-screen p-2">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 pt-2 gap-4">
        
        <div className="flex items-center justify-end gap-3">
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar..."
              className="border rounded-full pl-9 pr-15 py-1 text-black focus:outline-none focus:ring focus:ring-gray-200"
            />
          </div>

          <div className="notificacoes relative cursor-pointer p-2">
          <PopoverNotificacoes/>
          </div>

          <div className="profile">
            <ComboboxDemo />
          </div>
        </div>
        <div className="conteudo bg-gray-50 h-screen rounded-2xl p-3">
        
        </div>
      </div>
    </div>
  );
}
