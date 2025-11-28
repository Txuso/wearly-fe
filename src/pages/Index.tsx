import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useState } from "react";

import { ApiError } from "@/services/api";
import { ChatInterface } from "@/components/ChatInterface";
import { NavLink } from "@/components/NavLink";
import { Product } from "@/types/product";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { ProductGrid } from "@/components/ProductGrid";
import { ShoppingBag } from "lucide-react";
import { generateMockProducts } from "@/utils/mockProducts";
import { useToast } from "@/hooks/use-toast";

interface BackendProduct {
  title: string;
  description: string;
  score: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  product_url: string;
  product_image_url: string;
  user_product_url?: string;
  store: string;
  color: string;
  size: string;
  garmentType: string;
}

interface ChatApiResponse {
  response: string;
  sessionId: string;
  conversationHistory: Array<{
    role: string;
    content: string;
  }>;
  searchResults: BackendProduct[];
}

const CHAT_ENDPOINT = "http://localhost:3000/api/chat";
const UPLOAD_IMAGE_ENDPOINT = "http://localhost:3000/api/upload-user-image";
const TRY_ON_ENDPOINT = "http://localhost:3000/api/try-on/from-item";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [tryOnLoadingIds, setTryOnLoadingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const bootstrapSession = async () => {
      try {
        const response = await fetch(CHAT_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message:
              "Me gustaría encontrar unas zapatillas de trail running talla 42 por debajo de 80 euros",
          }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = (await response.json()) as ChatApiResponse;

        if (data.sessionId) {
          setSessionId(data.sessionId);
          console.log(`[Wearly] Session established: ${data.sessionId}`);
        } else {
          console.warn("[Wearly] Session bootstrap succeeded but no sessionId was returned.");
        }
      } catch (error) {
        console.error("[Wearly] Unable to bootstrap chat session", error);
      }
    };

    bootstrapSession();
  }, []);

  const handleSearchRequest = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: query,
          ...(sessionId ? { sessionId } : {}),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = (await response.json()) as ChatApiResponse;

      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        console.log(`[Wearly] Session updated: ${data.sessionId}`);
      }

      const reply = data.response || `He recibido tu búsqueda para "${query}". Estoy preparando recomendaciones.`;

      const searchResults = Array.isArray(data.searchResults) ? data.searchResults : [];
      const normalizedProducts: Product[] = searchResults.map((item, index) => ({
        id: item.product_url || `product-${index}`,
        name: item.title,
        price: item.price,
        ...(item.discount && item.discount > 0 ? { originalPrice: item.originalPrice, discount: item.discount } : {}),
        image: item.product_image_url || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&w=400&h=400&fit=crop",
        userProductImage: item.user_product_url,
        source: item.store,
        color: item.color,
        size: item.size,
        category: item.garmentType,
        inStock: true,
        description: item.description,
      }));

      setProducts(normalizedProducts);

      toast({
        title: "✨ Perfect matches found",
        description: normalizedProducts.length
          ? `I found ${normalizedProducts.length} amazing ${normalizedProducts.length === 1 ? 'product' : 'products'} for you!`
          : "No products found yet, but I'll keep searching for you.",
        className: "border-primary bg-primary/95 text-primary-foreground",
      });

      return { reply, products: normalizedProducts };
    } catch (error) {
      console.error("Error contacting chat API", error);

      const fallbackProducts = generateMockProducts(query);
      setProducts(fallbackProducts);

      const errorMessage = error instanceof ApiError
        ? `Error ${error.status}: ${error.message}`
        : "No se pudo conectar con el servidor";

      toast({
        title: "Conexión con el asistente fallida",
        description: errorMessage + ". Mostrando resultados simulados.",
        variant: "destructive",
      });

      return {
        reply:
          "No he podido conectar con el servidor ahora mismo, así que te muestro unas recomendaciones simuladas.",
        products: fallbackProducts,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    // Validate file before upload
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > MAX_SIZE) {
      toast({
        title: "File too large",
        description: "Image must be less than 10MB. Please choose a smaller file.",
        variant: "destructive",
      });
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only JPEG, PNG, and WebP images are allowed.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingPhoto(true);
    setUploadedPhoto(file);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      // Add sessionId if available
      if (sessionId) {
        formData.append('sessionId', sessionId);
      }

      const response = await fetch(UPLOAD_IMAGE_ENDPOINT, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type - browser will set it automatically with boundary
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('[Wearly] Image uploaded successfully:', data);

      // Store imageId and url for later use with try-on
      if (data.imageId) {
        localStorage.setItem('userImageId', data.imageId);
      }
      if (data.url) {
        localStorage.setItem('userImageUrl', data.url);
      }

      toast({
        title: "✨ Photo uploaded",
        description: "Your photo is ready for virtual try-on!",
        className: "border-primary bg-primary/95 text-primary-foreground",
      });
    } catch (error) {
      console.error('[Wearly] Failed to upload image:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Clear the uploaded photo on error
      setUploadedPhoto(null);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleTryOn = async (product: Product) => {
    if (!sessionId) {
      toast({
        title: "Session not ready",
        description: "Please wait for the session to be established.",
        variant: "destructive",
      });
      return;
    }

    // Add product to loading set
    setTryOnLoadingIds(prev => new Set(prev).add(product.id));

    try {
      const response = await fetch(TRY_ON_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionId,
          itemImageUrl: product.image,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Try-on failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('[Wearly] Try-on successful:', data);

      // Update the product with the try-on image
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === product.id
            ? { ...p, userProductImage: data.tryOnImageUrl }
            : p
        )
      );

      toast({
        title: "✨ Try-on complete",
        description: data.message || "Your virtual try-on is ready!",
        className: "border-primary bg-primary/95 text-primary-foreground",
      });
    } catch (error) {
      console.error('[Wearly] Try-on failed:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      toast({
        title: "Try-on failed",
        description: errorMessage || "Could not process virtual try-on. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Remove product from loading set
      setTryOnLoadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uploadedPhoto={uploadedPhoto}
        sessionId={sessionId}
        onProductUpdate={(updatedProduct) => {
          setProducts(prev => 
            prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
          );
        }}
      />
      {/* Header */}
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-md sticky top-0 z-10 shadow-soft">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10">
                <img 
                  src="/wearly-logo.png" 
                  alt="Wearly Logo" 
                  className="h-16 w-16 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text tracking-tight">
                  Wearly
                </h1>
                <p className="text-xs font-medium text-muted-foreground">AI Fashion Assistant</p>
              </div>
            </div>
            <nav className="flex items-center gap-6">
              <NavLink
                to="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-foreground"
              >
                Home
              </NavLink>
              <NavLink
                to="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-foreground"
              >
                Pricing
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 h-[calc(100vh-88px)]">
        <div className="max-w-7xl mx-auto h-full">
          <ResizablePanelGroup direction="vertical" className="h-full rounded-lg border border-border/60">
            {/* Chat Interface Panel */}
            <ResizablePanel defaultSize={35} minSize={20} maxSize={60}>
              <div className="h-full">
                <ChatInterface
                  onSearchRequest={handleSearchRequest}
                  onPhotoUpload={handlePhotoUpload}
                  uploadedPhoto={uploadedPhoto}
                  isUploadingPhoto={isUploadingPhoto}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-border/60 hover:bg-primary/20 transition-colors" />

            {/* Products Grid Panel */}
            <ResizablePanel defaultSize={65} minSize={40}>
              <div className="h-full overflow-auto p-6 bg-background">
                <ProductGrid
                  products={products}
                  onProductSelect={handleProductSelect}
                  uploadedPhoto={uploadedPhoto}
                  isLoading={isLoading}
                  onTryOn={handleTryOn}
                  tryOnLoadingIds={tryOnLoadingIds}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
};

export default Index;
