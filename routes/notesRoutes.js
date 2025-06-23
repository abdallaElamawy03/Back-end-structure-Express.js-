const express = require("express")
const router = express.Router()
const notes = require("../controllers/notes")
const verifyJwt=require("../middleware/verifyJwt")
const loginLimiter = require("../middleware/loginLimiter")
router.use(loginLimiter)
router.use(verifyJwt)
///
router.route("/")
.get(notes.getAllNotes)
.delete(notes.deleteNote)
////

router.route("/:user").post(notes.postnewNote).get(notes.getnoteby_uid)
////

router.route("/:id").get(notes.getnotebyid)
.patch(notes.updateNotebyId).delete(notes.deleteNote)
////
module.exports = router