const mongoose = require('mongoose');

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [ true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [ true, 'Please add a description'],
        unique: true,
        trim: true,
        maxlength: [500, 'Description cannot be more than 50 characters']
    },
    
})