import * as cheerio from "cheerio";
export async function detectCurrentTerm() {
    const searchUrl = "https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudent.htm";
    // Get the html from the initial page
    const res = await fetch(searchUrl, {
        method: "POST",
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    const currentTerm = $("#selectedTerm").find("option").first();
    // Keeping only text content
    const currentTermProcessed = currentTerm
        .text()
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
    return currentTermProcessed;
}
