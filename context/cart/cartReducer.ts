import { ICartProduct } from "../../interfaces";
import { CartState, ShippingAddress } from "./";

type CartActionType =
  | {
      type: "[Cart] - Load cart from cookie | storage";
      payload: ICartProduct[];
    }
  | { type: "[Cart] - Update products in cart"; payload: ICartProduct[] }
  | { type: "[Cart] - Change cart Quantity"; payload: ICartProduct }
  | { type: "[Cart] - Remove product in cart"; payload: ICartProduct }
  | { type: "[Cart] - Load address from Cookie"; payload: ShippingAddress }
  | { type: "[Cart] - Update address"; payload: ShippingAddress }
  | {
      type: "[Cart] - update cart order summary";
      payload: {
        numbersOfItems: number;
        subTotal: number;
        Tax: number;
        Total: number;
      };
    };

export const cartReducer = (
  state: CartState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case "[Cart] - Load cart from cookie | storage":
      return {
        ...state,
        isLoaded: true,
        cart: [...action.payload],
      };

    case "[Cart] - Update products in cart":
      return {
        ...state,
        cart: [...action.payload],
      };

    case "[Cart] - Change cart Quantity":
      return {
        ...state,
        cart: state.cart.map((product) => {
          if (product._id !== action.payload._id) return product;
          if (product.size !== action.payload.size) return product;

          return action.payload;
        }),
      };

    case "[Cart] - Remove product in cart":
      return {
        ...state,
        cart: state.cart.filter(
          (product) =>
            !(
              product._id === action.payload._id &&
              product.size === action.payload.size
            )
        ),
      };

    case "[Cart] - update cart order summary":
      return {
        ...state,
        ...action.payload,
      };

    case "[Cart] - Update address":
    case "[Cart] - Load address from Cookie":
      return {
        ...state,
        shippingAddress: action.payload,
      };

    default:
      return state;
  }
};
