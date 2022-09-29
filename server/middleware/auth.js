import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    // checking for the auth of the user
    try {
        // getting the token
        const token = req.headers.authorization.split(" ")[1];
        // checking if the token is from google or our token
        const isCustomAuth = token.length < 500;

        let decodedData;


        if (token && isCustomAuth) {
            // getting the details of the user and checking that.
            //                     token  , secret word
            decodedData = jwt.verify(token, 'test')

            req.userId = decodedData?.id
        } else {
            decodedData = jwt.decode(token)

            // sub is GOggle name for an id 
            req.userId = decodedData?.sub
        }
        next()
    } catch (error) {
        console.log(error);
    }
}

export default auth