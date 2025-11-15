// src/Components/Footer.jsx
import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3 className="footer-logo">E Market</h3>
          <p className="footer-tagline">Your trusted online marketplace</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-section">
            <h4>Shop</h4>
            <a href="#products">Products</a>
            <a href="#deals">Deals</a>
            <a href="#new">New Arrivals</a>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <a href="#help">Help Center</a>
            <a href="#shipping">Shipping Info</a>
            <a href="#returns">Returns</a>
          </div>
          
          <div className="footer-section">
            <h4>Company</h4>
            <a href="#about">About Us</a>
            <a href="#developers">Developers</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; 2025 My E-commerce Site. All Rights Reserved.
          </p>
          <p className="footer-contact">
            Contact us:{" "}
            <a href="mailto:support@myecommerce.com">support@myecommerce.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
