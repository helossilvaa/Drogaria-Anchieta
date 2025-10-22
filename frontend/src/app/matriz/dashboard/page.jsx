"use client";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardMatriz() {
  return (
    <SidebarProvider>
      <Sidebar>
       
        <div className="p-4 text-black">Menu lateral</div>
      </Sidebar>

      
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Dashboard Matriz</h1>
        <p>Conteúdo principal aq</p>
      </main>
    </SidebarProvider>
  );
}
