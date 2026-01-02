import bcrypt from 'bcrypt';
import admin from 'firebase-admin';
import { db } from '../config/dbConfig.js';

//є
class AuthController {
    register = async (req, res) => {
        console.log('Register endpoint called', req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                statusCode: 400,
                error: "Missing fields"
            });
        }

        try {
            const userRecord = await admin.auth().createUser({
                email,
                password
            });

            const hashedPassword = await bcrypt.hash(password, 10);

            await db.collection("users").doc(userRecord.uid).set({
                email,
                password: hashedPassword,
                createdAt: new Date(),
                role: "user"
            });

            res.status(201).json({
                statusCode: 201,
                message: "User created",
                uid: userRecord.uid
            });
        } catch (err) {
            console.error('Register error:', err, err?.errorInfo);
            res.status(500).json({
                statusCode: 500,
                error: err.message,
                details: err?.errorInfo || null
            });
        }
    };

    login = async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                statusCode: 400,
                error: "Missing fields"
            });
        }

        try {

            const userQuery = await db.collection("users").where("email", "==", email).limit(1).get();
            if (userQuery.empty) {
                return res.status(401).json({
                    statusCode: 401,
                    error: "Invalid credentials"
                });
            }

            const userDoc = userQuery.docs[0];
            const userData = userDoc.data();
            const uid = userDoc.id;

            const isMatch = await bcrypt.compare(password, userData.password);

            if (!isMatch) {
                return res.status(401).json({
                    statusCode: 401,
                    error: "Invalid password"
                });
            }

            const token = await admin.auth().createCustomToken(uid);

            res.status(200).json({
                statusCode: 200,
                message: "Вхід виконано",
                uid,
                token
            });
        } catch (err) {
            res.status(500).json({
                statusCode: 500,
                error: "Server error"
            });
        }
    }
}

export default AuthController;