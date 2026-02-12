export async function requireApiSecret(req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }
    const expected = process.env.API_KEY;
    const authHeader = req.headers.authorization ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (expected !== token) {
        return res.status(401).send({ Message: 'Not Authorized' });
    }
    return next();
}
