import Document from "../models/DocumentModel.js";

const getAllDocuments = async (req, res) => {
    try {
        const docs = await Document.find({ owner: req.user.id }).sort("-updatedAt");
        res.json(docs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

const getDocumentById = async (req, res) => {
    try {
        const doc = await Document.findOne({ _id: req.params.id, owner: req.user.id });
        if (!doc) return res.status(404).json({ message: "Not found" });
        res.json(doc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

const createDocument = async (req, res) => {
    try {
        const { title, content } = req.body;
        const doc = await Document.create({ title, content, owner: req.user.id });
        res.status(201).json(doc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateDocument = async (req, res) => {
    try {
        const { title, content } = req.body;
        const doc = await Document.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            { title, content },
            { new: true }
        );
        if (!doc) return res.status(404).json({ message: "Not found" });
        res.json(doc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

const deleteDocument = async (req, res) => {
    try {
        const deleted = await Document.findOneAndDelete({
            _id: req.params.id,
            owner: req.user.id,
        });
        if (!deleted) return res.status(404).json({ message: "Not found" });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// ✅ ESM export
export {
    getAllDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
};
