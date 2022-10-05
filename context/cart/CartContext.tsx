import { createContext } from "react";
import { ICartProduct, ShippingAddress } from "../../interfaces";

interface ContextProps {
  isLoaded: boolean;
  cart: ICartProduct[];
  numbersOfItems: number;
  subTotal: number;
  Tax: number;
  Total: number;

  shippingAddress?: ShippingAddress;

  // methods
  addProductToCart: (product: ICartProduct) => void;
  updateCartQuantity: (product: ICartProduct) => void;
  removeCartProduct: (product: ICartProduct) => void;
  updateAddress: (address: ShippingAddress) => void;

  // orders
  createOrder: () => Promise<void>;
}

export const CartContext = createContext({} as ContextProps);
