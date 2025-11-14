import React from "react";
import { Link } from "react-router-dom";
import "./FailurePage.css";

export function FailurePage() {
  return (
    <div className="failure-container">
      <div className="failure-box">
        <h2>Payment Failed ❌</h2>
        <p>Oops! Something went wrong with your payment. Please try again.</p>
        <Link to="/checkout" className="proceed-btn">
          Try Again
        </Link>
      </div>
    </div>
  );
}
