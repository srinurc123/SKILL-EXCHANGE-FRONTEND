import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useLocation } from "react-router-dom";
import * as skillApi from "../api/skillApi";

const games = [
  { id: 1, name: "Game1", route: "/game1" },
  { id: 2, name: "Game2", route: "/game2" },
  { id: 3, name: "Game3", route: "/game3" },
  { id: 4, name: "Game4", route: "/game4" },
  { id: 5, name: "Game5", route: "/game5" },
];

export default function Dashboard() {
  const location = useLocation();

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: "", level: "", description: "" });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = () => {
    skillApi.fetchMySkills()
      .then((res) => setSkills(res.data))
      .catch(() => setMessage({ text: "Failed to load skills", severity: "error" }));
  };

  const handleInputChange = (e) => {
    setNewSkill({ ...newSkill, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.name) {
      setMessage({ text: "Skill name is required", severity: "warning" });
      return;
    }
    skillApi.addSkill(newSkill)
      .then(res => {
        setSkills([...skills, res.data]);
        setNewSkill({ name: "", level: "", description: "" });
        setMessage({ text: "Skill added!", severity: "success" });
      })
      .catch(() => setMessage({ text: "Failed to add skill", severity: "error" }));
  };

  const handleDeleteSkill = (skillId) => {
    skillApi.deleteSkill(skillId)
      .then(() => {
        setSkills(skills.filter(skill => skill.id !== skillId));
        setMessage({ text: "Skill deleted.", severity: "info" });
      })
      .catch(() => setMessage({ text: "Failed to delete skill", severity: "error" }));
  };

  const handleCloseMessage = () => setMessage(null);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 220,
          bgcolor: "primary.main",
          color: "white",
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
          Skill Exchange
        </Typography>

        {/* Navigation Links */}
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/dashboard" selected={location.pathname === "/dashboard"} sx={{ color: "white" }}>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/match-requests" selected={location.pathname === "/match-requests"} sx={{ color: "white" }}>
              <ListItemText primary="Match Requests" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/messaging" selected={location.pathname === "/messaging"} sx={{ color: "white" }}>
              <ListItemText primary="Messaging" />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />

        <Typography variant="subtitle1" sx={{ mb: 1, pl: 1 }}>
          Games
        </Typography>
        <List>
          {games.map((game) => (
            <ListItem key={game.id} disablePadding>
              <ListItemButton
                component={Link}
                to={game.route}
                selected={location.pathname === game.route}
                sx={{ color: "white" }}
              >
                <ListItemText primary={game.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main content */}
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, overflowY: "auto" }}>
        <Typography variant="h4" gutterBottom>My Skills</Typography>

        <Paper sx={{ p: 3, mb: 4 }} elevation={4}>
          <Typography variant="h6" gutterBottom>Add New Skill</Typography>
          <Box component="form" onSubmit={handleAddSkill} sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Skill Name"
              name="name"
              value={newSkill.name}
              onChange={handleInputChange}
              required
              sx={{ flex: 1, minWidth: 200 }}
            />
            <TextField
              label="Level (e.g., Beginner)"
              name="level"
              value={newSkill.level}
              onChange={handleInputChange}
              sx={{ flex: 1, minWidth: 150 }}
            />
            <TextField
              label="Description"
              name="description"
              value={newSkill.description}
              onChange={handleInputChange}
              sx={{ flex: 2, minWidth: 300 }}
            />
            <Button type="submit" variant="contained" sx={{ alignSelf: "center", height: 40 }}>
              Add
            </Button>
          </Box>
        </Paper>

        <Paper elevation={4}>
          <List>
            {skills.length === 0 && (
              <ListItem>
                <ListItemText primary="No skills added yet." />
              </ListItem>
            )}
            {skills.map(({ id, name, level, description }) => (
              <React.Fragment key={id}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" color="error" onClick={() => handleDeleteSkill(id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={`${name}${level ? ` - ${level}` : ""}`} secondary={description} />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Container>
    </Box>
  );
}
