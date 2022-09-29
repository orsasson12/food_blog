import express from 'express'
import auth from '../middleware/auth.js'
const router = express.Router()

import { getPostsBySearch, likePost, ratePost, getPosts, deletePost, updatePost, getPost, createPost, commentPost } from '../controllers/postsController.js'

router.get('/', getPosts)
router.get('/search', getPostsBySearch)
router.get('/:id', getPost)



router.post('/', auth, createPost)
router.patch('/:id', auth, updatePost)
router.delete('/:id', auth, deletePost)
router.patch('/:id/likePost', auth, likePost)
router.patch('/:id/ratePost', auth, ratePost)
router.post('/:id/commentPost', auth, commentPost)
export default router