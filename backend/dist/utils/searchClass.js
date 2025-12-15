import * as fs from "fs";
import * as cheerio from "cheerio";
import { extractCookies } from "./extractCookies.js";
async function searchClass() {
    // Search page endpoint
    const searchUrl = "https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudent.htm";
    // Result page endpoint
    const resultUrl = "https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudentResult.htm";
    // Fetch session cookies
    const initResp = await fetch(searchUrl);
    // Extract cookies
    const cookies = extractCookies(initResp);
    console.log(`Generating new session cookie...\nScraping contents...`);
    // Request Body
    const body = new URLSearchParams({
        selectedTerm: "WI26",
        courses: "math",
        tabNum: "tabs-crs",
    });
    // Request
    const resp = await fetch(resultUrl, {
        method: "POST",
        headers: {
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "max-age=0",
            "Content-Type": "application/x-www-form-urlencoded",
            Origin: "https://act.ucsd.edu",
            Referer: searchUrl,
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36",
            "sec-ch-ua": `"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"`,
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": `"Android"`,
            Cookie: cookies,
        },
        body,
    });
    let page = 1;
    let hasMore = true;
    let pageContents = [];
    const url = "https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudentResult.htm";
    while (hasMore) {
        const url = "https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudentResult.htm";
        const res = await fetch(`${url}?page=${page}`, {
            method: "GET",
            headers: {
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Accept-Language": "en-US,en;q=0.9",
                "Cache-Control": "max-age=0",
                "Content-Type": "application/x-www-form-urlencoded",
                Origin: "https://act.ucsd.edu",
                Referer: searchUrl,
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-User": "?1",
                "Upgrade-Insecure-Requests": "1",
                "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36",
                "sec-ch-ua": `"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"`,
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": `"Android"`,
                Cookie: cookies,
            },
        });
        const html = await res.text();
        const $ = cheerio.load(html);
        const item = $(".tbrdr").html() ?? "";
        if (item.length == 0) {
            hasMore = false;
            break;
        }
        pageContents.push(item);
        page++;
    }
    // Writes to file
    // TODO: Create the object store in mongo by class, and
    // within these objects are the sections for this class
    await fs.promises.writeFile("text.txt", pageContents.join("\n\n"), "utf8");
    console.log(`Successfully written to file`);
}
