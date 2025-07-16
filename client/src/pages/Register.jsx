import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock } from "lucide-react";

const url = "http://localhost:3000/api/auth";

const Register = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`${url}/register`, { username, password });
			alert("Registered! You can log in now.");
			navigate("/login");
		} catch (err) {
			alert("Registration failed");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#1e1f22] p-4">
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="w-full max-w-md bg-white/10 backdrop-blur-lg text-white rounded-3xl shadow-2xl p-8"
			>
				<h1 className="text-center text-3xl font-bold mb-6">register karo</h1>

				<form onSubmit={handleRegister} className="space-y-5">
					<div>
						<label className="text-sm">Username</label>
						<div className="flex items-center bg-zinc-900 px-4 py-2 rounded-lg mt-1">
							<Mail className="w-5 h-5 text-zinc-400 mr-2" />
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="Enter username"
								className="bg-transparent outline-none w-full text-sm placeholder-zinc-500"
							/>
						</div>
					</div>

					<div>
						<label className="text-sm">Password</label>
						<div className="flex items-center bg-zinc-900 px-4 py-2 rounded-lg mt-1">
							<Lock className="w-5 h-5 text-zinc-400 mr-2" />
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter password"
								className="bg-transparent outline-none w-full text-sm placeholder-zinc-500"
							/>
						</div>
					</div>

					<button
						type="submit"
						className="w-full bg-green-600 hover:bg-green-700 transition duration-300 py-2 rounded-lg flex items-center justify-center gap-2 font-medium"
					>
						<UserPlus size={18} /> Register
					</button>
				</form>

				<p className="text-center text-sm mt-6 text-zinc-400">
					Already have an account?{" "}
					<span
						className="text-blue-400 hover:underline cursor-pointer"
						onClick={() => navigate("/login")}
					>
						Login
					</span>
				</p>
			</motion.div>
		</div>
	);
};

export default Register;
