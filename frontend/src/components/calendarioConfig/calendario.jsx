// CalendarioConfig.jsx
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";

export function CalendarioConfig({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value ? new Date(value) : undefined);

  useEffect(() => {
    if (value) setSelected(new Date(value));
  }, [value]);

  const handleSelect = (date) => {
    if (!date) return; 
    setSelected(date);
    if (onChange) {
      onChange(date.toISOString().split("T")[0]); 
    }
    setOpen(false);
  };
  

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selected ? selected.toLocaleDateString() : "Selecione a data"}
          <CalendarIcon className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={selected} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}
