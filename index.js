// Load environment variables from .env file
require('dotenv').config();

// NOTE: All required packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

// NOTE: Import chat model
const Chat = require("./models/chat.js");

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// HACK: Mongoose setup
// Mongoose setup
async function main() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Database connection successful");
    } catch (err) {
        console.error("Database connection error:", err);
    }
}

main();

// NOTE: Index Route
app.get("/chats", async (req, res) => {
    try {
        let chats = await Chat.find();
        res.render("index.ejs", { chats });
    } catch (err) {
        console.error("Error fetching chats:", err);
        res.status(500).send("Internal Server Error");
    }
});

// NOTE: New Chat Create Route
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/chats", async (req, res) => {
    let { from, to, msg } = req.body;
    let newChat = new Chat({
        from,
        to,
        msg,
        create_at: new Date(),
    });
    try {
        await newChat.save();
        res.redirect("/chats");
    } catch (err) {
        console.error("Error saving chat:", err);
        res.status(500).send("Internal Server Error");
    }
});

// NOTE: Edit Route
app.get("/chats/:id/edit", async (req, res) => {
    let { id } = req.params;
    try {
        let chat = await Chat.findById(id);
        res.render("edit.ejs", { chat });
    } catch (err) {
        console.error("Error fetching chat:", err);
        res.status(500).send("Internal Server Error");
    }
});

// NOTE: Update Route
app.put("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    try {
        await Chat.findByIdAndUpdate(id, { msg: newMsg }, { new: true, runValidators: true });
        res.redirect("/chats");
    } catch (err) {
        console.error("Error updating chat:", err);
        res.status(500).send("Internal Server Error");
    }
});

// NOTE: Delete Route
app.get("/chats/:id/delete", async (req, res) => {
    let { id } = req.params;
    try {
        await Chat.findByIdAndDelete(id);
        res.redirect("/chats");
    } catch (err) {
        console.error("Error deleting chat:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Main route
app.get("/", (req, res) => {
    res.send("CONNECTED");
});

// NOTE: Server port configuration
app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});

module.exports.handler = serverless(app);
