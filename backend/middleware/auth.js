// AUTH , IS STUDENT , IS INSTRUCTOR , IS ADMIN

const jwt = require("jsonwebtoken");
require('dotenv').config();


// ================ AUTH ================
// user Authentication by checking token validating
exports.auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log("DEBUG: Token received in backend =", token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            });
        }

        try {
            console.log("DEBUG: Using JWT_SECRET =", process.env.JWT_SECRET);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("DEBUG: Decoded token =", decoded);
            req.user = decoded;
            next();
        } catch (error) {
            console.log("DEBUG: Token verification failed:", error.message);
            return res.status(401).json({
                success: false,
                error: error.message,
                message: "Invalid Token"
            });
        }
    } catch (error) {
        console.log("DEBUG: Error while validating token", error);
        return res.status(500).json({
            success: false,
            message: "Error while validating token"
        });
    }
};








// ================ IS STUDENT ================
exports.isStudent = (req, res, next) => {
    try {
        // console.log('User data -> ', req.user)
        if (req.user?.accountType != 'Student') {
            return res.status(401).json({
                success: false,
                messgae: 'This Page is protected only for student'
            })
        }
        // go to next middleware
        next();
    }
    catch (error) {
        console.log('Error while cheching user validity with student accountType');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            messgae: 'Error while cheching user validity with student accountType'
        })
    }
}


// ================ IS INSTRUCTOR ================
exports.isInstructor = (req, res, next) => {
    console.log("DEBUG: User role =", req.user.accountType);

    if (req.user.accountType !== "Instructor") {
        return res.status(403).json({ success: false, message: "Access Denied: You are not an Instructor" });
    }
    next();
};



// ================ IS ADMIN ================
exports.isAdmin = (req, res, next) => {
    try {
        // console.log('User data -> ', req.user)
        if (req.user.accountType != 'Admin') {
            return res.status(401).json({
                success: false,
                messgae: 'This Page is protected only for Admin'
            })
        }
        // go to next middleware
        next();
    }
    catch (error) {
        console.log('Error while cheching user validity with Admin accountType');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            messgae: 'Error while cheching user validity with Admin accountType'
        })
    }
}


