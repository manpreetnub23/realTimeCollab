// api/documents.js (or fetchDocuments.js)

import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
});

// Add token interceptor
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Export API functions
export const fetchDocuments = () => api.get("api/documents");
export const fetchDocumentById = (id) => api.get(`api/documents/${id}`);
export const createDocument = (data) => api.post("api/documents", data);
export const updateDocument = (id, data) =>
	api.put(`api/documents/${id}`, data);
export const deleteDocument = (id) => api.delete(`api/documents/${id}`);
