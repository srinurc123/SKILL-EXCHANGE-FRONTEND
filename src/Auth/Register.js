// src/Auth/Register.js
import React, { useState, useContext } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
} from "@mui/material";
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
      const { username, email, password, confirmPassword } = formData;
      const res = await registerUser({ username, email, password, confirmPassword });
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data || "Registration failed. Try a different username."
      );
    }
  };

  return (
    // The Container's maxWidth="xs" still limits the width of the card
    <Container maxWidth="xs" sx={{ zIndex: 2, position: 'relative' }}> {/* zIndex to bring card above overlay */}
      <Box
        sx={{
          // REMOVED: mt: 8, // This was pushing it down. Parent Box in App.js now centers.
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'white', // ADDED: Set background color to white
        }}
      >
        <Typography component="h1" variant="h5" mb={2}>
          Create Account
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
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            inputProps={{ minLength: 6 }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
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
  );
}