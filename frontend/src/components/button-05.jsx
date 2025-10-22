import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const IconButtonDemo = () => {
  return (
    <div className="flex items-center gap-2">
      <Button >
      Pix <ArrowRight />
      </Button>
      <Button>
        Crédito <ArrowRight />
      </Button>
      <Button>
        Débito <ArrowRight />
      </Button>
    </div>
  );
};

export default IconButtonDemo;
