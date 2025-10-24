"use client"

import * as React from "react";
import {useState, useEffect} from 'react'
import { LogOut, Settings, Check, ChevronsUpDown } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"


const menuItems = [
  {
    value: "configuracoes",
    label: "Configurações",
    icon: Settings,
  },
  {
    value: "sair",
    label: "Sair",
    icon: LogOut,
  },
]


function getInitials(name) {
  if (!name) return ""
  const parts = name.trim().split(" ")
  return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join("")
}

export function ComboboxDemo({ userName = "Heloise Soares", userImage = null }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const API_URL = "http://localhost:8080";
const router = useRouter();

useEffect(() => {
  const fetchUsuario = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const decoded = jwtDecode(token);

      if (!["matriz", "gerente", "pdv"].includes(decoded.funcao)) {
        router.push("/");
        return;
      }

      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem("token");
        toast.error("Seu login expirou.");
        setTimeout(() => router.push("/login"), 3000);
        return;
      }

      const id = decoded.id;

      const res = await fetch(`${API_URL}/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Usuário não encontrado");

      const data = await res.json();

      setDadosUsuario({
        nome: data.nome,
        foto: data.foto || getInitials
      });

      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  fetchUsuario();
}, [router]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[220px] justify-between"
        >
         
          <div className="flex items-center gap-2">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                width={24}
                height={24}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium uppercase">
                {getInitials(userName)}
              </div>
            )}
            <span className="font-medium">{userName}</span>
          </div>

          <ChevronsUpDown className="opacity-50 h-4 w-4" />
        </Button>
      </PopoverTrigger>

      {/* Menu dropdown */}
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandInput placeholder="Buscar..." className="h-9" />
          <CommandList>
            <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
            <CommandGroup>
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
