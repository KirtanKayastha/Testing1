// src/Components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Header.css"; // <-- case-sensitive fix

import userIcon from "../assets/user-icon.png";
import ordersIcon from "../assets/orders-icon.png";
import cartIcon from "../assets/cart-icon.png";

export function Header({ searchTerm, setSearchTerm }) {
  const { user, logout, cartCount } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProtectedClick = (path) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="header">
      <div className="left-section">
        <Link to="/" className="header-link">
          <span className="logo-text">E Market</span>
        </Link>
      </div>

      <div className="middle-section">
        <div className="search-wrapper">
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            className="search-bar"
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="right-section">
        {user ? (
          <>
            <Link className="header-item user-greeting" to="/">
              <img src={userIcon} className="icon" alt="User" />
              <span className="user-name">Hello, {user.name}</span>
            </Link>
            <button className="header-item logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link className="header-item login-btn" to="/login">
            <img src={userIcon} className="icon" alt="Login" />
            <span>Login</span>
          </Link>
        )}

        <span
          className="header-item"
          onClick={() => handleProtectedClick("/orders")}
        >
          <img src={ordersIcon} className="icon" alt="Orders" />
          <span>Orders</span>
        </span>

        <span
          className="header-item cart-link"
          onClick={() => handleProtectedClick("/cart")}
        >
          <img src={cartIcon} className="icon" alt="Cart" />
          <span>Cart</span>
          {user && cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </span>
      </div>
    </div>
  );
}
