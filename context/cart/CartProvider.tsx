import { FC, useEffect, useReducer, useState } from "react";
import Cookie from "js-cookie";

import { ICartProduct } from "../../interfaces";
import { CartContext, cartReducer } from "./";

export interface CartState {
  cart: ICartProduct[];
}

interface Props {
  children: React.ReactNode;
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
};

export const CartProvider: FC<Props> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    if (!isMounted) {
      try {
        const cookieProducts = Cookie.get("cart")
          ? JSON.parse(Cookie.get("cart")!)
          : [];
        dispatch({
          type: "[Cart] - Load cart from cookie | storage",
          payload: cookieProducts,
        });
      } catch (error) {
        dispatch({
          type: "[Cart] - Load cart from cookie | storage",
          payload: [],
        });
      }
      setIsMounted(true);
    }
  }, [isMounted]);

  useEffect(() => {
    if (isMounted) Cookie.set("cart", JSON.stringify(state.cart));
  }, [state.cart, isMounted]);

  const addProductToCart = (product: ICartProduct) => {
    //! Nivel 1
    // dispatch({ type: "[Cart] - Add product to cart", payload: product });
    //! Nivel 2
    // const productsInCart = state.cart.filter(
    //   (p) => p._id !== product._id && p.size !== product.size
    // );
    // dispatch({
    //   type: "[Cart] - Add product to cart",
    //   payload: [...productsInCart, product],
    // });
    //! Nivel final
    const productInCart = state.cart.some((p) => p._id === product._id);
    if (!productInCart)
      return dispatch({
        type: "[Cart] - Update products in cart",
        payload: [...state.cart, product],
      });

    const productInCartButDifferentSize = state.cart.some(
      (p) => p._id === product._id && p.size === product.size
    );
    if (!productInCartButDifferentSize)
      return dispatch({
        type: "[Cart] - Update products in cart",
        payload: [...state.cart, product],
      });

    // Acumular
    const updatedProduct = state.cart.map((p) => {
      if (p._id !== product._id) return p;
      if (p.size !== product.size) return p;

      // actualizar la cantidad
      p.quantity += product.quantity;

      return p;
    });

    return dispatch({
      type: "[Cart] - Update products in cart",
      payload: updatedProduct,
    });
  };

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: "[Cart] - Change cart Quantity", payload: product });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: "[Cart] - Remove product in cart", payload: product });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,

        // method
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
