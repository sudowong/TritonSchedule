import { app } from "./api/app.js";
import { searchSchool, searchProfessorsAtSchoolId } from "ratemyprofessor-api";
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
// Testing rmp API here (save somewhere for reference)
async function testAPI() {
    const school = await searchSchool("University of California, San Diego");
    if (school !== undefined) {
        const schoolId = school[0].node.id;
        const search = await searchProfessorsAtSchoolId("Ben Ochoa", schoolId);
        console.log(search);
    }
}
