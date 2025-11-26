const mongoose = require("mongoose");




const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;