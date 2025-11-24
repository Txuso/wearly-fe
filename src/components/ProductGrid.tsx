import { ProductCard } from "./ProductCard";
import { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

export const ProductGrid = ({ products, onProductSelect }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <ProductCard product={product} onClick={() => onProductSelect(product)} />
        </div>
      ))}
      {products.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground">
          <p className="text-lg">No products found yet.</p>
          <p className="text-sm mt-2">Try asking the assistant for what you're looking for!</p>
        </div>
      )}
    </div>
  );
};
