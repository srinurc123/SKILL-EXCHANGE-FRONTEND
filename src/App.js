import React, { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Dashboard from "./Dashboard/Dashboard";
import MatchRequestPage from "./match/MatchRequestPage";
import MessagingPage from "./message/MessagingPage";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import './App.css'; 
import Game1 from "./Games/Game1";
import Game2 from "./Games/Game2";
import Game3 from "./Games/Game3";
import Game4 from "./Games/Game4";
import Game5 from "./Games/Game5";
import LandingPage from "./Auth/LandingPage";

function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

function Navbar() {
  const { token, logout } = useContext(AuthContext);

  // Only show Navbar when user is logged in
  if (!token) return null;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Skill Exchange
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} to="/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/match-requests">
            Match Requests
          </Button>
          <Button color="inherit" component={Link} to="/messaging">
            Messaging
          </Button>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  useEffect(() => {
    document.body.style.backgroundImage = `url(${process.env.PUBLIC_URL}/skill.png)`;
    return () => {
      document.body.style.backgroundImage = '';
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Landing Page - First page when user visits */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/match-requests"
            element={
              <PrivateRoute>
                <MatchRequestPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/messaging"
            element={
              <PrivateRoute>
                <MessagingPage />
              </PrivateRoute>
            }
          />

          {/* Game Routes - Protected */}
          <Route
            path="/game1"
            element={
              <PrivateRoute>
                <Game1 />
              </PrivateRoute>
            }
          />
          <Route
            path="/game2"
            element={
              <PrivateRoute>
                <Game2 />
              </PrivateRoute>
            }
          />
          <Route
            path="/game3"
            element={
              <PrivateRoute>
                <Game3 />
              </PrivateRoute>
            }
          />
          <Route
            path="/game4"
            element={
              <PrivateRoute>
                <Game4 />
              </PrivateRoute>
            }
          />
          <Route
            path="/game5"
            element={
              <PrivateRoute>
                <Game5 />
              </PrivateRoute>
            }
          />

          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
