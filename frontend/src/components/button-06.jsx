import { Button } from "@/components/ui/button";

const LoadingButtonDemo = () => {
  return (
    <div className="flex items-center gap-2">
      <Button>
      Cancelar
      </Button>
      <Button>
        Prosseguir
      </Button>
    </div>
  );
};

export default LoadingButtonDemo;
