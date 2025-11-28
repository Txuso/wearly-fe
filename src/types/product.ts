export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  userProductImage?: string;
  source: string;
  color: string;
  size: string;
  category: string;
  inStock?: boolean;
  description?: string;
}
