import express from 'express';
import { auth } from "../middleware/auth.js";
import {
    getAllDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument
} from "../controllers/documentController.js";

const router = express.Router();

router.use(auth); // all routes below are protected

router.get("/", getAllDocuments);
router.get("/:id", getDocumentById);
router.post("/", createDocument);
router.put("/:id", updateDocument);
router.delete("/:id", deleteDocument);

export default router;
