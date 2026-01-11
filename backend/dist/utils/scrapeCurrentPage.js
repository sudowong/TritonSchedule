// WORKFLOW
// Check current row element
// - If is a header, scrape the class title and put it in the model
// - If it is a class section scrape the contents and push it to the
// model array
export async function scrapeCurrentPage(cur_subject, page) {
    const rows = await page.$$("tr");
    const results = [];
    let current = null;
    for (const row of rows) {
        // The course number
        const courseNumber = await row.$$eval("td.crsheader", (tds) => tds[1]?.textContent?.trim());
        // The subject code of the class
        const subjectCode = cur_subject + courseNumber;
        // Gets the class title
        const courseTitle = await row.$$eval("td.crsheader span.boldtxt", (span) => span[0]?.textContent?.trim());
        // Code Segment I was using:
        // https://chatgpt.com/share/69634281-2ad0-8008-90d6-f36376ceb4c8
    }
    return results;
}
