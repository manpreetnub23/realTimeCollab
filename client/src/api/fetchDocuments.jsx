import axios from "axios";

const API = axios.create({
	baseURL: "http://localhost:3000/api",
});

API.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

export const fetchDocuments = () => API.get("/documents");
export const fetchDocumentById = (id) => API.get(`/documents/${id}`);
export const createDocument = (data) => API.post("/documents", data);
export const updateDocument = (id, data) => API.put(`/documents/${id}`, data);
export const deleteDocument = (id) => API.delete(`/documents/${id}`);
