import { createContext } from "react";
import { ICartProduct } from "../../interfaces";

interface ContextProps {
  isLoaded: boolean;
  cart: ICartProduct[];
  numbersOfItems: number;
  subTotal: number;
  Tax: number;
  Total: number;

  // methods
  addProductToCart: (product: ICartProduct) => void;
  updateCartQuantity: (product: ICartProduct) => void;
  removeCartProduct: (product: ICartProduct) => void;
}

export const CartContext = createContext({} as ContextProps);
