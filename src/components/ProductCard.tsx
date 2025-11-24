import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <Card 
      className="group cursor-pointer hover:shadow-medium transition-all duration-300 overflow-hidden"
      onClick={onClick}
    >
      <div className="relative overflow-hidden aspect-square bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        {product.inStock === false && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="secondary">Out of Stock</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm line-clamp-2 flex-1">
            {product.name}
          </h3>
          <Badge variant="outline" className="shrink-0">
            {product.source}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            €{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              €{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-xs">
            {product.color}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Size {product.size}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
        </div>
        <Button 
          className="w-full mt-2" 
          size="sm"
          disabled={product.inStock === false}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
