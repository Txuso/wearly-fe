import { ChatInterface } from "@/components/ChatInterface";
import { Product } from "@/types/product";
import { ProductGrid } from "@/components/ProductGrid";
import { ShoppingBag } from "lucide-react";
import { generateMockProducts } from "@/utils/mockProducts";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type ApiProduct = Partial<Product> & {
  price?: number | string;
  originalPrice?: number | string;
};

interface ChatApiResponse {
  reply?: string;
  message?: string;
  products?: ApiProduct[];
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSearchRequest = async (query: string) => {
    const endpoint = "http://localhost:3000/api/chat";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = (await response.json()) as ChatApiResponse;
      const reply: string =
        data?.reply ??
        data?.message ??
        `He recibido tu búsqueda para "${query}". Estoy preparando recomendaciones.`;

      const rawProducts: ApiProduct[] = Array.isArray(data?.products) ? data.products : [];
      const normalizedProducts: Product[] = rawProducts.map((item, index) => ({
        id: item?.id ?? `api-product-${index}`,
        name: item?.name ?? `Suggested item ${index + 1}`,
        price: typeof item?.price === "number" ? item.price : Number(item?.price) || 0,
        originalPrice:
          typeof item?.originalPrice === "number"
            ? item.originalPrice
            : item?.originalPrice
            ? Number(item.originalPrice)
            : undefined,
        image:
          item?.image ??
          "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&w=400&h=400&fit=crop",
        source: item?.source ?? "Assistant",
        color: item?.color ?? "Assorted",
        size: item?.size ?? "M",
        category: item?.category ?? "Apparel",
        inStock: typeof item?.inStock === "boolean" ? item.inStock : true,
        description: item?.description ?? "Curated recommendation from the assistant.",
      }));

      setProducts(normalizedProducts);

      toast({
        title: "Assistant response",
        description: normalizedProducts.length
          ? `Encontré ${normalizedProducts.length} productos para ti.`
          : "No he encontrado productos, pero seguiré buscando.",
      });

      return { reply, products: normalizedProducts };
    } catch (error) {
      console.error("Error contacting chat API", error);

      const fallbackProducts = generateMockProducts(query);
      setProducts(fallbackProducts);

      toast({
        title: "Conexión con el asistente fallida",
        description: "Mostrando resultados simulados mientras se restablece la conexión.",
        variant: "destructive",
      });

      return {
        reply:
          "No he podido conectar con el servidor ahora mismo, así que te muestro unas recomendaciones simuladas.",
        products: fallbackProducts,
      };
    }
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
              <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text tracking-tight">
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
