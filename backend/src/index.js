import { app } from "./api/scheduleAPI.js";
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listenong on port ${PORT}`);
});
