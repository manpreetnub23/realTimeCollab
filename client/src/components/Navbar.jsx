import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const Navbar = () => {
	const navigate = useNavigate();
	const username = localStorage.getItem("username");

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("username");
		navigate("/login");
	};

	const initial = username?.charAt(0)?.toUpperCase();

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/5 border-b border-white/10 shadow-sm px-6 py-3 flex items-center justify-between">
			{/* Logo */}
			<Link
				to={username ? "/" : "/login"}
				className="text-xl sm:text-2xl font-semibold tracking-tight text-white select-none hover:cursor-pointer"
			>
				🌚 mil-Lo
			</Link>

			{/* Right Side */}
			<div className="flex items-center gap-6">
				{username ? (
					<>
						<Link
							to="/"
							className="text-sm sm:text-base font-medium text-blue-300 hover:underline"
						>
							Dashboard
						</Link>

						<div className="flex items-center gap-3">
							<div
								className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold hover:cursor-pointer"
								title={username}
							>
								{initial}
							</div>

							<button
								onClick={handleLogout}
								className="p-2 rounded-full bg-red-500/80 hover:bg-red-600/90 backdrop-blur-md transition duration-200 shadow hover:shadow-lg"
								title="Logout"
							>
								<LogOut className="w-5 h-5 text-white" />
							</button>
						</div>
					</>
				) : (
					<div className="flex items-center gap-3">
						<Link
							to="/login"
							className="px-4 py-1.5 rounded-md bg-blue-600/80 hover:bg-blue-700/90 text-sm font-medium text-white backdrop-blur-md transition shadow"
						>
							Login
						</Link>
						<Link
							to="/register"
							className="px-4 py-1.5 rounded-md bg-green-600/80 hover:bg-green-700/90 text-sm font-medium text-white backdrop-blur-md transition shadow"
						>
							Register
						</Link>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
