import React, { useState, useEffect, useContext } from "react";
import {
  Container, Typography, Paper, List, ListItem, ListItemText, Button,
  Box, TextField, Snackbar, Alert, Divider, MenuItem
} from "@mui/material";
import * as matchApi from "../api/matchApi";
import { AuthContext } from "../context/AuthContext";
import * as skillApi from "../api/skillApi";

export default function MatchRequestPage() {
  const { token } = useContext(AuthContext);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ receiverUsername: "", skillOfferedId: "", skillRequestedId: "" });
  const [message, setMessage] = useState(null);

  // Fetch user skills and requests
  useEffect(() => {
    skillApi.fetchMySkills().then(res => setSkills(res.data)).catch(() => setSkills([]));
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    matchApi.getReceivedRequests().then(res => setReceived(res.data));
    matchApi.getSentRequests().then(res => setSent(res.data));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.receiverUsername || !form.skillOfferedId || !form.skillRequestedId) {
      setMessage({ text: "Please fill all fields.", severity: "warning" });
      return;
    }
    try {
      await matchApi.sendMatchRequest(form);
      setMessage({ text: "Match request sent!", severity: "success" });
      setForm({ receiverUsername: "", skillOfferedId: "", skillRequestedId: "" });
      fetchRequests();
    } catch {
      setMessage({ text: "Failed to send match request.", severity: "error" });
    }
  };

  const handleRespond = async (requestId, status) => {
    try {
      await matchApi.respondToRequest(requestId, status);
      setMessage({ text: `Request ${status.toLowerCase()}`, severity: "success" });
      fetchRequests();
    } catch {
      setMessage({ text: "Error updating request.", severity: "error" });
    }
  };

  const handleCloseMessage = () => setMessage(null);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Match Requests</Typography>

      {/* Send new request */}
      <Paper sx={{ p: 3, mb: 4 }} elevation={4}>
        <Typography variant="h6" gutterBottom>Send New Request</Typography>
        <Box component="form" onSubmit={handleSend} sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="Receiver Username"
            name="receiverUsername"
            value={form.receiverUsername}
            onChange={handleChange}
            required
            sx={{ flex: 1, minWidth: 200 }}
          />
          <TextField
            select
            label="Skill Offered"
            name="skillOfferedId"
            value={form.skillOfferedId}
            onChange={handleChange}
            required
            sx={{ flex: 1, minWidth: 150 }}
          >
            {skills.map(skill => (
              <MenuItem key={skill.id} value={skill.id}>{skill.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Requested Skill ID"
            name="skillRequestedId"
            value={form.skillRequestedId}
            onChange={handleChange}
            required
            sx={{ flex: 1, minWidth: 150 }}
            helperText="Ask the other user's skill ID (can be improved with search!)"
          />
          <Button type="submit" variant="contained" sx={{ alignSelf: "center", height: 40 }}>Send</Button>
        </Box>
      </Paper>

      {/* Received requests */}
      <Paper sx={{ p: 3, mb: 4 }} elevation={4}>
        <Typography variant="h6" gutterBottom>Received Requests</Typography>
        <List>
          {received.length === 0 && (<ListItem><ListItemText primary="No received requests" /></ListItem>)}
          {received.map(({ id, skillOfferedId, skillRequestedId, status, senderUsername }) => (
            <React.Fragment key={id}>
              <ListItem
                secondaryAction={
                  status === "PENDING" && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        sx={{ mr: 1 }}
                        onClick={() => handleRespond(id, "ACCEPTED")}
                      >Accept</Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRespond(id, "REJECTED")}
                      >Reject</Button>
                    </>
                  )
                }
              >
                <ListItemText
                  primary={`From: ${senderUsername} | Status: ${status}`}
                  secondary={`Their Skill: ${skillOfferedId} | Requested From You: ${skillRequestedId}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Sent requests */}
      <Paper sx={{ p: 3 }} elevation={4}>
        <Typography variant="h6" gutterBottom>Sent Requests</Typography>
        <List>
          {sent.length === 0 && (<ListItem><ListItemText primary="No sent requests" /></ListItem>)}
          {sent.map(({ id, skillOfferedId, skillRequestedId, status, receiverUsername }) => (
            <React.Fragment key={id}>
              <ListItem>
                <ListItemText
                  primary={`To: ${receiverUsername} | Status: ${status}`}
                  secondary={`Offered: ${skillOfferedId} | Requested: ${skillRequestedId}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={handleCloseMessage}
      >
        {message && (
          <Alert onClose={handleCloseMessage} severity={message.severity} sx={{ width: "100%" }}>
            {message.text}
          </Alert>
        )}
      </Snackbar>
    </Container>
  );
}
