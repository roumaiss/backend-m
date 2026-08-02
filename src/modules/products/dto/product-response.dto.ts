import { ProductType } from '../product-type.enum';

export interface ProductVariantResponse {
  id: string;
  shade: string | null;
  color: string | null;
  volume: string | null;
  price: string;
  stockQuantity: number;
  inStock: boolean;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  images: string[];
  primaryImage: string;
  type: ProductType;
  brand: string;
  subcategory: {
    name: string;
    category: string;
  };
  variants: ProductVariantResponse[];
}
