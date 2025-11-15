// src/pages/LoginPage.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./LoginPage.css";

// Backend API URL from env
const API_URL = import.meta.env.VITE_API_URL;

export function LoginPage() {
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState({});

  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupErrors, setSignupErrors] = useState({});

  const [successMessage, setSuccessMessage] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate single field (onBlur)
  const validateField = (form, field, value) => {
    let message = "";

    if (form === "signup") {
      if (field === "name") {
        if (!value.trim()) message = "Name is required";
        else if (value.trim().length < 3) message = "Name must be at least 3 letters";
      }
      if (field === "email") {
        if (!value.trim()) message = "Email is required";
        else if (!emailRegex.test(value)) message = "Invalid email format";
      }
      if (field === "password") {
        if (!value) message = "Password is required";
        else if (value.length < 7) message = "Password must be at least 7 characters";
      }
      setSignupErrors((prev) => ({ ...prev, [field]: message }));
    }

    if (form === "login") {
      if (field === "email") {
        if (!value.trim()) message = "Email is required";
        else if (!emailRegex.test(value)) message = "Invalid email format";
      }
      if (field === "password") {
        if (!value) message = "Password is required";
      }
      setLoginErrors((prev) => ({ ...prev, [field]: message }));
    }
  };

  // Validate all fields (on submit)
  const validateAll = () => {
    const newErrors = {};
    if (isSignup) {
      if (!signupName.trim()) newErrors.name = "Name is required";
      else if (signupName.trim().length < 3) newErrors.name = "Name must be at least 3 letters";

      if (!signupEmail.trim()) newErrors.email = "Email is required";
      else if (!emailRegex.test(signupEmail)) newErrors.email = "Invalid email format";

      if (!signupPassword) newErrors.password = "Password is required";
      else if (signupPassword.length < 7) newErrors.password = "Password must be at least 7 characters";
    } else {
      if (!loginEmail.trim()) newErrors.email = "Email is required";
      else if (!emailRegex.test(loginEmail)) newErrors.email = "Invalid email format";

      if (!loginPassword) newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoginErrors({});
    setSignupErrors({});
    setSuccessMessage("");

    const newErrors = validateAll();
    if (Object.keys(newErrors).length > 0) {
      if (isSignup) setSignupErrors(newErrors);
      else setLoginErrors(newErrors);
      return;
    }

    try {
      const url = isSignup
        ? `${API_URL}/api/users/signup`
        : `${API_URL}/api/users/login`;

      const body = isSignup
        ? { name: signupName, email: signupEmail, password: signupPassword }
        : { email: loginEmail, password: loginPassword };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (isSignup) setSignupErrors({ general: data.message || "Something went wrong" });
        else setLoginErrors({ general: data.message || "Something went wrong" });
        return;
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccessMessage(isSignup ? "Signup successful!" : "Login successful!");
      navigate("/");

    } catch (err) {
      console.error(err);
      if (isSignup) setSignupErrors({ general: "Network error" });
      else setLoginErrors({ general: "Network error" });
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
          <p className="login-subtitle">
            {isSignup ? "Sign up to get started" : "Login to continue shopping"}
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={signupName}
                onChange={(e) => {
                  setSignupName(e.target.value);
                  setSignupErrors((prev) => ({ ...prev, name: "" }));
                }}
                onBlur={(e) => validateField("signup", "name", e.target.value)}
                className={signupErrors.name ? "error-input" : ""}
              />
              {signupErrors.name && <p className="error">{signupErrors.name}</p>}
            </div>
          )}

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={isSignup ? signupEmail : loginEmail}
              onChange={(e) => {
                if (isSignup) {
                  setSignupEmail(e.target.value);
                  setSignupErrors((prev) => ({ ...prev, email: "" }));
                } else {
                  setLoginEmail(e.target.value);
                  setLoginErrors((prev) => ({ ...prev, email: "" }));
                }
              }}
              onBlur={(e) => validateField(isSignup ? "signup" : "login", "email", e.target.value)}
              className={(isSignup ? signupErrors.email : loginErrors.email) ? "error-input" : ""}
            />
            {(isSignup ? signupErrors.email : loginErrors.email) && (
              <p className="error">{isSignup ? signupErrors.email : loginErrors.email}</p>
            )}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={isSignup ? signupPassword : loginPassword}
              onChange={(e) => {
                if (isSignup) {
                  setSignupPassword(e.target.value);
                  setSignupErrors((prev) => ({ ...prev, password: "" }));
                } else {
                  setLoginPassword(e.target.value);
                  setLoginErrors((prev) => ({ ...prev, password: "" }));
                }
              }}
              onBlur={(e) => validateField(isSignup ? "signup" : "login", "password", e.target.value)}
              className={(isSignup ? signupErrors.password : loginErrors.password) ? "error-input" : ""}
            />
            {(isSignup ? signupErrors.password : loginErrors.password) && (
              <p className="error">{isSignup ? signupErrors.password : loginErrors.password}</p>
            )}
          </div>

          {(isSignup ? signupErrors.general : loginErrors.general) && (
            <div className="error-box">
              <p className="error">{isSignup ? signupErrors.general : loginErrors.general}</p>
            </div>
          )}

          {successMessage && (
            <div className="success-box">
              <p className="success">{successMessage}</p>
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isSignup ? "Sign Up" : "Login"}
          </button>

          <div className="toggle-link">
            <span className="toggle-text">
              {isSignup ? "Already have an account?" : "Don't have an account?"}
            </span>{" "}
            <span className="toggle-action" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Login" : "Sign Up"}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
