import React, { useState, useContext } from "react";
import {
  Container, Box, TextField, Button, Typography, Alert, Link, InputAdornment, AppBar,Toolbar,IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { registerUser } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const { username, email, password } = formData;
      const res = await registerUser({ username, email, password });
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data || "Registration failed. Try a different username.");
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
       <AppBar position="static" sx={{ bgcolor: "#63b0b7d6" }}>
              <Toolbar sx={{ justifyContent: "center" }}>
                <Typography variant="h4" fontWeight="700" sx={{ fontFamily: "Poppins, sans-serif" }}>
                  Skill Exchange Platform
                </Typography>
              </Toolbar>
            </AppBar>
      {/* Main Content - Centered Register Form */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Container maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 4,
              boxShadow: 6,
              borderRadius: 3,
              bgcolor: "white",
            }}
          >
            <Typography component="h1" variant="h4" mb={1} fontWeight="600" color="primary">
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Join Skill Exchange and start learning
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
              <TextField
                margin="normal"
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                inputProps={{ minLength: 6 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.2 }}>
                Register
              </Button>
              <Typography variant="body2" align="center">
                Already have an account?{" "}
                <Link href="/login" underline="hover">
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer Section */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          py: 3,
          px: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", gap: 3 }}>
            {/* About Project */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="600" mb={1} sx={{ fontFamily: "Poppins, sans-serif" }}>
                About Skill Exchange
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                Skill Exchange is a peer-to-peer platform where users can offer their skills and learn from others.
                Match with people who have complementary skills, exchange knowledge, and grow together. Whether you're
                teaching or learning, our platform connects you with the right people to advance your journey.
              </Typography>
            </Box>

            {/* Contact Info */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="600" mb={1} sx={{ fontFamily: "Poppins, sans-serif" }}>
                Contact Us
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                📧 Email: <Link href="mailto:srinuvalasani5@gmail.com" color="inherit" underline="hover">support@skillexchange.com</Link>
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                📞 Phone: +91 7893855952
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                📍 Location: Hyderabad, Telangana, India
              </Typography>
            </Box>
          </Box>

          {/* Copyright */}
          <Typography variant="body2" align="center" sx={{ mt: 3, fontFamily: "Poppins, sans-serif" }}>
            © 2025 Skill Exchange Platform. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
