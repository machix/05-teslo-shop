import { ICartProduct } from "../../interfaces";
import { CartState } from "./";

type CartActionType =
  | {
      type: "[Cart] - Load cart from cookie | storage";
      payload: ICartProduct[];
    }
  | { type: "[Cart] - Add product to cart"; payload: ICartProduct };

export const cartReducer = (
  state: CartState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case "[Cart] - Load cart from cookie | storage":
      return { ...state };

    default:
      return state;
  }
};
