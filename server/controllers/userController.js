import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/userModel.js'


export const signin = async (req, res) => {
    const { email, password } = req.body

    try {
        const existingUser = await User.findOne({ email })
        if (!existingUser) return res.status(404).json({ message: 'User doesnt exist' })

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(404).json({ message: 'Invalid credntials' })

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: '1h' })

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
    }
}
export const signup = async (req, res) => {
    const { email, password, firstName, lastName, confirmPassword, userImage, description } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(404).json({ message: 'User exist' })
        if (password !== confirmPassword) return res.status(404).json({ message: 'password dont match' })

        const hashedPassword = await bcrypt.hash(password, 12)

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`, description: description, userImage: userImage })
        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: '1h' })
        res.status(200).json({ result, token });
    } catch (error) {
        console.log(error, 'here');
        res.status(500).json({ message: 'something went wrong' })
    }
}