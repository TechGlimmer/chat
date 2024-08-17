const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    from : {
        type: String,
        require: true

    },
    to : {
        type: String,
        require: true
    },
    msg: {
        type: String,
        maxLength: 100
    },
    create_at : {
        type: Date,
        require: true
    }
});

const Chat = new mongoose.model("Chat", chatSchema)

module.exports = Chat;