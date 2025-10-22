import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

export default function DropdownMenuEstados() {
  const [estados, setEstados] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState(null);

  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((response) => response.json())
      .then((data) => {
        const estadosOrdenados = data.sort((a, b) =>
          a.nome.localeCompare(b.nome)
        );
        setEstados(estadosOrdenados);
      })
      .catch((error) => {
        console.error("Erro ao buscar estados:", error);
      });
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="w-full text-left border border-input bg-background rounded-md px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {estadoSelecionado
            ? `${estadoSelecionado.nome} (${estadoSelecionado.sigla})`
            : "Escolha um estado"}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        {estados.map((estado) => (
          <DropdownMenuItem
            key={estado.id}
            onClick={() => setEstadoSelecionado(estado)}
          >
            {estado.nome} ({estado.sigla})
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
