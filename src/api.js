// Talks to the Flask backend (backend/app.py). Change API_BASE below if
// your backend runs somewhere other than http://localhost:5000.
export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    let message = `Request to ${path} failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // response wasn't JSON, keep the default message
    }
    throw new Error(message);
  }
  // 204s and similar have no body
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export function assessImage(file) {
  const form = new FormData();
  form.append("image", file);
  return request("/assess", { method: "POST", body: form });
}

export function createClaim(payload) {
  return request("/claims", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function listClaims({ farmer, status } = {}) {
  const params = new URLSearchParams();
  if (farmer) params.set("farmer", farmer);
  if (status) params.set("status", status);
  const qs = params.toString();
  return request(`/claims${qs ? `?${qs}` : ""}`);
}

export function getClaim(id) {
  return request(`/claims/${id}`);
}

export function updateClaim(id, payload) {
  return request(`/claims/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function sendChatMessage(message) {
  return request("/chatbot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
}

export function uploadUrl(imageId) {
  return `${API_BASE}/uploads/${imageId}`;
}
