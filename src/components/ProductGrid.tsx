import { ProductCard } from "./ProductCard";
import { Product } from "@/types/product";
import { ShoppingBag } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

export const ProductGrid = ({ products, onProductSelect }: ProductGridProps) => {
  return (
    <div className="w-full">
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} onClick={() => onProductSelect(product)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/40 mb-4" />
          <p className="text-xl font-medium text-foreground mb-2">Start your search</p>
          <p className="text-muted-foreground max-w-md">
            Use voice or text to tell me what you're looking for. Try "Show me blue mountain pants under 80 euros, size M"
          </p>
        </div>
      )}
    </div>
  );
};
