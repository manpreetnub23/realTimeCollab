import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDocumentById, updateDocument } from "../api/fetchDocuments";
import socket from "../socket";
import { Save } from "lucide-react";

const Editor = () => {
	const { id } = useParams();
	const [doc, setDoc] = useState({ title: "", content: "" });

	useEffect(() => {
		const load = async () => {
			const res = await fetchDocumentById(id);
			setDoc(res.data);
			socket.emit("join-doc", id);
		};
		load();

		socket.on("receive-changes", (data) => {
			setDoc((prev) => ({ ...prev, content: data }));
		});

		return () => {
			socket.emit("leave-doc", id);
			socket.off("receive-changes");
		};
	}, [id]);

	const handleChange = (e) => {
		setDoc({ ...doc, content: e.target.value });
		socket.emit("send-changes", { id, content: e.target.value });
	};

	const handleSave = async () => {
		await updateDocument(id, doc);
		alert("✅ Saved successfully!");
	};

	return (
		<div className="p-6 pt-20 max-w-5xl mx-auto text-white custom-scroll">
			{/* Title & Save Row */}
			<div className="flex items-center justify-between mb-6 gap-4">
				<input
					className="text-3xl font-bold bg-transparent border-b-2 border-zinc-700 pb-2 outline-none focus:border-blue-500 transition w-full"
					value={doc.title}
					onChange={(e) => setDoc({ ...doc, title: e.target.value })}
					placeholder="Untitled Document"
				/>
				<button
					onClick={handleSave}
					className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 transition whitespace-nowrap"
				>
					<Save className="w-5 h-5" />
					<span>Save & Sync</span>
				</button>
			</div>

			{/* Textarea */}
			<textarea
				className="w-full h-[70vh] bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-xl text-white outline-none text-base resize-none focus:ring-2 focus:ring-blue-600 transition"
				value={doc.content}
				onChange={handleChange}
				placeholder="Start writing your document here..."
			/>
		</div>
	);
};

export default Editor;
