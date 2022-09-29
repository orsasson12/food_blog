import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title: String,
    ingredients: [String],
    description: String,
    preparation: String,
    name: String,
    userDescription: String,
    userImage: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    category: String,
    ratings: [{
        rate: Number,
        userId: String
    }],
    likes: {
        type: [String],
        default: []
    },
    comments: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
})

const PostMessage = mongoose.model('PostMessage', postSchema)

export default PostMessage