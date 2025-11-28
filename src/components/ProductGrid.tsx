import { useState, useEffect } from "react";
import { Loader2, ShoppingBag } from "lucide-react";

import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

const loadingMessages = [
  "Finding the best fashion pieces just for you",
  "Searching through thousands of stylish options",
  "Matching your style with perfect outfits",
  "Discovering trending pieces for your wardrobe",
  "Curating exclusive selections from top brands",
  "AI is analyzing the latest fashion trends",
  "Handpicking items that match your taste",
];

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  uploadedPhoto?: File | null;
  isLoading?: boolean;
}

export const ProductGrid = ({ products, onProductSelect, uploadedPhoto, isLoading = false }: ProductGridProps) => {
  const firstThreeProducts = products.slice(0, 3);
  const remainingProducts = products.slice(3);
  const photoUrl = uploadedPhoto ? URL.createObjectURL(uploadedPhoto) : null;

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isMessageVisible, setIsMessageVisible] = useState(true);

  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setIsMessageVisible(false);
      
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        setIsMessageVisible(true);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="w-full space-y-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
          </div>
          <p className="text-xl font-semibold text-foreground mb-2">Creating your perfect style...</p>
          <p 
            className={`text-sm text-muted-foreground max-w-md font-medium transition-opacity duration-300 ${
              isMessageVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {loadingMessages[currentMessageIndex]}
          </p>
        </div>
      ) : products.length > 0 ? (
        <>
          {/* First 3 products with comparison view */}
          {uploadedPhoto && firstThreeProducts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Comparación rápida</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {firstThreeProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-pointer"
                    style={{ animationDelay: `${index * 80}ms` }}
                    onClick={() => onProductSelect(product)}
                  >
                    <div className="border border-border/80 rounded-xl overflow-hidden bg-card shadow-card hover:shadow-medium transition-all duration-300">
                      <div className="grid grid-cols-2 gap-0">
                        <div className="relative aspect-[3/4] bg-gradient-subtle">
                          <img
                            src={photoUrl!}
                            alt="Tu foto"
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute bottom-2 left-2 right-2">
                            <span className="text-[10px] font-medium px-2 py-1 bg-background/90 backdrop-blur-sm rounded-full">
                              Tu foto
                            </span>
                          </div>
                        </div>
                        <div className="relative aspect-[3/4] bg-gradient-subtle">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute bottom-2 left-2 right-2">
                            <span className="text-[10px] font-medium px-2 py-1 bg-background/90 backdrop-blur-sm rounded-full">
                              Producto
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-3.5 space-y-2">
                        <h3 className="font-semibold text-base leading-snug line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-foreground">
                            €{product.price.toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              €{product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular products or all products if no photo */}
          {((uploadedPhoto && remainingProducts.length > 0) || !uploadedPhoto) && (
            <div className="space-y-4">
              {uploadedPhoto && remainingProducts.length > 0 && (
                <h2 className="text-lg font-semibold text-foreground">Más resultados</h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {(uploadedPhoto ? remainingProducts : products).map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <ProductCard product={product} onClick={() => onProductSelect(product)} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-4 bg-gradient-subtle rounded-2xl mb-4">
            <ShoppingBag className="h-14 w-14 text-primary/60" />
          </div>
          <p className="text-xl font-semibold text-foreground mb-2">Start your search</p>
          <p className="text-sm text-muted-foreground max-w-md font-medium">
            Use voice or text to tell me what you're looking for. Try "Show me blue mountain pants under 80 euros, size M"
          </p>
        </div>
      )}
    </div>
  );
};
