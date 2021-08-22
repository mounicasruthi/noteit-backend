const express = require("express");
const { addNote, getAllNotes, updateNote } = require("../controllers/notes");
const { verifyToken } = require("../middlewares/authMiddleware");
const { handleNoteIdParam } = require("../middlewares/noteMiddleware");
const router = express.Router();

router.param("noteId", handleNoteIdParam);

router.post("/add", verifyToken, addNote);
router.put("/update/:noteId", verifyToken, updateNote);
// router.delete("/delete/:noteId", verifyToken, deleteNote);
router.get("/getallnotes", verifyToken, getAllNotes);

module.exports = router;