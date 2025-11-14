import { useState, useEffect, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // Load token and user on startup
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoadingUser(false);
  }, []);

  // Fetch cart when user logs in
  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }

    const fetchCart = async () => {
      setLoadingCart(true);
      try {
        const res = await axios.get(`http://localhost:5000/cart/${user.id}`);
        const cartWithIds = res.data.map((item) => ({
          cartId: item.id,
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        }));
        setCart(cartWithIds);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setCart([]);
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCart();
  }, [user]);

  // Derived cartCount from cart array
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [cart]);

  // Add to cart
  const addToCart = async (product) => {
    if (!user) return;
    const exists = cart.some((item) => item.productId === product.id);
    if (exists) return;

    try {
      const res = await axios.post("http://localhost:5000/cart", {
        userId: user.id,
        productId: product.id,
        quantity: 1,
      });

      const newCartItem = {
        cartId: res.data.cartId,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      };

      setCart((prev) => [...prev, newCartItem]);
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  };

  // Remove from cart by productId
  const removeFromCart = async (productId) => {
    if (!user) return;

    const cartItem = cart.find((item) => item.productId === productId);
    if (!cartItem) return;

    try {
      await axios.delete(`http://localhost:5000/cart/${cartItem.cartId}`);
      setCart((prev) => prev.filter((item) => item.productId !== productId));
    } catch (err) {
      console.error("Failed to remove from cart", err);
    }
  };

  // Remove a specific cart item by cartId (used after placing order)
  const removeCartItemByCartId = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setCart([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        logout,
        cart,
        addToCart,
        removeFromCart,
        removeCartItemByCartId, 
        loadingUser,
        loadingCart,
        cartCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
