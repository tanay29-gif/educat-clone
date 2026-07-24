import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { userService } from "../services/userService";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

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

      const response = await userService.register(registerFormData);
      const tokenData = response.data.data;

      if (!tokenData || !tokenData.accessToken) {
        throw new Error("No tokens received from server");
      }

      localStorage.setItem("accessToken", tokenData.accessToken);
      localStorage.setItem("refreshToken", tokenData.refreshToken);
      localStorage.setItem("user", JSON.stringify(tokenData.user));

      if (tokenData.user.role === "instructor") {
        navigate("/instructor-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Registration failed. Please check console for details.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
        }}
      >
        <Typography component="h1" variant="h5">
          Create Account
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="fullName"
            label="Full Name"
            name="fullName"
            autoComplete="name"
            value={formData.fullName}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="instructor">Instructor</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" component="label" fullWidth sx={{mt: 2}}>
            Upload Avatar
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          {formData.avatar && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {formData.avatar.name}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </Button>
          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <Link component={RouterLink} to="/login" variant="body2">
              {"Login"}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

