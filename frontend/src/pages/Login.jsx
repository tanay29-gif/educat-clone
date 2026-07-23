import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import "../styles/Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await userService.login(formData);
      console.log("✅ Full response object:", response);
      console.log("✅ Response data structure:", response.data);
      
      const tokenData = response.data.data;
      console.log("✅ Token data extracted:", tokenData);
      
      if (!tokenData || !tokenData.accessToken) {
        throw new Error("No tokens received from server");
      }
      
      localStorage.setItem("accessToken", tokenData.accessToken);
      localStorage.setItem("refreshToken", tokenData.refreshToken);
      localStorage.setItem("user", JSON.stringify(tokenData.user));
      
      console.log("✅ Tokens saved to localStorage, navigating...");
      // Redirect based on user role
      if (tokenData.user.role === "instructor") {
        navigate("/instructor-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Your Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
