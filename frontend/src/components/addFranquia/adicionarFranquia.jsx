import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '../ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import DropdownEstados from '@/components/dropdownEstados/dropdownEstados';

export default function DialogFranquia() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="verde" size="lg" className="flex">
            <Plus size={16} className="mr-2" />
            Nova Franquia
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar nova franquia</DialogTitle>
            <DialogDescription>
              Preencha os dados da nova unidade e clique em salvar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Nome + CNPJ */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Nome</Label>
                <Input placeholder="Nome da unidade" />
              </div>
              <div className="grid gap-2">
                <Label>CNPJ</Label>
                <Input placeholder="CNPJ da unidade" />
              </div>
            </div>

            {/* Email + Telefone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input placeholder="Email da unidade" />
              </div>
              <div className="grid gap-2">
                <Label>Telefone</Label>
                <Input placeholder="Telefone de contato" />
              </div>
            </div>

            {/* Estado + Cidade */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Estado</Label>
                <DropdownEstados />
              </div>
              <div className="grid gap-2">
                <Label>Cidade</Label>
                <Input placeholder="Cidade" />
              </div>
            </div>

            {/* Rua + Número */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Rua</Label>
                <Input placeholder="Nome da rua" />
              </div>
              <div className="grid gap-2">
                <Label>Número</Label>
                <Input placeholder="Número" />
              </div>
            </div>

            {/* CEP + Data de abertura */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>CEP</Label>
                <Input placeholder="CEP" />
              </div>
              <div className="grid gap-2">
                <Label>Data de abertura</Label>
                <Input type="date" />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" variant="verde">Criar unidade</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
