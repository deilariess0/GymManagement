// src/utils/memberStorage.js
import { MOCK_MEMBERS } from "../data/mockData";

const STORAGE_KEY = "fit4less_members";

export const getAllMembers = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_MEMBERS));
      return MOCK_MEMBERS;
    }
    return JSON.parse(stored);
  } catch (err) {
    console.error("Error reading members from storage:", err);
    return MOCK_MEMBERS;
  }
};

export const saveMembers = (members) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  } catch (err) {
    console.error("Error saving members:", err);
  }
};

export const addMemberToStorage = (newMember) => {
  const current = getAllMembers();
  const filtered = current.filter((m) => m.id !== newMember.id);
  const updated = [...filtered, newMember];
  saveMembers(updated);
  return updated;
};

export const updateMemberInStorage = (id, updates) => {
  const current = getAllMembers();
  const updated = current.map((m) => (m.id === id ? { ...m, ...updates } : m));
  saveMembers(updated);
  return updated;
};

export const resetMemberStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_MEMBERS));
  return MOCK_MEMBERS;
};