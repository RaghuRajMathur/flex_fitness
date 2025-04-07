
import React from "react";
import { Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const ProductBenefits: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-b">
      <div className="flex items-center">
        <Truck className="h-5 w-5 mr-3 text-muted-foreground" />
        <span className="text-sm">Free shipping over {formatCurrency(10000)}</span>
      </div>
      <div className="flex items-center">
        <ShieldCheck className="h-5 w-5 mr-3 text-muted-foreground" />
        <span className="text-sm">10-year warranty</span>
      </div>
      <div className="flex items-center">
        <RotateCcw className="h-5 w-5 mr-3 text-muted-foreground" />
        <span className="text-sm">30-day returns</span>
      </div>
    </div>
  );
};

export default ProductBenefits;
