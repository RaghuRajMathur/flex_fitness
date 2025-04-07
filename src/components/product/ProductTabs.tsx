
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";

interface ProductTabsProps {
  specs: Record<string, string>;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ specs }) => {
  return (
    <Tabs defaultValue="specifications" className="mt-8">
      <TabsList className="w-full grid grid-cols-3 mb-2">
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
        <TabsTrigger value="shipping">Shipping</TabsTrigger>
        <TabsTrigger value="warranty">Warranty</TabsTrigger>
      </TabsList>
      
      <TabsContent value="specifications" className="pt-4 bg-white/70 p-6 rounded-lg border">
        {specs && Object.keys(specs).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="flex py-3 border-b last:border-0">
                <span className="w-1/3 font-medium text-gray-700">{key}</span>
                <span className="w-2/3 text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Detailed specifications not available for this product.
          </p>
        )}
      </TabsContent>
      
      <TabsContent value="shipping" className="pt-4 bg-white/70 p-6 rounded-lg border">
        <div className="space-y-4">
          <p>
            We offer free standard shipping on all orders over {formatCurrency(10000)}. Orders under {formatCurrency(10000)} have a flat shipping rate of {formatCurrency(499)}.
          </p>
          <p>
            <strong>Delivery times:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Standard Shipping: 3-5 business days</li>
            <li>Express Shipping: 1-2 business days (additional {formatCurrency(1295)})</li>
          </ul>
          <p>
            International shipping is available for select countries. Rates and delivery times vary by location.
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="warranty" className="pt-4 bg-white/70 p-6 rounded-lg border">
        <div className="space-y-4">
          <p>
            All FlexFitness products come with our industry-leading 10-year warranty against manufacturing defects.
          </p>
          <p>
            Our warranty covers:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Structural failures due to materials or workmanship</li>
            <li>Welds and moving parts</li>
            <li>Surface finish against peeling or cracking</li>
          </ul>
          <p>
            Normal wear and tear, improper assembly, and damage due to misuse are not covered by the warranty.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;
