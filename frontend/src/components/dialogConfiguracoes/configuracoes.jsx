import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from "@/components/ui/dialog";
  import { Label } from "@radix-ui/react-label";
  import { Input } from "@heroui/react";
  
  export function DialogConfig({ open, onOpenChange }) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurações</DialogTitle>
            <DialogDescription>
              Faça alterações no seu perfil aqui. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>
  
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name-1">Nome</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username-1">Telefone</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username-1">email</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username-1">Data de nascimento</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username-1">Telefone</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  