import React, { useState, useEffect, useRef } from "react";
import socket from "../socket";
import axios from "axios";
import {
	fetchRooms,
	createRoom as createRoomAPI,
	joinRoomWithCode,
} from "../api/fetchRooms";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Menu, Send, X, Plus, ChevronDown, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const Chat = () => {
	const [currentRoom, setCurrentRoom] = useState(null);
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [rooms, setRooms] = useState([]);
	const [newRoomName, setNewRoomName] = useState("");
	const [inviteCodeInput, setInviteCodeInput] = useState("");
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [showCreate, setShowCreate] = useState(false);
	const [showJoin, setShowJoin] = useState(false);

	const [hasMore, setHasMore] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);

	const scrollRef = useRef(null);
	const messageContainerRef = useRef(null);

	const username = localStorage.getItem("username") || "Anonymous";
	const BASE_URL = import.meta.env.VITE_BASE_URL;

	// Fetch messages with pagination
	const fetchMessages = async (before = null) => {
		if (!currentRoom?.name) return;

		try {
			const query = before ? `?before=${before}&limit=50` : `?limit=50`;
			const res = await axios.get(
				`${BASE_URL}/api/messages/${currentRoom.name}${query}`
			);

			const newMessages = res.data;

			if (before) {
				setMessages((prev) => [...newMessages, ...prev]);
				if (newMessages.length < 50) setHasMore(false);
			} else {
				setMessages(newMessages);
				setHasMore(true);
			}
		} catch (err) {
			console.error("Failed to fetch messages:", err);
			toast.error(err?.response?.data?.error || "Can't load messages");
		}
	};

	// Join room and listen to socket messages
	useEffect(() => {
		if (!currentRoom?.name) return;

		socket.emit("joinRoom", currentRoom.name);
		fetchMessages();

		socket.on("chatMessage", (msg) => {
			setMessages((prev) => [...prev, msg]);
		});

		return () => {
			socket.off("chatMessage");
		};
	}, [currentRoom]);

	// Auto scroll to bottom on new messages
	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Load rooms
	useEffect(() => {
		const loadRooms = async () => {
			try {
				const res = await fetchRooms(username);
				setRooms(res);
				if (res.length > 0) setCurrentRoom(res[0]);
			} catch (err) {
				console.error("Error fetching rooms:", err);
			}
		};

		loadRooms();

		socket.on("newRoom", (newRoom) => {
			if (newRoom.createdBy === username) {
				setRooms((prev) => [...prev, newRoom]);
				setCurrentRoom(newRoom);
			}
		});

		socket.emit("register", username);

		return () => {
			socket.off("newRoom");
		};
	}, []);

	// Infinite scroll up
	useEffect(() => {
		const container = messageContainerRef.current;
		if (!container) return;

		const handleScroll = async () => {
			if (container.scrollTop === 0 && hasMore && !loadingMore) {
				setLoadingMore(true);
				const oldest = messages[0]?.timestamp;
				await fetchMessages(oldest);
				setLoadingMore(false);
			}
		};

		container.addEventListener("scroll", handleScroll);
		return () => container.removeEventListener("scroll", handleScroll);
	}, [messages, hasMore, loadingMore]);

	// isko naya lagaya hai.
	useEffect(() => {
		const container = messageContainerRef.current;
		if (!container || loadingMore) return;

		const isNearBottom =
			container.scrollHeight - container.scrollTop - container.clientHeight <
			100;

		if (isNearBottom) {
			scrollRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	const sendMessage = (e) => {
		e.preventDefault();
		if (message.trim() && currentRoom?.name) {
			socket.emit("chatMessage", {
				sender: username,
				roomId: currentRoom.name,
				message,
			});
			setMessage("");
		}
	};

	const createRoom = async (e) => {
		e.preventDefault();
		if (!newRoomName.trim()) return;
		try {
			await createRoomAPI(newRoomName, username);
			setNewRoomName("");
			toast.success("Room created successfully 🎉");
		} catch (err) {
			console.error("Room creation failed:", err);
			toast.error(err?.response?.data?.error || "Failed to create room");
		}
	};

	const joinWithInviteCode = async (e) => {
		e.preventDefault();
		if (!inviteCodeInput.trim()) return;
		try {
			const room = await joinRoomWithCode(inviteCodeInput, username);
			if (!rooms.some((r) => r.name === room.name)) {
				setRooms((prev) => [...prev, room]);
			}
			setCurrentRoom(room);
			setInviteCodeInput("");
			toast.success(`Joined #${room.name}`);
		} catch (err) {
			console.error("Join failed:", err);
			toast.error(err?.response?.data?.error || "Invalid invite code");
		}
	};

	return (
		<div className="flex flex-col h-screen bg-zinc-950 text-white pt-16">
			{/* Mobile header for toggling sidebar */}
			{/* Mobile header for toggling sidebar */}
			<div className="sm:hidden flex flex-col px-4 py-3 border-b border-zinc-800 bg-zinc-900">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">
						#{currentRoom?.name || "No Room"}
					</h2>
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="p-2 bg-zinc-800 rounded-md"
					>
						<Menu />
					</button>
				</div>
				{currentRoom?.inviteCode && (
					<p className="text-xs text-zinc-400 mt-1">
						Invite code:{" "}
						<span className="font-mono">{currentRoom.inviteCode}</span>
					</p>
				)}
			</div>

			<div className="flex flex-1 overflow-hidden relative">
				{/* Sidebar */}
				<div
					className={clsx(
						"z-20 sm:relative fixed sm:translate-x-0 top-0 left-0 h-full bg-zinc-900 border-r border-zinc-800 transition-all duration-300",
						sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full w-64"
					)}
				>
					<div className="p-5 mt-12">
						<h2 className="text-xl font-semibold mb-4">Chat Rooms</h2>

						{/* Create Room */}
						<div className="mb-4">
							<div
								onClick={() => setShowCreate((prev) => !prev)}
								className="flex items-center cursor-pointer mb-2"
							>
								{showCreate ? <ChevronDown /> : <ChevronRight />}
								<span className="ml-1 font-medium">Create Room</span>
							</div>
							{showCreate && (
								<form onSubmit={createRoom} className="flex gap-2 mt-2">
									<Input
										placeholder="New room name"
										value={newRoomName}
										onChange={(e) => setNewRoomName(e.target.value)}
										className="bg-zinc-800 text-white text-sm"
									/>
									<Button
										className="rounded-xl p-2 bg-green-600 hover:bg-green-700"
										type="submit"
									>
										<Plus className="h-4 w-4" />
									</Button>
								</form>
							)}
						</div>

						{/* Join Room */}
						<div className="mb-4">
							<div
								onClick={() => setShowJoin((prev) => !prev)}
								className="flex items-center cursor-pointer mb-2"
							>
								{showJoin ? <ChevronDown /> : <ChevronRight />}
								<span className="ml-1 font-medium">Join Room</span>
							</div>
							{showJoin && (
								<form onSubmit={joinWithInviteCode} className="flex gap-2 mt-2">
									<Input
										placeholder="Invite code"
										value={inviteCodeInput}
										onChange={(e) => setInviteCodeInput(e.target.value)}
										className="bg-zinc-800 text-white text-sm"
									/>
									<Button
										type="submit"
										className="rounded-xl p-2 bg-blue-600 hover:bg-blue-700"
									>
										Join
									</Button>
								</form>
							)}
						</div>

						{/* Room list */}
						<div className="space-y-2">
							{rooms.map((room) => (
								<Button
									key={room._id}
									variant={
										currentRoom?.name === room.name ? "default" : "ghost"
									}
									className={clsx(
										"w-full justify-start rounded-xl",
										currentRoom?.name === room.name &&
											"bg-blue-600 hover:bg-blue-700"
									)}
									onClick={() => {
										setCurrentRoom(room);
										setSidebarOpen(false); // hide on mobile
									}}
								>
									#{room.name}
								</Button>
							))}
						</div>
					</div>
				</div>

				{/* Mobile sidebar overlay */}
				{sidebarOpen && (
					<div
						className="fixed inset-0 bg-black bg-opacity-40 sm:hidden z-10"
						onClick={() => setSidebarOpen(false)}
					></div>
				)}

				{/* Chat Area */}
				<div className="flex-1 flex flex-col w-full">
					{/* Desktop Header */}
					<div className="hidden sm:flex justify-between items-center px-6 py-4 border-b border-zinc-800 bg-zinc-900">
						<div>
							<h2 className="text-2xl font-bold">
								#{currentRoom?.name || "No Room"}
							</h2>
							<p className="text-xs text-zinc-400">
								Invite code:{" "}
								<span className="font-mono">
									{currentRoom?.inviteCode || "N/A"}
								</span>
							</p>
						</div>
					</div>

					{/* Messages */}
					<div
						ref={messageContainerRef}
						className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scroll"
					>
						{messages.map((msg, i) => {
							const isMe = msg.sender === username;
							return (
								<motion.div
									key={i}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.2, delay: i * 0.01 }}
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
											<p className="font-semibold text-blue-300">
												{msg.sender}
											</p>
											<p className="break-words">
												{msg.message || msg.content}
											</p>
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
						<Button
							type="submit"
							className="bg-blue-600 hover:bg-blue-700 p-3 rounded-xl"
						>
							<Send className="w-5 h-5" />
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Chat;
