import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { Product } from "@/types/product";
import { Loader2 } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onTryOn?: () => void;
  isLoading?: boolean;
}

export const ProductCard = ({ product, onClick, onTryOn, isLoading = false }: ProductCardProps) => {
  return (
    <Card 
      className="group cursor-pointer hover:shadow-medium transition-all duration-300 overflow-hidden border border-border/80 bg-card shadow-card relative"
      onClick={onClick}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center backdrop-blur-sm z-10">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-2" />
          <p className="text-sm font-medium text-foreground">Processing try-on...</p>
        </div>
      )}
      
      {product.userProductImage ? (
        // Comparison view with try-on image
        <div className="grid grid-cols-2 gap-0">
          <div className="relative aspect-[3/4] bg-gradient-subtle">
            <img
              src={product.userProductImage}
              alt="Virtual try-on"
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-2 left-2 right-2">
              <span className="text-[10px] font-medium px-2 py-1 bg-background/90 backdrop-blur-sm rounded-full">
                Virtual Try-On
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
                Product
              </span>
            </div>
          </div>
        </div>
      ) : (
        // Regular single image view
        <div className="relative overflow-hidden aspect-[3/4] bg-gradient-subtle">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          {product.discount && product.discount > 0 && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-red-500 text-white font-bold text-xs px-2 py-1">
                -{product.discount}%
              </Badge>
            </div>
          )}
          {product.inStock === false && (
            <div className="absolute inset-0 bg-background/90 flex items-center justify-center backdrop-blur-sm">
              <Badge variant="secondary" className="font-medium">Out of Stock</Badge>
            </div>
          )}
        </div>
      )}
      
      <CardContent className="p-3.5 space-y-2.5">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base leading-snug line-clamp-2 flex-1">
              {product.name}
            </h3>
          </div>
          <Badge 
            variant="outline" 
            className="text-[10px] font-medium px-2 py-0.5 border-border/60"
          >
            {product.source}
          </Badge>
        </div>
        
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
        
        <div className="flex flex-wrap gap-1.5">
          {product.color && (
            <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 border-border/60 bg-secondary/30">
              {product.color}
            </Badge>
          )}
          {product.size && (
            <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 border-border/60 bg-secondary/30">
              {product.size}
            </Badge>
          )}
          {product.category && (
            <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 border-border/60 bg-secondary/30">
              {product.category}
            </Badge>
          )}
        </div>
        
        {!product.userProductImage ? (
          <div className="flex gap-2 mt-1">
            <Button 
              className="flex-1 h-8 text-xs font-semibold rounded-full" 
              size="sm"
              disabled={product.inStock === false}
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              View Details
            </Button>
            <Button 
              className="flex-1 h-8 text-xs font-semibold rounded-full bg-background text-primary border border-primary hover:bg-primary/10" 
              size="sm"
              variant="outline"
              disabled={product.inStock === false}
              onClick={(e) => {
                e.stopPropagation();
                onTryOn?.();
              }}
            >
              Try-On
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full mt-1 h-8 text-xs font-semibold rounded-full" 
            size="sm"
            disabled={product.inStock === false}
          >
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
