import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function MessagingPage() {
  const { token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [messageText, setMessageText] = useState("");
  const [message, setMessage] = useState(null);
  const messagesEndRef = useRef(null);

  const apiClient = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const fetchConversation = async () => {
    if (!receiver) return;
    try {
      const res = await apiClient.get(`/messages/conversation/${receiver}`);
      setMessages(res.data);
    } catch {
      setMessage({ text: "Failed to fetch messages", severity: "error" });
    }
  };

  const handleSendMessage = async () => {
    if (!receiver || !messageText) {
      setMessage({ text: "Receiver and message required", severity: "warning" });
      return;
    }
    try {
      await apiClient.post("/messages/send", {
        receiverUsername: receiver,
        content: messageText,
      });
      setMessageText("");
      fetchConversation();
    } catch {
      setMessage({ text: "Failed to send message", severity: "error" });
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [receiver]);

  const handleCloseMessage = () => setMessage(null);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Messaging
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }} elevation={4}>
        <TextField
          label="Receiver Username"
          fullWidth
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          sx={{ mb: 2 }}
        />
        <List sx={{ maxHeight: 400, overflowY: "auto", mb: 2 }}>
          {messages.length === 0 && <Typography>No messages</Typography>}
          {messages.map(({ id, senderUsername, content, timestamp }) => (
            <ListItem key={id} divider>
              <ListItemText
                primary={`${senderUsername} says:`}
                secondary={content}
              />
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="Type a message"
            fullWidth
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <Button variant="contained" onClick={handleSendMessage}>
            Send
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={handleCloseMessage}
      >
        {message && (
          <Alert
            onClose={handleCloseMessage}
            severity={message.severity}
            sx={{ width: "100%" }}
          >
            {message.text}
          </Alert>
        )}
      </Snackbar>
    </Container>
  );
}
