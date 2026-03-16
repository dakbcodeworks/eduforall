import { jwtVerify, SignJWT } from 'jose';

export const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length === 0) {
        // Fallback to a development secret if one isn't provided.
        // In a real production application, this should throw an error.
        return 'development-secret-key-do-not-use-in-prod';
    }
    return secret;
};

export const verifyAuth = async (token: string) => {
    try {
        const verified = await jwtVerify(
            token,
            new TextEncoder().encode(getJwtSecretKey())
        );
        return verified.payload;
    } catch (err) {
        throw new Error('Your token has expired or is invalid.');
    }
};

export const createToken = async (payload: any) => {
    const secret = new TextEncoder().encode(getJwtSecretKey());
    const alg = 'HS256';

    return new SignJWT(payload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime('24h') // Token expires in 24 hours
        .sign(secret);
};
