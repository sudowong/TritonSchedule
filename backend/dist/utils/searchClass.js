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
    let results = [];
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
        const classes = $("tr") ?? "";
        // Variable for keep track of the current class and it's sections
        // let current: Course | null = null;
        // Scraping call name + sections logic
        classes.each((_, el) => {
            const row = $(el);
            if (row.find("td.crsheader").length > 0) {
                let sections = [];
                let index = 0;
                const title = row.children();
                const classCode = $(title).eq(1).text().replace(/\s+/g, " ").trim();
                const className = $(title)
                    .eq(2)
                    .find(".boldtxt")
                    .text()
                    .replace(/\s+/g, " ")
                    .trim();
                if (className.length > 0 && classCode.length > 0) {
                    sections.push(classCode);
                    sections.push(className);
                }
                console.log(sections);
            }
            // Place the logic for creating the sections under each header
            // Ensure that it avoids a edge case of no sections under header
            // by searching by .sectxt
        });
        // type Course =  {
        //   RestrictionCode: string;
        //   CourseNumber: string;
        //   SectionID: string;
        //   MeetingType: string;
        //   Section: string;
        //   Days: string;
        //   Time: string;
        //   Location: string;
        //   Instructor: string;
        //   AvaliableSeats: string;
        //   Limit: string;
        //   searchText: string;
        // };
        classes.each((_, el) => {
            const rows = $(el).children("td");
            // Need to figure out a way to get the class name and course number
            const searchText = rows.eq(1).text().trim() + rows.eq(2).text().trim();
            results.push({
                RestrictionCode: rows.eq(0).text().trim(),
                CourseNumber: rows.eq(1).text().trim(),
                SectionID: rows.eq(2).text().trim(),
                MeetingType: rows.eq(3).text().trim(),
                Section: rows.eq(4).text().trim(),
                Days: rows.eq(5).text().trim(),
                Time: rows.eq(6).text().trim(),
                Location: rows.eq(7).text().trim(),
                Instructor: rows.eq(9).text().trim(),
                AvaliableSeats: rows.eq(10).text().trim(),
                Limit: rows.eq(11).text().trim(),
                searchText: "placeholder",
            });
        });
        if (classes.length == 0) {
            hasMore = false;
            break;
        }
        if (page == 1) {
            hasMore = false;
            break;
        }
        page++;
    }
    console.log("Successfully scraped classes");
}
// Delete later; strictly for testing purposes
searchClass();
