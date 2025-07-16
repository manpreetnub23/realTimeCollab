import React from "react";

const DocumentCard = ({ doc, onClick, onDelete }) => {
	return (
		<li className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-xl flex justify-between items-center transition hover:bg-white/10 cursor-pointer">
			<div onClick={onClick}>
				<h3 className="font-semibold text-lg text-white">{doc.title}</h3>
				<small className="text-gray-300">
					Last updated: {new Date(doc.updatedAt).toLocaleString()}
				</small>
			</div>
			<button
				onClick={onDelete}
				className="text-red-400 hover:text-red-500 font-medium"
			>
				🗑️
			</button>
		</li>
	);
};

export default DocumentCard;
