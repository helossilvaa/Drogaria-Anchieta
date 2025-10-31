"use client";

import Sidebar from "@/components/sidebar/sidebar";
import { Search } from "lucide-react";
import { ComboboxDemo } from "../combobox/combobox";
import { PopoverNotificacoes } from "../notificacoes/notificacoes";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const API_URL = "http://localhost:8080";
  const router = useRouter();

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/");
          return;
        }

        const decoded = jwtDecode(token);

       
        if (!["matriz", "gerente", "pdv"].includes(decoded.setor)) {
          router.push("/");
          return;
        }

        
        if (decoded.exp < Date.now() / 1000) {
          localStorage.removeItem("token");
          router.push("/");
          return;
        }

        
        const res = await fetch(`${API_URL}/usuarios/${decoded.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Usuário não encontrado");

        const data = await res.json();
        setUsuario({
          nome: data.nome,
          foto: data.foto || null,
          setor: decoded.setor,
        });

      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [router]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }


  if (erro) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Erro: {erro}</p>
      </div>
    );
  }

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
            <PopoverNotificacoes />
          </div>

          <div className="profile">
            <ComboboxDemo />
          </div>
        </div>

       
        <div className="conteudo bg-gray-50 h-screen rounded-2xl p-3">
          {children}
        </div>
      </div>
    </div>
  );
}
