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
	const [currentRoom, setCurrentRoom] = useState(null); // 👈 store full room object
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [rooms, setRooms] = useState([]);
	const [newRoomName, setNewRoomName] = useState("");
	const [inviteCodeInput, setInviteCodeInput] = useState("");
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [showCreate, setShowCreate] = useState(false);
	const [showJoin, setShowJoin] = useState(false);
	const scrollRef = useRef(null);
	const username = localStorage.getItem("username") || "Anonymous";

	// Load messages when room changes
	useEffect(() => {
		if (!currentRoom?.name) return;

		socket.emit("joinRoom", currentRoom.name);

		const fetchMessages = async () => {
			try {
				const res = await axios.get(
					`https://realtimecollab-8.onrender.com/api/messages/${currentRoom.name}?username=${username}`
				);
				setMessages(res.data);
			} catch (err) {
				console.error("Failed to fetch messages:", err);
				toast.error(err?.response?.data?.error || "Can't load messages");
			}
		};

		fetchMessages();

		socket.on("chatMessage", (msg) => {
			setMessages((prev) => [...prev, msg]);
		});

		return () => {
			socket.off("chatMessage");
		};
	}, [currentRoom]);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

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
			console.log("chat ke try mein aa gaya hun");
			const room = await joinRoomWithCode(inviteCodeInput, username);
			console.log("char file ke function mein hun aur room hai ", room);
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
		<div className="flex text-white bg-zinc-950 pt-16 h-screen overflow-hidden">
			{/* Sidebar */}
			<div
				className={clsx(
					"transition-all duration-300 border-r border-zinc-800 bg-zinc-900",
					sidebarOpen ? "w-64 p-5" : "w-0 p-0 overflow-hidden"
				)}
			>
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
							variant={currentRoom?.name === room.name ? "default" : "ghost"}
							className={clsx(
								"w-full justify-start rounded-xl",
								currentRoom?.name === room.name &&
									"bg-blue-600 hover:bg-blue-700"
							)}
							onClick={() => setCurrentRoom(room)}
						>
							#{room.name}
						</Button>
					))}
				</div>
			</div>

			{/* Chat area */}
			<div className="flex flex-col flex-1 max-h-[calc(100vh-64px)] w-full overflow-hidden">
				<div className="flex justify-between items-center px-4 py-4 border-b border-zinc-800 bg-zinc-900">
					<div className="flex items-center gap-3">
						<button
							onClick={() => setSidebarOpen((prev) => !prev)}
							className="p-2 rounded-md bg-zinc-800"
						>
							{sidebarOpen ? (
								<X className="w-5 h-5" />
							) : (
								<Menu className="w-5 h-5" />
							)}
						</button>
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
										<p className="font-semibold text-blue-300">{msg.sender}</p>
										<p className="break-words">{msg.message || msg.content}</p>
									</div>
								</div>
							</motion.div>
						);
					})}
					<div ref={scrollRef} />
				</div>

				{/* Message input */}
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
	);
};

export default Chat;
