import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #55d6e2b5 0%, #505c60c7 100%)",
        color: "white",
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 2,
            textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          Welcome to Skill Exchange
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            fontWeight: 300,
            lineHeight: 1.6,
            textShadow: "1px 1px 4px rgba(0,0,0,0.2)",
          }}
        >
          Connect with people, share your skills, and learn from others in a
          vibrant community. Exchange knowledge, grow together, and unlock new
          opportunities.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/login")}
          sx={{
            px: 6,
            py: 2,
            fontSize: "1.2rem",
            fontWeight: 600,
            bgcolor: "white",
            color: "#667eea",
            borderRadius: 3,
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            "&:hover": {
              bgcolor: "#f0f0f0",
              transform: "scale(1.05)",
              transition: "all 0.3s ease",
            },
          }}
        >
          Enter Here
        </Button>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Already have an account?{" "}
            <Button
              onClick={() => navigate("/login")}
              sx={{
                color: "white",
                textDecoration: "underline",
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              Sign In
            </Button>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
