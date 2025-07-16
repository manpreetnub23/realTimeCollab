import React, { useState, useEffect, useRef } from "react";
import socket from "../socket";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Menu, Send, X } from "lucide-react";

const rooms = ["general", "tech", "random", "music"];

const Chat = () => {
	const [roomId, setRoomId] = useState("general");
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const scrollRef = useRef(null);
	const username = localStorage.getItem("username") || "Anonymous";

	useEffect(() => {
		socket.emit("joinRoom", roomId);

		const fetchMessages = async () => {
			try {
				const res = await axios.get(
					`http://localhost:3000/api/messages/${roomId}`
				);
				setMessages(res.data);
			} catch (err) {
				console.error("Failed to fetch messages:", err);
			}
		};
		fetchMessages();

		socket.on("chatMessage", (msg) => {
			setMessages((prev) => [...prev, msg]);
		});

		return () => {
			socket.off("chatMessage");
		};
	}, [roomId]);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const sendMessage = (e) => {
		e.preventDefault();
		if (message.trim()) {
			socket.emit("chatMessage", {
				sender: username,
				roomId,
				message,
			});
			setMessage("");
		}
	};

	return (
		<div className="flex text-white bg-zinc-950 pt-16 h-screen overflow-hidden">
			{/* Sidebar */}
			<div
				className={clsx(
					"transition-all duration-300 border-r border-zinc-800 bg-zinc-900",
					sidebarOpen ? "w-64 p-5" : "w-0 p-0 overflow-hidden"
				)}
			>
				<h2 className="text-xl font-semibold mb-5">chat rooms</h2>
				<div className="space-y-2">
					{rooms.map((room) => (
						<Button
							key={room}
							variant={room === roomId ? "default" : "ghost"}
							className={clsx(
								"w-full justify-start",
								room === roomId && "bg-blue-600 hover:bg-blue-700"
							)}
							onClick={() => setRoomId(room)}
						>
							#{room}
						</Button>
					))}
				</div>
			</div>

			{/* Chat Area */}
			<div className="flex flex-col flex-1 max-h-[calc(100vh-64px)] w-full overflow-hidden">
				{/* Header */}
				<div className="flex justify-between items-center px-4 py-4 border-b border-zinc-800 bg-zinc-900">
					<div className="flex items-center gap-3">
						<button
							onClick={() => setSidebarOpen((prev) => !prev)}
							className="p-2 rounded-md bg-zinc-800"
						>
							{sidebarOpen ? (
								<X className="w-5 h-5 text-white" />
							) : (
								<Menu className="w-5 h-5 text-white" />
							)}
						</button>
						<h2 className="text-2xl font-bold">#{roomId}</h2>
					</div>
				</div>

				{/* Messages */}
				<div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scroll">
					{messages.map((msg, i) => {
						const isMe = msg.sender === username;
						return (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2, delay: i * 0.02 }}
								className={clsx(
									"flex w-full",
									isMe ? "justify-end" : "justify-start"
								)}
							>
								<div
									className={clsx(
										"flex items-start gap-3",
										isMe && "flex-row-reverse"
									)}
								>
									<div
										className={clsx(
											"w-10 h-10 flex items-center justify-center rounded-full font-bold text-white",
											isMe ? "bg-blue-600" : "bg-blue-700"
										)}
									>
										{msg.sender[0]?.toUpperCase()}
									</div>

									<div
										className={clsx(
											"px-4 py-3 rounded-xl max-w-[75%]",
											isMe
												? "bg-blue-600 text-white ml-auto"
												: "bg-zinc-800 text-white mr-auto"
										)}
									>
										<p
											className={clsx(
												"font-semibold",
												isMe ? "text-white" : "text-blue-400"
											)}
										>
											{msg.sender}
										</p>
										<p className="break-words">{msg.message || msg.content}</p>
									</div>
								</div>
							</motion.div>
						);
					})}
					<div ref={scrollRef} />
				</div>

				{/* Input */}
				<form
					onSubmit={sendMessage}
					className="flex gap-3 px-6 py-4 border-t border-zinc-800 bg-zinc-900"
				>
					<Input
						placeholder="Type your message..."
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						className="bg-zinc-800 text-white"
					/>
					<Button type="submit" className="bg-blue-600 hover:bg-blue-700 p-3">
						<Send className="w-5 h-5" />
					</Button>
				</form>
			</div>
		</div>
	);
};

export default Chat;
