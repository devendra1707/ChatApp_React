import axios from "axios";

export const baseUrl = "http://localhost:8081"; // Backend server URL

export const httpClient = axios.create({
  baseURL: baseUrl, // Correct property name
  // timeout: 1000,
  // headers: {
  //   // Ensure headers is plural
  //   "Content-Type": "application/json",
  // },
});
