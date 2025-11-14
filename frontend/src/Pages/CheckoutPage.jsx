import { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./CheckoutPage.css";

export function CheckoutPage() {
  const { state } = useLocation();
  const product = state?.product;
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    region: "",
    city: "",
    address: "",
    area: "",
  });

  const [loading, setLoading] = useState(false);
  const allFilled = Object.values(formData).every((v) => v.trim() !== "");

  const deliveryFee = 150;
  const total = product ? (Number(product.price) + deliveryFee).toFixed(2) : "0.00";

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

 const handlePayment = async () => {
  if (!product || !allFilled || loading || !user) return;
  setLoading(true);

  try {
    // 1️⃣ Create Stripe Checkout Session
    const response = await axios.post(
      "http://localhost:5000/api/payments/create-checkout-session",
      {
        totalAmount: Number(total),
        userId: user.id,
        productId: product.productId,
        productName: product.name,
        quantity: product.quantity || 1,
        cartId: product.cartId, // Pass cartId so webhook can remove it
      }
    );

    // 2️⃣ Redirect to Stripe checkout
    if (response.data.url) {
      window.location.href = response.data.url;
    }
  } catch (err) {
    console.error("Payment session creation failed:", err);
    setLoading(false);
  }
};


  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <h2>Delivery Information</h2>
        <form>
          {["fullname", "phone", "region", "city", "address", "area"].map((name) => (
            <input
              key={name}
              type="text"
              name={name}
              placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
              value={formData[name]}
              onChange={handleChange}
            />
          ))}
        </form>
      </div>

      {product && (
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="summary-item">
            <img
              src={product.image ? `http://localhost:5000${product.image}` : "https://via.placeholder.com/100"}
              alt={product.name}
            />
            <div className="summary-info">
              <p className="summary-name">{product.name}</p>
              <p className="summary-price">Price: ₹{Number(product.price).toFixed(2)}</p>
            </div>
          </div>

          <div className="summary-details">
            <p>Delivery Fee: ₹{deliveryFee.toFixed(2)}</p>
            <h4>Total: ₹{total}</h4>
          </div>

          <button
            className="proceed-btn"
            disabled={!allFilled || loading || !user}
            onClick={handlePayment}
          >
            {loading ? "Processing..." : "Proceed to Pay"}
          </button>
          {!user && <p style={{ color: "red", marginTop: "0.5rem" }}>You must be logged in to checkout.</p>}
        </div>
      )}
    </div>
  );
}
