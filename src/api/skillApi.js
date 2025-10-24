import apiClient from "../utils/apiClient";

export const fetchMySkills = () => apiClient.get("/skills/me");

export const addSkill = (skillData) => apiClient.post("/skills/me", skillData);

export const deleteSkill = (skillId) => apiClient.delete(`/skills/me/${skillId}`);
