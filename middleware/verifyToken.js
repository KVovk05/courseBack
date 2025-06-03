import admin from 'firebase-admin';

const verifyFirebaseToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw Error("Unauthorized: No token provided");
        }

        const idToken = authHeader.split(" ")[1];

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;

        next();
    } catch (error) {
        return res.status(401).json({ 
            statusCode: 401,
            error: error.message
         });
    }
};

export default verifyFirebaseToken;
