export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  source: string;
  color: string;
  size: string;
  category: string;
  inStock?: boolean;
  description?: string;
}
