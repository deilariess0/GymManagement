// src/context/useGym.js
import { useContext } from "react";
import { GymContext } from "./GymContext";

export function useGym() {
  return useContext(GymContext);
}