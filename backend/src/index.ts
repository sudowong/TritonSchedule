import { app } from "./api/scheduleAPI.js";

// TODO:
// - change scheduleAPI.js to "app.ts"
// - move functions to util dir
// reminder scheduleAPI.js is so it would as the delegator essentially, where it initializes the express instance and then delegates endpoints to controllers and handles some endpoints here as well

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listenong on port ${PORT}`);
});
