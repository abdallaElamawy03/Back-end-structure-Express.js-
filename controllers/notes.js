const express = require("express")
const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const Note = require("../models/Note")

// desc get all notes ]
// route get / notes 
// @ access Private 
const getAllNotes = asyncHandler (async(req, res) => {
    // Get all notes from MongoDB
    const notes = await Note.find().lean()

    // If no notes 
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' })
    }
    // const notesWithUser  = await Promise.all(notes.map(async (note) => {
    //     const user = await User.findById(note.username).lean().exec(); // Ensure correct field is used
    //     if (!user) {
    //         return { ...note, username: 'Unknown User' }; // Handle missing user
    //     }
    //     return { ...note, username: user.username };
    // }));
   
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        //confirm the data received and if the user of the post have been deleted 
        if(!user){
            return {...note , username:" user unavailable "}
        }else{

            return { ...note, username: user.username }
        }
        
    }))

    res.json(notesWithUser)

    
})
const getnotebyid = asyncHandler(async(req,res)=>{
    const{id} = req.params
    if(!id){
        return res.status(400).json({message:"Id is required"})
    }
    const note = await Note.findById(id).exec()
    if(!note){
        return res.status(409).json({message:"the note is not founded"})
    }
    res.json({note})
})

//create new note 
//route post / notes 
// access private 
//confirm data 
// check for duplicate titles 
// create and store new user note  
const postnewNote = asyncHandler(async (req, res) => {
    const { title, text } = req.body; // Ensure user is included
    const {user} = req.params

    // Confirm data
    if ( !user||!title || !text ) { // Check for all required fields
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).collation({locale:"en",strength:2}).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note title' });
    }

    // Create and store the new note 
    const note = await Note.create({  title, text, user }); // Ensure username is included

    if (note) { // Created 
        return res.status(201).json({ message: 'New note created', note });
    } else {
        return res.status(400).json({ message: 'Invalid note data received' });
    }
});
//desc update note
//update note using patch 
//@access private 
//cofirm data
//confirm note if exists or not 
//check duplicate
//allow renaming of the original note 
//get the note by its id 


const updateNote = asyncHandler(async(req,res)=>{
    const {id,user,title,text,completed}=req.body 

    //confirm data 
    if(!id || !user || !title || !text || !completed || typeof completed !== 'boolean'){
        return res.status(400).json({message:"All field are required "})
    }
    const note = await Note.findById(id).exec()
    const user1 = await User.findById(user).exec()
    if(!note){
        return res.status(400).json({message:"Note is not found "})

    }
    const duplicate = await Note.findOne({title}).collation({locale:"en",strength:2}).lean().exec()
    if(duplicate && duplicate?._id.toString()!==id){
        return res.status(409).json({message:"Duplicate note title"})

    }
    note.user=user
    note.title=title 
    note.text=text
    note.completed=completed
    const updateNote = await note.save()
    if(updateNote){
        return res.status(201).json({message:`${user1.username} your note with the title :( ${note.title} ) has been updated`})
    }else{
        return res.status(400).json({message:"Error updating the note"})
    }
})
const updateNotebyId = asyncHandler(async (req, res) => {
    const { text, title } = req.body;

    // Check for required fields
    if (!text || !title) {
        return res.status(400).json({ message: "Fields are required" });
    }

    const { id } = req.params;

    // Check for required ID
    if (!id) {
        return res.status(400).json({ message: "ID is required" });
    }

    // Find the note by ID
    const note = await Note.findById(id).exec(); // Renamed variable to 'note'
    if (!note) {
        return res.status(404).json({ message: "Note not found" });
    }

    // Check for duplication
    const duplicate = await Note.findOne({ title })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();

    if (duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate note title" });
    }
    
    // Update the note
    note.title = title;
    note.text = text;

    const updatedNote = await note.save(); // Use 'note' here

    if (updatedNote) {
        return res.status(200).json({ message: `Note with title: ${note.title} has been updated successfully` });
    } else {
        return res.status(400).json({ message: "There is an error in updating" });
    }
});
const deleteNote = asyncHandler(async(req,res)=>{
    const {id} =req.params
    //confirm data 
    if(!id){
        return res.status(400).json({message:"Note id is required"})
    }
    const note = await Note.findById(id).exec()
    if(!note){
        return res.status(409).json({message:"Note not found"})
    }
    const result = await note.deleteOne()
    if(result){
        res.status(201).json({message:`the post with id ${note?._id.toString()} has been deleted`})
    }else{
        res.status(409).json({message:"The note is not founded "})
    }
}

)
const getnoteby_uid = asyncHandler(async(req, res) => {
    const { user } = req.params;
    
    if(!user) {
        return res.status(403).json({ message: `forbidden` });
    }

    const username = await User.findById(user).select('username').exec();
    if(!username) {
        return res.status(404).json({ message: `user not found` });
    }

    const notes = await Note.find({ user }).exec();
    if(!notes){
        return res.status(404).json({message:`there is no any notes founded`})
    }

    
    return res.json({
        username: username.username,
        notes:notes.map(note=>({
            title:note.title,
            content:note.text,
            createdat:note.createdAt,
            
        }))
    })
})
module.exports={
    getAllNotes,
    postnewNote,
    updateNote,
    deleteNote,
    getnotebyid,
    updateNotebyId,
    getnoteby_uid

}

