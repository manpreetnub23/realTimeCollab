import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DocumentCard from "../components/DocumentCard";
import {
	fetchDocuments,
	createDocument,
	deleteDocument,
} from "../api/fetchDocuments";
import { Plus } from "lucide-react"; // 👈 Optional icon lib like lucide or use emoji

const Documents = () => {
	const [docs, setDocs] = useState([]);
	const [title, setTitle] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		loadDocs();
	}, []);

	const loadDocs = async () => {
		try {
			const res = await fetchDocuments();
			setDocs(res.data);
		} catch (err) {
			console.error("Error loading documents:", err);
		}
	};

	const handleCreate = async () => {
		if (!title.trim()) return;
		try {
			const res = await createDocument({ title, content: "" });
			setTitle("");
			await loadDocs();
			navigate(`/editor/${res.data._id}`);
		} catch (err) {
			console.error("Error creating document:", err);
		}
	};

	const handleDelete = async (id) => {
		try {
			await deleteDocument(id);
			loadDocs();
		} catch (err) {
			console.error("Error deleting document:", err);
		}
	};

	return (
		<div className="mt-16 px-6 py-8 max-w-4xl mx-auto text-white">
			<h2 className="text-3xl font-bold mb-6">📄 Your Documents</h2>

			<div className="flex gap-3 mb-8">
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Enter new document title..."
					className="px-5 py-3 bg-zinc-800 rounded-xl w-full outline-none focus:ring-2 focus:ring-blue-600 transition"
				/>
				<button
					onClick={handleCreate}
					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl flex items-center justify-center transition"
					title="Create Document"
				>
					<Plus className="w-5 h-5" />
				</button>
			</div>

			<ul className="space-y-4">
				{docs.map((doc) => (
					<DocumentCard
						key={doc._id}
						doc={doc}
						onClick={() => navigate(`/editor/${doc._id}`)}
						onDelete={() => handleDelete(doc._id)}
					/>
				))}
			</ul>
		</div>
	);
};

export default Documents;
