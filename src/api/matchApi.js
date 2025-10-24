import apiClient from "../utils/apiClient";

export const sendMatchRequest = (payload) => apiClient.post("/match/send", payload);

export const getSentRequests = () => apiClient.get("/match/sent");

export const getReceivedRequests = () => apiClient.get("/match/received");

export const respondToRequest = (requestId, status) =>
  apiClient.put(`/match/respond/${requestId}?status=${status}`);
