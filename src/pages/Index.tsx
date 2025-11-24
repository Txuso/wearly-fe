import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { ProductGrid } from "@/components/ProductGrid";
import { FilterPanel } from "@/components/FilterPanel";
import { Product } from "@/types/product";
import { generateMockProducts } from "@/utils/mockProducts";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag } from "lucide-react";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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

  const toggleArrayItem = (array: string[], item: string, setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    if (product.price > maxPrice) return false;
    if (selectedColors.length > 0 && !selectedColors.includes(product.color)) return false;
    if (selectedSizes.length > 0 && !selectedSizes.includes(product.size)) return false;
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10 shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <ShoppingBag className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                SmartShop AI
              </h1>
              <p className="text-sm text-muted-foreground">Your AI-powered shopping assistant</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Chat */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="h-[calc(100vh-180px)] sticky top-24">
              <ChatInterface 
                onSearchRequest={handleSearchRequest}
                onPhotoUpload={handlePhotoUpload}
              />
            </div>
          </div>

          {/* Main Content - Products */}
          <div className="lg:col-span-5 xl:col-span-6">
            <ProductGrid 
              products={filteredProducts} 
              onProductSelect={handleProductSelect}
            />
          </div>

          {/* Right Sidebar - Filters */}
          <div className="lg:col-span-3 xl:col-span-3">
            <FilterPanel
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              selectedColors={selectedColors}
              onColorToggle={(color) => toggleArrayItem(selectedColors, color, setSelectedColors)}
              selectedSizes={selectedSizes}
              onSizeToggle={(size) => toggleArrayItem(selectedSizes, size, setSelectedSizes)}
              selectedCategories={selectedCategories}
              onCategoryToggle={(category) => toggleArrayItem(selectedCategories, category, setSelectedCategories)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
