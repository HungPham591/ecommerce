import initStore from "./init-store";

const reducer = (state = initStore(), action) => {
  switch (action.type) {
    case "SIGN_IN":
      return { ...state, ...action.payload };
    case "SIGN_OUT":
      return {...state, ...initStore()};
    case "RELOAD_CART": {
      if (!state.isSignIn) {
        const currentCart = JSON.parse(localStorage.getItem("cartItems"));

        if (currentCart && currentCart.length > 0) {
          const quantitySum = currentCart.reduce((a, b) => a + b.quantity, 0);
          return { ...state, cartNum: quantitySum };
        } else {
          return { ...state, cartNum: 0 };
        }
      } 
      return {...state};
    }
    default:
      throw new Error(`No action with type: ${action.type}`);
  }
};
export default reducer;
