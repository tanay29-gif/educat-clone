import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import "../styles/Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    role: "student",
    avatar: null,
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

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      avatar: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const registerFormData = new FormData();
      Object.keys(formData).forEach((key) => {
        registerFormData.append(key, formData[key]);
      });

      console.log("📤 Sending registration data...");
      const response = await userService.register(registerFormData);
      console.log("✅ Full response object:", response);
      console.log("✅ Response data structure:", response.data);
      
      // Response structure: { statusCode, message, data: { user, accessToken, refreshToken } }
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
    } catch (err) {
      console.error("❌ Registration error details:", {
        message: err.response?.data?.message,
        status: err.response?.status,
        fullError: err.response?.data,
        error: err.message
      });
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          err.message ||
                          "Registration failed. Please check console for details.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
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
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
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

          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>

          <div className="form-group">
            <label>Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
