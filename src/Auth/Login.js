// src/Auth/Login.js
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
import { loginUser } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginUser(formData);
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data || "Login failed. Please check your credentials."
      );
    }
  };

  return (
    // The Container's maxWidth="xs" still limits the width of the card
    <Container maxWidth="xs" sx={{ zIndex: 2, position: 'relative' }}> {/* zIndex to bring card above overlay */}
      <Box
        sx={{
          // mt: 8, // REMOVED: No longer needed for vertical centering, parent Box handles it
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
          Sign in
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
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Typography variant="body2" align="center">
            Don't have an account?{" "}
            <Link href="/register" underline="hover">
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}