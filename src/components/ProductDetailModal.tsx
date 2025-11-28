import { Product } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ShoppingBag } from "lucide-react";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  uploadedPhoto?: File | null;
}

export const ProductDetailModal = ({
  product,
  isOpen,
  onClose,
  uploadedPhoto,
}: ProductDetailModalProps) => {
  if (!product) return null;

  const photoUrl = uploadedPhoto ? URL.createObjectURL(uploadedPhoto) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-gradient-subtle">
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {/* Comparison Grid */}
          {photoUrl ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* User Photo */}
              <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-500">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Tu foto
                </h3>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-border/80 shadow-card bg-gradient-subtle">
                  <img
                    src={photoUrl}
                    alt="Tu foto"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Product Photo */}
              <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  El producto
                </h3>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-primary/20 shadow-card bg-gradient-subtle">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                  {product.inStock === false && (
                    <div className="absolute inset-0 bg-background/90 flex items-center justify-center backdrop-blur-sm">
                      <Badge variant="secondary" className="font-medium">
                        Agotado
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 animate-in fade-in scale-in duration-500">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border-2 border-border/80 shadow-card bg-gradient-subtle">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Product Details */}
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            {/* Price */}
            <div className="flex items-baseline gap-3 pb-4 border-b border-border/60">
              <span className="text-3xl font-bold text-foreground">
                €{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  €{product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.originalPrice && (
                <Badge variant="default" className="ml-2">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>

            {/* Attributes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Color</p>
                <Badge variant="outline" className="text-sm font-medium">
                  {product.color || "-"}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Talla</p>
                <Badge variant="outline" className="text-sm font-medium">
                  {product.size || "-"}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Categoría</p>
                <Badge variant="outline" className="text-sm font-medium">
                  {product.category || "-"}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Tienda</p>
                <Badge variant="outline" className="text-sm font-medium">
                  {product.source || "-"}
                </Badge>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Descripción
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                size="lg"
                className="flex-1 h-12 text-base font-semibold rounded-xl shadow-card hover:shadow-medium transition-all"
                disabled={product.inStock === false}
                onClick={() => {
                  // In a real app, this would open the product URL
                  window.open(`https://example.com/product/${product.id}`, '_blank');
                }}
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Ver en tienda
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 rounded-xl border-2"
                onClick={onClose}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
