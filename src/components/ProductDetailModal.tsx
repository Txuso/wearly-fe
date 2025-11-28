import { Product } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ShoppingBag, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  uploadedPhoto?: File | null;
  sessionId: string;
  onProductUpdate?: (updatedProduct: Product) => void;
}

export const ProductDetailModal = ({
  product,
  isOpen,
  onClose,
  uploadedPhoto,
  sessionId,
  onProductUpdate,
}: ProductDetailModalProps) => {
  const [isLoadingTryOn, setIsLoadingTryOn] = useState(false);
  const [tryOnImage, setTryOnImage] = useState<string | null>(null);
  const { toast } = useToast();

  // Call try-on API when modal opens and photo is uploaded
  useEffect(() => {
    if (isOpen && product && uploadedPhoto && !product.userProductImage) {
      handleTryOn();
    }
    // Reset try-on image when modal closes or product changes
    if (!isOpen) {
      setTryOnImage(null);
      setIsLoadingTryOn(false);
    }
  }, [isOpen, product?.id]);

  const handleTryOn = async () => {
    if (!product || !sessionId) return;

    setIsLoadingTryOn(true);
    try {
      const response = await fetch('http://localhost:3000/api/try-on/from-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          itemImageUrl: product.image,
        }),
      });

      if (!response.ok) throw new Error('Try-on request failed');

      const data = await response.json();
      if (data.tryOnImageUrl) {
        setTryOnImage(data.tryOnImageUrl);
        // Update the product with the try-on image
        const updatedProduct = { ...product, userProductImage: data.tryOnImageUrl };
        if (onProductUpdate) {
          onProductUpdate(updatedProduct);
        }
      }
    } catch (error) {
      console.error('Error during try-on:', error);
      toast({
        title: "Virtual Try-On Error",
        description: "There was a problem generating the virtual try-on. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTryOn(false);
    }
  };

  if (!product) return null;

  const photoUrl = uploadedPhoto ? URL.createObjectURL(uploadedPhoto) : null;
  const displayTryOnImage = tryOnImage || product.userProductImage;

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
          {uploadedPhoto ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Virtual Try-On */}
              <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-500">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Virtual Try-On
                </h3>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-border/80 shadow-card bg-gradient-subtle">
                  {isLoadingTryOn ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                      <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    </div>
                  ) : displayTryOnImage ? (
                    <img
                      src={displayTryOnImage}
                      alt="Virtual try-on"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-subtle">
                      <p className="text-sm text-muted-foreground">Processing...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Photo */}
              <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Product
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
                        Out of Stock
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
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Size</p>
                <Badge variant="outline" className="text-sm font-medium">
                  {product.size || "-"}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Category</p>
                <Badge variant="outline" className="text-sm font-medium">
                  {product.category || "-"}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Store</p>
                <Badge variant="outline" className="text-sm font-medium">
                  {product.source || "-"}
                </Badge>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Description
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
                  if (product.url) {
                    window.open(product.url, '_blank');
                  }
                }}
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                View in Store
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 rounded-xl border-2"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
