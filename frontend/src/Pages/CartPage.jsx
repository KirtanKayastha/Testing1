// src/pages/CartPage.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./CartPage.css";

export function CartPage() {
  const { cart, user, removeFromCart } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  // Remove item manually from cart
  const handleRemove = async (productId) => {
    const removedItem = cart.find((item) => item.productId === productId);
    await removeFromCart(productId);
    if (removedItem) showToast(`${removedItem.name} removed from cart`, "error");
  };

  // Navigate to checkout with selected product
  const handlePlaceOrder = (product) => {
    navigate("/checkout", { state: { product } });
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div className="cart-icon-wrapper">
          <svg className="cart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <h1>{user.name}'s Shopping Cart</h1>
        <p className="cart-subtitle">Review your items before checkout</p>
      </div>

      {cart.length === 0 ? (
        <p className="empty-cart">
          Your cart is empty. Go to <Link to="/" className="home-link">homepage</Link> and click "Add to Cart".
        </p>
      ) : (
        <div className="cart-items">
          {cart.map((product) => (
            <div key={product.cartId} className="cart-item">
              <div className="cart-item-image-wrapper">
                <img
                  src={
                    product.image
                      ? `http://localhost:5000${product.image}`
                      : "https://via.placeholder.com/100"
                  }
                  alt={product.name}
                  className="cart-item-image"
                />
              </div>
              <div className="cart-item-info">
                <h3 className="cart-item-name">{product.name}</h3>
                <p className="cart-item-price">₹{product.price}</p>
                <div className="cart-item-buttons">
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(product.productId)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Remove
                  </button>
                  <button
                    className="order-btn"
                    onClick={() => handlePlaceOrder(product)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}