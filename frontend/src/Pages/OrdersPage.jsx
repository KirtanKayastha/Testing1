import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import "./OrdersPage.css";

// Use the environment variable for backend URL
const API_URL = import.meta.env.VITE_API_URL;

export function OrdersPage() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/orders/${user.id}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="orders-container">
        <div className="message-wrapper">
          <div className="message-icon error">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2 className="message-title">Access Denied</h2>
          <p className="not-logged-in">Please log in to view your orders.</p>
          <Link to="/login" className="action-btn">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading-wrapper">
          <div className="loading-spinner"></div>
          <p className="loading">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div className="orders-icon-wrapper">
          <svg className="orders-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg>
        </div>
        <h1>{user.name}'s Orders</h1>
        <p className="orders-subtitle">Track and manage your purchases</p>
      </div>

      {orders.length === 0 ? (
        <p className="no-orders">
          You haven't placed any orders yet. Go to{" "}
          <Link to="/" className="home-link">homepage</Link> and place your first order!
        </p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-header">
                <div className="order-id">
                  <span className="label">Order ID:</span>
                  <span className="value">#{order.id}</span>
                </div>
                <div className="order-status-wrapper">
                  <span className="label">Status:</span>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status === 'paid' && '✓'}
                    {order.status === 'pending' && '⏳'}
                    {order.status === 'cancelled' && '✗'}
                    {' '}{order.status}
                  </span>
                </div>
              </div>
              <div className="order-body">
                <div className="order-image-wrapper">
                  <img
                    src={order.image ? `${API_URL}${order.image}` : "https://via.placeholder.com/100"}
                    alt={order.name}
                    className="order-image"
                  />
                </div>
                <div className="order-details">
                  <div className="detail-row">
                    <span className="detail-label">Product:</span>
                    <span className="detail-value">{order.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Quantity:</span>
                    <span className="detail-value">{order.quantity}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Unit Price:</span>
                    <span className="detail-value">₹{order.price}</span>
                  </div>
                  <div className="detail-row total">
                    <span className="detail-label">Total:</span>
                    <span className="detail-value">₹{order.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
