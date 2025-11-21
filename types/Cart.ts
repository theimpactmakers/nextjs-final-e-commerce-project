type CartItem = {
  id: string;
  variant_id: string;
  product_id: string;
  product_name: string;
  variant_name: string;
  price: number;
  quantity: number;
  image_url: string | null;
  stock_quantity: number;
};

// Type for database cart item response
type DbCartItem = {
  id: string;
  quantity: number;
  price_at_add: string;
  variant_id: string;
  product_variants: {
    id: string;
    name: string;
    price: string;
    stock_quantity: number;
    product_id: string;
    products: {
      id: string;
      name: string;
      slug: string;
    }[];
  }[];
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (
    variantId: string,
    productId: string,
    productName: string,
    variantName: string,
    price: number,
    imageUrl: string | null,
    stockQuantity: number,
    quantity?: number
  ) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

export type { CartItem, DbCartItem, CartContextType };
