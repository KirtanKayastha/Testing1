import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";
import "./ProductCard.css";

export const ProductCard = ({ product, cart }) => {
  const navigate = useNavigate();
  const { user, addToCart } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const imageSrc = product.image
    ? `http://localhost:5000${product.image}`
    : "https://via.placeholder.com/150";

  const inCart = cart.some((item) => item.productId === product.id); // check cart

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!inCart) {
      await addToCart(product);
      showToast(`${product.name} added to cart!`, "success");
    } else {
      showToast(`${product.name} is already in cart!`, "info");
    }
  };

  return (
    <div className="product-card">
      <img src={imageSrc} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-price">Price: ₹{product.price}</p>
        <p className="product-rating">
          Rating: {product.rating ? product.rating : "N/A"} ⭐⭐⭐⭐
        </p>
        <p className="product-stock">
          {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
        </p>

        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={product.stock === 0 || inCart}
        >
          {inCart ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}