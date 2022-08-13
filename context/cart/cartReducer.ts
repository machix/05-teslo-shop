import { ICartProduct } from "../../interfaces";
import { CartState } from "./";

type CartActionType =
  | {
      type: "[Cart] - Load cart from cookie | storage";
      payload: ICartProduct[];
    }
  | { type: "[Cart] - Update products in cart"; payload: ICartProduct[] };

export const cartReducer = (
  state: CartState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case "[Cart] - Load cart from cookie | storage":
      return {
        ...state,
        cart: [...action.payload],
      };

    case "[Cart] - Update products in cart":
      return {
        ...state,
        cart: [...action.payload],
      };

    default:
      return state;
  }
};
