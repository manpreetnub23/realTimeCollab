// pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const cards = [
	{
		title: "📝 Notes / Task Manager",
		description: "Plan, write & manage tasks collaboratively in real-time.",
		path: "/notes",
		bg: "from-purple-600 to-purple-800",
	},
	{
		title: "💬 Chat",
		description: "Join real-time chat rooms and talk with teammates.",
		path: "/chat",
		bg: "from-blue-600 to-blue-800",
	},
	{
		title: "📄 Document Editor",
		description: "Edit and collaborate on documents like Google Docs.",
		path: "/documents",
		bg: "from-green-600 to-green-800",
	},
];

const Dashboard = () => {
	const navigate = useNavigate();

	return (
		<div className="pt-24 lg:mt-20 px-4 py-10 bg-zinc-950 overflow-y custom-scroll">
			<div className="grid w-full max-w-6xl mx-auto grid-cols-1 md:grid-cols-3 gap-6 gap-y-4">
				{cards.map((card, index) => (
					<motion.div
						key={index}
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.98 }}
						initial={{ opacity: 0, y: 100 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.6, delay: index * 0.1 }}
						onClick={() => navigate(card.path)}
						className={`bg-gradient-to-br ${card.bg} text-white rounded-2xl p-8 shadow-xl cursor-pointer backdrop-blur-sm bg-opacity-80 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between min-h-[260px] md:min-h-[320px]`}
					>
						<h2 className="text-3xl font-bold">{card.title}</h2>
						<p className="text-white/80 text-base mt-4">{card.description}</p>
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default Dashboard;
