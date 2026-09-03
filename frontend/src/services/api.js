// Centralized API Service for PlantAI
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/**
 * Upload an image to identify the plant species.
 */
export async function identifyPlant(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload-image`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok && !data.message) {
    throw new Error("Failed to communicate with plant identification service.");
  }
  return data;
}

/**
 * Upload a seed image to identify the seed species.
 */
export async function identifySeed(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/seed-identify`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok && !data.message) {
    throw new Error("Failed to communicate with seed identification service.");
  }
  return data;
}

/**
 * Upload an image of an affected plant/leaf for disease diagnosis.
 */
export async function checkPlantHealth(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/health-check`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok && !data.message) {
    throw new Error("Failed to communicate with health diagnosis service.");
  }
  return data;
}

/**
 * Retrieve plant care guidance from the MySQL database.
 */
export async function getPlantCare(plantName) {
  const response = await fetch(
    `${API_BASE_URL}/plant-care/${encodeURIComponent(plantName)}`
  );

  const data = await response.json();
  return data;
}

/**
 * Ask the AI Plant Assistant a botanical question.
 */
export async function askAssistant(question, plantName = "") {
  const response = await fetch(`${API_BASE_URL}/assistant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: question.trim(),
      plant_name: (plantName || "").trim(),
    }),
  });

  const data = await response.json();
  return data;
}

/**
 * Register a new user.
 */
export async function registerUser(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
  return await response.json();
}

/**
 * Authenticate an existing user.
 */
export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return await response.json();
}

export default {
  identifyPlant,
  identifySeed,
  checkPlantHealth,
  getPlantCare,
  askAssistant,
  registerUser,
  loginUser,
  API_BASE_URL,
};
