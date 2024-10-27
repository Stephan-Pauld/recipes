import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            email: user.email
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export const getUser = (context) => {
    const authHeader = context.req.headers.authorization;
    if (!authHeader) return null;

    const token = authHeader.split('Bearer ')[1];
    if (!token) return null;

    return verifyToken(token);
};

export const requireAuth = (resolver) => {
    return (parent, args, context, info) => {
        const user = getUser(context);
        if (!user) {
            throw new Error('Authentication required');
        }
        return resolver(parent, args, { ...context, user }, info);
    };
};