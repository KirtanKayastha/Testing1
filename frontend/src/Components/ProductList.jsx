import { useEffect, useState, useContext } from "react";
import { ProductCard } from "./ProductCard";
import { AuthContext } from "../context/AuthContext";
import "./ProductList.css";

// Use the environment variable for backend URL
const API_URL = import.meta.env.VITE_API_URL;

export const ProductList = ({ searchTerm }) => {
  const [products, setProducts] = useState([]);
  const { cart, loadingCart } = useContext(AuthContext); // get cart from context

  useEffect(() => {
    // Use VITE_API_URL instead of localhost
    const url = searchTerm
      ? `${API_URL}/products/search?q=${encodeURIComponent(searchTerm)}`
      : `${API_URL}/products`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, [searchTerm]);

  if (loadingCart)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading products...
      </div>
    );

  return (
    <div className={`product-list ${products.length === 0 ? "empty" : ""}`}>
      {products.length === 0 ? (
        <p className="no-products">No products Yet.</p>
      ) : (
        products.map((product) => (
          <ProductCard key={product.id} product={product} cart={cart} />
        ))
      )}
    </div>
  );
};
