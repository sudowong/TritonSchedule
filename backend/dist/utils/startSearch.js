import puppeteer from "puppeteer";
import { Db } from "mongodb";
import { scrapeCurrentPage } from "./scrapeCurrentPage.js";
import { insertDB } from "../services/insertDB.js";
import { connectToDB } from "../db/connectToDB.js";
/* TODO: Fix the subject codes, for some of them it doesn't work super well
 * - Overscraping for single page content pages
 * - Some subject codes are invalid, it's not clicking on anything (probably need to include a safe bracket for that)
 */
export const SUBJECT_CODES = [
    "AIP ",
    // "LIPO",
    // "LISP",
    // "LTAM",
    // "LTAF",
    // "LTCO",
    // "LTCS",
    // "LTEU",
    // "LTFR",
    // "LTGM",
    // "LTGK",
    // "LTIT",
    // "LTKO",
    // "LTLA",
    // "LTRU",
    // "LTSP",
    // "LTTH",
    // "LTWR",
    // "LTEN",
    // "LTWL",
    // "LTEA",
    // "MMW ",
    "MBC ",
    "MATS",
    "MATH",
    "MSED",
    "MAE ",
    "MED ",
    "MUIR",
    "MCWP",
    "MUS ",
    "NANO",
    "NEU ",
    "NEUG",
    "OBG ",
    "OPTH",
    "ORTH",
    "PATH",
    "PEDS",
    "PHAR",
    "SPPS",
    "PHIL",
    "PAE ",
    "PHYS",
    "PHYA",
    "POLI",
    "PSY ",
    "PSYC",
    // "PH ",
    "PHB ",
    "RMAS",
    "RAD ",
    "MGTF",
    "MGT ",
    "MGTA",
    "MGTP",
    "RELI",
    "RMED",
    "REV ",
    "SPPH",
    "SOMI",
    "SOMC",
    "SIOC",
    "SIOG",
    "SIOB",
    "SIO ",
    "SEV ",
    "SOCG",
    "SOCE",
    "SOCI",
    "SE ",
    "SURG",
    "SYN ",
    "TDAC",
    "TDDE",
    "TDDR",
    "TDGE",
    "TDGR",
    "TDHT",
    "TDPW",
    "TDPR",
    "TMC ",
    "USP ",
    "UROL",
    "VIS ",
    "WCWP",
    "WES ",
];
export async function startSearch() {
    // Browser intialization
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    /*-------------------------------------------------------------------------*/
    // Scrape all subjects
    for (const code of SUBJECT_CODES) {
        await page.goto("https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudent.htm", { waitUntil: "networkidle2" });
        await page.waitForSelector("#selectedSubjects");
        await page.select("select#selectedSubjects", code);
        await page.click("#socFacSubmit");
        await page.waitForSelector("#socDisplayCVO");
        // To determine the max # of pages
        const pages = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a[href*="page="]'))
                .map((a) => a.getAttribute("href"))
                .filter((h) => h !== null);
        });
        let lastPage = null;
        if (pages.length > 0) {
            const lastHref = pages[pages.length - 1];
            const pageParam = new URL(lastHref, "https://example.com").searchParams.get("page");
            lastPage = pageParam ? parseInt(pageParam, 10) : null;
        }
        lastPage = lastPage != null ? lastPage + 1 : 0;
        let currentPage = 0;
        while (currentPage < lastPage) {
            // If last page reached, break
            // if (currentPage == lastPage) {
            //   break;
            // }
            // Scrapes contents of current page
            let curPageContent = await scrapeCurrentPage("WI26", page);
            if (curPageContent.length <= 0) {
                break;
            }
            /*
             * Connects, and inserts document to DB
             * Note: Might block if you don't add IP to DB allowed list
             */
            let db = await connectToDB();
            await insertDB(db, curPageContent, "courses");
            currentPage += 1;
            /**
             * Checks if next page button exists
             *
             * @return true if exists, false if doesn't
             */
            let didClick = await page.evaluate((nextPage) => {
                const links = Array.from(document.querySelectorAll('a[href*="scheduleOfClassesStudentResult.htm?page="]'));
                const nextLink = links.find((a) => a.textContent?.trim() === String(nextPage));
                if (!nextLink) {
                    return false;
                }
                nextLink.click();
                return true;
            }, currentPage);
            // Waits for page to load if clicked
            if (didClick) {
                await page.waitForNavigation({ waitUntil: "networkidle0" });
            }
        }
    }
    return;
}
await startSearch();
