// Normalizes set-cookie
export function extractCookies(resp) {
    const rawCookies = resp.headers.getSetCookie?.() ?? [];
    const sessionCookie = rawCookies.map((item) => item.split(";")[0]).join("; ");
    return sessionCookie;
}
