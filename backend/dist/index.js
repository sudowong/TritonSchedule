import { app } from "./api/app.js";
// TODO:
//
// - change scheduleAPI.js to "app.ts" (DONE)
//
// - move functions to util dir (DONE)
//
// - reminder scheduleAPI.js which should be named app.ts is used as the delegator essentially, (DONE)
// where it initializes the express instance and then delegates endpoints
// to controllers and handles some endpoints here as well
//
// - serve default HTML boiler plate
//
// - revamp scraping utility as an type object to store in mongo
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
