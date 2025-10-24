"use client";
import Sidebar from "@/components/sidebar/sidebar";
import { Bell, Search } from "lucide-react";
import { ComboboxDemo } from "../combobox/combobox";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        
        <div className="flex items-center justify-end p-4 gap-3 pr-10">
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar..."
              className="border rounded-full pl-9 pr-15 py-1 text-black focus:outline-none focus:ring focus:ring-gray-200"
            />
          </div>

          <div className="notificacoes relative cursor-pointer p-2">
            <div className="w-9 h-9 shadow-sm flex items-center justify-center rounded-full hover:bg-gray-200">
              <Bell className="w-5 h-5 text-gray-700" />
            </div>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>

          <div className="profile">
            <ComboboxDemo />
          </div>
        </div>
      </div>
    </div>
  );
}
