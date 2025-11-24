import { Product } from "@/types/product";

export const generateMockProducts = (query: string): Product[] => {
  // Parse query to extract filters
  const lowerQuery = query.toLowerCase();
  const colors = ["blue", "black", "white", "red", "green", "gray", "brown"];
  const sizes = ["xs", "s", "m", "l", "xl", "xxl"];
  const categories = ["pants", "jackets", "shirts", "shoes", "accessories"];

  const detectedColor = colors.find(color => lowerQuery.includes(color)) || "blue";
  const detectedSize = sizes.find(size => lowerQuery.includes(size)) || "m";
  const detectedCategory = categories.find(cat => lowerQuery.includes(cat)) || "pants";

  // Extract price if mentioned
  const priceMatch = lowerQuery.match(/under (\d+)/);
  const maxPrice = priceMatch ? parseInt(priceMatch[1]) : 100;

  // Generate 8-12 mock products
  const productCount = Math.floor(Math.random() * 5) + 8;
  const products: Product[] = [];

  const sources = ["Amazon", "Zalando", "ASOS", "Nike", "Adidas"];
  
  for (let i = 0; i < productCount; i++) {
    const price = Math.floor(Math.random() * (maxPrice - 20)) + 20;
    const hasDiscount = Math.random() > 0.6;
    
    products.push({
      id: `product-${i}`,
      name: `${detectedColor.charAt(0).toUpperCase() + detectedColor.slice(1)} ${detectedCategory.charAt(0).toUpperCase() + detectedCategory.slice(1)} - Style ${i + 1}`,
      price,
      originalPrice: hasDiscount ? price + Math.floor(Math.random() * 30) + 10 : undefined,
      image: `https://images.unsplash.com/photo-${1540000000000 + i * 100000}?w=400&h=400&fit=crop&auto=format`,
      source: sources[Math.floor(Math.random() * sources.length)],
      color: detectedColor.charAt(0).toUpperCase() + detectedColor.slice(1),
      size: detectedSize.toUpperCase(),
      category: detectedCategory.charAt(0).toUpperCase() + detectedCategory.slice(1),
      inStock: Math.random() > 0.1,
      description: `High-quality ${detectedCategory} in ${detectedColor}. Perfect for any occasion.`
    });
  }

  return products;
};
