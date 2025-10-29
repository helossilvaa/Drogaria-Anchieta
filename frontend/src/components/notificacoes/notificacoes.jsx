import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function PopoverNotificacoes() {
  const [activeTab, setActiveTab] = useState("Inbox");
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef({});

  const tabs = ["Inbox", "Importantes", "Arquivados"];

  // Atualiza posição e largura da linha rosa conforme aba ativa
  useEffect(() => {
    const el = tabsRef.current[activeTab];
    if (el) {
      setIndicatorStyle({
        width: el.offsetWidth + "px",
        left: el.offsetLeft + "px",
      });
    }
  }, [activeTab]);

  return (
    <Popover>
      <PopoverTrigger className="relative">
        <div className="w-9 h-9 shadow-sm flex items-center justify-center rounded-full hover:bg-gray-200 relative">
          <Bell className="w-5 h-5 text-gray-700" />
          {/* bolinha de notificação no ícone */}
          <span className="absolute top-[0] right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0">
        <div className="flex flex-col">
          <div className="p-4 pb-0 relative">
            <h1 className="text-2xl font-bold mb-2">Notificações</h1>

            {/* TABS */}
            <div className="relative flex items-center gap-4 border-b border-gray-300 pb-2">
              {tabs.map((tab, index) => (
                <div key={tab} className="flex items-center gap-4">
                  <button
                    ref={(el) => (tabsRef.current[tab] = el)}
                    onClick={() => setActiveTab(tab)}
                    className={`font-medium transition-colors ${
                      activeTab === tab
                        ? "text-pink-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>

                  {/* Adiciona o separador “|” entre Importantes e Arquivados */}
                  {index === 1 && (
                    <span className="text-gray-400 select-none">|</span>
                  )}
                </div>
              ))}

              {/* Linha rosa animada */}
              <span
                className="absolute bottom-0 h-[2px] bg-pink-500 transition-all duration-300"
                style={indicatorStyle}
              ></span>
            </div>
          </div>

          {/* Conteúdo abaixo */}
          <p className="px-4 py-2 bg-gray-50 text-gray-400">HOJE</p>
          <div className="noti px-4 py-2">
            <div className="icon"></div>
            <div className="mensagem"></div>
            <div className="horario"></div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
