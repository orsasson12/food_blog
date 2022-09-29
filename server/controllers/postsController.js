import mongoose from "mongoose"
import PostMessage from "../models/postMessage.js"

// export const getPosts = async (req, res) => {
//     try {
//         const posts = await PostMessage.find();
//         res.json(posts)
//     } catch (error) {
//         console.log(error);
//         res.json({ message: `from posts ${error}` })
//     }
// }

export const getPosts = async (req, res) => {
    // the "game" when we want to make a pagination its between limit and skip - the limit gives us the limit number of posts and skip help us not to get the prev data
    const { page } = req.query
    try {
        // the number of posts in each page
        const LIMIT = 6
        const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page 
        const total = await PostMessage.countDocuments({})
        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex)// the sort will give us the last posts that made and the limit will limit the posts that we are getting // the skip will skip all of the posts if we will be at the second page we will not get 16 posts
        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query
    try {

        const title = new RegExp(searchQuery, 'i');

        const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] })
        res.json({ data: posts })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


export const getPost = async (req, res) => {
    const { id } = req.params
    try {
        const post = await PostMessage.findById(id)
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}



export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })
    try {
        await newPost.save()
        res.status(201).json(newPost)
    } catch (error) {
        console.log(error, 'from controller');
        res.status(409).json({ message: error.message })
    }
}


export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id')
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true })
    res.json(updatedPost)
}


export const deletePost = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id')
    await PostMessage.findByIdAndRemove(_id)
    res.json({ message: 'Post Deleted Successfully' })
}


export const likePost = async (req, res) => {
    const { id } = req.params;

    // when we are putting the auth function before the like function for example we will be able to use thing that we are passing in the auth function
    // for exmaple we are able to use the req.userId that are coming from the auth function.

    if (!req.userId) return res.json({ message: 'Unauthenticated' })

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id')

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
        // like the post
        post.likes.push(req.userId)
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId))
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })
    res.status(200).json(updatedPost)
}
export const ratePost = async (req, res) => {
    const { id } = req.params;
    // when we are putting the auth function before the like function for example we will be able to use thing that we are passing in the auth function
    // for exmaple we are able to use the req.userId that are coming from the auth function.
    if (!req.userId) return res.json({ message: 'Unauthenticated' })

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id')

    const post = await PostMessage.findById(id);

    const index = post.ratings.findIndex((rateData) => String(rateData.userId) === String(req.userId));
    if (index === -1) {
        // like the post
        post.ratings.push({
            rate: req.body.rate,
            userId: req.userId
        })
    } else {
        post.ratings[index].rate = req.body.rate
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })

    res.status(200).json(updatedPost)
}


// comment post by taking the id from params and the value from the body 
export const commentPost = async (req, res) => {
    const { id } = req.params
    const { value } = req.body

    const post = await PostMessage.findById(id)
    post.comments.push(value)
    const updatePost = await PostMessage.findByIdAndUpdate(id, post, { new: true })
    res.status(200).json(updatePost)
}