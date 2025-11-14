import { useState } from "react";
import { Header } from "../Components/Header";
import { Footer } from "../Components/Footer";
import { ProductList } from "../Components/ProductList";
import "./HomePage.css";

export function HomePage() {
  const [searchTerm, setSearchTerm] = useState(""); // search state lifted here

  return (
    <div className="page-container">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ProductList searchTerm={searchTerm} />
      <Footer />
    </div>
  );
}
