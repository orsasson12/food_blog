import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true

    },
    password: {
        type: String,
        required: true
    },
    userImage: {
        type: String
    },
    description: {
        type: String
    },
    ratingNumber: {
        type: Number
    },
    favoritePosts: [],
    id: { type: String }
})

export default mongoose.model('User', userSchema)