import React from "react";
import { Link } from "react-router-dom";
import "./SuccessPage.css";

export function SuccessPage() {
  return (
    <div className="success-container">
      <div className="success-box">
        <div className="success-icon">✔</div>
        <h2>Payment Successful</h2>
        <p>Your payment has been processed successfully. Thank you for your order!</p>
        <div className="success-buttons">
          <Link to="/" className="proceed-btn">
            Go to Home
          </Link>
          <Link
            to="/orders"
            className="orders-btn"
            state={{ highlightLatest: true }}
          >
            Go to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
