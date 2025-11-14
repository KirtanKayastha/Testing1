// src/context/ToastProvider.jsx
import { useState } from "react";
import { ToastContext } from "./ToastContext";
import "./toast.css"; // <-- create this file (see below)

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    message: "",
    type: "", // success | error | info
    visible: false,
  });

  const showToast = (message, type = "info", duration = 3000) => {
    setToast({ message, type, visible: true });

    setTimeout(() => {
      setToast({ message: "", type: "", visible: false });
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};
