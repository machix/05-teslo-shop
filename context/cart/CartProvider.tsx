import { FC, useEffect, useReducer, useState } from "react";

import { ICartProduct, IOrder, ShippingAddress } from "../../interfaces";
import { CartContext, cartReducer } from "./";
import Cookies from "js-cookie";
import { tesloApi } from "../../api";

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numbersOfItems: number;
  subTotal: number;
  Tax: number;
  Total: number;

  shippingAddress?: ShippingAddress;
}

interface Props {
  children: React.ReactNode;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numbersOfItems: 0,
  subTotal: 0,
  Tax: 0,
  Total: 0,

  shippingAddress: undefined,
};

export const CartProvider: FC<Props> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    if (!isMounted) {
      try {
        const cookieProducts = Cookies.get("cart")
          ? JSON.parse(Cookies.get("cart")!)
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
    if (isMounted) {
      if (Cookies.get("firstName")) {
        const shippingAddress = {
          firstName: Cookies.get("firstName") || "",
          lastName: Cookies.get("lastName") || "",
          address: Cookies.get("address") || "",
          address2: Cookies.get("address2") || "",
          zip: Cookies.get("zip") || "",
          city: Cookies.get("city") || "",
          country: Cookies.get("country") || "",
          phone: Cookies.get("phone") || "",
        };
        dispatch({
          type: "[Cart] - Load address from Cookie",
          payload: shippingAddress,
        });
      }
    }
  }, [isMounted]);

  useEffect(() => {
    if (isMounted) Cookies.set("cart", JSON.stringify(state.cart));
  }, [state.cart, isMounted]);

  useEffect(() => {
    const numbersOfItems = state.cart.reduce(
      (prev, current) => current.quantity + prev,
      0
    );
    const subTotal = state.cart.reduce(
      (prev, current) => current.quantity * current.price + prev,
      0
    );

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const orderSummary = {
      numbersOfItems,
      subTotal,
      Tax: subTotal * taxRate,
      Total: subTotal * (taxRate + 1),
    };

    dispatch({
      type: "[Cart] - update cart order summary",
      payload: orderSummary,
    });
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

  const updateAddress = (address: ShippingAddress) => {
    Cookies.set("firstName", address.firstName);
    Cookies.set("lastName", address.lastName);
    Cookies.set("address", address.address);
    Cookies.set("address2", address.address2 || "");
    Cookies.set("zip", address.zip);
    Cookies.set("city", address.city);
    Cookies.set("country", address.country);
    Cookies.set("phone", address.phone);
    dispatch({ type: "[Cart] - Update address", payload: address });
  };

  const createOrder = async () => {
    if (!state.shippingAddress) {
      throw new Error("No hay direccion de entrega");
    }

    const body: IOrder = {
      orderItems: state.cart.map((p) => ({
        ...p,
        size: p.size!,
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numbersOfItems,
      subTotal: state.subTotal,
      tax: state.Tax,
      total: state.Total,
      isPaid: false,
    };

    try {
      const { data } = await tesloApi.post("/orders", body);
      console.log({ data });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,

        // method
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress,

        //orders
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
