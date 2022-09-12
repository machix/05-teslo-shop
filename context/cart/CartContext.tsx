import { createContext } from "react";
import { ShippingAddress } from ".";
import { ICartProduct } from "../../interfaces";

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
}

export const CartContext = createContext({} as ContextProps);
