import { createContext, useContext, useEffect, useReducer } from "react";

const CartContext = createContext();

const initialState = {
  cart: JSON.parse(localStorage.getItem("cart")) || [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.cart.find((item) => item._id === action.payload._id);

      let updatedCart;

      if (existing) {
        updatedCart = state.cart.map((item) =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }

      return { ...state, cart: updatedCart };
    }

    case "INCREASE_QUANTITY": {
      const updatedCart = state.cart.map((item) =>
        item._id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      return { ...state, cart: updatedCart };
    }

    case "DECREASE_QUANTITY": {
      const updatedCart = state.cart.map((item) =>
        item._id === action.payload
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      );
      return { ...state, cart: updatedCart };
    }

    case "REMOVE_FROM_CART": {
      const updatedCart = state.cart.filter((item) => item._id !== action.payload);
      return { ...state, cart: updatedCart };
    }

    case "CLEAR_CART":
      return { ...state, cart: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  const total = state.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        total,
        dispatch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}