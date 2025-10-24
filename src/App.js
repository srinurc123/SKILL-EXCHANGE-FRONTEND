// src/App.js
import React, { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Dashboard from "./Dashboard/Dashboard";
import MatchRequestPage from "./match/MatchRequestPage";
import MessagingPage from "./message/MessagingPage";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import './App.css'; // Keep this import for other styles
import Game1 from "./Games/Game1";
import Game2 from "./Games/Game2";
import Game3 from "./Games/Game3";
import Game4 from "./Games/Game4";
import Game5 from "./Games/Game5";

function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

function Navbar() {
  const { logout } = useContext(AuthContext);

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
      document.body.style.backgroundImage = ''; // Clear background image
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
           <Route path="/game1" element={<Game1 />} />
            <Route path="/game2" element={<Game2 />} />
            <Route path="/game3" element={<Game3 />} />
            <Route path="/game4" element={<Game4 />} />
            <Route path="/game5" element={<Game5 />} />

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;