import React from "react";
import { Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents"; // You’ll create this
import Editor from "./pages/Editor";
import ProtectedRoute from "./components/routes/ProtectedRoute"; // 🔐 ProtectedRoute component
import { Toaster } from "react-hot-toast";

const App = () => {
	return (
		<div className="h-screen flex flex-col bg-zinc-950">
			<Toaster position="top-right" />
			<Navbar />
			<div className="flex-1">
				<Routes>
					{/* Public Routes */}
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					{/* Protected Routes */}
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/chat"
						element={
							<ProtectedRoute>
								<Chat />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/notes"
						element={
							<ProtectedRoute>
								<Notes />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/documents"
						element={
							<ProtectedRoute>
								<Documents />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/editor/:id"
						element={
							<ProtectedRoute>
								<Editor />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</div>
		</div>
	);
};

export default App;
