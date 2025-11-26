import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { ProductGrid } from "@/components/ProductGrid";
import { Product } from "@/types/product";
import { generateMockProducts } from "@/utils/mockProducts";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag } from "lucide-react";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSearchRequest = (query: string) => {
    // Generate mock products based on query
    const mockProducts = generateMockProducts(query);
    setProducts(mockProducts);
    
    toast({
      title: "Search completed",
      description: `Found ${mockProducts.length} products matching your request.`,
    });
  };

  const handlePhotoUpload = (file: File) => {
    setUploadedPhoto(file);
    // In a real implementation, this would call Nano Banana API
    setTimeout(() => {
      toast({
        title: "Virtual try-on ready",
        description: "Select a product to see how it looks on you!",
      });
    }, 2000);
  };

  const handleProductSelect = (product: Product) => {
    if (uploadedPhoto) {
      toast({
        title: "Generating try-on",
        description: `Creating virtual try-on for ${product.name}...`,
      });
      // Here you would call Nano Banana API with the uploaded photo and product
    } else {
      toast({
        title: product.name,
        description: `€${product.price} - ${product.source}`,
      });
    }
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-md sticky top-0 z-10 shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-hero rounded-xl shadow-card">
              <ShoppingBag className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent tracking-tight">
                Wearly
              </h1>
              <p className="text-xs font-medium text-muted-foreground">AI Fashion Assistant</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Chat Interface */}
          <div className="w-full">
            <ChatInterface 
              onSearchRequest={handleSearchRequest}
              onPhotoUpload={handlePhotoUpload}
              uploadedPhoto={uploadedPhoto}
            />
          </div>

          {/* Products Grid */}
          <div className="w-full">
            <ProductGrid 
              products={products} 
              onProductSelect={handleProductSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
