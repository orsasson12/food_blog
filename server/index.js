import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/user.js'
import postRouter from './routes/posts.js'
const app = express();
dotenv.config()
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use('/', postRouter)
app.use('/user', userRoutes)

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => app.listen(PORT, () => console.log(`server Running on port: ${PORT}`, 'connected mongo')))
    .catch((error) => console.log(error))