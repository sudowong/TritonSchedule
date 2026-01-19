import puppeteer from "puppeteer";
import type { Course } from "../models/Course.js";
import type { Section } from "../models/Section.js";
import type { Term } from "../models/Term.js";
import { Db } from "mongodb";
import { scrapeCurrentPage } from "./scrapeCurrentPage.js";
import { insertDB } from "../services/insertDB.js";
import { connectToDB } from "../db/connectToDB.js";

export const SUBJECT_CODES = [
  "AIP ",
  "AAS ",
  "AWP ",
  "ANES",
  "ANBI",
  "ANAR",
  "ANTH",
  "ANSC",
  "AAPI",
  "ASTR",
  "AUD ",
  "BENG",
  "BNFO",
  "BIEB",
  "BICD",
  "BIPN",
  "BIBC",
  "BGGN",
  "BGJC",
  "BGRD",
  "BGSE",
  "BILD",
  "BIMM",
  "BISP",
  "BIOM",
  "CMM ",
  "CENG",
  "CHEM",
  "CLX ",
  "CHIN",
  "CLAS",
  "CCS ",
  "CLIN",
  "CLRE",
  "COGS",
  "COMM",
  "COGR",
  "CSS ",
  "CSE ",
  "COSE",
  "CCE ",
  "CGS ",
  "CAT ",
  "TDDM",
  "TDHD",
  "TDMV",
  "TDPR",
  "TDTR",
  "DSC ",
  "DSE ",
  "DERM",
  "DSGN",
  "DOC ",
  "DDPM",
  "ECON",
  "EDSP",
  "ERC ",
];
// TODO: Ended at ECE

export async function startSearch() {
  // New browser instance
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();

  await page.goto(
    "https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudent.htm",
    { waitUntil: "networkidle2" },
  );

  await page.waitForSelector("#selectedSubjects");
  await page.select("select#selectedSubjects", "MATH");
  await page.click("#socFacSubmit");

  await page.waitForSelector("#socDisplayCVO");

  /* To determine the amount of pages */

  const pages = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href*="page="]'),
    )
      .map((a) => a.getAttribute("href"))
      .filter((h): h is string => h !== null);
  });

  let lastPage: number | null = null;

  if (pages.length > 0) {
    const lastHref = pages[pages.length - 1];
    const pageParam = new URL(lastHref, "https://example.com").searchParams.get(
      "page",
    );

    lastPage = pageParam ? parseInt(pageParam, 10) : null;
  }

  lastPage = lastPage != null ? lastPage + 1 : null;

  /*-------------------------------------------------------------------------*/

  let currentPage = 0;

  // INPROG: Per subject scraping every page
  // - future me, i want to test if i can break out of the loop after
  //    all pages were clicked (or rather your out of pages)
  while (true) {
    if (currentPage == lastPage) {
      break;
    }

    let curPageContent = await scrapeCurrentPage("WI26", page);

    let db: Db = await connectToDB();

    await insertDB(db, curPageContent, "courses");

    currentPage += 1;

    let didClick = await page.evaluate((nextPage) => {
      const links = Array.from(
        document.querySelectorAll<HTMLAnchorElement>(
          'a[href*="scheduleOfClassesStudentResult.htm?page="]',
        ),
      );

      const nextLink = links.find(
        (a) => a.textContent?.trim() === String(nextPage),
      );

      if (!nextLink) {
        return false;
      }

      nextLink.click();
      return true;
    }, currentPage);

    if (didClick) {
      await page.waitForNavigation({ waitUntil: "networkidle0" });
    } else {
      break;
    }
  }

  return;
}

await startSearch();
